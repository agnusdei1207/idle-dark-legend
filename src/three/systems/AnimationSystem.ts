/**
 * ============================================================
 * AnimationSystem - 애니메이션 시스템
 * ============================================================
 * 스프라이트 애니메이션을 관리하는 시스템
 * ============================================================
 */

import * as THREE from 'three';

/**
 * 애니메이션 상태
 */
export type AnimationState =
    | 'idle'
    | 'walk'
    | 'attack'
    | 'hurt'
    | 'death'
    | 'cast';

/**
 * 애니메이션 데이터
 */
export interface AnimationData {
    name: AnimationState;
    frames: THREE.Texture[];
    frameRate: number;
    loop: boolean;
}

/**
 * AnimationController 클래스
 */
export class AnimationController {
    private sprite: THREE.Sprite;
    private animations: Map<AnimationState, AnimationData>;
    private currentAnimation: AnimationState | null;
    private currentFrame: number = 0;
    private frameTime: number = 0;
    private isPlaying: boolean = true;
    private animationCompleteCallback?: () => void;

    constructor(sprite: THREE.Sprite) {
        this.sprite = sprite;
        this.animations = new Map();
        this.currentAnimation = null;
    }

    /**
     * 애니메이션 등록
     */
    public registerAnimation(data: AnimationData): void {
        this.animations.set(data.name, data);
    }

    /**
     * 애니메이션 재생
     */
    public play(
        animationName: AnimationState,
        onComplete?: () => void
    ): void {
        if (!this.animations.has(animationName)) {
            console.warn(`Animation not found: ${animationName}`);
            return;
        }

        this.currentAnimation = animationName;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.animationCompleteCallback = onComplete;
        this.isPlaying = true;

        // 첫 프레임 적용
        this.updateFrame();
    }

    /**
     * 애니메이션 정지
     */
    public stop(): void {
        this.isPlaying = false;
    }

    /**
     * 애니메이션 재개
     */
    public resume(): void {
        this.isPlaying = true;
    }

    /**
     * 현재 애니메이션 가져오기
     */
    public getCurrentAnimation(): AnimationState | null {
        return this.currentAnimation;
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number): void {
        if (!this.isPlaying || !this.currentAnimation) {
            return;
        }

        const animation = this.animations.get(this.currentAnimation);
        if (!animation) return;

        this.frameTime += deltaTime;

        const frameDuration = 1 / animation.frameRate;

        if (this.frameTime >= frameDuration) {
            this.frameTime = 0;
            this.currentFrame++;

            // 애니메이션 종료 확인
            if (this.currentFrame >= animation.frames.length) {
                if (animation.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = animation.frames.length - 1;
                    this.isPlaying = false;

                    if (this.animationCompleteCallback) {
                        this.animationCompleteCallback();
                        this.animationCompleteCallback = undefined;
                    }
                }
            }

            this.updateFrame();
        }
    }

    /**
     * 프레임 업데이트
     */
    private updateFrame(): void {
        if (!this.currentAnimation) return;

        const animation = this.animations.get(this.currentAnimation);
        if (!animation || !animation.frames[this.currentFrame]) return;

        this.sprite.material.map = animation.frames[this.currentFrame];
    }

    /**
     * 스프라이트 방향 설정 (아이소메트릭 4방향)
     */
    public setDirection(direction: 0 | 1 | 2 | 3): void {
        // 방향에 따라 스프라이트 스케일 조정
        // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
        switch (direction) {
            case 1: // 오른쪽
                this.sprite.scale.x = Math.abs(this.sprite.scale.x);
                break;
            case 3: // 왼쪽
                this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
                break;
        }
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.animations.clear();
        this.animationCompleteCallback = undefined;
    }
}

/**
 * AnimationSystem 클래스 - 전체 관리
 */
export class AnimationSystem {
    private controllers: Map<string, AnimationController> = new Map();

    /**
     * AnimationController 생성
     */
    public createController(
        id: string,
        sprite: THREE.Sprite
    ): AnimationController {
        const controller = new AnimationController(sprite);
        this.controllers.set(id, controller);
        return controller;
    }

    /**
     * AnimationController 가져오기
     */
    public getController(id: string): AnimationController | undefined {
        return this.controllers.get(id);
    }

    /**
     * 전체 업데이트
     */
    public update(deltaTime: number): void {
        this.controllers.forEach((controller) => {
            controller.update(deltaTime);
        });
    }

    /**
     * 컨트롤러 제거
     */
    public removeController(id: string): void {
        const controller = this.controllers.get(id);
        if (controller) {
            controller.destroy();
            this.controllers.delete(id);
        }
    }

    /**
     * 전체 파괴
     */
    public destroy(): void {
        this.controllers.forEach((controller) => {
            controller.destroy();
        });
        this.controllers.clear();
    }
}
