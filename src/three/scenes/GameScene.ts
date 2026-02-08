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

/**
 * GameScene 클래스
 */
export class GameScene implements BaseScene {
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.OrthographicCamera;

    private game: ThreeGame;
    private mapGroup: THREE.Group;
    private entityGroup: THREE.Group;
    private playerSprite: THREE.Sprite | null = null;
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

        // 카메라 설정
        this.setupCamera();

        // UI 표시
        this.showGameUI();

        console.log('GameScene: Ready!');
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
                    // 나무
                    const tree = SpriteUtils.createColorSprite('#27ae60', 32, 48);
                    tree.position.set(pos.x, pos.y, 2);
                    this.mapGroup.add(tree);
                } else {
                    // 바위
                    const rock = SpriteUtils.createColorSprite('#7f8c8d', 24, 16);
                    rock.position.set(pos.x, pos.y, 1);
                    this.mapGroup.add(rock);
                }
            }
        }
    }

    /**
     * 플레이어 생성
     */
    private createPlayer(): void {
        const assetManager = this.game.assetManager;
        const playerTexture = assetManager.get('player');

        if (playerTexture) {
            this.playerSprite = new THREE.Sprite(playerTexture);
            this.playerSprite.scale.set(64, 64, 1);
        } else {
            // 플레이스홀더
            this.playerSprite = SpriteUtils.createColorSprite('#3498db', 64, 64);
        }

        // 맵 중앙에 배치
        const centerTileX = 15;
        const centerTileY = 15;
        const pos = IsometricUtils.tileToWorld(centerTileX, centerTileY, 64, 32);

        this.playerSprite.position.set(pos.x, pos.y, 10);
        this.entityGroup.add(this.playerSprite);

        // 카메라 타겟 설정
        this.cameraTarget.copy(this.playerSprite.position);
    }

    /**
     * 카메라 설정
     */
    private setupCamera(): void {
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

            <!-- ESC 안내 -->
            <div id="esc-hint" style="
                position: absolute;
                top: 20px;
                right: 20px;
                color: #7f8c8d;
                font-size: 14px;
                z-index: 1000;
            ">ESC: 메뉴</div>
        `;

        container.insertAdjacentHTML('beforeend', hudHtml);
    }

    /**
     * 플레이어 이동 처리
     */
    private handlePlayerMovement(deltaTime: number): void {
        if (!this.playerSprite) return;

        const input = this.game.input;
        const moveSpeed = 150; // 유닛/초

        // WASD 이동
        const wasdDir = input.getWASDDirection();
        if (wasdDir.x !== 0 || wasdDir.y !== 0) {
            this.playerSprite.position.x += wasdDir.x * moveSpeed * deltaTime;
            this.playerSprite.position.y += wasdDir.y * moveSpeed * deltaTime;
        }

        // 방향키 이동
        const arrowDir = input.getArrowDirection();
        if (arrowDir.x !== 0 || arrowDir.y !== 0) {
            this.playerSprite.position.x += arrowDir.x * moveSpeed * deltaTime;
            this.playerSprite.position.y += arrowDir.y * moveSpeed * deltaTime;
        }
    }

    /**
     * 카메라 업데이트
     */
    private updateCamera(): void {
        if (!this.playerSprite) return;

        // 카메라 타겟을 플레이어 위치로 업데이트
        this.cameraTarget.copy(this.playerSprite.position);

        // 부드러운 카메라 이동
        const lerpFactor = 0.1;
        this.camera.position.x += (this.cameraTarget.x - this.camera.position.x) * lerpFactor;
        this.camera.position.y += (this.cameraTarget.y - this.camera.position.y) * lerpFactor;
    }

    /**
     * HUD 업데이트
     */
    private updateHUD(): void {
        // TODO: 실제 플레이어 데이터 연동
        // 현재는 정적 값만 표시
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number, elapsedTime: number): void {
        // 플레이어 이동
        this.handlePlayerMovement(deltaTime);

        // 카메라 업데이트
        this.updateCamera();

        // HUD 업데이트
        this.updateHUD();

        // ESC 키로 메뉴
        if (this.game.input.justPressed('Escape')) {
            // TODO: 일시정지 또는 메뉴 표시
            console.log('GameScene: ESC pressed');
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
        // UI 제거
        const hud = document.getElementById('game-hud');
        const escHint = document.getElementById('esc-hint');
        if (hud) hud.remove();
        if (escHint) escHint.remove();

        console.log('GameScene: Shutdown');
    }
}
