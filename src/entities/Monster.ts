/**
 * ============================================================
 * 몬스터 엔티티
 * ============================================================
 */

import Phaser from 'phaser';
import { Entity } from './Entity';
import type { MonsterDefinition, Position } from '../types/game.types';
import { getMonsterById } from '../data/monsters.data';

export class Monster extends Entity {
    private definition: MonsterDefinition;
    private spawnPosition: Position;
    private target: Entity | null = null;
    private lastAttackTime: number = 0;
    private patrolTarget: Position | null = null;
    private respawnTime: number;

    constructor(
        scene: Phaser.Scene,
        monsterId: string,
        worldX: number,
        worldY: number,
        respawnTime: number = 30000
    ) {
        super(scene, worldX, worldY);

        const def = getMonsterById(monsterId);
        if (!def) throw new Error(`Monster not found: ${monsterId}`);

        this.definition = def;
        this.spawnPosition = { x: worldX, y: worldY };
        this.respawnTime = respawnTime;
        this.combatStats = { ...def.stats };
        this.element = def.element;

        // 스프라이트 (플레이스홀더 - 레벨에 따라 색상 변경)
        const color = this.getColorByLevel(def.level);
        this.sprite = scene.add.rectangle(0, -16, 28, 28, color);
        this.add(this.sprite);

        // HP 바
        this.hpBar = scene.add.graphics();
        this.add(this.hpBar);
        this.updateHpBar();

        // 이름
        this.nameText = scene.add.text(0, -55, `${def.nameKo} Lv.${def.level}`, {
            fontSize: '10px',
            color: '#ff8888',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.nameText);
    }

    /** 레벨에 따른 색상 */
    private getColorByLevel(level: number): number {
        if (level <= 3) return 0x88ff88;  // 초록 (약함)
        if (level <= 6) return 0xffff88;  // 노랑 (보통)
        if (level <= 10) return 0xff8888; // 빨강 (강함)
        return 0xff44ff; // 보라 (매우 강함)
    }

    /** AI 업데이트 */
    update(time: number, delta: number, playerPos: Position): void {
        if (this.isDead || this.isMoving) return;

        const distToPlayer = this.getDistance(playerPos);

        // 공격적 AI
        if (this.definition.aiType === 'aggressive') {
            if (distToPlayer <= this.definition.aggroRange) {
                this.target = null; // 플레이어 추적
                this.chasePlayer(playerPos);
                this.tryAttack(time, playerPos);
            } else {
                this.patrol();
            }
        }
        // 수동적 AI
        else if (this.definition.aiType === 'passive') {
            this.patrol();
            // 공격받으면 반격 (takeDamage에서 처리)
        }
        // 방어적 AI
        else if (this.definition.aiType === 'defensive') {
            if (this.combatStats.currentHp < this.combatStats.maxHp * 0.5) {
                // HP 50% 이하면 도주
                this.runAway(playerPos);
            } else if (distToPlayer <= this.definition.attackRange) {
                this.tryAttack(time, playerPos);
            }
        }
    }

    /** 플레이어 추적 */
    private chasePlayer(playerPos: Position): void {
        const dist = this.getDistance(playerPos);
        if (dist <= this.definition.attackRange) return;

        // 플레이어 방향으로 이동
        const dx = Math.sign(playerPos.x - this.worldPos.x);
        const dy = Math.sign(playerPos.y - this.worldPos.y);

        const newX = this.worldPos.x + dx * 0.5;
        const newY = this.worldPos.y + dy * 0.5;

        this.moveToWorld(newX, newY, 500);
    }

    /** 순찰 */
    private patrol(): void {
        if (Math.random() > 0.01) return; // 1% 확률로 이동

        const range = 2;
        const newX = this.spawnPosition.x + (Math.random() - 0.5) * range * 2;
        const newY = this.spawnPosition.y + (Math.random() - 0.5) * range * 2;

        this.moveToWorld(newX, newY, 800);
    }

    /** 도주 */
    private runAway(playerPos: Position): void {
        const dx = Math.sign(this.worldPos.x - playerPos.x);
        const dy = Math.sign(this.worldPos.y - playerPos.y);

        const newX = this.worldPos.x + dx;
        const newY = this.worldPos.y + dy;

        this.moveToWorld(newX, newY, 400);
    }

    /** 공격 시도 */
    private tryAttack(time: number, playerPos: Position): void {
        const dist = this.getDistance(playerPos);
        if (dist > this.definition.attackRange) return;
        if (time - this.lastAttackTime < this.combatStats.attackSpeed) return;

        this.lastAttackTime = time;
        this.scene.events.emit('monsterAttack', this, this.combatStats.attack);
    }

    /** 거리 계산 */
    private getDistance(pos: Position): number {
        const dx = pos.x - this.worldPos.x;
        const dy = pos.y - this.worldPos.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /** 사망 처리 */
    protected onDeath(): void {
        // 드롭 아이템 생성
        const drops = this.calculateDrops();

        // 골드 계산
        const gold = Phaser.Math.Between(
            this.definition.gold.min,
            this.definition.gold.max
        );

        this.scene.events.emit('monsterDeath', {
            monster: this.definition,
            exp: this.definition.exp,
            gold,
            drops,
            position: this.worldPos
        });

        // 리스폰 타이머
        this.scene.time.delayedCall(this.respawnTime, () => {
            this.respawn();
        });
    }

    /** 드롭 아이템 계산 */
    private calculateDrops(): { itemId: string, quantity: number }[] {
        const drops: { itemId: string, quantity: number }[] = [];

        for (const drop of this.definition.drops) {
            if (Math.random() * 100 <= drop.chance) {
                drops.push({
                    itemId: drop.itemId,
                    quantity: Phaser.Math.Between(drop.minQuantity, drop.maxQuantity)
                });
            }
        }

        return drops;
    }

    /** 리스폰 */
    respawn(): void {
        this.isDead = false;
        this.alpha = 1;
        this.worldPos = { ...this.spawnPosition };
        this.updateScreenPosition();
        this.combatStats = { ...this.definition.stats };
        this.updateHpBar();
    }

    getDefinition(): MonsterDefinition { return this.definition; }
}
