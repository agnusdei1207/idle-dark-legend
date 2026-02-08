/**
 * ============================================================
 * SceneManager - Scene 관리 클래스
 * ============================================================
 * Phaser의 Scene 관리를 대체하는 Three.js Scene 관리 시스템
 *
 * [기능]
 * - Scene 클래스 등록
 * - Scene 조회
 * - Scene 전환
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from './ThreeGame';
import type { SceneId } from '../../types/game.types';

/**
 * Scene 클래스 타입
 */
export interface SceneClass {
    new (game: ThreeGame, data?: any): BaseScene;
}

/**
 * 기본 Scene 인터페이스
 */
export interface BaseScene {
    scene: THREE.Scene;
    camera: THREE.Camera;
    create(): Promise<void> | void;
    update?(deltaTime: number, elapsedTime: number): void;
    resize?(width: number, height: number): void;
    shutdown?(): void;
}

/**
 * SceneManager 클래스
 */
export class SceneManager {
    private game: ThreeGame;
    private scenes: Map<SceneId, SceneClass>;

    constructor(game: ThreeGame) {
        this.game = game;
        this.scenes = new Map();
    }

    /**
     * Scene 등록
     */
    public registerScene(sceneId: SceneId, SceneClass: SceneClass): void {
        this.scenes.set(sceneId, SceneClass);
    }

    /**
     * Scene 조회
     */
    public getScene(sceneId: SceneId): SceneClass | undefined {
        return this.scenes.get(sceneId);
    }

    /**
     * Scene 등록 여부 확인
     */
    public hasScene(sceneId: SceneId): boolean {
        return this.scenes.has(sceneId);
    }

    /**
     * 모든 Scene 제거
     */
    public clear(): void {
        this.scenes.clear();
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.clear();
    }
}
