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
import { QuestSystem, CombatSystem, SaveSystem, getDefaultSaveData } from '../systems';
import { InventoryUI, DialogueUI, QuestUI, ShopUI, CharacterUI, SkillTreeUI, CircleUI } from '../ui';
import { getMapById, generateProceduralMap } from '../data/maps.data';
import type { Position, MapDefinition } from '../types/game.types';

export class GameScene extends Phaser.Scene {
    // 엔티티
    private player!: Player;
    private monsters: Monster[] = [];
    private npcs: NPC[] = [];

    // 시스템
    private questSystem!: QuestSystem;
    private combatSystem!: CombatSystem;

    // UI
    private inventoryUI!: InventoryUI;
    private dialogueUI!: DialogueUI;
    private questUI!: QuestUI;
    private shopUI!: ShopUI;
    private characterUI!: CharacterUI;
    private skillTreeUI!: SkillTreeUI;
    private circleUI!: CircleUI;

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
        const { width, height } = this.cameras.main;

        // 시스템 초기화
        this.questSystem = new QuestSystem();
        this.combatSystem = new CombatSystem();

        // 월드 컨테이너
        this.worldContainer = this.add.container(width / 2, 150);

        // 맵 생성
        this.createMap();

        // 엔티티 생성
        this.createEntities();

        // UI 생성
        this.createUI();

        // 입력 설정
        this.setupInput();

        // 이벤트 리스너
        this.setupEvents();

        // 페이드 인
        this.cameras.main.fadeIn(500);

        // UI 씬 시작
        this.scene.launch('UIScene', { player: this.player });

        // 저장 데이터 로드
        this.loadGame();

        // 디버그 정보
        if (import.meta.env.DEV) {
            this.add.text(10, 10, `🎮 ${this.currentMap.nameKo}`, {
                fontSize: '14px', color: '#0f0'
            }).setScrollFactor(0).setDepth(2000);
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

        // 레벨업
        this.events.on('levelUp', (level: number) => {
            this.showLevelUpMessage(level);
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
     * ESC 키 처리
     */
    private handleEscape(): void {
        if (this.dialogueUI.getIsOpen()) return;
        if (this.inventoryUI.getIsOpen()) { this.inventoryUI.toggle(); return; }
        if (this.questUI.getIsOpen()) { this.questUI.toggle(); return; }
        if (this.shopUI.getIsOpen()) { this.shopUI.close(); return; }
        if (this.characterUI.getIsOpen()) { this.characterUI.toggle(); return; }
        if (this.skillTreeUI.getIsOpen()) { this.skillTreeUI.toggle(); return; }
        if (this.circleUI.getIsOpen()) { this.circleUI.toggle(); return; }

        // 게임 메뉴 열기 (구현 필요)
        this.showGameMenu();
    }

    /**
     * 게임 메뉴 표시
     */
    private showGameMenu(): void {
        // TODO: 메뉴 씬 전환
        console.log('게임 메뉴');
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

        // TODO: 플레이어 데이터 적용
        this.player.getInventory().addGold(data.gold - 100); // 기본 100골드 제외
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
}
