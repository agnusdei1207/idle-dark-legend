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
import type { MapDefinition } from '../../types/game.types';
import { Player } from '../entities/Player';
import { Monster } from '../entities/Monster';
import { NPC } from '../entities/NPC';
import { getMonsterById } from '../../data/monsters.data';

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

    constructor(game: ThreeGame, data?: { mapId?: string }) {
        this.game = game;

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

        // 맵 중앙에 배치
        const centerTileX = 15;
        const centerTileY = 15;
        this.player.setPosition(
            IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).x,
            IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32).y
        );

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
                <div>Warrior Lv.1</div>
                <div style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">Gold: 0</div>
            </div>

            <!-- ESC 안내 -->
            <div id="esc-hint" style="
                position: absolute;
                top: 20px;
                right: 20px;
                color: #7f8c8d;
                font-size: 14px;
                z-index: 1000;
            ">ESC: 메뉴 | SPACE: 공격</div>
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
            }
        });

        // 죽은 몬스터 제거
        this.monsters.forEach((monster, id) => {
            if (monster.isDead()) {
                // TODO: 죽은 몬스터 처리 (경험치, 드롭 등)
                console.log(`Monster ${id} died`);
                this.entityGroup.remove(monster.mesh);
                monster.destroy();
                this.monsters.delete(id);
            }
        });
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
            if (inRange) {
                // TODO: NPC 상호작용 표시
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

        if (hpText && hpBar) {
            const currentHp = 100; // TODO: 실제 플레이어 HP
            const maxHp = 100;
            hpText.textContent = `${currentHp}/${maxHp}`;
            hpBar.style.width = `${(currentHp / maxHp) * 100}%`;
        }

        if (mpText && mpBar) {
            const currentMp = 50; // TODO: 실제 플레이어 MP
            const maxMp = 50;
            mpText.textContent = `${currentMp}/${maxMp}`;
            mpBar.style.width = `${(currentMp / maxMp) * 100}%`;
        }

        if (expText && expBar) {
            const currentExp = 0; // TODO: 실제 플레이어 EXP
            const expNeeded = 100;
            expText.textContent = `${currentExp}/${expNeeded} Lv.1`;
            expBar.style.width = `${(currentExp / expNeeded) * 100}%`;
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

        // ESC 키로 메뉴
        if (this.game.input.justPressed('Escape')) {
            // TODO: 일시정지 또는 메뉴 표시
            console.log('GameScene: ESC pressed');
        }

        // SPACE 키로 공격
        if (this.game.input.justPressed('Space')) {
            if (this.player) {
                this.player.playAttackAnimation();
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
        const escHint = document.getElementById('esc-hint');
        if (hud) hud.remove();
        if (playerInfo) playerInfo.remove();
        if (escHint) escHint.remove();

        console.log('GameScene: Shutdown');
    }
}
