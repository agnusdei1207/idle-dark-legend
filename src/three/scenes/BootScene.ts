/**
 * ============================================================
 * BootScene - 부트 Scene
 * ============================================================
 * 게임 시작 시 에셋을 로딩하고 초기화하는 Scene
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { BaseScene } from '../core/SceneManager';
import { IsometricUtils } from '../utils/IsometricUtils';

/**
 * BootScene 클래스
 */
export class BootScene implements BaseScene {
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.OrthographicCamera;

    private game: ThreeGame;
    private loadingProgress: number = 0;

    constructor(game: ThreeGame, data?: any) {
        this.game = game;

        // Scene 생성
        this.scene = new THREE.Scene();

        // Camera 생성 (아이소메트릭)
        const canvas = game.getCanvas();
        this.camera = IsometricUtils.createIsometricCamera(canvas.width, canvas.height);
    }

    /**
     * Scene 생성
     */
    public async create(): Promise<void> {
        console.log('BootScene: Loading assets...');

        // 로딩 UI 표시
        this.showLoadingScreen();

        // 에셋 로딩
        await this.loadAssets();

        // 메뉴 Scene으로 전환
        setTimeout(async () => {
            this.hideLoadingScreen();
            try {
                await this.game.switchScene('menu');
            } catch (error) {
                console.error('Failed to switch to menu:', error);
            }
        }, 1000);
    }

    /**
     * 에셋 로딩
     */
    private async loadAssets(): Promise<void> {
        const assetManager = this.game.assetManager;

        // 플레이스홀더 텍스처 생성
        await this.loadPlaceholderAssets(assetManager);

        // 로딩 진행률 업데이트
        this.loadingProgress = 1;
        this.updateLoadingProgress(1);
    }

    /**
     * 플레이스홀더 에셋 로딩
     */
    private async loadPlaceholderAssets(assetManager: any): Promise<void> {
        // 플레이어 플레이스홀더 (파란색 사각형)
        const playerTexture = this.createPlaceholderTexture('#3498db', 64, 64);
        assetManager['player'] = playerTexture;

        // 몬스터 플레이스홀더 (빨간색 사각형)
        const monsterTexture = this.createPlaceholderTexture('#e74c3c', 64, 64);
        assetManager['monster'] = monsterTexture;

        // NPC 플레이스홀더 (녹색 사각형)
        const npcTexture = this.createPlaceholderTexture('#2ecc71', 64, 64);
        assetManager['npc'] = npcTexture;

        // 타일 플레이스홀더
        const tileTexture = this.createPlaceholderTexture('#34495e', 64, 32);
        assetManager['tile'] = tileTexture;
    }

    /**
     * 플레이스홀더 텍스처 생성
     */
    private createPlaceholderTexture(color: string, width: number, height: number): THREE.CanvasTexture {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, width, height);

            // 테두리
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, width, height);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        return texture;
    }

    /**
     * 로딩 화면 표시
     */
    private showLoadingScreen(): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        // 기존 로딩 화면 제거
        const existing = document.getElementById('loading-screen');
        if (existing) existing.remove();

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-screen';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #e94560;
            font-family: 'Arial', sans-serif;
            z-index: 1000;
        `;

        loadingDiv.innerHTML = `
            <h1 style="font-size: 48px; margin-bottom: 20px;">어둠의전설 클래식</h1>
            <div style="font-size: 24px; margin-bottom: 20px;">Dark Legend Classic</div>
            <div style="width: 300px; height: 4px; background: #0f0f23; border-radius: 2px; overflow: hidden;">
                <div id="loading-bar" style="width: 0%; height: 100%; background: #e94560; transition: width 0.3s;"></div>
            </div>
            <div id="loading-text" style="margin-top: 10px; color: #e0e0e0;">로딩 중... 0%</div>
        `;

        container.appendChild(loadingDiv);
    }

    /**
     * 로딩 진행률 업데이트
     */
    private updateLoadingProgress(progress: number): void {
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');

        if (loadingBar) {
            loadingBar.style.width = `${progress * 100}%`;
        }

        if (loadingText) {
            loadingText.textContent = `로딩 중... ${Math.floor(progress * 100)}%`;
        }
    }

    /**
     * 로딩 화면 제거
     */
    private hideLoadingScreen(): void {
        // HTML 로딩 스크린 숨기기
        const htmlLoading = document.getElementById('loading');
        if (htmlLoading) {
            htmlLoading.classList.add('hidden');
            setTimeout(() => {
                htmlLoading.remove();
            }, 500);
        }

        // BootScene 로딩 스크린 제거
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
        }
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number, elapsedTime: number): void {
        // 로딩 애니메이션
        this.loadingProgress += deltaTime * 0.5;
        if (this.loadingProgress > 1) {
            this.loadingProgress = 1;
        }
        this.updateLoadingProgress(this.loadingProgress);
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
        this.hideLoadingScreen();
        console.log('BootScene: Shutdown');
    }
}
