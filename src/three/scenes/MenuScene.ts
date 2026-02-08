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

        try {
            await this.game.switchScene('game');
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('게임 시작 실패');
        }
    }

    /**
     * 이어하기
     */
    private async continueGame(): Promise<void> {
        console.log('MenuScene: Continuing game...');

        // 저장된 게임 확인
        const saveData = this.checkSaveData();
        if (saveData) {
            try {
                // 저장된 데이터로 GameScene 전환
                await this.game.switchScene('game', { saveData });
            } catch (error) {
                console.error('Failed to continue game:', error);
                alert('게임 로드 실패');
            }
        } else {
            alert('저장된 게임이 없습니다.\n새 게임으로 시작해주세요!');
        }
    }

    /**
     * 저장 데이터 확인
     */
    private checkSaveData(): any | null {
        try {
            const saveJson = localStorage.getItem('shadow_realm_save');
            if (saveJson) {
                const data = JSON.parse(saveJson);
                // 저장 데이터 유효성 확인
                if (data && data.level && data.savedAt) {
                    const saveDate = new Date(data.savedAt);
                    const now = new Date();
                    const diffHours = Math.floor((now.getTime() - saveDate.getTime()) / (1000 * 60 * 60));
                    console.log(`Found save data: Level ${data.level}, saved ${diffHours}h ago`);
                    return data;
                }
            }
            return null;
        } catch (e) {
            console.error('Failed to check save data:', e);
            return null;
        }
    }

    /**
     * 옵션
     */
    private showOptions(): void {
        console.log('MenuScene: Showing options...');

        // 기존 옵션 제거
        const existingOptions = document.getElementById('options-modal');
        if (existingOptions) {
            existingOptions.remove();
            return;
        }

        // 저장된 설정 불러오기
        const settingsJson = localStorage.getItem('shadow_realm_settings');
        const settings = settingsJson ? JSON.parse(settingsJson) : {
            masterVolume: 80,
            bgmVolume: 70,
            sfxVolume: 80,
            showDamageNumbers: true,
            autoSaveInterval: 5,
            uiScale: 1
        };

        // 옵션 모달 HTML 생성
        const optionsHtml = `
            <div id="options-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            ">
                <div style="
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #e94560;
                    border-radius: 12px;
                    padding: 30px;
                    width: 400px;
                    color: #e0e0e0;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                ">
                    <h2 style="
                        color: #e94560;
                        margin-bottom: 20px;
                        text-align: center;
                        font-size: 28px;
                    ">옵션</h2>

                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>마스터 볼륨</label>
                            <input type="range" id="opt-master" min="0" max="100" value="${settings.masterVolume}" style="width: 150px;">
                            <span id="val-master">${settings.masterVolume}</span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>BGM 볼륨</label>
                            <input type="range" id="opt-bgm" min="0" max="100" value="${settings.bgmVolume}" style="width: 150px;">
                            <span id="val-bgm">${settings.bgmVolume}</span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>SFX 볼륨</label>
                            <input type="range" id="opt-sfx" min="0" max="100" value="${settings.sfxVolume}" style="width: 150px;">
                            <span id="val-sfx">${settings.sfxVolume}</span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>데미지 표시</label>
                            <input type="checkbox" id="opt-damage" ${settings.showDamageNumbers ? 'checked' : ''}>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label>오토저장 간격</label>
                            <select id="opt-autosave" style="width: 100px; padding: 5px;">
                                <option value="1" ${settings.autoSaveInterval === 1 ? 'selected' : ''}>1분</option>
                                <option value="5" ${settings.autoSaveInterval === 5 ? 'selected' : ''}>5분</option>
                                <option value="10" ${settings.autoSaveInterval === 10 ? 'selected' : ''}>10분</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: center;">
                        <button id="opt-save" style="
                            padding: 10px 20px;
                            background: linear-gradient(135deg, #e94560 0%, #c0392b 100%);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">저장</button>
                        <button id="opt-cancel" style="
                            padding: 10px 20px;
                            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">취소</button>
                    </div>

                    <div style="margin-top: 15px; text-align: center;">
                        <button id="opt-reset" style="
                            padding: 8px 16px;
                            background: #95a5a6;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                        ">초기화</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', optionsHtml);

        // 이벤트 리스너 설정
        const modal = document.getElementById('options-modal');
        const masterSlider = document.getElementById('opt-master') as HTMLInputElement;
        const bgmSlider = document.getElementById('opt-bgm') as HTMLInputElement;
        const sfxSlider = document.getElementById('opt-sfx') as HTMLInputElement;
        const damageCheck = document.getElementById('opt-damage') as HTMLInputElement;
        const autosaveSelect = document.getElementById('opt-autosave') as HTMLSelectElement;

        // 슬라이더 값 표시 업데이트
        const updateSliderDisplay = (slider: HTMLInputElement, displayId: string) => {
            const display = document.getElementById(displayId);
            if (display) {
                slider.addEventListener('input', () => {
                    display.textContent = slider.value;
                });
            }
        };

        updateSliderDisplay(masterSlider, 'val-master');
        updateSliderDisplay(bgmSlider, 'val-bgm');
        updateSliderDisplay(sfxSlider, 'val-sfx');

        // 저장 버튼
        document.getElementById('opt-save')?.addEventListener('click', () => {
            const newSettings = {
                masterVolume: parseInt(masterSlider.value),
                bgmVolume: parseInt(bgmSlider.value),
                sfxVolume: parseInt(sfxSlider.value),
                showDamageNumbers: damageCheck.checked,
                autoSaveInterval: parseInt(autosaveSelect.value),
                uiScale: settings.uiScale
            };

            localStorage.setItem('shadow_realm_settings', JSON.stringify(newSettings));
            console.log('Options saved:', newSettings);

            if (modal) modal.remove();
            alert('옵션이 저장되었습니다!');
        });

        // 취소 버튼
        document.getElementById('opt-cancel')?.addEventListener('click', () => {
            if (modal) modal.remove();
        });

        // 초기화 버튼
        document.getElementById('opt-reset')?.addEventListener('click', () => {
            if (confirm('모든 설정을 초기화하시겠습니까?')) {
                localStorage.removeItem('shadow_realm_settings');
                if (modal) modal.remove();
                alert('설정이 초기화되었습니다.');
            }
        });

        // 모달 외부 클릭 시 닫기
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
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
