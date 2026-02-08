/**
 * ============================================================
 * AnimationSystem - 박스 기반 애니메이션 시스템
 * ============================================================
 * 스프라이트 없이 3D 메시를 이용한 애니메이션 관리
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
    duration: number; // 애니메이션 길이 (초)
    loop: boolean;
}

/**
 * AnimationController 클래스
 * 박스 기반 캐릭터를 위한 애니메이션 컨트롤러
 */
export class AnimationController {
    private mesh: THREE.Group;
    private animations: Map<AnimationState, AnimationData>;
    private currentAnimation: AnimationState | null;
    private animationTime: number = 0;
    private isPlaying: boolean = true;
    private animationCompleteCallback?: () => void;

    // 메시 참조 (애니메이션용)
    private bodyMesh?: THREE.Mesh;
    private headMesh?: THREE.Mesh;
    private leftArmMesh?: THREE.Mesh;
    private rightArmMesh?: THREE.Mesh;
    private leftLegMesh?: THREE.Mesh;
    private rightLegMesh?: THREE.Mesh;

    // 원본 위치/회전 저장
    private originalPositions: Map<THREE.Object3D, THREE.Vector3> = new Map();
    private originalRotations: Map<THREE.Object3D, THREE.Euler> = new Map();

    constructor(mesh: THREE.Group) {
        this.mesh = mesh;
        this.animations = new Map();
        this.currentAnimation = null;

        // 자식 메시 참조 찾기
        this.findMeshReferences();
        this.saveOriginalTransforms();
    }

    /**
     * 애니메이션용 메시 참조 찾기
     */
    private findMeshReferences(): void {
        this.mesh.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                const name = child.name.toLowerCase();
                if (name.includes('body')) this.bodyMesh = child;
                else if (name.includes('head')) this.headMesh = child;
                else if (name.includes('arm')) {
                    if (name.includes('left') || child.position.x < 0) {
                        this.leftArmMesh = child;
                    } else {
                        this.rightArmMesh = child;
                    }
                } else if (name.includes('leg')) {
                    if (name.includes('left') || child.position.x < 0) {
                        this.leftLegMesh = child;
                    } else {
                        this.rightLegMesh = child;
                    }
                }
            }
        });

        // 이름이 없으면 위치로 추정
        if (!this.leftArmMesh || !this.rightArmMesh) {
            const arms = this.mesh.children.filter((c) => c instanceof THREE.Mesh && c.position.y > 30 && c.position.y < 60);
            if (arms.length >= 2) {
                arms.sort((a, b) => a.position.x - b.position.x);
                this.leftArmMesh = arms[0] as THREE.Mesh;
                this.rightArmMesh = arms[1] as THREE.Mesh;
            }
        }

        if (!this.leftLegMesh || !this.rightLegMesh) {
            const legs = this.mesh.children.filter((c) => c instanceof THREE.Mesh && c.position.y < 20);
            if (legs.length >= 2) {
                legs.sort((a, b) => a.position.x - b.position.x);
                this.leftLegMesh = legs[0] as THREE.Mesh;
                this.rightLegMesh = legs[1] as THREE.Mesh;
            }
        }
    }

    /**
     * 원본 위치/회전 저장
     */
    private saveOriginalTransforms(): void {
        this.mesh.children.forEach((child) => {
            this.originalPositions.set(child, child.position.clone());
            this.originalRotations.set(child, child.rotation.clone());
        });
    }

    /**
     * 원본 위치/회전 복원
     */
    private restoreOriginalTransforms(): void {
        this.mesh.children.forEach((child) => {
            const originalPos = this.originalPositions.get(child);
            const originalRot = this.originalRotations.get(child);
            if (originalPos) child.position.copy(originalPos);
            if (originalRot) child.rotation.copy(originalRot);
        });
    }

    /**
     * 애니메이션 등록
     */
    public registerAnimation(data: AnimationData): void {
        this.animations.set(data.name, data);
    }

    /**
     * 기본 애니메이션 자동 등록
     */
    public registerDefaultAnimations(): void {
        const defaultAnimations: AnimationData[] = [
            { name: 'idle', duration: 1.0, loop: true },
            { name: 'walk', duration: 0.5, loop: true },
            { name: 'attack', duration: 0.3, loop: false },
            { name: 'hurt', duration: 0.2, loop: false },
            { name: 'death', duration: 1.0, loop: false },
            { name: 'cast', duration: 0.5, loop: false }
        ];

        defaultAnimations.forEach((anim) => this.registerAnimation(anim));
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
        this.animationTime = 0;
        this.animationCompleteCallback = onComplete;
        this.isPlaying = true;

        // 원본 상태 복원
        this.restoreOriginalTransforms();
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
            // 기본 idle 상태로 복원
            if (!this.currentAnimation) {
                this.restoreOriginalTransforms();
                this.applyIdleAnimation(0);
            }
            return;
        }

        const animation = this.animations.get(this.currentAnimation);
        if (!animation) return;

        this.animationTime += deltaTime;

        const progress = this.animationTime / animation.duration;

        // 애니메이션 종료 확인
        if (progress >= 1) {
            if (animation.loop) {
                this.animationTime = 0;
            } else {
                this.animationTime = animation.duration;
                this.isPlaying = false;
                this.restoreOriginalTransforms();

                if (this.animationCompleteCallback) {
                    this.animationCompleteCallback();
                    this.animationCompleteCallback = undefined;
                }
                return;
            }
        }

        // 상태별 애니메이션 적용
        this.applyAnimation(this.currentAnimation, this.animationTime, animation.duration);
    }

    /**
     * 애니메이션 적용
     */
    private applyAnimation(state: AnimationState, time: number, duration: number): void {
        const t = (time % duration) / duration; // 0~1 진행률

        switch (state) {
            case 'idle':
                this.applyIdleAnimation(t);
                break;
            case 'walk':
                this.applyWalkAnimation(t);
                break;
            case 'attack':
                this.applyAttackAnimation(t);
                break;
            case 'hurt':
                this.applyHurtAnimation(t);
                break;
            case 'death':
                this.applyDeathAnimation(t);
                break;
            case 'cast':
                this.applyCastAnimation(t);
                break;
        }
    }

    /**
     * Idle 애니메이션 (숨쉬기 효과)
     */
    private applyIdleAnimation(t: number): void {
        // 몸이 위아래로 살짝 움직임
        if (this.bodyMesh) {
            this.bodyMesh.position.y = (this.originalPositions.get(this.bodyMesh)?.y || 24) + Math.sin(t * Math.PI * 2) * 1;
        }
        if (this.headMesh) {
            this.headMesh.position.y = (this.originalPositions.get(this.headMesh)?.y || 60) + Math.sin(t * Math.PI * 2) * 0.5;
        }
    }

    /**
     * Walk 애니메이션 (팔다리 움직임)
     */
    private applyWalkAnimation(t: number): void {
        const swingAngle = Math.sin(t * Math.PI * 2) * 0.3;

        // 팔 swing
        if (this.leftArmMesh) {
            this.leftArmMesh.rotation.z = swingAngle;
        }
        if (this.rightArmMesh) {
            this.rightArmMesh.rotation.z = -swingAngle;
        }

        // 다리 swing
        if (this.leftLegMesh) {
            this.leftLegMesh.rotation.z = -swingAngle;
        }
        if (this.rightLegMesh) {
            this.rightLegMesh.rotation.z = swingAngle;
        }

        // 몸이 위아래로
        if (this.bodyMesh) {
            const baseY = this.originalPositions.get(this.bodyMesh)?.y || 24;
            this.bodyMesh.position.y = baseY + Math.abs(Math.sin(t * Math.PI * 2)) * 2;
        }
    }

    /**
     * Attack 애니메이션 (공격 동작)
     */
    private applyAttackAnimation(t: number): void {
        // 앞으로 숙였다가 돌아옴
        if (this.bodyMesh) {
            this.bodyMesh.rotation.x = Math.sin(t * Math.PI) * 0.3;
        }

        // 오른팔 휘두르기
        if (this.rightArmMesh) {
            this.rightArmMesh.rotation.z = -Math.sin(t * Math.PI) * 1.2;
        }
    }

    /**
     * Hurt 애니메이션 (피격 동작)
     */
    private applyHurtAnimation(t: number): void {
        // 뒤로 흔들림
        if (this.bodyMesh) {
            this.bodyMesh.rotation.x = -Math.sin(t * Math.PI) * 0.2;
        }
        if (this.headMesh) {
            this.headMesh.rotation.y = Math.sin(t * Math.PI) * 0.3;
        }

        // 색상 변경 (빨간색 플래시)
        const flashIntensity = Math.sin(t * Math.PI);
        this.mesh.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.MeshLambertMaterial;
                if (material.color) {
                    material.color.setHex(0xffffff);
                }
            }
        });
    }

    /**
     * Death 애니메이션 (쓰러짐)
     */
    private applyDeathAnimation(t: number): void {
        // 쓰러짐
        if (this.bodyMesh) {
            this.bodyMesh.rotation.x = -t * Math.PI / 2;
        }
        if (this.headMesh) {
            this.headMesh.rotation.x = -t * Math.PI / 2;
        }

        // 아래로 내려감
        this.mesh.position.y = -t * 20;
    }

    /**
     * Cast 애니메이션 (스킬 시전)
     */
    private applyCastAnimation(t: number): void {
        // 양팔 올림
        if (this.leftArmMesh) {
            this.leftArmMesh.rotation.z = -Math.sin(t * Math.PI) * 1.5;
        }
        if (this.rightArmMesh) {
            this.rightArmMesh.rotation.z = Math.sin(t * Math.PI) * 1.5;
        }

        // 몸이 위로 살짝
        if (this.bodyMesh) {
            const baseY = this.originalPositions.get(this.bodyMesh)?.y || 24;
            this.bodyMesh.position.y = baseY + Math.sin(t * Math.PI) * 3;
        }
    }

    /**
     * 스프라이트 방향 설정 (아이소메트릭 4방향) - 호환성용
     */
    public setDirection(direction: 0 | 1 | 2 | 3): void {
        // 박스 기반에서는 방향에 따른 메시 회전이 필요없음
        // 추후 카메라 방향 전환 시 사용
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.animations.clear();
        this.originalPositions.clear();
        this.originalRotations.clear();
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
        mesh: THREE.Group
    ): AnimationController {
        const controller = new AnimationController(mesh);
        controller.registerDefaultAnimations();
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
