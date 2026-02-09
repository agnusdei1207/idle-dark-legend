/**
 * ============================================================
 * 게임 엔티티 기본 클래스
 * ============================================================
 * 
 * 모든 게임 오브젝트(플레이어, 몬스터, NPC)의 기본 클래스
 * ============================================================
 */

import Phaser from 'phaser';
import type { Position, IsoDirection, CombatStats, ElementType } from '../types/game.types';
import { GAME_CONSTANTS } from '../config/game.config';

export abstract class Entity extends Phaser.GameObjects.Container {
    /** 월드 좌표 (아이소메트릭 그리드) */
    protected worldPos: Position = { x: 0, y: 0 };

    /** 현재 방향 */
    protected direction: IsoDirection = 'se';

    /** 전투 스탯 */
    protected combatStats!: CombatStats;

    /** 속성 */
    protected element: ElementType = 'none';

    /** 스프라이트 */
    protected sprite!: Phaser.GameObjects.Sprite | Phaser.GameObjects.Rectangle;

    /** HP 바 */
    protected hpBar!: Phaser.GameObjects.Graphics;

    /** 이름 텍스트 */
    protected nameText!: Phaser.GameObjects.Text;

    /** 이동 중 여부 */
    protected isMoving: boolean = false;

    /** 사망 여부 */
    protected isDead: boolean = false;

    constructor(scene: Phaser.Scene, worldX: number, worldY: number) {
        super(scene, 0, 0);
        this.worldPos = { x: worldX, y: worldY };
        this.updateScreenPosition();
        scene.add.existing(this);
    }

    /** 월드 좌표 → 화면 좌표 변환 */
    protected updateScreenPosition(): void {
        const tileW = GAME_CONSTANTS.TILE_WIDTH;
        const tileH = GAME_CONSTANTS.TILE_HEIGHT;
        const offsetX = this.scene.cameras.main.width / 2;
        const offsetY = 150;

        this.x = (this.worldPos.x - this.worldPos.y) * (tileW / 2) + offsetX;
        this.y = (this.worldPos.x + this.worldPos.y) * (tileH / 2) + offsetY;

        // 깊이 정렬
        this.setDepth((this.worldPos.x + this.worldPos.y) * 10 + 100);
    }

    /** HP 바 업데이트 */
    protected updateHpBar(): void {
        if (!this.hpBar) return;

        this.hpBar.clear();
        const width = 40;
        const height = 4;
        const x = -width / 2;
        const y = -50;

        // 배경
        this.hpBar.fillStyle(0x000000, 0.5);
        this.hpBar.fillRect(x, y, width, height);

        // HP
        const hpPercent = this.combatStats.currentHp / this.combatStats.maxHp;
        const hpColor = hpPercent > 0.5 ? 0x00ff00 : hpPercent > 0.25 ? 0xffff00 : 0xff0000;
        this.hpBar.fillStyle(hpColor, 1);
        this.hpBar.fillRect(x, y, width * hpPercent, height);
    }

    /** 데미지 받기 */
    takeDamage(amount: number): void {
        if (this.isDead) return;

        this.combatStats.currentHp = Math.max(0, this.combatStats.currentHp - amount);
        this.updateHpBar();

        // 피격 이펙트
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });

        // 데미지 숫자 표시
        this.showDamageNumber(amount);

        if (this.combatStats.currentHp <= 0) {
            this.die();
        }
    }

    /** 회복 */
    heal(amount: number): void {
        if (this.isDead) return;

        const oldHp = this.combatStats.currentHp;
        this.combatStats.currentHp = Math.min(this.combatStats.maxHp, this.combatStats.currentHp + amount);
        const healed = this.combatStats.currentHp - oldHp;

        this.updateHpBar();
        this.showHealNumber(healed);
    }

    /** 데미지 숫자 표시 */
    protected showDamageNumber(amount: number, isCritical: boolean = false): void {
        const text = this.scene.add.text(this.x, this.y - 60, `-${amount}`, {
            fontSize: isCritical ? '20px' : '16px',
            color: isCritical ? '#ff0000' : '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    /** 회복 숫자 표시 */
    protected showHealNumber(amount: number): void {
        const text = this.scene.add.text(this.x, this.y - 60, `+${amount}`, {
            fontSize: '16px',
            color: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    /** 사망 처리 */
    protected die(): void {
        this.isDead = true;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => this.onDeath()
        });
    }

    /** 사망 후 처리 (오버라이드) */
    protected abstract onDeath(): void;

    /** 이동 */
    moveToWorld(worldX: number, worldY: number, duration: number = 300): void {
        if (this.isMoving || this.isDead) return;

        this.isMoving = true;
        this.worldPos = { x: worldX, y: worldY };

        const tileW = GAME_CONSTANTS.TILE_WIDTH;
        const tileH = GAME_CONSTANTS.TILE_HEIGHT;
        const offsetX = this.scene.cameras.main.width / 2;
        const offsetY = 150;

        const targetX = (worldX - worldY) * (tileW / 2) + offsetX;
        const targetY = (worldX + worldY) * (tileH / 2) + offsetY;

        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration,
            onUpdate: () => {
                this.setDepth((this.worldPos.x + this.worldPos.y) * 10 + 100);
            },
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }

    /** Getter */
    getWorldPos(): Position { return { ...this.worldPos }; }
    getCombatStats(): CombatStats { return { ...this.combatStats }; }
    getElement(): ElementType { return this.element; }
    getIsDead(): boolean { return this.isDead; }
    getIsMoving(): boolean { return this.isMoving; }
}
