/**
 * ============================================================
 * MenuScene - 메인 메뉴 Scene
 * ============================================================
 * 메인 메뉴를 표시하고 게임 시작을 처리하는 Scene
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { BaseScene } from '../core/SceneManager';
import { IsometricUtils } from '../utils/IsometricUtils';
import { SpriteUtils } from '../utils/SpriteUtils';

/**
 * MenuScene 클래스
 */
export class MenuScene implements BaseScene {
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.OrthographicCamera;

    private game: ThreeGame;
    private backgroundGroup: THREE.Group;
    private menuVisible: boolean = false;

    constructor(game: ThreeGame, data?: any) {
        this.game = game;

        // Scene 생성
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera 생성 (아이소메트릭)
        const canvas = game.getCanvas();
        this.camera = IsometricUtils.createIsometricCamera(canvas.width, canvas.height);
        this.camera.position.set(0, 0, 200);

        // 배경 그룹
        this.backgroundGroup = new THREE.Group();
        this.scene.add(this.backgroundGroup);
    }

    /**
     * Scene 생성
     */
    public async create(): Promise<void> {
        console.log('MenuScene: Creating menu...');

        // 배경 생성
        this.createBackground();

        // 메뉴 UI 표시
        this.showMenuUI();

        // 입력 리스너 설정
        this.setupInputListeners();
    }

    /**
     * 배경 생성
     */
    private createBackground(): void {
        // 아이소메트릭 타일 배경
        const tileGrid = IsometricUtils.createTileGrid(20, 20, {
            width: 64,
            height: 32
        }, 0x2c3e50);

        this.backgroundGroup.add(tileGrid);

        // 장식 추가 (무작위 배치)
        for (let i = 0; i < 30; i++) {
            const x = Math.floor(Math.random() * 20);
            const y = Math.floor(Math.random() * 20);
            const pos = IsometricUtils.tileToWorld(x, y, 64, 32);

            const decoration = SpriteUtils.createColorSprite(
                Math.random() > 0.5 ? 0x3498db : 0x9b59b6,
                32, 32
            );
            decoration.position.set(pos.x, pos.y, 1);
            this.backgroundGroup.add(decoration);
        }
    }

    /**
     * 메뉴 UI 표시
     */
    private showMenuUI(): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        // 기존 메뉴 제거
        const existingMenu = document.getElementById('main-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // 메뉴 HTML 생성
        const menuHtml = `
            <div id="main-menu" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #e0e0e0;
                font-family: 'Arial', sans-serif;
                z-index: 1000;
            ">
                <h1 style="
                    font-size: 48px;
                    margin-bottom: 10px;
                    color: #e94560;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                ">어둠의전설 클래식</h1>
                <h2 style="
                    font-size: 24px;
                    margin-bottom: 40px;
                    color: #e0e0e0;
                ">Dark Legend Classic</h2>
                <div class="menu-buttons" style="display: flex; flex-direction: column; gap: 15px; align-items: center;">
                    <button id="btn-new-game" class="menu-btn" style="
                        width: 200px;
                        padding: 15px 30px;
                        font-size: 18px;
                        background: linear-gradient(135deg, #e94560 0%, #c0392b 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">새 게임</button>
                    <button id="btn-continue" class="menu-btn" style="
                        width: 200px;
                        padding: 15px 30px;
                        font-size: 18px;
                        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">이어하기</button>
                    <button id="btn-options" class="menu-btn" style="
                        width: 200px;
                        padding: 15px 30px;
                        font-size: 18px;
                        background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">옵션</button>
                </div>
                <p style="
                    margin-top: 40px;
                    font-size: 14px;
                    color: #7f8c8d;
                ">Phaser 3 → Three.js 마이그레이션 중</p>
            </div>
            <style>
                .menu-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
                }
                .menu-btn:active {
                    transform: scale(0.98);
                }
            </style>
        `;

        container.insertAdjacentHTML('beforeend', menuHtml);

        // 버튼 이벤트 리스너
        const newGameBtn = document.getElementById('btn-new-game');
        const continueBtn = document.getElementById('btn-continue');
        const optionsBtn = document.getElementById('btn-options');

        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.startNewGame());
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.continueGame());
        }

        if (optionsBtn) {
            optionsBtn.addEventListener('click', () => this.showOptions());
        }

        this.menuVisible = true;
    }

    /**
     * 입력 리스너 설정
     */
    private setupInputListeners(): void {
        // ESC 키로 메뉴 숨김/표시 (테스트용)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                if (this.menuVisible) {
                    this.hideMenuUI();
                } else {
                    this.showMenuUI();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
    }

    /**
     * 새 게임 시작
     */
    private async startNewGame(): Promise<void> {
        console.log('MenuScene: Starting new game...');

        // TODO: GameScene 등록 후 전환
        // await this.game.switchScene('game');

        // 임시: 알림만 표시
        alert('새 게임 시작 (GameScene 구현 예정)');
    }

    /**
     * 이어하기
     */
    private async continueGame(): Promise<void> {
        console.log('MenuScene: Continuing game...');

        // TODO: 저장된 게임 확인 후 GameScene 전환
        // const hasSaveData = checkSaveData();
        // if (hasSaveData) {
        //     await this.game.switchScene('game');
        // }

        // 임시: 알림만 표시
        alert('이어하기 (저장된 게임 없음)');
    }

    /**
     * 옵션
     */
    private showOptions(): void {
        // TODO: 옵션 UI 표시
        alert('옵션 (구현 예정)');
    }

    /**
     * 메뉴 UI 숨김
     */
    private hideMenuUI(): void {
        const menu = document.getElementById('main-menu');
        if (menu) {
            menu.remove();
        }
        this.menuVisible = false;
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number, elapsedTime: number): void {
        // 배경 회전 (효과)
        this.backgroundGroup.rotation.z += deltaTime * 0.05;
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
        this.hideMenuUI();
        console.log('MenuScene: Shutdown');
    }
}
