/**
 * ============================================================
 * 몬스터 데이터베이스
 * ============================================================
 */

import type { MonsterDefinition } from '../types/game.types';

export const MONSTERS: MonsterDefinition[] = [
    {
        id: 'mon_slime', name: 'Slime', nameKo: '슬라임',
        spriteKey: 'monsters', level: 1, element: 'water',
        stats: {
            maxHp: 30, maxMp: 0, currentHp: 30, currentMp: 0,
            attack: 5, defense: 2, magicAttack: 0, magicDefense: 5,
            accuracy: 80, evasion: 5, critRate: 0, critDamage: 100,
            attackSpeed: 1000, moveSpeed: 80
        },
        attackPattern: 'melee', attackRange: 1, aggroRange: 3,
        drops: [
            { itemId: 'mat_slime_jelly', chance: 80, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'potion_hp_small', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 10, gold: { min: 5, max: 15 }, aiType: 'passive'
    },
    {
        id: 'mon_wolf', name: 'Wolf', nameKo: '늑대',
        spriteKey: 'monsters', level: 3, element: 'none',
        stats: {
            maxHp: 60, maxMp: 0, currentHp: 60, currentMp: 0,
            attack: 12, defense: 5, magicAttack: 0, magicDefense: 3,
            accuracy: 90, evasion: 15, critRate: 5, critDamage: 120,
            attackSpeed: 800, moveSpeed: 120
        },
        attackPattern: 'melee', attackRange: 1, aggroRange: 5,
        drops: [
            { itemId: 'mat_wolf_pelt', chance: 60, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 25, gold: { min: 10, max: 25 }, aiType: 'aggressive'
    },
    {
        id: 'mon_goblin', name: 'Goblin', nameKo: '고블린',
        spriteKey: 'monsters', level: 5, element: 'earth',
        stats: {
            maxHp: 100, maxMp: 20, currentHp: 100, currentMp: 20,
            attack: 18, defense: 8, magicAttack: 5, magicDefense: 5,
            accuracy: 85, evasion: 10, critRate: 3, critDamage: 110,
            attackSpeed: 900, moveSpeed: 100
        },
        attackPattern: 'melee', attackRange: 1, aggroRange: 4,
        drops: [
            { itemId: 'weapon_iron_sword', chance: 5, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'potion_hp_small', chance: 20, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 45, gold: { min: 20, max: 50 }, aiType: 'aggressive'
    },
    {
        id: 'mon_skeleton', name: 'Skeleton', nameKo: '스켈레톤',
        spriteKey: 'monsters', level: 8, element: 'dark',
        stats: {
            maxHp: 150, maxMp: 30, currentHp: 150, currentMp: 30,
            attack: 25, defense: 15, magicAttack: 10, magicDefense: 20,
            accuracy: 88, evasion: 8, critRate: 5, critDamage: 130,
            attackSpeed: 1000, moveSpeed: 90
        },
        attackPattern: 'melee', attackRange: 1, aggroRange: 5,
        drops: [
            { itemId: 'mat_iron_ore', chance: 30, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 80, gold: { min: 35, max: 80 }, aiType: 'aggressive'
    }
];

export function getMonsterById(id: string): MonsterDefinition | undefined {
    return MONSTERS.find(m => m.id === id);
}
