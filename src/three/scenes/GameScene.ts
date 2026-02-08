/**
 * ============================================================
 * GameScene - 메인 게임 Scene
 * ============================================================
 * 실제 게임 플레이가 이루어지는 메인 Scene
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { BaseScene } from '../core/SceneManager';
import { IsometricUtils } from '../utils/IsometricUtils';
import { SpriteUtils } from '../utils/SpriteUtils';
import type { MapDefinition, Position } from '../../types/game.types';
import { Player } from '../entities/Player';
import { Monster } from '../entities/Monster';
import { NPC } from '../entities/NPC';
import { getMonsterById } from '../../data/monsters.data';
import { DialogueSystem } from '../systems/DialogueSystem';
import { OfflineRewardSystem } from '../systems/OfflineRewardSystem';
import { ParticleSystem } from '../systems/ObjectPool';
import { InventoryUI } from '../ui/InventoryUI';
import { SkillsUI } from '../ui/SkillsUI';
import { QuestUI } from '../ui/QuestUI';

/**
 * GameScene 클래스
 */
export class GameScene implements BaseScene {
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.OrthographicCamera;

    private game: ThreeGame;
    private mapGroup: THREE.Group;
    private entityGroup: THREE.Group;
    public player: Player | null = null;
    private monsters: Map<string, Monster> = new Map();
    private npcs: Map<string, NPC> = new Map();
    private cameraTarget: THREE.Vector3;
    private currentMap: MapDefinition | null = null;
    private dialogueSystem: DialogueSystem;
    private activeNPC: NPC | null = null;
    private offlineRewardSystem: OfflineRewardSystem;
    private particleSystem: ParticleSystem;
    private inventoryUI: InventoryUI;
    private skillsUI: SkillsUI;
    private questsUI: QuestUI;
    private saveData: any | null = null;

    constructor(game: ThreeGame, data?: { mapId?: string; saveData?: any }) {
        this.game = game;

        // 저장 데이터 저장
        if (data?.saveData) {
            this.saveData = data.saveData;
            console.log('GameScene: Loaded save data', this.saveData);
        }

        // Scene 생성
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera 생성 (아이소메트릭)
        const canvas = game.getCanvas();
        this.camera = IsometricUtils.createIsometricCamera(canvas.width, canvas.height);
        this.camera.position.set(0, 0, 200);

        // 그룹 생성
        this.mapGroup = new THREE.Group();
        this.entityGroup = new THREE.Group();
        this.scene.add(this.mapGroup);
        this.scene.add(this.entityGroup);

        // 카메라 타겟
        this.cameraTarget = new THREE.Vector3(0, 0, 0);

        // 대화 시스템
        this.dialogueSystem = new DialogueSystem();

        // 오프라인 보상 시스템
        this.offlineRewardSystem = new OfflineRewardSystem();

        // 파티클 시스템
        this.particleSystem = ParticleSystem.getInstance();

        // UI 시스템 초기화
        this.inventoryUI = new InventoryUI();
        this.skillsUI = new SkillsUI([], new Map());
        this.questsUI = new QuestUI();

        // 맵 데이터 설정 (임시)
        this.currentMap = {
            id: 'novis_village',
            name: 'Novice Village',
            nameKo: '노비스 마을',
            tilemapKey: '',
            tilesetKey: '',
            portals: [],
            spawns: [],
            npcs: [],
            pvpEnabled: false,
            levelRequirement: 1
        };
    }

    /**
     * Scene 생성
     */
    public async create(): Promise<void> {
        console.log('GameScene: Creating game scene...');

        // 맵 로딩 및 렌더링
        await this.loadMap();

        // 플레이어 생성
        this.createPlayer();

        // 몬스터 생성 (테스트)
        this.spawnTestMonsters();

        // NPC 생성 (테스트)
        this.spawnTestNPCs();

        // 카메라 설정
        this.setupCamera();

        // UI 표시
        this.showGameUI();

        // 오프라인 보상 체크
        this.checkOfflineReward();

        // 조명 설정
        this.setupLighting();

        console.log('GameScene: Ready!');
    }

    /**
     * 조명 설정
     */
    private setupLighting(): void {
        // ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(50, 100, 50);
        this.scene.add(directionalLight);
    }

    /**
     * 맵 로딩
     */
    private async loadMap(): Promise<void> {
        // 임시: 타일 그리드 생성
        const mapWidth = 30;
        const mapHeight = 30;

        // 배경 타일
        const tileGrid = IsometricUtils.createTileGrid(mapWidth, mapHeight, {
            width: 64,
            height: 32
        }, 0x2c3e50);

        this.mapGroup.add(tileGrid);

        // 벽 타일 (테두리)
        this.createWallTiles(mapWidth, mapHeight);

        // 장식 추가
        this.addMapDecorations(mapWidth, mapHeight);
    }

    /**
     * 벽 타일 생성
     */
    private createWallTiles(width: number, height: number): void {
        // 상단 벽
        for (let x = 0; x < width; x++) {
            const pos = IsometricUtils.tileToWorld(x, 0, 64, 32);
            const wall = SpriteUtils.createColorSprite('#1a1a2e', 64, 32);
            wall.position.set(pos.x, pos.y, 1);
            this.mapGroup.add(wall);
        }

        // 하단 벽
        for (let x = 0; x < width; x++) {
            const pos = IsometricUtils.tileToWorld(x, height - 1, 64, 32);
            const wall = SpriteUtils.createColorSprite('#1a1a2e', 64, 32);
            wall.position.set(pos.x, pos.y, 1);
            this.mapGroup.add(wall);
        }

        // 좌단 벽
        for (let y = 0; y < height; y++) {
            const pos = IsometricUtils.tileToWorld(0, y, 64, 32);
            const wall = SpriteUtils.createColorSprite('#1a1a2e', 64, 32);
            wall.position.set(pos.x, pos.y, 1);
            this.mapGroup.add(wall);
        }

        // 우단 벽
        for (let y = 0; y < height; y++) {
            const pos = IsometricUtils.tileToWorld(width - 1, y, 64, 32);
            const wall = SpriteUtils.createColorSprite('#1a1a2e', 64, 32);
            wall.position.set(pos.x, pos.y, 1);
            this.mapGroup.add(wall);
        }
    }

    /**
     * 맵 장식 추가
     */
    private addMapDecorations(width: number, height: number): void {
        // 무작위 나무/바위
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * (width - 2)) + 1;
            const y = Math.floor(Math.random() * (height - 2)) + 1;

            // 타일 위에만 배치 (벽 제외)
            if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
                const pos = IsometricUtils.tileToWorld(x, y, 64, 32);
                const isTree = Math.random() > 0.5;

                if (isTree) {
                    // 나무 (3D 박스로)
                    const trunkGeometry = new THREE.BoxGeometry(8, 20, 8);
                    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                    trunk.position.set(pos.x, pos.y + 10, 1);
                    this.mapGroup.add(trunk);

                    // 나뭇잎
                    const leavesGeometry = new THREE.BoxGeometry(24, 24, 24);
                    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
                    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
                    leaves.position.set(pos.x, pos.y + 32, 1);
                    this.mapGroup.add(leaves);
                } else {
                    // 바위
                    const rockGeometry = new THREE.BoxGeometry(16, 12, 16);
                    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
                    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
                    rock.position.set(pos.x, pos.y + 6, 1);
                    this.mapGroup.add(rock);
                }
            }
        }
    }

    /**
     * 플레이어 생성
     */
    private createPlayer(): void {
        this.player = new Player(this.game);

        // 저장된 데이터가 있으면 로드
        if (this.saveData) {
            console.log('Loading player from save data...');

            // 레벨, 경험치, 골드 설정
            if (this.saveData.level) {
                this.player.setLevel(this.saveData.level);
            }
            if (this.saveData.exp) {
                this.player.setExp(this.saveData.exp);
            }
            if (this.saveData.gold !== undefined) {
                this.player.setGold(this.saveData.gold);
            }

            // 저장된 위치에 배치
            if (this.saveData.position) {
                const pos = IsometricUtils.tileToWorld(
                    this.saveData.position.x || 15,
                    this.saveData.position.y || 15,
                    64, 32
                );
                this.player.setPosition(pos.x, pos.y);
            } else {
                // 맵 중앙에 배치
                const centerTileX = 15;
                const centerTileY = 15;
                this.player.setPosition(
                    IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).x,
                    IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).y
                );
            }

            console.log(`Player loaded: Level ${this.saveData.level}, ${this.saveData.exp} EXP, ${this.saveData.gold} Gold`);
        } else {
            // 맵 중앙에 배치
            const centerTileX = 15;
            const centerTileY = 15;
            this.player.setPosition(
                IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).x,
                IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).y
            );
        }

        this.entityGroup.add(this.player.mesh);

        // 카메라 타겟 설정
        this.cameraTarget.copy(this.player.mesh.position);

        console.log('GameScene: Player created');
    }

    /**
     * 테스트 몬스터 스폰
     */
    private spawnTestMonsters(): void {
        // 슬라임 3마리
        const slimeData = getMonsterById('mon_pampat');
        if (slimeData) {
            for (let i = 0; i < 3; i++) {
                const tileX = 10 + i * 3;
                const tileY = 10 + i * 2;
                const monster = new Monster(this.game, slimeData, tileX, tileY);
                const monsterId = `monster_${i}`;
                this.monsters.set(monsterId, monster);
                this.entityGroup.add(monster.mesh);
            }
        }

        // 늑대 2마리
        const wolfData = getMonsterById('mon_wolf');
        if (wolfData) {
            for (let i = 0; i < 2; i++) {
                const tileX = 20 + i * 2;
                const tileY = 20 + i;
                const monster = new Monster(this.game, wolfData, tileX, tileY);
                const monsterId = `wolf_${i}`;
                this.monsters.set(monsterId, monster);
                this.entityGroup.add(monster.mesh);
            }
        }

        console.log(`GameScene: Spawned ${this.monsters.size} test monsters`);
    }

    /**
     * 테스트 NPC 스폰
     */
    private spawnTestNPCs(): void {
        // 상인 NPC
        const merchantData = {
            id: 'npc_merchant_1',
            name: 'Merchant',
            nameKo: '상인',
            type: 'merchant' as const,
            spriteKey: 'npc_merchant',
            dialogueId: 'dialogue_merchant_1',
            shopId: 'shop_general'
        };

        const merchant = new NPC(this.game, merchantData, 5, 15);
        this.npcs.set('npc_merchant_1', merchant);
        this.entityGroup.add(merchant.mesh);

        // 퀘스트 NPC
        const questData = {
            id: 'npc_quest_1',
            name: 'Quest Giver',
            nameKo: '퀘스트 NPC',
            type: 'quest' as const,
            spriteKey: 'npc_quest',
            dialogueId: 'dialogue_quest_1',
            questIds: ['quest_tutorial_1']
        };

        const questGiver = new NPC(this.game, questData, 25, 10);
        this.npcs.set('npc_quest_1', questGiver);
        this.entityGroup.add(questGiver.mesh);

        console.log(`GameScene: Spawned ${this.npcs.size} test NPCs`);
    }

    /**
     * 카메라 설정
     */
    private setupCamera(): void {
        if (!this.player) return;

        // 카메라를 플레이어 위치로
        this.camera.position.set(
            this.cameraTarget.x,
            this.cameraTarget.y,
            200
        );
        this.camera.lookAt(this.cameraTarget);
    }

    /**
     * 게임 UI 표시
     */
    private showGameUI(): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        // HUD
        const hudHtml = `
            <div id="game-hud" style="
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                pointer-events: none;
                z-index: 1000;
            ">
                <!-- HP 바 -->
                <div style="width: 300px;">
                    <div style="color: #e0e0e0; font-size: 14px; margin-bottom: 5px;">HP: <span id="hp-text">100/100</span></div>
                    <div style="width: 100%; height: 20px; background: #1a1a2e; border-radius: 10px; overflow: hidden; border: 2px solid #34495e;">
                        <div id="hp-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%); transition: width 0.3s;"></div>
                    </div>
                </div>

                <!-- MP 바 -->
                <div style="width: 300px;">
                    <div style="color: #e0e0e0; font-size: 14px; margin-bottom: 5px;">MP: <span id="mp-text">50/50</span></div>
                    <div style="width: 100%; height: 20px; background: #1a1a2e; border-radius: 10px; overflow: hidden; border: 2px solid #34495e;">
                        <div id="mp-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, #3498db 0%, #2980b9 100%); transition: width 0.3s;"></div>
                    </div>
                </div>

                <!-- EXP 바 -->
                <div style="width: 300px;">
                    <div style="color: #e0e0e0; font-size: 14px; margin-bottom: 5px;">EXP: <span id="exp-text">0/100</span> Lv.1</div>
                    <div style="width: 100%; height: 20px; background: #1a1a2e; border-radius: 10px; overflow: hidden; border: 2px solid #34495e;">
                        <div id="exp-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #f39c12 0%, #e67e22 100%); transition: width 0.3s;"></div>
                    </div>
                </div>
            </div>

            <!-- 플레이어 정보 -->
            <div id="player-info" style="
                position: absolute;
                top: 20px;
                left: 20px;
                color: #e0e0e0;
                font-size: 16px;
                z-index: 1000;
                background: rgba(26, 26, 46, 0.8);
                padding: 10px 15px;
                border-radius: 8px;
                border: 1px solid #34495e;
            ">
                <div class="player-title">Warrior Lv.1</div>
                <div class="player-gold" style="font-size: 14px; color: #f1c40f; margin-top: 5px;">Gold: 0</div>
            </div>

            <!-- 단축키 안내 -->
            <div id="controls-hint" style="
                position: absolute;
                top: 20px;
                right: 20px;
                color: #7f8c8d;
                font-size: 12px;
                z-index: 1000;
                text-align: right;
                line-height: 1.6;
            ">
                <div>ESC: 메뉴 | SPACE: 공격/대화</div>
                <div>I: 인벤토리 | K: 스킬 | J: 퀘스트</div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', hudHtml);
    }

    /**
     * 플레이어 이동 처리
     */
    private handlePlayerMovement(deltaTime: number): void {
        if (!this.player) return;

        const input = this.game.input;

        // WASD 이동
        const wasdDir = input.getWASDDirection();
        if (wasdDir.x !== 0 || wasdDir.y !== 0) {
            this.player.move(deltaTime, wasdDir);
        }

        // 방향키 이동
        const arrowDir = input.getArrowDirection();
        if (arrowDir.x !== 0 || arrowDir.y !== 0) {
            this.player.move(deltaTime, arrowDir);
        }
    }

    /**
     * 몬스터 AI 업데이트
     */
    private updateMonsters(deltaTime: number): void {
        if (!this.player) return;

        const playerPosition = this.player.getPosition();

        this.monsters.forEach((monster) => {
            if (!monster.isDead()) {
                monster.updateAI(deltaTime, playerPosition, this.player);

                // 플레이어 공격 범위 확인
                const distance = this.getDistance(this.player.getPosition(), monster.getPosition());
                if (distance <= 60 && monster.data.ai !== 'passive') {
                    // 몬스터가 플레이어를 공격
                    if (monster.canAttack()) {
                        const damage = monster.data.stats.attack || 10;
                        this.player.takeDamage(damage);
                        this.showDamageNumber(this.player.mesh.position, damage, 'player');
                        monster.resetAttackCooldown();
                    }
                }
            }
        });

        // 죽은 몬스터 처리
        this.monsters.forEach((monster, id) => {
            if (monster.isDead()) {
                // 경험치 보상
                const expGain = monster.data.exp || 0;
                if (this.player && expGain > 0) {
                    this.player.gainExp(expGain);
                    this.showExpNotification(expGain);
                }

                // 골드 보상
                const goldGain = monster.data.gold.min + Math.floor(Math.random() * (monster.data.gold.max - monster.data.gold.min));
                if (this.player && goldGain > 0) {
                    this.player.addGold(goldGain);
                    this.showGoldNotification(goldGain);
                }

                console.log(`Monster ${id} died - gained ${expGain} EXP, ${goldGain} gold`);

                // 메시에서 제거
                this.entityGroup.remove(monster.mesh);
                monster.destroy();
                this.monsters.delete(id);
            }
        });
    }

    /**
     * 플레이어 공격 처리
     */
    private handlePlayerAttack(): void {
        if (!this.player) return;

        const playerPosition = this.player.getPosition();

        // 근처 몬스터 찾기
        let nearestMonster: Monster | null = null;
        let nearestDistance = Infinity;

        this.monsters.forEach((monster) => {
            if (!monster.isDead()) {
                const distance = this.getDistance(playerPosition, monster.getPosition());
                if (distance <= 80 && distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestMonster = monster;
                }
            }
        });

        // 공격
        if (nearestMonster) {
            const playerStats = this.player.getStats();
            const damage = playerStats?.str || 10; // 기본 공격력
            nearestMonster.takeDamage(damage, this.player);
            this.showDamageNumber(nearestMonster.mesh.position, damage, 'monster');
            this.player.playAttackAnimation();

            // 반격 체크
            if (nearestMonster.isDead()) {
                console.log('Monster killed!');
            } else {
                // 공격당하면 추적 시작
                // (몬스터 AI가 자동 처리)
            }
        }
    }

    /**
     * 거리 계산
     */
    private getDistance(pos1: Position, pos2: Position): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 데미지 숫자 표시
     */
    private showDamageNumber(position: THREE.Vector3, damage: number, target: 'player' | 'monster'): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        // 화면 좌표로 변환 (간단히 중앙 기준)
        const x = container.clientWidth / 2;
        const y = container.clientHeight / 2;

        this.particleSystem.spawnDamageText(damage, x, y, target === 'player');
    }

    /**
     * 경험치 획득 알림
     */
    private showExpNotification(exp: number): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        const x = container.clientWidth / 2;
        const y = container.clientHeight * 0.3;

        this.particleSystem.spawnExpText(exp, x, y);
    }

    /**
     * 골드 획득 알림
     */
    private showGoldNotification(gold: number): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        const x = container.clientWidth / 2;
        const y = container.clientHeight * 0.35;

        this.particleSystem.spawnGoldText(gold, x, y);
    }

    /**
     * NPC 업데이트
     */
    private updateNPCs(): void {
        if (!this.player) return;

        const playerPosition = this.player.getPosition();

        // NPC 상호작용 범위 체크
        this.npcs.forEach((npc, id) => {
            const inRange = npc.isInRange(playerPosition);
            if (inRange && !this.dialogueSystem.isDialogueActive()) {
                // 상호작용 가능 표시
                this.showNPCInteractionHint(npc);
                this.activeNPC = npc;
            }
        });

        // 범위 밖이면 힌트 숨김
        if (this.activeNPC && !this.activeNPC.isInRange(playerPosition)) {
            this.hideNPCInteractionHint();
            this.activeNPC = null;
        }
    }

    /**
     * NPC 상호작용 힌트 표시
     */
    private showNPCInteractionHint(npc: NPC): void {
        let hint = document.getElementById('npc-interaction-hint');
        if (!hint) {
            const container = document.getElementById('game-container');
            if (!container) return;

            const hintHtml = `
                <div id="npc-interaction-hint" style="
                    position: absolute;
                    bottom: 200px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(46, 204, 113, 0.9);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1500;
                    animation: pulse 1.5s infinite;
                ">Space: 대화</div>
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                        50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
                    }
                </style>
            `;
            container.insertAdjacentHTML('beforeend', hintHtml);
            hint = document.getElementById('npc-interaction-hint');
        }

        if (hint) {
            hint.style.display = 'block';
        }
    }

    /**
     * NPC 상호작용 힌트 숨김
     */
    private hideNPCInteractionHint(): void {
        const hint = document.getElementById('npc-interaction-hint');
        if (hint) {
            hint.style.display = 'none';
        }
    }

    /**
     * 오프라인 보상 체크
     */
    private checkOfflineReward(): void {
        const reward = OfflineRewardSystem.calculateOfflineReward();
        if (reward) {
            this.offlineRewardSystem.showOfflineReward(reward, {
                onClaim: (reward) => {
                    if (!this.player) return;

                    // 경험치 지급
                    this.player.gainExp(reward.exp);

                    // 골드 지급
                    this.player.addGold(reward.gold);

                    console.log(`Offline reward claimed: ${reward.exp} EXP, ${reward.gold} Gold`);

                    // 효과 표시
                    this.showExpNotification(reward.exp);
                    this.showGoldNotification(reward.gold);
                },
                onClose: () => {
                    // 마지막 플레이 시간 저장
                    OfflineRewardSystem.saveLastPlayTime();
                }
            });
        } else {
            // 보상이 없더라도 마지막 플레이 시간은 저장
            OfflineRewardSystem.saveLastPlayTime();
        }
    }

    /**
     * NPC 대화 시작
     */
    public startDialogue(npc: NPC): void {
        // 임시 대화 데이터
        const dialogueData = [
            {
                id: 'dialogue_1',
                speaker: npc.data.name,
                speakerKo: npc.data.nameKo,
                text: `안녕하세요! 저는 ${npc.data.nameKo}입니다.`,
                choices: [
                    {
                        text: '상점 열기',
                        nextDialogueId: 'dialogue_shop'
                    },
                    {
                        text: '안녕히 가기',
                        nextDialogueId: undefined
                    }
                ]
            },
            {
                id: 'dialogue_shop',
                speaker: npc.data.name,
                speakerKo: npc.data.nameKo,
                text: '무엇을 도와드릴까요?',
                choices: [
                    {
                        text: '아이템 사기',
                        nextDialogueId: undefined
                    },
                    {
                        text: '아이템 팔기',
                        nextDialogueId: undefined
                    },
                    {
                        text: '나가기',
                        nextDialogueId: undefined
                    }
                ]
            }
        ];

        this.dialogueSystem.start(dialogueData, {
            onEnd: () => {
                console.log('Dialogue ended');
            }
        });
    }

    /**
     * 카메라 업데이트
     */
    private updateCamera(): void {
        if (!this.player) return;

        // 카메라 타겟을 플레이어 위치로 업데이트
        this.cameraTarget.copy(this.player.mesh.position);

        // 부드러운 카메라 이동
        const lerpFactor = 0.1;
        this.camera.position.x += (this.cameraTarget.x - this.camera.position.x) * lerpFactor;
        this.camera.position.y += (this.cameraTarget.y - this.camera.position.y) * lerpFactor;
    }

    /**
     * HUD 업데이트
     */
    private updateHUD(): void {
        if (!this.player) return;

        const hpText = document.getElementById('hp-text');
        const mpText = document.getElementById('mp-text');
        const expText = document.getElementById('exp-text');
        const hpBar = document.getElementById('hp-bar');
        const mpBar = document.getElementById('mp-bar');
        const expBar = document.getElementById('exp-bar');

        // HP 업데이트
        if (hpText && hpBar) {
            const currentHp = this.player.getCurrentHp();
            const maxHp = this.player.getMaxHp();
            hpText.textContent = `${currentHp}/${maxHp}`;
            hpBar.style.width = `${(currentHp / maxHp) * 100}%`;
        }

        // MP 업데이트
        if (mpText && mpBar) {
            const currentMp = this.player.getCurrentMp();
            const maxMp = this.player.getMaxMp();
            mpText.textContent = `${currentMp}/${maxMp}`;
            mpBar.style.width = `${(currentMp / maxMp) * 100}%`;
        }

        // EXP 업데이트
        if (expText && expBar) {
            const currentExp = this.player.getCurrentExp();
            const expNeeded = this.player.getExpNeeded();
            const level = this.player.getLevel();
            expText.textContent = `${currentExp}/${expNeeded} Lv.${level}`;
            expBar.style.width = `${(currentExp / expNeeded) * 100}%`;
        }

        // 플레이어 정보 업데이트
        const playerInfo = document.getElementById('player-info');
        if (playerInfo && this.player) {
            const level = this.player.getLevel();
            const gold = this.player.getGold();

            // title 업데이트
            const titleDiv = playerInfo.querySelector('.player-title');
            if (titleDiv) {
                titleDiv.textContent = `Warrior Lv.${level}`;
            }

            // 골드 업데이트
            const goldDiv = playerInfo.querySelector('.player-gold');
            if (goldDiv) {
                goldDiv.textContent = `Gold: ${gold}`;
            }
        }
    }

    /**
     * Z-index 정렬 (엔티티 깊이 정렬)
     */
    private sortEntitiesByDepth(): void {
        // 모든 엔티티를 Z-index (x + y) 기준으로 정렬
        const entities: Array<{ mesh: THREE.Group; z: number }> = [];

        if (this.player) {
            entities.push({ mesh: this.player.mesh, z: this.player.mesh.position.z });
        }

        this.monsters.forEach((monster) => {
            entities.push({ mesh: monster.mesh, z: monster.mesh.position.z });
        });

        this.npcs.forEach((npc) => {
            entities.push({ mesh: npc.mesh, z: npc.mesh.position.z });
        });

        // Z-index 오름차순 정렬
        entities.sort((a, b) => a.z - b.z);

        // 정렬된 순서대로 entityGroup에 재배치
        entities.forEach((entity) => {
            this.entityGroup.remove(entity.mesh);
            this.entityGroup.add(entity.mesh);
        });
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number, elapsedTime: number): void {
        // 플레이어 업데이트
        if (this.player) {
            this.player.update(deltaTime);
        }

        // 플레이어 이동
        this.handlePlayerMovement(deltaTime);

        // 몬스터 업데이트
        this.updateMonsters(deltaTime);

        // NPC 업데이트
        this.updateNPCs();

        // 카메라 업데이트
        this.updateCamera();

        // Z-index 정렬
        this.sortEntitiesByDepth();

        // HUD 업데이트
        this.updateHUD();

        // 파티클 시스템 업데이트
        this.particleSystem.update(deltaTime);

        // ESC 키로 메뉴
        if (this.game.input.justPressed('Escape')) {
            // TODO: 일시정지 또는 메뉴 표시
            console.log('GameScene: ESC pressed');
            // 대화 중이면 대화 종료
            if (this.dialogueSystem.isDialogueActive()) {
                this.dialogueSystem.end();
            }
            // 열린 UI 닫기
            this.inventoryUI.close();
            this.skillsUI.close();
            this.questsUI.close();
        }

        // I 키로 인벤토리 토글
        if (this.game.input.justPressed('KeyI')) {
            if (!this.dialogueSystem.isDialogueActive()) {
                this.inventoryUI.toggle();
            }
        }

        // K 키로 스킬 창 토글
        if (this.game.input.justPressed('KeyK')) {
            if (!this.dialogueSystem.isDialogueActive()) {
                this.skillsUI.toggle();
            }
        }

        // J 키로 퀘스트 창 토글
        if (this.game.input.justPressed('KeyJ')) {
            if (!this.dialogueSystem.isDialogueActive()) {
                this.questsUI.toggle();
            }
        }

        // SPACE 키로 공격 또는 NPC 대화
        if (this.game.input.justPressed('Space')) {
            // UI가 열려 있으면 동작하지 않음
            if (this.inventoryUI['isOpen'] || this.skillsUI['isOpen'] || this.questsUI['isOpen']) {
                return;
            }

            // 대화 중이면 다음 대화
            if (this.dialogueSystem.isDialogueActive()) {
                // 대화 시스템이 처리
            } else if (this.activeNPC) {
                // NPC 대화 시작
                this.startDialogue(this.activeNPC);
            } else if (this.player) {
                // 공격
                this.handlePlayerAttack();
            }
        }
    }

    /**
     * 리사이즈
     */
    public resize(width: number, height: number): void {
        const aspectRatio = width / height;
        const frustumSize = height;

        this.camera.left = (frustumSize * aspectRatio) / -2;
        this.camera.right = (frustumSize * aspectRatio) / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();
    }

    /**
     * 정리
     */
    public shutdown(): void {
        // 마지막 플레이 시간 저장
        OfflineRewardSystem.saveLastPlayTime();

        // 대화 시스템 정리
        if (this.dialogueSystem.isDialogueActive()) {
            this.dialogueSystem.end();
        }

        // NPC 힌트 제거
        this.hideNPCInteractionHint();

        // 플레이어 정리
        if (this.player) {
            this.player.destroy();
        }

        // 몬스터 정리
        this.monsters.forEach((monster) => monster.destroy());
        this.monsters.clear();

        // NPC 정리
        this.npcs.forEach((npc) => npc.destroy());
        this.npcs.clear();

        // UI 제거
        const hud = document.getElementById('game-hud');
        const playerInfo = document.getElementById('player-info');
        const controlsHint = document.getElementById('controls-hint');
        const npcHint = document.getElementById('npc-interaction-hint');
        if (hud) hud.remove();
        if (playerInfo) playerInfo.remove();
        if (controlsHint) controlsHint.remove();
        if (npcHint) npcHint.remove();

        // UI 시스템 정리
        this.inventoryUI.destroy();
        this.skillsUI.destroy();
        this.questsUI.destroy();

        // 파티클 시스템 정리
        this.particleSystem.destroy();

        console.log('GameScene: Shutdown');
    }
}
