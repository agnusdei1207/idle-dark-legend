/**
 * ============================================================
 * Player - 플레이어 엔티티 (2.5D)
 * ============================================================
 * 3D 모델 기반 플레이어 캐릭터
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import { AnimationController } from '../systems/AnimationSystem';
import { IsometricUtils } from '../utils/IsometricUtils';
import type { BaseStats, Position } from '../../types/game.types';
import { getClassById } from '../../data/classes.data';

type ClassType = 'warrior' | 'mage' | 'rogue' | 'cleric' | 'monk';

/**
 * Player 클래스
 */
export class Player {
    public readonly mesh: THREE.Group;
    public readonly animationController: AnimationController;

    private game: ThreeGame;
    private stats: any;
    private currentHp: number;
    private currentMp: number;
    private level: number = 1;
    private exp: number = 0;
    private classType: ClassType = 'warrior';

    // 이동 관련
    private moveSpeed: number = 150;
    private targetPosition: THREE.Vector3 | null = null;

    constructor(game: ThreeGame) {
        this.game = game;
        this.mesh = new THREE.Group();

        // 기본 스탯
        const classData = getClassById(this.classType);
        if (!classData) {
            throw new Error(`Class not found: ${this.classType}`);
        }
        this.stats = { ...classData.baseStats };
        this.currentHp = 100;
        this.currentMp = 50;

        // 3D 캐릭터 메시 생성 (2.5D 스타일)
        this.createCharacterMesh();

        // 애니메이션 컨트롤러 (더미 스프라이트)
        const dummyTexture = new THREE.Texture();
        const dummySprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: dummyTexture }));
        dummySprite.visible = false;
        this.mesh.add(dummySprite);
        this.animationController = new AnimationController(dummySprite);

        // 애니메이션 등록
        this.registerAnimations();
    }

    /**
     * 캐릭터 메시 생성 (2.5D - 3D 모델)
     */
    private createCharacterMesh(): void {
        // 바디 (박스 형태, 2.5D)
        const bodyGeometry = new THREE.BoxGeometry(32, 48, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x3498db });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 24;
        body.castShadow = true;
        this.mesh.add(body);

        // 머리
        const headGeometry = new THREE.BoxGeometry(24, 24, 24);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf5cba });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 60;
        head.castShadow = true;
        this.mesh.add(head);

        // 팔
        const armGeometry = new THREE.BoxGeometry(8, 32, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x3498db });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-20, 50, 0);
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(20, 50, 0);
        this.mesh.add(rightArm);

        // 다리
        const legGeometry = new THREE.BoxGeometry(10, 32, 10);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-8, 0, 0);
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(8, 0, 0);
        this.mesh.add(rightLeg);

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(20, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -5;
        this.mesh.add(shadow);
    }

    /**
     * 애니메이션 등록
     */
    private registerAnimations(): void {
        // TODO: 실제 스프라이트 시트가 있으면 등록
        // 현재는 기본 애니메이션만
    }

    /**
     * 위치 설정
     */
    public setPosition(x: number, y: number): void {
        this.mesh.position.set(x, y, 0);
    }

    /**
     * 위치 가져오기
     */
    public getPosition(): Position {
        return {
            x: this.mesh.position.x,
            y: this.mesh.position.y
        };
    }

    /**
     * 이동 처리
     */
    public move(deltaTime: number, direction: { x: number; y: number }): void {
        if (direction.x === 0 && direction.y === 0) return;

        this.mesh.position.x += direction.x * this.moveSpeed * deltaTime;
        this.mesh.position.y += direction.y * this.moveSpeed * deltaTime;

        // Z-index 정렬 (아이소메트릭)
        this.mesh.position.z = this.mesh.position.x + this.mesh.position.y;
    }

    /**
     * 타일 좌표로 이동
     */
    public moveToTile(tileX: number, tileY: number): void {
        const pos = IsometricUtils.tileToWorld(tileX, tileY, 64, 32);
        this.targetPosition = new THREE.Vector3(pos.x, pos.y, 0);
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number): void {
        // 타겟 위치로 부드르게 이동
        if (this.targetPosition) {
            const speed = this.moveSpeed * deltaTime;
            const dx = this.targetPosition.x - this.mesh.position.x;
            const dy = this.targetPosition.y - this.mesh.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < speed) {
                this.mesh.position.copy(this.targetPosition);
                this.targetPosition = null;
            } else {
                this.mesh.position.x += (dx / distance) * speed;
                this.mesh.position.y += (dy / distance) * speed;
            }

            // Z-index 업데이트
            this.mesh.position.z = this.mesh.position.x + this.mesh.position.y;
        }

        // 애니메이션 업데이트
        this.animationController.update(deltaTime);

        // 그림자 위치 업데이트
        // (자동으로 메시에 따라감)
    }

    /**
     * 공격 애니메이션
     */
    public playAttackAnimation(): void {
        // TODO: 공격 애니메이션 구현
        console.log('Player: Attack animation');
    }

    /**
     * 피격 애니메이션
     */
    public playHurtAnimation(): void {
        // TODO: 피격 애니메이션 구현
        console.log('Player: Hurt animation');
    }

    /**
     * 데미지 받기
     */
    public takeDamage(damage: number): void {
        this.currentHp = Math.max(0, this.currentHp - damage);

        if (this.currentHp <= 0) {
            this.playDeathAnimation();
        }
    }

    /**
     * 사망 애니메이션
     */
    public playDeathAnimation(): void {
        // TODO: 사망 애니메이션 구현
        console.log('Player: Death animation');
    }

    /**
     * HP 회복
     */
    public heal(amount: number): void {
        const maxHp = this.getMaxHp();
        this.currentHp = Math.min(maxHp, this.currentHp + amount);
    }

    /**
     * MP 회복
     */
    public restoreMp(amount: number): void {
        const maxMp = this.getMaxMp();
        this.currentMp = Math.min(maxMp, this.currentMp + amount);
    }

    /**
     * 경험치 획득
     */
    public gainExp(amount: number): boolean {
        this.exp += amount;

        const expNeeded = this.getExpNeeded();
        if (this.exp >= expNeeded) {
            this.levelUp();
            return true;
        }
        return false;
    }

    /**
     * 레벨업
     */
    private levelUp(): void {
        this.level++;
        this.exp -= this.getExpNeeded();

        // 스탯 증가
        const classData = getClassById(this.classType);
        if (classData) {
            for (const stat in classData.statGrowth) {
                this.stats[stat as keyof BaseStats] += classData.statGrowth[stat as keyof BaseStats];
            }
        }

        // HP/MP 회복
        this.currentHp = this.getMaxHp();
        this.currentMp = this.getMaxMp();

        console.log(`Player: Level up! Lv.${this.level}`);
    }

    /**
     * 최대 HP 계산
     */
    public getMaxHp(): number {
        return Math.floor(100 + this.stats.con * 5 + this.stats.str * 2);
    }

    /**
     * 최대 MP 계산
     */
    public getMaxMp(): number {
        return Math.floor(50 + this.stats.int * 5 + this.stats.wis * 3);
    }

    /**
     * 다음 레벨 필요 경험치
     */
    public getExpNeeded(): number {
        return Math.floor(100 * Math.pow(1.1, this.level - 1));
    }

    /**
     * 사망 여부
     */
    public isDead(): boolean {
        return this.currentHp <= 0;
    }

    /**
     * 직업 변경
     */
    public setClass(classType: ClassType): void {
        this.classType = classType;
        // TODO: 캐릭터 모델 변경
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.animationController.destroy();
        // 메시 정리
    }
}
