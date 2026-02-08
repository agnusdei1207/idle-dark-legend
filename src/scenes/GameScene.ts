/**
 * ============================================================
 * 메인 게임 씬 - 통합 버전
 * ============================================================
 * 
 * 모든 시스템이 연결된 완전한 게임 씬입니다.
 * 에셋만 교체하면 바로 플레이 가능합니다.
 * 
 * [키 조작]
 * - 방향키/WASD: 아이소메트릭 이동
 * - I: 인벤토리
 * - Q: 퀘스트
 * - Space: NPC 상호작용
 * - 1-8: 스킬바
 * - ESC: 메뉴
 * ============================================================
 */

import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../config/game.config';
import { Player } from '../entities/Player';
import { Monster } from '../entities/Monster';
import { NPC } from '../entities/NPC';
import { QuestSystem, CombatSystem, SaveSystem, getDefaultSaveData, IdleSystem, HUNTING_ZONES } from '../systems';
import { InventoryUI, DialogueUI, QuestUI, ShopUI, CharacterUI, SkillTreeUI, CircleUI, HuntingZoneUI, OfflineRewardUI, JobSelectionUI } from '../ui';
import { getMapById, generateProceduralMap } from '../data/maps.data';
import { getMonstersByCircle } from '../data/monsters.data';
import type { Position, MapDefinition } from '../types/game.types';
import type { ClassType } from '../data/classes.data';

export class GameScene extends Phaser.Scene {
    // 엔티티
    private player!: Player;
    private monsters: Monster[] = [];
    private npcs: NPC[] = [];

    // 시스템
    private questSystem!: QuestSystem;
    private combatSystem!: CombatSystem;
    private idleSystem!: IdleSystem;

    // Idle 사냥 상태
    private isAutoHunting: boolean = false;
    private currentHuntingZone: string | null = null;
    private autoHuntTimer: number = 0;
    private killCount: number = 0;
    private sessionExp: number = 0;
    private sessionGold: number = 0;

    // UI
    private inventoryUI!: InventoryUI;
    private dialogueUI!: DialogueUI;
    private questUI!: QuestUI;
    private shopUI!: ShopUI;
    private characterUI!: CharacterUI;
    private skillTreeUI!: SkillTreeUI;
    private circleUI!: CircleUI;
    private huntingZoneUI!: HuntingZoneUI;
    private offlineRewardUI!: OfflineRewardUI;
    private jobSelectionUI!: JobSelectionUI;

    // 맵
    private currentMap!: MapDefinition;
    private mapData: number[][] = [];
    private worldContainer!: Phaser.GameObjects.Container;

    // 입력
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key };

    // 상태
    private isPaused: boolean = false;
    private playTime: number = 0;
    private lastAutoSave: number = 0;

    // 타일 색상 (에셋 교체 전 플레이스홀더)
    private tileColors: Record<number, number> = {
        0: 0x2d4a4b, 1: 0x4a7c6f, 2: 0x5a8c7f, 3: 0x6b8e7d, 4: 0x3d5a5b
    };

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { mapId?: string, position?: Position }): void {
        // 맵 전환 시 데이터 받기
        const mapId = data.mapId || 'map_village';
        this.currentMap = getMapById(mapId) || getMapById('map_village')!;
    }

    create(): void {
        console.log('🚀 GameScene.create() 시작!');

        try {
            const { width } = this.cameras.main;
            console.log('  [1] 카메라 가져옴. width:', width);

            // 카메라 배경색 설정 (검정 화면 방지)
            this.cameras.main.setBackgroundColor('#1a1a2e');
            console.log('  [2] 배경색 설정됨');

            // 시스템 초기화
            this.questSystem = new QuestSystem();
            this.combatSystem = new CombatSystem();
            this.idleSystem = new IdleSystem();
            console.log('  [3] 시스템 초기화됨');

            // 월드 컨테이너
            this.worldContainer = this.add.container(width / 2, 150);
            console.log('  [4] 월드 컨테이너 생성됨');

            // 맵 생성
            this.createMap();
            console.log('  [5] 맵 생성됨');

            // 엔티티 생성
            this.createEntities();
            console.log('  [6] 엔티티 생성됨');

            // UI 생성
            this.createUI();
            console.log('  [7] UI 생성됨');

            // 입력 설정
            this.setupInput();
            console.log('  [8] 입력 설정됨');

            // 이벤트 리스너
            this.setupEvents();
            console.log('  [9] 이벤트 리스너 설정됨');

            // 페이드 인
            this.cameras.main.fadeIn(500);
            console.log('  [10] 페이드 인 시작');

            // UI 씬 시작
            this.scene.launch('UIScene', { player: this.player });
            console.log('  [11] UIScene 시작됨');

            // 저장 데이터 로드
            this.loadGame();
            console.log('  [12] 게임 로드됨');

            // 오프라인 보상 체크
            this.checkOfflineReward();
            console.log('  [13] 오프라인 보상 체크됨');

            // 디버그 정보
            if (import.meta.env.DEV) {
                this.add.text(10, 10, `🎮 ${this.currentMap.nameKo}`, {
                    fontSize: '14px', color: '#0f0'
                }).setScrollFactor(0).setDepth(2000);
            }

            // 디버그: GameScene 생성 완료 로그
            console.log('✅ GameScene.create() 완료!');
            console.log('  - 카메라 크기:', this.cameras.main.width, 'x', this.cameras.main.height);
            console.log('  - 월드 컨테이너:', this.worldContainer.list.length, '개 오브젝트');
        } catch (error) {
            console.error('❌ GameScene.create() 에러:', error);
        }
    }

    /**
     * 맵 생성
     */
    private createMap(): void {
        // 절차적 맵 생성 (Tiled 맵이 없을 때)
        this.mapData = generateProceduralMap(10, 10);

        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                const tileType = this.mapData[y][x];
                const { screenX, screenY } = this.worldToScreen(x, y);

                // 타일 다이아몬드 그리기
                const tile = this.add.polygon(
                    screenX, screenY,
                    [
                        GAME_CONSTANTS.TILE_WIDTH / 2, 0,
                        GAME_CONSTANTS.TILE_WIDTH, GAME_CONSTANTS.TILE_HEIGHT / 2,
                        GAME_CONSTANTS.TILE_WIDTH / 2, GAME_CONSTANTS.TILE_HEIGHT,
                        0, GAME_CONSTANTS.TILE_HEIGHT / 2
                    ],
                    this.tileColors[tileType] || 0x4a7c6f
                );
                tile.setOrigin(0.5, 0.5);
                tile.setStrokeStyle(1, 0x1a3a3b, 0.3);
                tile.setDepth(y + x);
                this.worldContainer.add(tile);
            }
        }
    }

    /**
     * 엔티티 생성
     */
    private createEntities(): void {
        // 플레이어
        this.player = new Player(this, 5, 5);

        // NPC 배치
        for (const npcData of this.currentMap.npcs) {
            try {
                const npc = new NPC(this, npcData.npcId, npcData.x, npcData.y);
                this.npcs.push(npc);
            } catch (e) {
                console.warn(`NPC 생성 실패: ${npcData.npcId}`);
            }
        }

        // 몬스터 스폰
        for (const spawn of this.currentMap.spawns) {
            for (let i = 0; i < spawn.maxCount; i++) {
                try {
                    const offsetX = (Math.random() - 0.5) * 2;
                    const offsetY = (Math.random() - 0.5) * 2;
                    const monster = new Monster(
                        this, spawn.monsterId,
                        spawn.x + offsetX, spawn.y + offsetY,
                        spawn.respawnTime
                    );
                    this.monsters.push(monster);
                } catch (e) {
                    console.warn(`몬스터 생성 실패: ${spawn.monsterId}`);
                }
            }
        }
    }

    /**
     * UI 생성
     */
    private createUI(): void {
        this.inventoryUI = new InventoryUI(this, this.player.getInventory());
        this.dialogueUI = new DialogueUI(this);
        this.questUI = new QuestUI(this, this.questSystem);
        this.shopUI = new ShopUI(this, this.player.getInventory());
        this.characterUI = new CharacterUI(this);
        this.skillTreeUI = new SkillTreeUI(this);
        this.circleUI = new CircleUI(this);

        // Idle 시스템 UI
        this.huntingZoneUI = new HuntingZoneUI(this, this.idleSystem);
        this.huntingZoneUI.setPlayerLevel(this.player.getLevel());
        this.offlineRewardUI = new OfflineRewardUI(this);

        // 직업 선택 UI
        this.jobSelectionUI = new JobSelectionUI(this);
    }

    /**
     * 입력 설정
     */
    private setupInput(): void {
        if (!this.input.keyboard) return;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.keys = {
            W: this.input.keyboard.addKey('W'),
            A: this.input.keyboard.addKey('A'),
            S: this.input.keyboard.addKey('S'),
            D: this.input.keyboard.addKey('D'),
            I: this.input.keyboard.addKey('I'),
            Q: this.input.keyboard.addKey('Q'),
            C: this.input.keyboard.addKey('C'),
            K: this.input.keyboard.addKey('K'),
            G: this.input.keyboard.addKey('G'),
            H: this.input.keyboard.addKey('H'),
            SPACE: this.input.keyboard.addKey('SPACE'),
            ESC: this.input.keyboard.addKey('ESC'),
            ONE: this.input.keyboard.addKey('ONE'),
            TWO: this.input.keyboard.addKey('TWO'),
            THREE: this.input.keyboard.addKey('THREE'),
            FOUR: this.input.keyboard.addKey('FOUR'),
        };

        // 단축키
        this.keys.I.on('down', () => this.inventoryUI.toggle());
        this.keys.Q.on('down', () => this.questUI.toggle());
        this.keys.C.on('down', () => this.characterUI.toggle());
        this.keys.K.on('down', () => this.skillTreeUI.toggle());
        this.keys.G.on('down', () => this.circleUI.toggle());
        this.keys.H.on('down', () => this.huntingZoneUI.toggle());
        this.keys.SPACE.on('down', () => this.interactWithNearestNPC());
        this.keys.ESC.on('down', () => this.handleEscape());
    }

    /**
     * 이벤트 설정
     */
    private setupEvents(): void {
        // 몬스터 사망 이벤트
        this.events.on('monsterDeath', (data: any) => {
            // 경험치 획득
            this.player.gainExp(data.exp);

            // 골드 획득
            this.player.getInventory().addGold(data.gold);

            // 아이템 드롭
            for (const drop of data.drops) {
                this.player.getInventory().addItem(drop.itemId, drop.quantity);
            }

            // 퀘스트 업데이트
            this.questSystem.updateProgress('kill', data.monster.id);

            // 자동 사냥 중이면 세션 통계 업데이트
            if (this.isAutoHunting) {
                this.sessionExp += data.exp;
                this.sessionGold += data.gold;
                this.updateHuntingHUD();
            }
        });

        // NPC 상호작용
        this.events.on('npcInteract', (data: any) => {
            this.dialogueUI.startDialogue(data.dialogueId);
        });

        // 퀘스트 수락
        this.events.on('acceptQuest', (questId: string) => {
            this.questSystem.acceptQuest(questId);
        });

        // 상점 열기
        this.events.on('openShop', (shopId: string) => {
            this.shopUI.open(shopId);
        });

        // 아이템 사용 (인벤토리에서)
        this.player.getInventory().on('useConsumable', (item: any) => {
            if (item.healHp) {
                this.player.heal(item.healHp);
            }
            // MP 회복 등 추가 가능
        });

        // 골드 변경 시 UIScene에 반영
        this.player.getInventory().on('goldChanged', (gold: number) => {
            const uiScene = this.scene.get('UIScene') as any;
            if (uiScene?.updateGold) {
                uiScene.updateGold(gold);
            }
        });

        // 레벨업
        this.events.on('levelUp', (level: number) => {
            this.showLevelUpMessage(level);
            // 레벨 6 전직 체크
            if (level === 6 && !this.player.getData('job')) {
                this.showJobSelectionPrompt();
            }
        });
    }

    /**
     * 가장 가까운 NPC와 상호작용
     */
    private interactWithNearestNPC(): void {
        if (this.dialogueUI.getIsOpen()) return;

        const playerPos = this.player.getWorldPos();

        for (const npc of this.npcs) {
            const npcPos = npc.getWorldPos();
            const dist = Math.sqrt(
                Math.pow(playerPos.x - npcPos.x, 2) +
                Math.pow(playerPos.y - npcPos.y, 2)
            );

            if (dist <= 1.5) {
                npc.onInteract();
                return;
            }
        }
    }

    /**
     * ESC 키 처리 - 우선순위에 따라 UI 닫기
     */
    private handleEscape(): void {
        // 1. 대화 중이면 무시
        if (this.dialogueUI.getIsOpen()) return;

        // 2. 직업 선택 UI (닫기 불가 - 선택 필수)
        if (this.jobSelectionUI.getIsOpen()) return;

        // 3. 오프라인 보상 UI
        if (this.offlineRewardUI.getIsOpen()) {
            this.offlineRewardUI.close();
            return;
        }

        // 3. 사냥터 선택 UI
        if (this.huntingZoneUI.getIsOpen()) {
            this.huntingZoneUI.close();
            return;
        }

        // 4. 상점 UI
        if (this.shopUI.getIsOpen()) {
            this.shopUI.close();
            return;
        }

        // 5. 인벤토리
        if (this.inventoryUI.getIsOpen()) {
            this.inventoryUI.toggle();
            return;
        }

        // 6. 퀘스트
        if (this.questUI.getIsOpen()) {
            this.questUI.toggle();
            return;
        }

        // 7. 캐릭터
        if (this.characterUI.getIsOpen()) {
            this.characterUI.toggle();
            return;
        }

        // 8. 스킬트리
        if (this.skillTreeUI.getIsOpen()) {
            this.skillTreeUI.toggle();
            return;
        }

        // 9. 서클
        if (this.circleUI.getIsOpen()) {
            this.circleUI.toggle();
            return;
        }

        // 10. 자동 사냥 중이면 중지
        if (this.isAutoHunting) {
            this.stopAutoHunt();
            return;
        }

        // 11. 모든 UI가 닫혀있으면 게임 메뉴 열기
        this.showGameMenu();
    }

    /**
     * 게임 메뉴 표시
     */
    private showGameMenu(): void {
        this.showPauseMenu();
    }

    /**
     * 직업 선택 UI 표시 (레벨 6 전직)
     */
    private showJobSelectionPrompt(): void {
        this.jobSelectionUI.open((selectedJob: ClassType) => {
            this.player.setData('job', selectedJob);
            this.player.setData('classType', selectedJob);

            // UIScene에 직업 정보 전달
            const uiScene = this.scene.get('UIScene') as any;
            if (uiScene?.updateClass) {
                const jobNames: Record<ClassType, string> = {
                    warrior: '전사',
                    mage: '마법사',
                    rogue: '도적',
                    cleric: '성직자',
                    monk: '무도가'
                };
                uiScene.updateClass(jobNames[selectedJob]);
            }

            this.showAutoHuntMessage(`🎉 ${this.getJobName(selectedJob)}(으)로 전직했습니다!`);
        });
    }

    /**
     * 직업 이름 가져오기
     */
    private getJobName(job: ClassType): string {
        const names: Record<ClassType, string> = {
            warrior: '전사',
            mage: '마법사',
            rogue: '도적',
            cleric: '성직자',
            monk: '무도가'
        };
        return names[job] || job;
    }

    /**
     * 일시정지 메뉴
     */
    private showPauseMenu(): void {
        // 기존 메뉴 제거
        const existing = this.children.getByName('pauseMenu');
        if (existing) {
            existing.destroy();
            this.isPaused = false;
            return;
        }

        this.isPaused = true;
        const { width, height } = this.cameras.main;

        const menu = this.add.container(width / 2, height / 2);
        menu.setName('pauseMenu');
        menu.setDepth(5000);
        menu.setScrollFactor(0);

        // 반투명 배경
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        menu.add(overlay);

        // 메뉴 박스
        const box = this.add.rectangle(0, 0, 300, 350, 0x1a1a2e, 0.95);
        box.setStrokeStyle(3, 0x8b5cf6);
        menu.add(box);

        // 타이틀
        const title = this.add.text(0, -130, '⚙️ 게임 메뉴', {
            fontSize: '24px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        menu.add(title);

        // 메뉴 버튼들
        const buttons = [
            { text: '▶️ 계속하기', action: () => this.closePauseMenu() },
            { text: '💾 저장하기', action: () => { this.saveGame(); this.showSaveMessage(); } },
            { text: '🏠 마을로 돌아가기', action: () => this.returnToVillage() },
            { text: '🚪 타이틀로', action: () => this.scene.start('MenuScene') }
        ];

        buttons.forEach((btn, i) => {
            const y = -50 + i * 55;
            const btnBg = this.add.rectangle(0, y, 220, 45, 0x2a2a4e);
            btnBg.setStrokeStyle(1, 0x4a4a6a);
            btnBg.setInteractive({ useHandCursor: true });
            menu.add(btnBg);

            const btnText = this.add.text(0, y, btn.text, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            menu.add(btnText);

            btnBg.on('pointerover', () => {
                btnBg.setFillStyle(0x3a3a5e);
                btnText.setColor('#ffd700');
            });
            btnBg.on('pointerout', () => {
                btnBg.setFillStyle(0x2a2a4e);
                btnText.setColor('#ffffff');
            });
            btnBg.on('pointerdown', btn.action);
        });

        // ESC 안내
        const hint = this.add.text(0, 140, '[ESC] 닫기', {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(0.5);
        menu.add(hint);
    }

    private closePauseMenu(): void {
        const menu = this.children.getByName('pauseMenu');
        if (menu) {
            menu.destroy();
            this.isPaused = false;
        }
    }

    private showSaveMessage(): void {
        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 100,
            '💾 저장되었습니다!',
            { fontSize: '16px', color: '#4ade80' }
        ).setOrigin(0.5).setDepth(5001).setScrollFactor(0);

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    private returnToVillage(): void {
        if (this.isAutoHunting) {
            this.stopAutoHunt();
        }
        this.closePauseMenu();

        // 몬스터 모두 제거
        for (const monster of this.monsters) {
            monster.destroy();
        }
        this.monsters = [];

        // NPC 다시 표시
        for (const npc of this.npcs) {
            npc.setVisible(true);
        }

        // 사냥터 관련 상태 초기화
        this.currentHuntingZone = null;
        this.killCount = 0;
        this.sessionExp = 0;
        this.sessionGold = 0;

        // 마을 색상으로 복원
        this.tileColors = { 0: 0x2d4a4b, 1: 0x4a7c6f, 2: 0x5a8c7f, 3: 0x6b8e7d, 4: 0x3d5a5b };
        this.worldContainer.removeAll(true);
        this.createMap();

        // 플레이어 위치 초기화
        this.player.moveToWorld(5, 5, 0);

        this.showAutoHuntMessage('🏠 마을로 돌아왔습니다!');
    }

    /**
     * 레벨업 메시지
     */
    private showLevelUpMessage(level: number): void {
        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 100,
            `🎉 LEVEL UP! Lv.${level}`,
            {
                fontSize: '32px',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setDepth(3000);

        this.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    /**
     * 월드 좌표 → 화면 좌표
     */
    private worldToScreen(worldX: number, worldY: number): { screenX: number, screenY: number } {
        return {
            screenX: (worldX - worldY) * (GAME_CONSTANTS.TILE_WIDTH / 2),
            screenY: (worldX + worldY) * (GAME_CONSTANTS.TILE_HEIGHT / 2)
        };
    }

    /**
     * 게임 저장
     */
    saveGame(): void {
        const playerData = getDefaultSaveData();
        playerData.level = this.player.getLevel();
        playerData.exp = this.player.getExp();
        playerData.baseStats = this.player.getBaseStats();
        playerData.currentHp = this.player.getCombatStats().currentHp;
        playerData.currentMp = this.player.getCombatStats().currentMp;
        playerData.currentMapId = this.currentMap.id;
        playerData.position = this.player.getWorldPos();
        playerData.inventory = this.player.getInventory().getSlots();
        playerData.equipment = this.player.getInventory().getEquipment();
        playerData.gold = this.player.getInventory().getGold();
        playerData.quests = this.questSystem.getActiveQuests();
        playerData.completedQuests = this.questSystem.getCompletedQuests();
        playerData.playTime = this.playTime;

        SaveSystem.save(playerData);
    }

    /**
     * 게임 로드
     */
    loadGame(): void {
        const data = SaveSystem.load();
        if (!data) return;

        // 인벤토리 데이터 로드 (저장 형식에 맞춤)
        this.player.getInventory().loadSaveData({
            slots: data.inventory || [],
            equipment: data.equipment || {
                weapon: null, shield: null, helmet: null, armor: null,
                gloves: null, boots: null, necklace: null, ring1: null, ring2: null
            },
            gold: data.gold || 0
        });
        this.playTime = data.playTime || 0;
    }

    /**
     * 업데이트 루프
     */
    update(time: number, delta: number): void {
        if (this.isPaused) return;
        if (this.dialogueUI.getIsOpen()) return;

        // 플레이 시간 업데이트
        this.playTime += delta / 1000;

        // 자동 저장 (5분마다)
        if (time - this.lastAutoSave > 300000) {
            this.saveGame();
            this.lastAutoSave = time;
        }

        // 플레이어 이동
        this.handlePlayerMovement(delta);

        // 몬스터 AI 업데이트
        const playerPos = this.player.getWorldPos();
        for (const monster of this.monsters) {
            monster.update(time, delta, playerPos);
        }

        // NPC 거리 체크
        for (const npc of this.npcs) {
            npc.checkPlayerDistance(playerPos);
        }
    }

    /**
     * 플레이어 이동 처리
     */
    private handlePlayerMovement(delta: number): void {
        if (!this.cursors || this.player.getIsMoving()) return;

        const speed = GAME_CONSTANTS.PLAYER_SPEED * (delta / 1000) * 0.02;
        let worldDx = 0;
        let worldDy = 0;

        /**
         * 아이소메트릭 방향:
         * ↑/W = 북서(NW) = worldY 감소
         * ↓/S = 남동(SE) = worldY 증가
         * ←/A = 남서(SW) = worldX 감소
         * →/D = 북동(NE) = worldX 증가
         */
        if (this.cursors.up.isDown || this.keys.W.isDown) worldDy -= speed;
        if (this.cursors.down.isDown || this.keys.S.isDown) worldDy += speed;
        if (this.cursors.left.isDown || this.keys.A.isDown) worldDx -= speed;
        if (this.cursors.right.isDown || this.keys.D.isDown) worldDx += speed;

        // 대각선 정규화
        if (worldDx !== 0 && worldDy !== 0) {
            worldDx *= 0.707;
            worldDy *= 0.707;
        }

        if (worldDx !== 0 || worldDy !== 0) {
            const currentPos = this.player.getWorldPos();
            let newX = currentPos.x + worldDx;
            let newY = currentPos.y + worldDy;

            // 맵 경계 체크
            newX = Math.max(1, Math.min(this.mapData[0].length - 2, newX));
            newY = Math.max(1, Math.min(this.mapData.length - 2, newY));

            // 충돌 체크 (벽 타일 = 0)
            const tileX = Math.floor(newX);
            const tileY = Math.floor(newY);
            if (this.mapData[tileY]?.[tileX] !== 0) {
                this.player.moveToWorld(newX, newY, 100);
            }
        }
    }

    /**
     * 오프라인 보상 체크
     */
    private checkOfflineReward(): void {
        const lastLogout = SaveSystem.getLastLogoutTime();
        if (!lastLogout) return;

        const progress = this.idleSystem.calculateOfflineProgress(
            lastLogout,
            this.player.getLevel(),
            this.currentHuntingZone || undefined
        );

        if (progress.effectiveSeconds >= 60) {
            // 1분 이상 오프라인이면 보상 표시
            this.offlineRewardUI.show(progress, () => {
                // 보상 지급
                this.player.gainExp(progress.earnedExp);
                this.player.getInventory().addGold(progress.earnedGold);

                for (const item of progress.earnedItems) {
                    this.player.getInventory().addItem(item.itemId, item.quantity);
                }

                this.showAutoHuntMessage(`오프라인 보상 획득!\\n경험치: ${progress.earnedExp}\\n골드: ${progress.earnedGold}`);
            });
        }
    }

    /**
     * 자동 사냥 시작
     */
    startAutoHunt(zoneId?: string): void {
        // 추천 사냥터 또는 지정 사냥터
        const zone = zoneId
            ? HUNTING_ZONES.find(z => z.id === zoneId)
            : this.idleSystem.getRecommendedZone(this.player.getLevel());

        if (!zone) {
            this.showAutoHuntMessage('적합한 사냥터가 없습니다.');
            return;
        }

        this.isAutoHunting = true;
        this.currentHuntingZone = zone.id;
        this.killCount = 0;
        this.sessionExp = 0;
        this.sessionGold = 0;
        this.idleSystem.selectZone(zone.id);
        this.idleSystem.startHunting();

        // 맵 이름 변경
        this.currentMap.nameKo = zone.name;

        // 맵 타일 색상 변경 (써클별 분위기)
        this.changeMapAtmosphere(zone.circle);

        // 기존 NPC 숨기기
        for (const npc of this.npcs) {
            npc.setVisible(false);
        }

        // 기존 몬스터 제거
        for (const monster of this.monsters) {
            monster.destroy();
        }
        this.monsters = [];

        // 새 몬스터 스폰
        this.spawnHuntingZoneMonsters(zone.id);

        // 자동 전투 시작
        this.startAutoBattle();

        // 사냥터 이름 HUD 표시
        this.showHuntingZoneHUD(zone.name);

        this.showAutoHuntMessage(`⚔️ ${zone.name}\n자동 사냥 시작!`);

        // 이벤트 발송
        this.events.emit('autoHuntStart', zone);
    }

    /**
     * 맵 분위기 변경 (써클별 색상)
     */
    private changeMapAtmosphere(circle: number): void {
        const atmosphereColors: Record<number, Record<number, number>> = {
            1: { 0: 0x2d4a4b, 1: 0x4a7c6f, 2: 0x5a8c7f, 3: 0x6b8e7d, 4: 0x3d5a5b }, // 숲
            2: { 0: 0x3d3d5c, 1: 0x5a5a7a, 2: 0x6a6a8a, 3: 0x7a7a9a, 4: 0x4d4d6c }, // 던전
            3: { 0: 0x4a5a3a, 1: 0x6a7a5a, 2: 0x7a8a6a, 3: 0x8a9a7a, 4: 0x5a6a4a }, // 해안
            4: { 0: 0x2a3a5a, 1: 0x4a5a7a, 2: 0x5a6a8a, 3: 0x6a7a9a, 4: 0x3a4a6a }, // 해저
            5: { 0: 0x3a2a3a, 1: 0x5a4a5a, 2: 0x6a5a6a, 3: 0x7a6a7a, 4: 0x4a3a4a }  // 호러
        };

        this.tileColors = atmosphereColors[circle] || this.tileColors;

        // 맵 다시 그리기
        this.worldContainer.removeAll(true);
        this.createMap();
    }

    /**
     * 자동 전투 시작
     */
    private startAutoBattle(): void {
        // 2초마다 몬스터 하나 처치
        this.autoHuntTimer = window.setInterval(() => {
            if (!this.isAutoHunting) {
                clearInterval(this.autoHuntTimer);
                return;
            }

            const aliveMonsters = this.monsters.filter(m => !m.checkIsDead());
            if (aliveMonsters.length === 0) {
                // 모든 몬스터 처치 -> 새로 스폰
                this.spawnHuntingZoneMonsters(this.currentHuntingZone!);
                return;
            }

            // 랜덤 몬스터 하나 공격
            const target = aliveMonsters[Math.floor(Math.random() * aliveMonsters.length)];
            this.autoAttackMonster(target);
        }, 1500);
    }

    /**
     * 자동 공격
     */
    private autoAttackMonster(monster: Monster): void {
        // 플레이어가 몬스터 방향으로 이동
        const monsterPos = monster.getWorldPos();
        this.player.moveToWorld(monsterPos.x - 0.5, monsterPos.y - 0.5, 300);

        // 공격 이펙트
        this.time.delayedCall(300, () => {
            if (monster.checkIsDead()) return;

            // 데미지 계산
            const playerStats = this.player.getCombatStats();
            const damage = Math.floor(playerStats.attack * (0.8 + Math.random() * 0.4));

            // 몬스터에 데미지
            const killed = monster.receiveDamage(damage);

            // 데미지 숫자 표시
            this.showDamageNumber(monster.x, monster.y - 20, damage);

            // 공격 이펙트
            this.showAttackEffect(monster.x, monster.y);

            if (killed) {
                this.killCount++;
                // 경험치/골드 및 HUD 업데이트는 monsterDeath 이벤트에서 처리됨
            }
        });
    }

    /**
     * 데미지 숫자 표시
     */
    private showDamageNumber(x: number, y: number, damage: number): void {
        const text = this.add.text(x, y, `-${damage}`, {
            fontSize: '16px',
            color: '#ff4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(2500);

        this.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => text.destroy()
        });
    }

    /**
     * 공격 이펙트
     */
    private showAttackEffect(x: number, y: number): void {
        const effect = this.add.text(x, y, '💥', {
            fontSize: '24px'
        }).setOrigin(0.5).setDepth(2400);

        this.tweens.add({
            targets: effect,
            scale: 1.5,
            alpha: 0,
            duration: 300,
            onComplete: () => effect.destroy()
        });
    }

    /**
     * 사냥터 이름 HUD (실시간 통계 포함)
     */
    private showHuntingZoneHUD(zoneName: string): void {
        // 기존 HUD 제거
        const existing = this.children.getByName('huntingHUD');
        if (existing) existing.destroy();

        const hud = this.add.container(this.cameras.main.width / 2, 45);
        hud.setName('huntingHUD');
        hud.setDepth(1500);
        hud.setScrollFactor(0);

        // 배경
        const bg = this.add.rectangle(0, 0, 320, 55, 0x000000, 0.8);
        bg.setStrokeStyle(2, 0x8b5cf6);
        hud.add(bg);

        // 사냥터 이름
        const nameText = this.add.text(-100, -15, `⚔️ ${zoneName}`, {
            fontSize: '14px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        hud.add(nameText);

        // 처치 수
        const killText = this.add.text(-100, 10, '🗡️ 0마리', {
            fontSize: '12px',
            color: '#ff6b6b'
        }).setOrigin(0, 0.5);
        killText.setName('huntKillText');
        hud.add(killText);

        // 경험치
        const expText = this.add.text(0, 10, '⭐ 0 EXP', {
            fontSize: '12px',
            color: '#4ade80'
        }).setOrigin(0, 0.5);
        expText.setName('huntExpText');
        hud.add(expText);

        // 골드
        const goldText = this.add.text(80, 10, '💰 0 G', {
            fontSize: '12px',
            color: '#ffd700'
        }).setOrigin(0, 0.5);
        goldText.setName('huntGoldText');
        hud.add(goldText);

        // 중지 버튼
        const stopBtn = this.add.text(140, -5, '❌', {
            fontSize: '20px'
        }).setOrigin(0.5);
        stopBtn.setInteractive({ useHandCursor: true });
        stopBtn.on('pointerdown', () => this.stopAutoHunt());
        stopBtn.on('pointerover', () => stopBtn.setScale(1.2));
        stopBtn.on('pointerout', () => stopBtn.setScale(1));
        hud.add(stopBtn);
    }

    /**
     * 사냥 HUD 통계 업데이트
     */
    private updateHuntingHUD(): void {
        const hud = this.children.getByName('huntingHUD') as Phaser.GameObjects.Container | null;
        if (!hud) return;

        const killText = hud.getByName('huntKillText') as Phaser.GameObjects.Text;
        const expText = hud.getByName('huntExpText') as Phaser.GameObjects.Text;
        const goldText = hud.getByName('huntGoldText') as Phaser.GameObjects.Text;

        if (killText) killText.setText(`🗡️ ${this.killCount}마리`);
        if (expText) expText.setText(`⭐ ${this.sessionExp.toLocaleString()} EXP`);
        if (goldText) goldText.setText(`💰 ${this.sessionGold.toLocaleString()} G`);
    }

    /**
     * 자동 사냥 중지
     */
    stopAutoHunt(): void {
        if (!this.isAutoHunting) return;

        this.isAutoHunting = false;
        this.idleSystem.stopHunting();

        // 타이머 정리
        if (this.autoHuntTimer) {
            clearInterval(this.autoHuntTimer);
            this.autoHuntTimer = 0;
        }

        // HUD 제거
        const hud = this.children.getByName('huntingHUD');
        if (hud) hud.destroy();

        // 종료 메시지 (로컬 통계 사용)
        this.showAutoHuntMessage(
            `⏹️ 사냥 종료\n처치: ${this.killCount}마리\n경험치: ${this.sessionExp.toLocaleString()}\n골드: ${this.sessionGold.toLocaleString()}`
        );

        const stats = { kills: this.killCount, exp: this.sessionExp, gold: this.sessionGold };
        this.events.emit('autoHuntStop', stats);

        // 몬스터 모두 제거
        for (const monster of this.monsters) {
            monster.destroy();
        }
        this.monsters = [];

        // NPC 다시 표시
        for (const npc of this.npcs) {
            npc.setVisible(true);
        }

        // 사냥터 관련 상태 초기화
        this.currentHuntingZone = null;

        // 마을 색상으로 복원
        this.tileColors = { 0: 0x2d4a4b, 1: 0x4a7c6f, 2: 0x5a8c7f, 3: 0x6b8e7d, 4: 0x3d5a5b };
        this.worldContainer.removeAll(true);
        this.createMap();

        // 플레이어 위치 초기화
        this.player.moveToWorld(5, 5, 0);

        // 맵 이름 복원
        this.currentMap.nameKo = '시작 마을';
    }

    /**
     * 사냥터 몬스터 스폰
     */
    private spawnHuntingZoneMonsters(zoneId: string): void {
        const zone = HUNTING_ZONES.find(z => z.id === zoneId);
        if (!zone) return;

        // 써클에 맞는 몬스터 가져오기
        const monsters = getMonstersByCircle(zone.circle);
        if (monsters.length === 0) return;

        // 10마리 스폰
        for (let i = 0; i < 10; i++) {
            const monsterDef = monsters[Math.floor(Math.random() * monsters.length)];
            const x = 3 + Math.random() * 4;
            const y = 3 + Math.random() * 4;

            try {
                const monster = new Monster(this, monsterDef.id, x, y, 3000);
                this.monsters.push(monster);
            } catch (e) {
                // 몬스터 생성 실패 시 무시
            }
        }
    }

    /**
     * 자동 사냥 메시지 표시
     */
    private showAutoHuntMessage(message: string): void {
        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            message,
            {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#000000aa',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setDepth(3000);

        this.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 2000,
            delay: 1000,
            onComplete: () => text.destroy()
        });
    }

    /**
     * 사냥터 UI 토글
     */
    toggleHuntingZoneUI(): void {
        this.huntingZoneUI.toggle();
    }

    /**
     * 현재 자동 사냥 중인지
     */
    getIsAutoHunting(): boolean {
        return this.isAutoHunting;
    }
}
