/**
 * ============================================================
 * Player - 플레이어 엔티티 (2.5D)
 * ============================================================
 * 3D 박스 모델 기반 플레이어 캐릭터
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { AnimationState } from '../systems/AnimationSystem';
import { AnimationController } from '../systems/AnimationSystem';
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
    private gold: number = 0;
    private classType: ClassType = 'warrior';

    // 이동 관련
    private moveSpeed: number = 150;
    private targetPosition: THREE.Vector3 | null = null;
    private isMoving: boolean = false;

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

        // 3D 캐릭터 메시 생성 (박스 형태)
        this.createCharacterMesh();

        // 애니메이션 컨트롤러 (메시 기반)
        this.animationController = new AnimationController(this.mesh);
        this.animationController.registerDefaultAnimations();
        this.animationController.play('idle');
    }

    /**
     * 캐릭터 메시 생성 (박스 형태)
     */
    private createCharacterMesh(): void {
        // 바디 (박스 형태, 2.5D) - 입체감을 위해 Y 위치 상승
        const bodyGeometry = new THREE.BoxGeometry(32, 48, 20);
        const bodyMaterial = new THREE.MeshLambertMaterial({
            color: 0x3498db,
            emissive: 0x1a5490,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.name = 'body';
        body.position.set(0, 28, 0); // 약간 위로 올림
        body.castShadow = true;
        body.receiveShadow = true;
        this.mesh.add(body);

        // 머리 - 더 크고 입체적으로
        const headGeometry = new THREE.BoxGeometry(26, 26, 26);
        const headMaterial = new THREE.MeshLambertMaterial({
            color: 0xf39c12,
            emissive: 0xa66e0c,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.name = 'head';
        head.position.set(0, 64, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        this.mesh.add(head);

        // 팔 - 더 입체적으로
        const armGeometry = new THREE.BoxGeometry(10, 36, 10);
        const armMaterial = new THREE.MeshLambertMaterial({
            color: 0x3498db,
            emissive: 0x1a5490,
            emissiveIntensity: 0.2
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.name = 'leftArm';
        leftArm.position.set(-22, 52, 0);
        leftArm.castShadow = true;
        this.mesh.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.name = 'rightArm';
        rightArm.position.set(22, 52, 0);
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // 다리 - 더 입체적으로
        const legGeometry = new THREE.BoxGeometry(12, 28, 12);
        const legMaterial = new THREE.MeshLambertMaterial({
            color: 0x2c3e50,
            emissive: 0x1a252f,
            emissiveIntensity: 0.2
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.name = 'leftLeg';
        leftLeg.position.set(-10, 8, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.name = 'rightLeg';
        rightLeg.position.set(10, 8, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // 그림자 - 더 크고 부드럽게
        const shadowGeometry = new THREE.CircleGeometry(24, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.4
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.name = 'shadow';
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(0, -8, -0.1); // 그림자는 뒤에 위치
        this.mesh.add(shadow);

        // 발판 효과 (캐릭터가 떠있는 느낌)
        const baseGeometry = new THREE.CylinderGeometry(18, 18, 2, 16);
        const baseMaterial = new THREE.MeshLambertMaterial({
            color: 0x34495e,
            transparent: true,
            opacity: 0.6
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.name = 'base';
        base.rotation.x = Math.PI / 2;
        base.position.set(0, -6, -0.05);
        this.mesh.add(base);
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
     * 스탯 가져오기
     */
    public getStats() {
        return this.stats;
    }

    /**
     * 이동 처리
     */
    public move(deltaTime: number, direction: { x: number; y: number }): void {
        if (direction.x === 0 && direction.y === 0) {
            if (this.isMoving) {
                this.isMoving = false;
                this.animationController.play('idle');
            }
            return;
        }

        if (!this.isMoving) {
            this.isMoving = true;
            this.animationController.play('walk');
        }

        this.mesh.position.x += direction.x * this.moveSpeed * deltaTime;
        this.mesh.position.y += direction.y * this.moveSpeed * deltaTime;

        // Z-index 정렬 (아이소메트릭) - renderOrder만 사용 (2D 아이소메트릭)
        const depth = this.mesh.position.x + this.mesh.position.y;
        this.mesh.renderOrder = Math.floor(depth);

        // 자식 메시들도 renderOrder 설정
        this.mesh.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.renderOrder = Math.floor(depth);
            }
        });
    }

    /**
     * 타일 좌표로 이동
     */
    public moveToTile(tileX: number, tileY: number): void {
        // 아이소메트릭 좌표 변환
        const x = (tileX - tileY) * 32;
        const y = (tileX + tileY) * 16;
        this.targetPosition = new THREE.Vector3(x, y, 0);
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
                this.isMoving = false;
                this.animationController.play('idle');
            } else {
                if (!this.isMoving) {
                    this.isMoving = true;
                    this.animationController.play('walk');
                }
                this.mesh.position.x += (dx / distance) * speed;
                this.mesh.position.y += (dy / distance) * speed;
            }

            // Z-index 업데이트 - renderOrder만 사용 (2D 아이소메트릭)
            const depth = this.mesh.position.x + this.mesh.position.y;
            this.mesh.renderOrder = Math.floor(depth);

            // 자식 메시들도 renderOrder 설정
            this.mesh.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.renderOrder = Math.floor(depth);
                }
            });
        }

        // 애니메이션 업데이트
        this.animationController.update(deltaTime);
    }

    /**
     * 공격 애니메이션
     */
    public playAttackAnimation(): void {
        this.animationController.play('attack');
    }

    /**
     * 피격 애니메이션
     */
    public playHurtAnimation(): void {
        this.animationController.play('hurt');
    }

    /**
     * 데미지 받기
     */
    public takeDamage(damage: number): void {
        this.currentHp = Math.max(0, this.currentHp - damage);

        this.playHurtAnimation();

        if (this.currentHp <= 0) {
            this.playDeathAnimation();
        }
    }

    /**
     * 사망 애니메이션
     */
    public playDeathAnimation(): void {
        this.animationController.play('death');
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
     * 현재 HP 가져오기
     */
    public getCurrentHp(): number {
        return this.currentHp;
    }

    /**
     * 현재 MP 가져오기
     */
    public getCurrentMp(): number {
        return this.currentMp;
    }

    /**
     * 현재 경험치 가져오기
     */
    public getCurrentExp(): number {
        return this.exp;
    }

    /**
     * 현재 레벨 가져오기
     */
    public getLevel(): number {
        return this.level;
    }

    /**
     * 골드 가져오기
     */
    public getGold(): number {
        return this.gold;
    }

    /**
     * 레벨 설정 (저장 데이터 로드용)
     */
    public setLevel(level: number): void {
        this.level = Math.max(1, Math.min(99, level));
        console.log(`Player: Level set to ${this.level}`);
    }

    /**
     * 경험치 설정 (저장 데이터 로드용)
     */
    public setExp(exp: number): void {
        this.exp = Math.max(0, exp);
        console.log(`Player: EXP set to ${this.exp}`);
    }

    /**
     * 골드 설정 (저장 데이터 로드용)
     */
    public setGold(gold: number): void {
        this.gold = Math.max(0, gold);
        console.log(`Player: Gold set to ${this.gold}`);
    }

    /**
     * 골드 추가
     */
    public addGold(amount: number): void {
        this.gold += amount;
        console.log(`Player: Gained ${amount} gold. Total: ${this.gold}`);
    }

    /**
     * 골드 사용
     */
    public spendGold(amount: number): boolean {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
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
        // 메시 정리는 호출자가 처리
    }
}
