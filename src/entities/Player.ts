/**
 * ============================================================
 * 플레이어 엔티티
 * ============================================================
 */

import Phaser from 'phaser';
import { Entity } from './Entity';
import type { BaseStats, EquipSlot } from '../types/game.types';
import { CombatSystem } from '../systems/CombatSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { getItemById, isEquipment } from '../data/items.data';
import { getSkillById } from '../data/skills.data';

export class Player extends Entity {
    private level: number = 1;
    private exp: number = 0;
    private baseStats: BaseStats;
    private statPoints: number = 0;
    private skillPoints: number = 0;
    private learnedSkills: string[] = [];
    private skillCooldowns: Map<string, number> = new Map();

    private combatSystem: CombatSystem;
    private inventory: InventorySystem;

    constructor(
        scene: Phaser.Scene,
        worldX: number,
        worldY: number,
        baseStats?: BaseStats
    ) {
        super(scene, worldX, worldY);

        this.combatSystem = new CombatSystem();
        this.inventory = new InventorySystem();

        // 기본 스탯
        this.baseStats = baseStats || {
            str: 5, dex: 5, con: 5, int: 5, wis: 5, luk: 5
        };

        // 전투 스탯 계산
        this.recalculateStats();

        // 스프라이트 (플레이스홀더)
        this.sprite = scene.add.rectangle(0, -16, 24, 32, 0xff4444);
        this.add(this.sprite);

        // HP 바
        this.hpBar = scene.add.graphics();
        this.add(this.hpBar);
        this.updateHpBar();

        // 이름
        this.nameText = scene.add.text(0, -60, 'Player', {
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.nameText);

        // 기본 스킬
        this.learnedSkills = ['skill_basic_attack', 'skill_slash'];
    }

    /** 스탯 재계산 (장비 포함) */
    recalculateStats(): void {
        // 기본 스탯으로 전투 스탯 계산
        this.combatStats = this.combatSystem.calculateCombatStats(this.baseStats, this.level);

        // 장비 보너스 적용
        const equipment = this.inventory.getEquipment();
        for (const slot of Object.keys(equipment) as EquipSlot[]) {
            const itemId = equipment[slot];
            if (!itemId) continue;

            const item = getItemById(itemId);
            if (!item || !isEquipment(item)) continue;

            // 스탯 보너스
            for (const [stat, value] of Object.entries(item.stats)) {
                if (stat in this.baseStats && value) {
                    (this.baseStats as any)[stat] += value;
                }
            }

            // 전투 스탯 보너스
            for (const [stat, value] of Object.entries(item.combatStats)) {
                if (stat in this.combatStats && value) {
                    (this.combatStats as any)[stat] += value;
                }
            }
        }

        this.updateHpBar();
    }

    /** 경험치 획득 */
    gainExp(amount: number): void {
        this.exp += amount;

        // 레벨업 체크
        const result = this.combatSystem.checkLevelUp(this.level, this.exp);
        if (result.newLevel > this.level) {
            const levelsGained = result.newLevel - this.level;
            this.level = result.newLevel;
            this.exp = result.remaining;
            this.statPoints += levelsGained * 5;
            this.skillPoints += levelsGained;

            // 레벨업 이펙트
            this.onLevelUp();
        }

        this.scene.events.emit('expChanged', this.exp, this.level);
    }

    /** 레벨업 이펙트 */
    private onLevelUp(): void {
        this.recalculateStats();

        // 풀 회복
        this.combatStats.currentHp = this.combatStats.maxHp;
        this.combatStats.currentMp = this.combatStats.maxMp;
        this.updateHpBar();

        // 이펙트
        const text = this.scene.add.text(this.x, this.y - 80, 'LEVEL UP!', {
            fontSize: '24px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            y: text.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });

        this.scene.events.emit('levelUp', this.level);
    }

    /** 스탯 포인트 사용 */
    addStatPoint(stat: keyof BaseStats): boolean {
        if (this.statPoints <= 0) return false;
        this.baseStats[stat]++;
        this.statPoints--;
        this.recalculateStats();
        return true;
    }

    /** 스킬 사용 */
    useSkill(skillId: string): boolean {
        if (!this.learnedSkills.includes(skillId)) return false;

        // 쿨다운 체크
        const cooldownEnd = this.skillCooldowns.get(skillId) || 0;
        if (Date.now() < cooldownEnd) return false;

        const skill = getSkillById(skillId);
        if (!skill) return false;

        // MP 체크
        if (this.combatStats.currentMp < skill.mpCost) return false;

        // MP 소모
        this.combatStats.currentMp -= skill.mpCost;

        // 쿨다운 설정
        this.skillCooldowns.set(skillId, Date.now() + skill.cooldown);

        this.scene.events.emit('skillUsed', skillId, skill);
        return true;
    }

    /** 스킬 학습 */
    learnSkill(skillId: string): boolean {
        if (this.learnedSkills.includes(skillId)) return false;
        if (this.skillPoints <= 0) return false;

        this.learnedSkills.push(skillId);
        this.skillPoints--;
        this.scene.events.emit('skillLearned', skillId);
        return true;
    }

    /** 사망 처리 */
    protected onDeath(): void {
        this.scene.events.emit('playerDeath');
        // 마을로 귀환 등 처리
    }

    /** 부활 */
    respawn(worldX: number, worldY: number): void {
        this.isDead = false;
        this.alpha = 1;
        this.worldPos = { x: worldX, y: worldY };
        this.updateScreenPosition();

        // 50% 상태로 부활
        this.combatStats.currentHp = Math.floor(this.combatStats.maxHp * 0.5);
        this.combatStats.currentMp = Math.floor(this.combatStats.maxMp * 0.5);
        this.updateHpBar();
    }

    // Getters
    getLevel(): number { return this.level; }
    getExp(): number { return this.exp; }
    getBaseStats(): BaseStats { return { ...this.baseStats }; }
    getStatPoints(): number { return this.statPoints; }
    getSkillPoints(): number { return this.skillPoints; }
    getLearnedSkills(): string[] { return [...this.learnedSkills]; }
    getInventory(): InventorySystem { return this.inventory; }

    getExpToNextLevel(): number {
        return this.combatSystem.getExpForLevel(this.level);
    }
}
