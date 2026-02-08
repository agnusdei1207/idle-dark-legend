/**
 * ============================================================
 * Monster - 몬스터 엔티티 (2.5D)
 * ============================================================
 * 3D 모델 기반 몬스터 캐릭터
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { MonsterDefinition, Position } from '../../types/game.types';
import { IsometricUtils } from '../utils/IsometricUtils';
import { AnimationController } from '../systems/AnimationSystem';

/**
 * 몬스터 AI 상태
 */
const MonsterState = {
    IDLE: 'idle',
    PATROL: 'patrol',
    CHASE: 'chase',
    ATTACK: 'attack',
    HURT: 'hurt',
    DEAD: 'dead',
    RETURN: 'return'
} as const;

type MonsterStateType = typeof MonsterState[keyof typeof MonsterState];

/**
 * Monster 클래스
 */
export class Monster {
    public readonly mesh: THREE.Group;
    public readonly animationController: AnimationController;

    private game: ThreeGame;
    public data: MonsterDefinition;
    private currentHp: number;
    private currentMp: number;
    private state: MonsterStateType = MonsterState.IDLE;

    // 이동 관련
    private moveSpeed: number;
    private targetPosition: THREE.Vector3 | null = null;
    private spawnPosition: THREE.Vector3;
    private patrolTarget: THREE.Vector3 | null = null;
    private patrolWaitTime: number = 0;

    // 전투 관련
    private attackCooldown: number = 0;
    private attackRange: number;
    private chaseRange: number;
    private lastDamageTime: number = 0;
    private damageFlashTime: number = 0;

    // 타겟 (주로 플레이어)
    private targetEntity: any = null;

    constructor(game: ThreeGame, data: MonsterDefinition, tileX: number, tileY: number) {
        this.game = game;
        this.data = data;
        this.currentHp = data.stats.maxHp;
        this.currentMp = data.stats.maxMp;

        const aiType = data.ai || 'passive';

        // 이동 속도 (AI 타입에 따라 다름)
        this.moveSpeed = data.stats.moveSpeed || 80;
        this.attackRange = data.stats.attackRange || 40;
        this.chaseRange = data.stats.chaseRange || 150;

        this.mesh = new THREE.Group();

        // 몬스터 메시 생성
        this.createMonsterMesh(data.type, data.level);

        // 위치 설정
        const pos = IsometricUtils.tileToWorld(tileX, tileY, 64, 32);
        this.mesh.position.set(pos.x, pos.y, 0);
        this.spawnPosition = new THREE.Vector3(pos.x, pos.y, 0);

        // Z-index 정렬
        this.mesh.position.z = pos.x + pos.y;

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
     * 몬스터 메시 생성 (박스 형태)
     */
    private createMonsterMesh(type: string, level: number): void {
        // 몬스터 타입별 색상과 크기
        const monsterConfigs: Record<string, { color: number; scale: number; height: number }> = {
            slime: { color: 0x27ae60, scale: 0.8, height: 20 },
            goblin: { color: 0x8e44ad, scale: 0.9, height: 32 },
            orc: { color: 0x16a085, scale: 1.2, height: 48 },
            skeleton: { color: 0xecf0f1, scale: 1.0, height: 44 },
            demon: { color: 0xc0392b, scale: 1.3, height: 52 },
            dragon: { color: 0xe74c3c, scale: 1.5, height: 64 },
            ghost: { color: 0x9b59b6, scale: 1.0, height: 40 },
            wolf: { color: 0x7f8c8d, scale: 0.9, height: 28 }
        };

        const config = monsterConfigs[type] || { color: 0x95a5a6, scale: 1.0, height: 36 };

        // 레벨에 따른 크기 증가
        const levelScale = 1 + (level - 1) * 0.1;
        const finalScale = config.scale * levelScale;

        // 바디
        const bodyGeometry = new THREE.BoxGeometry(28 * finalScale, config.height * finalScale, 14 * finalScale);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: config.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = (config.height * finalScale) / 2;
        body.castShadow = true;
        this.mesh.add(body);

        // 머리 (대부분의 몬스터)
        if (type !== 'slime') {
            const headGeometry = new THREE.BoxGeometry(20 * finalScale, 20 * finalScale, 20 * finalScale);
            const headMaterial = new THREE.MeshLambertMaterial({ color: this.getHeadColor(type) });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = config.height * finalScale;
            head.castShadow = true;
            this.mesh.add(head);
        }

        // 눈 (공격적인 몬스터)
        if (['goblin', 'orc', 'demon', 'dragon'].includes(type)) {
            const eyeGeometry = new THREE.BoxGeometry(4 * finalScale, 4 * finalScale, 2 * finalScale);
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-5 * finalScale, config.height * finalScale - 5, 8 * finalScale);
            this.mesh.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(5 * finalScale, config.height * finalScale - 5, 8 * finalScale);
            this.mesh.add(rightEye);
        }

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(16 * finalScale, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -4;
        this.mesh.add(shadow);

        // HP 바
        this.createHPBar();
    }

    /**
     * 머리 색상 반환
     */
    private getHeadColor(type: string): number {
        const headColors: Record<string, number> = {
            slime: 0x27ae60,
            goblin: 0x2ecc71,
            orc: 0x1abc9c,
            skeleton: 0xbdc3c7,
            demon: 0x8e44ad,
            dragon: 0xff6b6b,
            ghost: 0xecf0f1,
            wolf: 0x34495e
        };
        return headColors[type] || 0x95a5a6;
    }

    /**
     * HP 바 생성
     */
    private createHPBar(): void {
        // 배경
        const bgGeometry = new THREE.PlaneGeometry(40, 6);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const bg = new THREE.Mesh(bgGeometry, bgMaterial);
        bg.position.y = 80;
        this.mesh.add(bg);

        // HP (나중에 업데이트됨)
        // TODO: 실제 HP 바 업데이트 구현
    }

    /**
     * 애니메이션 등록
     */
    private registerAnimations(): void {
        // TODO: 실제 스프라이트 시트가 있으면 등록
        // 현재는 기본 애니메이션만
    }

    /**
     * AI 업데이트
     */
    public updateAI(deltaTime: number, playerPosition: Position, player: any): void {
        // 쿨다임 업데이트
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }

        // 데미지 플래시 업데이트
        if (this.damageFlashTime > 0) {
            this.damageFlashTime -= deltaTime;
            if (this.damageFlashTime <= 0) {
                // 원래 색상으로 복원
                this.resetColor();
            }
        }

        // 사망 상태면 업데이트 중지
        if (this.state === MonsterState.DEAD) {
            return;
        }

        // 상태별 AI 동작
        switch (this.state) {
            case MonsterState.IDLE:
                this.updateIdle(deltaTime, playerPosition);
                break;
            case MonsterState.PATROL:
                this.updatePatrol(deltaTime);
                break;
            case MonsterState.CHASE:
                this.updateChase(deltaTime, playerPosition);
                break;
            case MonsterState.ATTACK:
                this.updateAttack(deltaTime, player);
                break;
            case MonsterState.HURT:
                this.updateHurt(deltaTime);
                break;
            case MonsterState.RETURN:
                this.updateReturn(deltaTime);
                break;
        }

        // 애니메이션 업데이트
        this.animationController.update(deltaTime);

        // Z-index 업데이트
        this.mesh.position.z = this.mesh.position.x + this.mesh.position.y;
    }

    /**
     * 대기 상태 업데이트
     */
    private updateIdle(deltaTime: number, playerPosition: Position): void {
        const distance = this.getDistanceToPlayer(playerPosition);
        const aiType = this.data.ai || 'passive';

        // 플레이어가 추적 범위 내에 있으면 추적 시작
        if (distance <= this.chaseRange && aiType !== 'passive') {
            this.state = MonsterState.CHASE;
            this.targetEntity = { getPosition: () => playerPosition };
            return;
        }

        // 정찰 시작 (랜덤)
        if (Math.random() < 0.005) {
            this.state = MonsterState.PATROL;
            this.setRandomPatrolTarget();
        }
    }

    /**
     * 정찰 상태 업데이트
     */
    private updatePatrol(deltaTime: number): void {
        if (!this.patrolTarget) {
            this.setRandomPatrolTarget();
            return;
        }

        // 이동
        this.moveTowards(this.patrolTarget, this.moveSpeed * 0.5 * deltaTime);

        // 목표 도달 확인
        const distance = this.getDistanceTo(this.patrolTarget);
        if (distance < 5) {
            this.patrolWaitTime += deltaTime;
            if (this.patrolWaitTime > 2) {
                // 스폰 위치로 복귀
                this.state = MonsterState.RETURN;
                this.targetPosition = this.spawnPosition.clone();
                this.patrolWaitTime = 0;
            }
        }
    }

    /**
     * 추적 상태 업데이트
     */
    private updateChase(deltaTime: number, playerPosition: Position): void {
        const distance = this.getDistanceToPlayer(playerPosition);
        const aiType = this.data.ai || 'passive';

        // 추적 범위를 벗어나면 복귀
        if (distance > this.chaseRange * 1.5) {
            this.state = MonsterState.RETURN;
            this.targetPosition = this.spawnPosition.clone();
            this.targetEntity = null;
            return;
        }

        // 공격 범위 내면 공격
        if (distance <= this.attackRange && this.attackCooldown <= 0) {
            this.state = MonsterState.ATTACK;
            return;
        }

        // 추적
        const target = new THREE.Vector3(playerPosition.x, playerPosition.y, 0);
        this.moveTowards(target, this.moveSpeed * deltaTime);
    }

    /**
     * 공격 상태 업데이트
     */
    private updateAttack(deltaTime: number, player: any): void {
        if (this.attackCooldown > 0) {
            this.state = MonsterState.CHASE;
            return;
        }

        // 공격 실행
        this.performAttack(player);
        this.attackCooldown = this.data.stats.attackSpeed || 1.5;
        this.state = MonsterState.CHASE;
    }

    /**
     * 피격 상태 업데이트
     */
    private updateHurt(deltaTime: number): void {
        // 피격 애니메이션 후 추적 상태로
        if (this.damageFlashTime <= 0) {
            const aiType = this.data.ai || 'passive';
            if (aiType !== 'passive') {
                this.state = MonsterState.CHASE;
            } else {
                this.state = MonsterState.IDLE;
            }
        }
    }

    /**
     * 복귀 상태 업데이트
     */
    private updateReturn(deltaTime: number): void {
        if (!this.targetPosition) return;

        const distance = this.getDistanceTo(this.targetPosition);
        if (distance < 5) {
            this.mesh.position.copy(this.spawnPosition);
            this.targetPosition = null;
            this.state = MonsterState.IDLE;
            return;
        }

        this.moveTowards(this.targetPosition, this.moveSpeed * deltaTime);
    }

    /**
     * 공격 실행
     */
    private performAttack(target: any): void {
        if (!target || !this.data.stats.attack) return;

        // TODO: CombatSystem을 통한 공격 처리
        const damage = this.data.stats.attack;
        target.takeDamage?.(damage);

        console.log(`Monster ${this.data.name} attacks for ${damage} damage`);
    }

    /**
     * 이동 처리
     */
    private moveTowards(target: THREE.Vector3, speed: number): void {
        const dx = target.x - this.mesh.position.x;
        const dy = target.y - this.mesh.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < speed) {
            this.mesh.position.x = target.x;
            this.mesh.position.y = target.y;
        } else {
            this.mesh.position.x += (dx / distance) * speed;
            this.mesh.position.y += (dy / distance) * speed;
        }

        // 방향에 따른 애니메이션 설정
        this.setAnimationDirection(dx, dy);
    }

    /**
     * 애니메이션 방향 설정
     */
    private setAnimationDirection(dx: number, dy: number): void {
        let direction: 0 | 1 | 2 | 3 = 0; // 0: down, 1: up, 2: left, 3: right

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 3 : 2;
        } else {
            direction = dy > 0 ? 1 : 0;
        }

        this.animationController.setDirection(direction);
    }

    /**
     * 랜덤 정찰 목표 설정
     */
    private setRandomPatrolTarget(): void {
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        this.patrolTarget = new THREE.Vector3(
            this.spawnPosition.x + Math.cos(angle) * distance,
            this.spawnPosition.y + Math.sin(angle) * distance,
            0
        );
    }

    /**
     * 플레이어까지의 거리 계산
     */
    private getDistanceToPlayer(playerPosition: Position): number {
        const dx = this.mesh.position.x - playerPosition.x;
        const dy = this.mesh.position.y - playerPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 특정 위치까지의 거리 계산
     */
    private getDistanceTo(position: THREE.Vector3): number {
        const dx = this.mesh.position.x - position.x;
        const dy = this.mesh.position.y - position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 데미지 받기
     */
    public takeDamage(damage: number, attacker?: any): void {
        if (this.state === MonsterState.DEAD) return;

        this.currentHp -= damage;
        this.lastDamageTime = Date.now();
        this.damageFlashTime = 0.2;

        // 피격 색상으로 변경
        this.flashDamage();

        const aiType = this.data.ai || 'passive';

        if (this.currentHp <= 0) {
            this.die();
        } else {
            // 공격당하면 반응
            if (aiType !== 'passive') {
                this.state = MonsterState.CHASE;
                this.targetEntity = attacker;
            } else {
                this.state = MonsterState.HURT;
            }
        }
    }

    /**
     * 공격 가능 여부 확인
     */
    public canAttack(): boolean {
        return this.attackCooldown <= 0;
    }

    /**
     * 공격 쿨다임 리셋
     */
    public resetAttackCooldown(): void {
        const attackSpeed = this.data.stats.attackSpeed || 1.5;
        this.attackCooldown = attackSpeed;
    }

    /**
     * 데미지 플래시 효과
     */
    private flashDamage(): void {
        this.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.MeshLambertMaterial;
                material.color.setHex(0xffffff);
            }
        });
    }

    /**
     * 색상 리셋
     */
    private resetColor(): void {
        // TODO: 원래 색상으로 복원
        // 현재는 간단히 처리
        this.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry.type === 'BoxGeometry') {
                const material = child.material as THREE.MeshLambertMaterial;
                // 기본 색상으로 복원 (임시)
            }
        });
    }

    /**
     * 사망 처리
     */
    private die(): void {
        this.state = MonsterState.DEAD;
        console.log(`Monster ${this.data.name} died`);

        // TODO: 사망 애니메이션, 경험치 보상, 드롭 아이템 등
    }

    /**
     * 현재 HP 퍼센트
     */
    public getHpPercent(): number {
        return this.currentHp / this.data.stats.maxHp;
    }

    /**
     * 위치 반환
     */
    public getPosition(): Position {
        return {
            x: this.mesh.position.x,
            y: this.mesh.position.y
        };
    }

    /**
     * 사망 여부
     */
    public isDead(): boolean {
        return this.currentHp <= 0;
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.animationController.destroy();
        // 메시 정리
    }
}
