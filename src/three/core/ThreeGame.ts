/**
 * ============================================================
 * ThreeGame - Three.js 메인 게임 클래스
 * ============================================================
 * Phaser.Game을 대체하는 Three.js 기반 게임 엔진
 *
 * [기능]
 * - Canvas 생성 및 관리
 * - WebGL Renderer 설정
 * - Scene 관리 (SceneManager 통해)
 * - Update 루프 (requestAnimationFrame)
 * - Delta time 계산
 * - 이벤트 처리
 * ============================================================
 */

import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { AssetManager } from './AssetManager';
import { InputSystem } from '../systems/InputSystem';
import type { SceneId } from '../../types/game.types';

/**
 * 게임 설정 인터페이스
 */
export interface GameConfig {
    parent?: HTMLElement | string;
    width?: number;
    height?: number;
    backgroundColor?: number;
    antialias?: boolean;
    pixelRatio?: number;
}

/**
 * ThreeGame 클래스
 *
 * Phaser.Game에 대응하는 Three.js 기반 메인 게임 클래스
 */
export class ThreeGame {
    // ========================================
    // 프로퍼티
    // ========================================

    /** Canvas 요소 */
    private canvas: HTMLCanvasElement;

    /** WebGL 렌더러 */
    private renderer: THREE.WebGLRenderer;

    /** Scene 매니저 */
    public sceneManager: SceneManager;

    /** 에셋 매니저 */
    public assetManager: AssetManager;

    /** 입력 시스템 */
    public input: InputSystem;

    /** Clock (델타타임 계산) */
    private clock: THREE.Clock;

    /** 현재 Scene */
    private currentScene: any | null;

    /** 실행 중 여부 */
    private isRunning: boolean;

    /** 콜백 ID */
    private animationFrameId: number | null;

    // ========================================
    // 생성자
    // ========================================

    constructor(config: GameConfig = {}) {
        const {
            parent,
            width = window.innerWidth,
            height = window.innerHeight,
            backgroundColor = 0x000000,
            antialias = true,
            pixelRatio = Math.min(window.devicePixelRatio, 2)
        } = config;

        // Canvas 생성
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        // DOM에 추가
        if (typeof parent === 'string') {
            const element = document.getElementById(parent);
            if (element) {
                element.appendChild(this.canvas);
            } else {
                document.body.appendChild(this.canvas);
            }
        } else if (parent instanceof HTMLElement) {
            parent.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }

        // Renderer 생성 (그림자 활성화)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias,
            alpha: false
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setClearColor(backgroundColor);

        // 그림자 활성화 (2.5D 느낌을 위해)
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clock 생성
        this.clock = new THREE.Clock();

        // 매니저 초기화
        this.assetManager = new AssetManager(this.renderer);
        this.sceneManager = new SceneManager(this);
        this.input = new InputSystem();

        // 상태 초기화
        this.currentScene = null;
        this.isRunning = false;
        this.animationFrameId = null;

        // 윈도우 리사이즈 처리
        this.handleResize();
    }

    // ========================================
    // 공개 메서드
    // ========================================

    /**
     * 게임 시작
     */
    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.clock.start();
        this.update();
    }

    /**
     * 게임 정지
     */
    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Scene 변경
     */
    public async switchScene(sceneId: SceneId, data?: any): Promise<void> {
        // 현재 Scene 정리
        if (this.currentScene) {
            if (this.currentScene.shutdown) {
                this.currentScene.shutdown();
            }
        }

        // 새 Scene 시작
        const SceneClass = this.sceneManager.getScene(sceneId);
        if (!SceneClass) {
            console.error(`Scene not found: ${sceneId}`);
            return;
        }

        this.currentScene = new SceneClass(this, data);
        await this.currentScene.create();
    }

    /**
     * 렌더러 가져오기
     */
    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    /**
     * Canvas 가져오기
     */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * 캔버스 크기 가져오기
     */
    public getSize(): { width: number; height: number } {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.stop();

        if (this.currentScene) {
            if (this.currentScene.shutdown) {
                this.currentScene.shutdown();
            }
            this.currentScene = null;
        }

        this.sceneManager.destroy();
        this.assetManager.destroy();
        this.renderer.dispose();

        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    // ========================================
    // 내부 메서드
    // ========================================

    /**
     * 업데이트 루프
     */
    private update = (): void => {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();

        // 입력 시스템 업데이트
        this.input.update();

        // 현재 Scene 업데이트
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime, this.clock.getElapsedTime());
        }

        // 렌더링
        if (this.currentScene && this.currentScene.scene) {
            this.renderer.render(this.currentScene.scene, this.currentScene.camera);
        }

        // 다음 프레임
        this.animationFrameId = requestAnimationFrame(this.update);
    }

    /**
     * 윈도우 리사이즈 처리
     */
    private handleResize(): void {
        const resizeHandler = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.canvas.width = width;
            this.canvas.height = height;
            this.renderer.setSize(width, height);

            // 현재 Scene에 리사이즈 통지
            if (this.currentScene && this.currentScene.resize) {
                this.currentScene.resize(width, height);
            }
        };

        window.addEventListener('resize', resizeHandler);
    }
}
