/**
 * ============================================================
 * CombatSystem - 전투 시스템
 * ============================================================
 * 자동 사냥, 공격, 데미지 계산 등 전투 관련 시스템
 * ============================================================
 */

import type { CombatStats, ElementType } from '../../types/game.types';

/**
 * 공격 결과
 */
export interface AttackResult {
    damage: number;
    isCritical: boolean;
    isMiss: boolean;
    element: ElementType;
}

/**
 * 전투 엔티티 인터페이스
 */
export interface CombatEntity {
    stats: CombatStats;
    position: { x: number; y: number };
    takeDamage: (damage: number) => void;
    isDead: () => boolean;
}

/**
 * CombatSystem 클래스
 */
export class CombatSystem {
    /**
     * 공격 계산
     */
    public static calculateAttack(
        attacker: CombatEntity,
        defender: CombatEntity,
        skillPower?: number
    ): AttackResult {
        const attackerStats = attacker.stats;
        const defenderStats = defender.stats;

        // 명중률 계산
        const accuracy = attackerStats.accuracy;
        const evasion = defenderStats.evasion;
        const hitChance = accuracy / (accuracy + evasion);

        // 회피 판정
        if (Math.random() > hitChance) {
            return {
                damage: 0,
                isCritical: false,
                isMiss: true,
                element: 'none'
            };
        }

        // 크리티컬 판정
        const critChance = attackerStats.critRate / 100;
        const isCritical = Math.random() < critChance;

        // 기본 데미지 계산
        let baseDamage = attackerStats.attack + (skillPower || 0);

        // 크리티컬 배율
        const critMultiplier = attackerStats.critDamage / 100;
        if (isCritical) {
            baseDamage *= critMultiplier;
        }

        // 방어력에 의한 데미지 감소
        const defense = defenderStats.defense;
        const finalDamage = Math.max(1, baseDamage - defense);

        return {
            damage: Math.floor(finalDamage),
            isCritical,
            isMiss: false,
            element: 'none'
        };
    }

    /**
     * 마법 공격 계산
     */
    public static calculateMagicAttack(
        attacker: CombatEntity,
        defender: CombatEntity,
        skillPower: number,
        element: ElementType
    ): AttackResult {
        const attackerStats = attacker.stats;
        const defenderStats = defender.stats;

        // 명중률 계산 (마법은 명중률이 높음)
        const hitChance = 0.9; // 90% 기본 명중률

        if (Math.random() > hitChance) {
            return {
                damage: 0,
                isCritical: false,
                isMiss: true,
                element
            };
        }

        // 크리티컬 판정
        const critChance = attackerStats.critRate / 100;
        const isCritical = Math.random() < critChance;

        // 기본 데미지 계산
        let baseDamage = attackerStats.magicAttack + skillPower;

        // 크리티컬 배율
        const critMultiplier = attackerStats.critDamage / 100;
        if (isCritical) {
            baseDamage *= critMultiplier;
        }

        // 마법 방어력에 의한 데미지 감소
        const magicDefense = defenderStats.magicDefense;
        const finalDamage = Math.max(1, baseDamage - magicDefense);

        return {
            damage: Math.floor(finalDamage),
            isCritical,
            isMiss: false,
            element
        };
    }

    /**
     * 사거리 계산
     */
    public static calculateDistance(
        entity1: CombatEntity,
        entity2: CombatEntity
    ): number {
        const dx = entity1.position.x - entity2.position.x;
        const dy = entity1.position.y - entity2.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 공격 가능 여부 확인
     */
    public static canAttack(
        attacker: CombatEntity,
        defender: CombatEntity,
        range: number
    ): boolean {
        const distance = this.calculateDistance(attacker, defender);
        return distance <= range;
    }

    /**
     * 자동 공격 타겟 찾기
     */
    public static findNearestTarget(
        attacker: CombatEntity,
        potentialTargets: CombatEntity[],
        maxRange: number
    ): CombatEntity | null {
        let nearest: CombatEntity | null = null;
        let nearestDistance = maxRange;

        for (const target of potentialTargets) {
            if (target.isDead()) continue;

            const distance = this.calculateDistance(attacker, target);
            if (distance <= nearestDistance) {
                nearest = target;
                nearestDistance = distance;
            }
        }

        return nearest;
    }
}
