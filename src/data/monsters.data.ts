/**
 * ============================================================
 * 어둠의전설 몬스터 데이터 - Idle RPG 버전
 * ============================================================
 */

import type { MonsterDefinition, CombatStats } from '../types/game.types';

// 기본 스탯 생성 헬퍼
function createCombatStats(level: number, hp: number, attack: number, defense: number): CombatStats {
    return {
        maxHp: hp,
        maxMp: Math.floor(hp * 0.3),
        currentHp: hp,
        currentMp: Math.floor(hp * 0.3),
        attack: attack,
        defense: defense,
        magicAttack: Math.floor(attack * 0.5),
        magicDefense: Math.floor(defense * 0.5),
        accuracy: 80 + level,
        evasion: 5 + Math.floor(level * 0.5),
        critRate: 5,
        critDamage: 150,
        attackSpeed: 1500 - Math.min(level * 10, 800),
        moveSpeed: 100
    };
}

// ========== 1써클 몬스터 (Lv 1~10) ==========
export const MONSTERS_CIRCLE_1: MonsterDefinition[] = [
    {
        id: 'rat',
        name: 'Rat',
        nameKo: '쥐',
        spriteKey: 'monster_rat',
        level: 1,
        element: 'none',
        stats: createCombatStats(1, 10, 2, 0),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 3,
        drops: [
            { itemId: 'rat_tail', chance: 30, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cheese', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 3,
        gold: { min: 1, max: 2 },
        aiType: 'passive'
    },
    {
        id: 'bat',
        name: 'Bat',
        nameKo: '박쥐',
        spriteKey: 'monster_bat',
        level: 2,
        element: 'dark',
        stats: createCombatStats(2, 15, 3, 0),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'bat_wing', chance: 25, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 5,
        gold: { min: 1, max: 3 },
        aiType: 'aggressive'
    },
    {
        id: 'spider',
        name: 'Spider',
        nameKo: '거미',
        spriteKey: 'monster_spider',
        level: 3,
        element: 'none',
        stats: createCombatStats(3, 20, 4, 1),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'spider_silk', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'poison_gland', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 7,
        gold: { min: 2, max: 4 },
        aiType: 'aggressive'
    },
    {
        id: 'goblin',
        name: 'Goblin',
        nameKo: '고블린',
        spriteKey: 'monster_goblin',
        level: 5,
        element: 'none',
        stats: createCombatStats(5, 35, 6, 2),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 5,
        drops: [
            { itemId: 'goblin_ear', chance: 25, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'rusty_dagger', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 12,
        gold: { min: 3, max: 7 },
        aiType: 'aggressive'
    },
    {
        id: 'slime',
        name: 'Slime',
        nameKo: '슬라임',
        spriteKey: 'monster_slime',
        level: 4,
        element: 'water',
        stats: createCombatStats(4, 40, 4, 3),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 3,
        drops: [
            { itemId: 'slime_jelly', chance: 35, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'slime_core', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 10,
        gold: { min: 2, max: 5 },
        aiType: 'passive'
    },
    {
        id: 'wolf',
        name: 'Wolf',
        nameKo: '늑대',
        spriteKey: 'monster_wolf',
        level: 6,
        element: 'none',
        stats: createCombatStats(6, 45, 8, 2),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'wolf_pelt', chance: 20, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'wolf_fang', chance: 15, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 15,
        gold: { min: 4, max: 8 },
        aiType: 'aggressive'
    },
    {
        id: 'orc',
        name: 'Orc',
        nameKo: '오크',
        spriteKey: 'monster_orc',
        level: 8,
        element: 'earth',
        stats: createCombatStats(8, 70, 10, 4),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 5,
        drops: [
            { itemId: 'orc_tooth', chance: 20, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'leather_armor_piece', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 22,
        gold: { min: 6, max: 12 },
        aiType: 'aggressive'
    },
    {
        id: 'troll',
        name: 'Troll',
        nameKo: '트롤',
        spriteKey: 'monster_troll',
        level: 9,
        element: 'earth',
        stats: createCombatStats(9, 90, 12, 5),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 5,
        drops: [
            { itemId: 'troll_blood', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'troll_club', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 28,
        gold: { min: 8, max: 15 },
        aiType: 'aggressive'
    },
    {
        id: 'bear',
        name: 'Wild Bear',
        nameKo: '야생곰',
        spriteKey: 'monster_bear',
        level: 10,
        element: 'none',
        stats: createCombatStats(10, 100, 14, 6),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'bear_pelt', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'bear_claw', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'raw_meat', chance: 30, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 35,
        gold: { min: 10, max: 18 },
        aiType: 'passive'
    }
];

// ========== 2써클 몬스터 (Lv 11~40) ==========
export const MONSTERS_CIRCLE_2: MonsterDefinition[] = [
    {
        id: 'mushroom_fairy',
        name: 'Mushroom Fairy',
        nameKo: '버섯요정',
        spriteKey: 'monster_mushroom',
        level: 15,
        element: 'earth',
        stats: createCombatStats(15, 120, 18, 8),
        attackPattern: 'magic',
        attackRange: 3,
        aggroRange: 5,
        drops: [
            { itemId: 'fairy_dust', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'magic_mushroom', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 45,
        gold: { min: 15, max: 25 },
        aiType: 'defensive'
    },
    {
        id: 'treant',
        name: 'Treant',
        nameKo: '트렌트',
        spriteKey: 'monster_treant',
        level: 18,
        element: 'earth',
        stats: createCombatStats(18, 200, 22, 15),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'treant_bark', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'ancient_wood', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 60,
        gold: { min: 18, max: 30 },
        aiType: 'passive'
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        nameKo: '스켈레톤',
        spriteKey: 'monster_skeleton',
        level: 22,
        element: 'dark',
        stats: createCombatStats(22, 150, 28, 10),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'bone', chance: 35, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'bone_sword', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 70,
        gold: { min: 22, max: 38 },
        aiType: 'aggressive'
    },
    {
        id: 'zombie',
        name: 'Zombie',
        nameKo: '좀비',
        spriteKey: 'monster_zombie',
        level: 25,
        element: 'dark',
        stats: createCombatStats(25, 250, 30, 12),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'rotten_flesh', chance: 40, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'zombie_heart', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 85,
        gold: { min: 28, max: 45 },
        aiType: 'aggressive'
    },
    {
        id: 'ghoul',
        name: 'Ghoul',
        nameKo: '구울',
        spriteKey: 'monster_ghoul',
        level: 28,
        element: 'dark',
        stats: createCombatStats(28, 280, 35, 14),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'ghoul_claw', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'cursed_essence', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 100,
        gold: { min: 32, max: 52 },
        aiType: 'aggressive'
    },
    {
        id: 'zombie_knight',
        name: 'Zombie Knight',
        nameKo: '좀비나이트',
        spriteKey: 'monster_zombie_knight',
        level: 32,
        element: 'dark',
        stats: createCombatStats(32, 400, 45, 25),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'cursed_armor_piece', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'zombie_knight_sword', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 130,
        gold: { min: 42, max: 68 },
        aiType: 'aggressive'
    },
    {
        id: 'wraith',
        name: 'Wraith',
        nameKo: '레이스',
        spriteKey: 'monster_wraith',
        level: 35,
        element: 'dark',
        stats: createCombatStats(35, 350, 55, 15),
        attackPattern: 'magic',
        attackRange: 4,
        aggroRange: 7,
        drops: [
            { itemId: 'ectoplasm', chance: 25, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'wraith_robe', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 150,
        gold: { min: 48, max: 75 },
        aiType: 'aggressive'
    },
    {
        id: 'vampire_bat',
        name: 'Vampire Bat',
        nameKo: '뱀파이어배트',
        spriteKey: 'monster_vampire_bat',
        level: 38,
        element: 'dark',
        stats: createCombatStats(38, 300, 50, 12),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 7,
        drops: [
            { itemId: 'vampire_fang', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'blood_vial', chance: 20, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 140,
        gold: { min: 45, max: 70 },
        aiType: 'aggressive'
    }
];

// ========== 3써클 몬스터 (Lv 41~70) ==========
export const MONSTERS_CIRCLE_3: MonsterDefinition[] = [
    {
        id: 'crab',
        name: 'Giant Crab',
        nameKo: '대게',
        spriteKey: 'monster_crab',
        level: 43,
        element: 'water',
        stats: createCombatStats(43, 500, 60, 40),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 4,
        drops: [
            { itemId: 'crab_shell', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'crab_claw', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 180,
        gold: { min: 55, max: 88 },
        aiType: 'passive'
    },
    {
        id: 'pirate',
        name: 'Pirate Rogue',
        nameKo: '해적도적',
        spriteKey: 'monster_pirate',
        level: 46,
        element: 'none',
        stats: createCombatStats(46, 450, 70, 30),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'pirate_coin', chance: 30, minQuantity: 1, maxQuantity: 5 },
            { itemId: 'pirate_cutlass', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 200,
        gold: { min: 68, max: 110 },
        aiType: 'aggressive'
    },
    {
        id: 'merman',
        name: 'Merman',
        nameKo: '머맨',
        spriteKey: 'monster_merman',
        level: 48,
        element: 'water',
        stats: createCombatStats(48, 520, 75, 35),
        attackPattern: 'ranged',
        attackRange: 3,
        aggroRange: 6,
        drops: [
            { itemId: 'merman_scale', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'trident_piece', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 220,
        gold: { min: 72, max: 115 },
        aiType: 'aggressive'
    },
    {
        id: 'gargoyle',
        name: 'Gargoyle',
        nameKo: '가고일',
        spriteKey: 'monster_gargoyle',
        level: 52,
        element: 'earth',
        stats: createCombatStats(52, 600, 85, 50),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 5,
        drops: [
            { itemId: 'gargoyle_stone', chance: 20, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'stone_heart', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 260,
        gold: { min: 80, max: 128 },
        aiType: 'defensive'
    },
    {
        id: 'mimic',
        name: 'Mimic',
        nameKo: '미믹',
        spriteKey: 'monster_mimic',
        level: 55,
        element: 'none',
        stats: createCombatStats(55, 550, 95, 45),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 2,
        drops: [
            { itemId: 'mimic_tongue', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'treasure_piece', chance: 25, minQuantity: 1, maxQuantity: 3 }
        ],
        exp: 290,
        gold: { min: 120, max: 200 },
        aiType: 'passive'
    },
    {
        id: 'death_eye',
        name: 'Death Eye',
        nameKo: '데스아이',
        spriteKey: 'monster_death_eye',
        level: 58,
        element: 'dark',
        stats: createCombatStats(58, 480, 100, 35),
        attackPattern: 'magic',
        attackRange: 5,
        aggroRange: 8,
        drops: [
            { itemId: 'evil_eye', chance: 12, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'dark_crystal', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 320,
        gold: { min: 95, max: 155 },
        aiType: 'aggressive'
    },
    {
        id: 'lich',
        name: 'Lich',
        nameKo: '리치',
        spriteKey: 'monster_lich',
        level: 62,
        element: 'dark',
        stats: createCombatStats(62, 650, 120, 40),
        attackPattern: 'magic',
        attackRange: 6,
        aggroRange: 8,
        drops: [
            { itemId: 'lich_skull', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'dark_grimoire', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 380,
        gold: { min: 115, max: 185 },
        aiType: 'aggressive'
    },
    {
        id: 'dullahan',
        name: 'Dullahan',
        nameKo: '듈라한',
        spriteKey: 'monster_dullahan',
        level: 65,
        element: 'dark',
        stats: createCombatStats(65, 750, 130, 55),
        attackPattern: 'melee',
        attackRange: 2,
        aggroRange: 7,
        drops: [
            { itemId: 'dullahan_head', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'cursed_sword', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 420,
        gold: { min: 135, max: 215 },
        aiType: 'aggressive'
    },
    {
        id: 'demon_archer',
        name: 'Demon Archer',
        nameKo: '데몬아처',
        spriteKey: 'monster_demon_archer',
        level: 68,
        element: 'fire',
        stats: createCombatStats(68, 680, 140, 45),
        attackPattern: 'ranged',
        attackRange: 7,
        aggroRange: 9,
        drops: [
            { itemId: 'demon_arrow', chance: 25, minQuantity: 2, maxQuantity: 5 },
            { itemId: 'demon_bow', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 450,
        gold: { min: 145, max: 230 },
        aiType: 'aggressive'
    }
];

// ========== 4써클 몬스터 (Lv 71~98) ==========
export const MONSTERS_CIRCLE_4: MonsterDefinition[] = [
    {
        id: 'kraken_tentacle',
        name: 'Kraken Tentacle',
        nameKo: '크라켄촉수',
        spriteKey: 'monster_kraken_tentacle',
        level: 73,
        element: 'water',
        stats: createCombatStats(73, 900, 160, 60),
        attackPattern: 'melee',
        attackRange: 2,
        aggroRange: 5,
        drops: [
            { itemId: 'kraken_sucker', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'kraken_ink', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 550,
        gold: { min: 175, max: 280 },
        aiType: 'aggressive'
    },
    {
        id: 'sea_pirate',
        name: 'Sea Pirate Captain',
        nameKo: '시파이라테',
        spriteKey: 'monster_sea_pirate',
        level: 76,
        element: 'none',
        stats: createCombatStats(76, 850, 175, 55),
        attackPattern: 'ranged',
        attackRange: 4,
        aggroRange: 7,
        drops: [
            { itemId: 'captains_medal', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'treasure_map_piece', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 600,
        gold: { min: 220, max: 360 },
        aiType: 'aggressive'
    },
    {
        id: 'deep_one',
        name: 'Deep One',
        nameKo: '딥원',
        spriteKey: 'monster_deep_one',
        level: 79,
        element: 'water',
        stats: createCombatStats(79, 1000, 185, 65),
        attackPattern: 'magic',
        attackRange: 5,
        aggroRange: 7,
        drops: [
            { itemId: 'deep_one_scale', chance: 15, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'abyssal_pearl', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 680,
        gold: { min: 240, max: 385 },
        aiType: 'aggressive'
    },
    {
        id: 'mermaid_warrior',
        name: 'Mermaid Warrior',
        nameKo: '머메이드워리어',
        spriteKey: 'monster_mermaid_warrior',
        level: 83,
        element: 'water',
        stats: createCombatStats(83, 1100, 200, 70),
        attackPattern: 'ranged',
        attackRange: 4,
        aggroRange: 7,
        drops: [
            { itemId: 'mermaid_tear', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'coral_spear', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 780,
        gold: { min: 280, max: 450 },
        aiType: 'defensive'
    },
    {
        id: 'sea_dragon',
        name: 'Sea Dragon',
        nameKo: '씨드래곤',
        spriteKey: 'monster_sea_dragon',
        level: 87,
        element: 'water',
        stats: createCombatStats(87, 1400, 230, 85),
        attackPattern: 'magic',
        attackRange: 6,
        aggroRange: 8,
        drops: [
            { itemId: 'sea_dragon_scale', chance: 10, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'dragon_pearl', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 900,
        gold: { min: 320, max: 520 },
        aiType: 'aggressive'
    },
    {
        id: 'ghost_captain',
        name: 'Ghost Captain',
        nameKo: '고스트캡틴',
        spriteKey: 'monster_ghost_captain',
        level: 92,
        element: 'dark',
        stats: createCombatStats(92, 1200, 250, 75),
        attackPattern: 'magic',
        attackRange: 5,
        aggroRange: 8,
        drops: [
            { itemId: 'ghost_compass', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'captains_soul', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1000,
        gold: { min: 360, max: 580 },
        aiType: 'aggressive'
    },
    {
        id: 'cursed_sailor',
        name: 'Cursed Sailor',
        nameKo: '커스드세일러',
        spriteKey: 'monster_cursed_sailor',
        level: 95,
        element: 'dark',
        stats: createCombatStats(95, 1350, 265, 80),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 6,
        drops: [
            { itemId: 'cursed_anchor', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'sailors_lament', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1100,
        gold: { min: 385, max: 620 },
        aiType: 'aggressive'
    },
    {
        id: 'leviathan_spawn',
        name: 'Leviathan Spawn',
        nameKo: '레비아탄스폰',
        spriteKey: 'monster_leviathan_spawn',
        level: 98,
        element: 'water',
        stats: createCombatStats(98, 1600, 290, 90),
        attackPattern: 'magic',
        attackRange: 6,
        aggroRange: 9,
        drops: [
            { itemId: 'leviathan_scale', chance: 8, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'abyssal_core', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1250,
        gold: { min: 440, max: 710 },
        aiType: 'aggressive'
    }
];

// ========== 5써클 몬스터 (Lv 99+) ==========
export const MONSTERS_CIRCLE_5: MonsterDefinition[] = [
    {
        id: 'dracula',
        name: 'Dracula Spawn',
        nameKo: '드라큘라',
        spriteKey: 'monster_dracula',
        level: 102,
        element: 'dark',
        stats: createCombatStats(102, 2000, 350, 100),
        attackPattern: 'magic',
        attackRange: 4,
        aggroRange: 8,
        drops: [
            { itemId: 'vampire_fang_elite', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'blood_gem', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1800,
        gold: { min: 560, max: 900 },
        aiType: 'aggressive'
    },
    {
        id: 'werewolf',
        name: 'Werewolf Alpha',
        nameKo: '웨어울프',
        spriteKey: 'monster_werewolf',
        level: 105,
        element: 'dark',
        stats: createCombatStats(105, 2200, 380, 95),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 9,
        drops: [
            { itemId: 'werewolf_pelt', chance: 12, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'moon_crystal', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 2000,
        gold: { min: 640, max: 1030 },
        aiType: 'aggressive'
    },
    {
        id: 'frankenstein',
        name: 'Frankenstein',
        nameKo: '프랑켄',
        spriteKey: 'monster_frankenstein',
        level: 108,
        element: 'none',
        stats: createCombatStats(108, 2800, 400, 120),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 5,
        drops: [
            { itemId: 'machine_part', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'lightning_core', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 2300,
        gold: { min: 720, max: 1160 },
        aiType: 'aggressive'
    },
    {
        id: 'maid_ghost',
        name: 'Maid Ghost',
        nameKo: '메이드고스트',
        spriteKey: 'monster_maid_ghost',
        level: 110,
        element: 'dark',
        stats: createCombatStats(110, 1800, 420, 90),
        attackPattern: 'magic',
        attackRange: 5,
        aggroRange: 7,
        drops: [
            { itemId: 'ghost_dress', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'soul_fragment', chance: 15, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 2500,
        gold: { min: 800, max: 1290 },
        aiType: 'aggressive'
    },
    {
        id: 'iron_maiden',
        name: 'Iron Maiden',
        nameKo: '아이언메이든',
        spriteKey: 'monster_iron_maiden',
        level: 115,
        element: 'earth',
        stats: createCombatStats(115, 3200, 450, 150),
        attackPattern: 'melee',
        attackRange: 1,
        aggroRange: 3,
        drops: [
            { itemId: 'iron_spike', chance: 20, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'torture_device', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 2800,
        gold: { min: 880, max: 1420 },
        aiType: 'passive'
    },
    {
        id: 'blood_countess',
        name: 'Blood Maiden',
        nameKo: '블러드카운테스',
        spriteKey: 'monster_blood_countess',
        level: 120,
        element: 'dark',
        stats: createCombatStats(120, 2500, 480, 110),
        attackPattern: 'magic',
        attackRange: 5,
        aggroRange: 8,
        drops: [
            { itemId: 'blood_dress', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'crimson_tear', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 3200,
        gold: { min: 1040, max: 1680 },
        aiType: 'aggressive'
    },
    {
        id: 'dark_witch',
        name: 'Dark Witch',
        nameKo: '다크위차스',
        spriteKey: 'monster_dark_witch',
        level: 125,
        element: 'dark',
        stats: createCombatStats(125, 2200, 520, 100),
        attackPattern: 'magic',
        attackRange: 7,
        aggroRange: 10,
        drops: [
            { itemId: 'witch_hat', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'dark_tome', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 3500,
        gold: { min: 1120, max: 1800 },
        aiType: 'aggressive'
    },
    {
        id: 'vecna_servant',
        name: 'Vecna Servant',
        nameKo: '베크나졸',
        spriteKey: 'monster_vecna_servant',
        level: 130,
        element: 'dark',
        stats: createCombatStats(130, 2800, 550, 120),
        attackPattern: 'magic',
        attackRange: 6,
        aggroRange: 9,
        drops: [
            { itemId: 'vecna_robe', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'arcane_crystal', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 4000,
        gold: { min: 1280, max: 2060 },
        aiType: 'aggressive'
    },
    {
        id: 'archmage',
        name: 'Dark Archmage',
        nameKo: '대마법사',
        spriteKey: 'monster_archmage',
        level: 135,
        element: 'dark',
        stats: createCombatStats(135, 2600, 600, 110),
        attackPattern: 'magic',
        attackRange: 8,
        aggroRange: 10,
        drops: [
            { itemId: 'archmage_staff', chance: 4, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'ancient_scroll', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 4500,
        gold: { min: 1440, max: 2320 },
        aiType: 'aggressive'
    }
];

// 모든 몬스터 통합
export const ALL_MONSTERS: MonsterDefinition[] = [
    ...MONSTERS_CIRCLE_1,
    ...MONSTERS_CIRCLE_2,
    ...MONSTERS_CIRCLE_3,
    ...MONSTERS_CIRCLE_4,
    ...MONSTERS_CIRCLE_5
];

// 몬스터 ID로 검색
export function getMonsterById(id: string): MonsterDefinition | undefined {
    return ALL_MONSTERS.find(m => m.id === id);
}

// 레벨 범위로 검색
export function getMonstersByLevel(minLevel: number, maxLevel: number): MonsterDefinition[] {
    return ALL_MONSTERS.filter(m => m.level >= minLevel && m.level <= maxLevel);
}

// 써클로 검색 (레벨 기반)
export function getMonstersByCircle(circle: number): MonsterDefinition[] {
    const circleRanges: { [key: number]: { min: number; max: number } } = {
        1: { min: 1, max: 10 },
        2: { min: 11, max: 40 },
        3: { min: 41, max: 70 },
        4: { min: 71, max: 98 },
        5: { min: 99, max: 999 }
    };
    const range = circleRanges[circle];
    if (!range) return [];
    return ALL_MONSTERS.filter(m => m.level >= range.min && m.level <= range.max);
}
