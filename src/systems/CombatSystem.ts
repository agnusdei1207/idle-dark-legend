/**
 * ============================================================
 * 전투 시스템
 * ============================================================
 * 
 * 데미지 계산, 속성 상성, 크리티컬, 회피 등을 처리합니다.
 * ============================================================
 */

import Phaser from 'phaser';
import type { CombatStats, BaseStats, ElementType } from '../types/game.types';
import { ELEMENT_WEAKNESS } from '../types/game.types';

/** 전투 결과 */
export interface CombatResult {
    damage: number;
    isCritical: boolean;
    isMiss: boolean;
    isElementalBonus: boolean;
    elementMultiplier: number;
}

export class CombatSystem extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    /**
     * 물리 데미지 계산
     */
    calculatePhysicalDamage(
        attacker: CombatStats,
        defender: CombatStats,
        skillPower: number = 100,
        attackerElement: ElementType = 'none',
        defenderElement: ElementType = 'none'
    ): CombatResult {
        // 명중 체크
        const hitChance = attacker.accuracy - defender.evasion;
        if (Math.random() * 100 > hitChance) {
            return { damage: 0, isCritical: false, isMiss: true, isElementalBonus: false, elementMultiplier: 1 };
        }

        // 기본 데미지 = (공격력 * 스킬배율 / 100) - 방어력
        let damage = (attacker.attack * skillPower / 100) - (defender.defense * 0.5);
        damage = Math.max(1, damage);

        // 크리티컬 체크
        const isCritical = Math.random() * 100 < attacker.critRate;
        if (isCritical) {
            damage *= (attacker.critDamage / 100);
        }

        // 속성 보너스
        const { multiplier, isBonus } = this.calculateElementBonus(attackerElement, defenderElement);
        damage *= multiplier;

        // 랜덤 변동 (±10%)
        damage *= 0.9 + Math.random() * 0.2;

        return {
            damage: Math.floor(damage),
            isCritical,
            isMiss: false,
            isElementalBonus: isBonus,
            elementMultiplier: multiplier
        };
    }

    /**
     * 마법 데미지 계산
     */
    calculateMagicDamage(
        attacker: CombatStats,
        defender: CombatStats,
        skillPower: number = 100,
        attackerElement: ElementType = 'none',
        defenderElement: ElementType = 'none'
    ): CombatResult {
        // 마법은 명중 체크 없음 (항상 명중)

        // 기본 데미지 = (마공 * 스킬배율 / 100) - 마방
        let damage = (attacker.magicAttack * skillPower / 100) - (defender.magicDefense * 0.5);
        damage = Math.max(1, damage);

        // 크리티컬 (마법도 크리티컬 가능)
        const isCritical = Math.random() * 100 < attacker.critRate * 0.5;
        if (isCritical) {
            damage *= (attacker.critDamage / 100);
        }

        // 속성 보너스 (마법은 속성 영향 더 큼)
        const { multiplier, isBonus } = this.calculateElementBonus(attackerElement, defenderElement);
        damage *= multiplier * 1.2; // 마법은 속성 보너스 20% 추가

        // 랜덤 변동
        damage *= 0.9 + Math.random() * 0.2;

        return {
            damage: Math.floor(damage),
            isCritical,
            isMiss: false,
            isElementalBonus: isBonus,
            elementMultiplier: multiplier
        };
    }

    /**
     * 속성 상성 계산
     * 상성 유리: 1.3배
     * 상성 불리: 0.7배
     */
    calculateElementBonus(attackerElement: ElementType, defenderElement: ElementType): { multiplier: number, isBonus: boolean } {
        if (attackerElement === 'none' || defenderElement === 'none') {
            return { multiplier: 1, isBonus: false };
        }

        // 공격자 속성이 방어자의 약점인지 확인
        if (ELEMENT_WEAKNESS[defenderElement] === attackerElement) {
            return { multiplier: 1.3, isBonus: true };
        }

        // 공격자 속성이 방어자에게 불리한지 확인
        if (ELEMENT_WEAKNESS[attackerElement] === defenderElement) {
            return { multiplier: 0.7, isBonus: false };
        }

        return { multiplier: 1, isBonus: false };
    }

    /**
     * 회복량 계산
     */
    calculateHeal(
        caster: CombatStats,
        baseHeal: number,
        scaling: { stat: keyof BaseStats, ratio: number }[],
        stats: BaseStats
    ): number {
        let heal = baseHeal;

        for (const scale of scaling) {
            heal += stats[scale.stat] * scale.ratio;
        }

        // 랜덤 변동 (±5%)
        heal *= 0.95 + Math.random() * 0.1;

        return Math.floor(heal);
    }

    /**
     * 경험치 계산 (레벨업에 필요한 경험치)
     */
    getExpForLevel(level: number): number {
        // 레벨^2 * 100 공식
        return level * level * 100;
    }

    /**
     * 레벨업 체크
     */
    checkLevelUp(currentLevel: number, currentExp: number): { newLevel: number, remaining: number } {
        let level = currentLevel;
        let exp = currentExp;

        while (exp >= this.getExpForLevel(level)) {
            exp -= this.getExpForLevel(level);
            level++;
        }

        return { newLevel: level, remaining: exp };
    }

    /**
     * 스탯으로 전투 스탯 계산
     */
    calculateCombatStats(base: BaseStats, level: number): CombatStats {
        return {
            maxHp: 50 + base.con * 10 + level * 5,
            maxMp: 20 + base.int * 5 + base.wis * 3 + level * 2,
            currentHp: 50 + base.con * 10 + level * 5,
            currentMp: 20 + base.int * 5 + base.wis * 3 + level * 2,
            attack: 5 + base.str * 2 + level,
            defense: 2 + base.con * 1 + Math.floor(level / 2),
            magicAttack: 3 + base.int * 2 + level,
            magicDefense: 2 + base.wis * 1.5 + Math.floor(level / 2),
            accuracy: 80 + base.dex * 0.5,
            evasion: 5 + base.dex * 0.5 + base.luk * 0.2,
            critRate: 5 + base.dex * 0.3 + base.luk * 0.5,
            critDamage: 150 + base.luk * 1,
            attackSpeed: 1000, // 1초
            moveSpeed: 100 + base.dex * 0.5
        };
    }
}
