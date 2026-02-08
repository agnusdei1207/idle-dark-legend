/**
 * ============================================================
 * 어둠의전설(Legend of Darkness) 몬스터 데이터베이스
 * ============================================================
 * 넥슨 어둠의전설 (1998/2005) 최초 출시 버전 기준
 *
 * 참고: 본 데이터는 팬 프로젝트로, 원본 게임의 몬스터와 사냥터를
 * 최대한 재현하기 위해 작성되었습니다.
 * ============================================================
 */

import type { MonsterDefinition, CombatStats, MonsterType } from '../types/game.types';

// 몬스터 ID를 MonsterType으로 매핑
function getMonsterType(id: string): MonsterType {
    const typeMap: Record<string, MonsterType> = {
        'mon_pampat': 'slime',
        'mon_nie': 'slime',
        'mon_wandu': 'slime',
        'mon_mantis': 'wolf',
        'mon_wasp': 'wolf',
        'mon_wolf': 'wolf',
        'mon_spider': 'wolf',
        'mon_centipede': 'wolf',
        'mon_orange_rat': 'wolf',
        'mon_curupay': 'demon',
        'mon_goblin_soldier': 'goblin',
        'mon_goblin_warrior': 'goblin',
        'mon_hobgoblin': 'goblin',
        'mon_werewolf': 'wolf',
        'mon_shrieker': 'ghost',
        'mon_wisp': 'ghost',
        'mon_ent': 'demon',
        'mon_abel_crab': 'demon',
        'mon_sea_witch': 'demon',
        'mon_skeleton_warrior': 'skeleton',
        'mon_ghoul': 'skeleton',
        'mon_zombie_knight': 'skeleton',
        'mon_vampire': 'demon',
        'mon_kraken': 'demon',
        'mon_sea_serpent': 'dragon',
        'mon_gargoyle': 'skeleton',
        'mon_lich': 'skeleton',
        'mon_dullahan': 'skeleton',
        'mon_horror_knight': 'skeleton',
        'mon_blood_countess': 'demon',
        'mon_dark_archmage': 'demon',
        'mon_dracula': 'demon'
    };
    return typeMap[id] || 'slime';
}

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
        moveSpeed: 100,
        // Three.js 2.5D specific stats
        attackRange: 40,
        chaseRange: 150
    };
}

// ============================================================
// 1서클 몬스터 (Lv 1~10) - 노비스 마을 주변, 우드랜드
// ============================================================

export const MONSTERS_CIRCLE_1: MonsterDefinition[] = [
    // 노비스 마을 주변 몬스터
    {
        id: 'mon_pampat',
        name: 'Pampat',
        nameKo: '팜팻',
        type: 'slime',
        spriteKey: 'monster_pampat',
        
        level: 1,
        element: 'earth',
        stats: {
            ...createCombatStats(1, 15, 2, 0),
            moveSpeed: 40,
            attackSpeed: 1.5,
            chaseRange: 100
        },
        attackPattern: 'melee',
        ai: 'passive',
        drops: [
            { itemId: 'mat_plant_fiber', chance: 30, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 5,
        gold: { min: 1, max: 3 }
    },
    {
        id: 'mon_nie',
        name: 'Nie',
        nameKo: '니에',
        spriteKey: 'monster_nie',
        type: 'slime' as const,
        
        level: 2,
        element: 'earth',
        stats: createCombatStats(2, 20, 3, 1),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_nie_feather', chance: 25, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_tiny_bone', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 8,
        gold: { min: 2, max: 4 },
        ai: 'passive'
    },
    {
        id: 'mon_wandu',
        name: 'Pea',
        nameKo: '완두콩',
        spriteKey: 'monster_pea',
        type: 'slime' as const,
        
        level: 3,
        element: 'earth',
        stats: createCombatStats(3, 25, 4, 1),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_pea_pod', chance: 30, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_plant_seed', chance: 20, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 10,
        gold: { min: 2, max: 5 },
        ai: 'passive'
    },
    {
        id: 'mon_mantis',
        name: 'Mantis',
        nameKo: '맨티스',
        spriteKey: 'monster_mantis',
        type: 'wolf' as const,
        
        level: 4,
        element: 'earth',
        stats: createCombatStats(4, 35, 5, 2),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_mantis_claw', chance: 25, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_insect_wing', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 12,
        gold: { min: 3, max: 6 },
        ai: 'aggressive'
    },
    {
        id: 'mon_wasp',
        name: 'Wasp',
        nameKo: '말벌',
        spriteKey: 'monster_wasp',
        type: 'wolf' as const,
        
        level: 5,
        element: 'earth',
        stats: createCombatStats(5, 30, 6, 1),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_wasp_stinger', chance: 25, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_honeycomb', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 15,
        gold: { min: 3, max: 7 },
        ai: 'aggressive'
    },
    {
        id: 'mon_wolf',
        name: 'Wolf',
        nameKo: '늑대',
        spriteKey: 'monster_wolf',
        type: 'wolf' as const,
        
        level: 6,
        element: 'none',
        stats: createCombatStats(6, 45, 8, 2),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_wolf_pelt', chance: 20, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_wolf_fang', chance: 15, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 18,
        gold: { min: 4, max: 8 },
        ai: 'aggressive'
    },
    {
        id: 'mon_spider',
        name: 'Spider',
        nameKo: '거미',
        spriteKey: 'monster_spider',
        type: 'wolf' as const,
        
        level: 7,
        element: 'none',
        stats: createCombatStats(7, 40, 7, 2),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_spider_silk', chance: 25, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_poison_sac', chance: 12, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 20,
        gold: { min: 4, max: 9 },
        ai: 'aggressive'
    },
    {
        id: 'mon_centipede',
        name: 'Centipede',
        nameKo: '지네',
        spriteKey: 'monster_centipede',
        type: 'wolf' as const,
        
        level: 8,
        element: 'earth',
        stats: createCombatStats(8, 50, 9, 3),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_centipede_leg', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_venom_fang', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 22,
        gold: { min: 5, max: 10 },
        ai: 'aggressive'
    },
    // 주황색 쥐 (노비스 던전)
    {
        id: 'mon_orange_rat',
        name: 'Orange Rat',
        nameKo: '주황쥐',
        spriteKey: 'monster_orange_rat',
        type: 'wolf' as const,
        
        level: 9,
        element: 'none',
        stats: createCombatStats(9, 60, 10, 4),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_rat_tail', chance: 30, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_orange_fur', chance: 20, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 25,
        gold: { min: 6, max: 12 },
        ai: 'passive'
    },
    // 큐르페이 (우드랜드 보스)
    {
        id: 'mon_curupay',
        name: 'Curupay',
        nameKo: '큐르페이',
        spriteKey: 'monster_curupay',
        type: 'demon' as const,
        
        level: 10,
        element: 'earth',
        stats: createCombatStats(10, 80, 12, 5),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_curupay_root', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_ancient_seed', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 35,
        gold: { min: 10, max: 18 },
        ai: 'aggressive'
    }
];

// ============================================================
// 2서클 몬스터 (Lv 11~40) - 포테의 숲, 피에트 마을
// ============================================================

export const MONSTERS_CIRCLE_2: MonsterDefinition[] = [
    {
        id: 'mon_goblin_soldier',
        name: 'Goblin Soldier',
        nameKo: '고블린병사',
        spriteKey: 'monster_goblin_soldier',
        type: 'goblin',

        level: 12,
        element: 'none',
        stats: createCombatStats(12, 100, 15, 6),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_goblin_ear', chance: 25, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'weapon_rusty_dagger', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 40,
        gold: { min: 10, max: 20 },
        ai: 'aggressive'
    },
    {
        id: 'mon_goblin_warrior',
        name: 'Goblin Warrior',
        nameKo: '고블린전사',
        spriteKey: 'monster_goblin_warrior',
        type: 'goblin',

        level: 18,
        element: 'none',
        stats: createCombatStats(18, 150, 22, 10),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_goblin_weapon', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_goblin_armor', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 55,
        gold: { min: 15, max: 28 },
        ai: 'aggressive'
    },
    {
        id: 'mon_hobgoblin',
        name: 'Hobgoblin',
        nameKo: '홉고블린',
        spriteKey: 'monster_hobgoblin',
        type: 'goblin',

        level: 25,
        element: 'none',
        stats: createCombatStats(25, 250, 35, 15),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_hobgoblin_club', chance: 12, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_goblin_treasure', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 80,
        gold: { min: 25, max: 45 },
        ai: 'aggressive'
    },
    {
        id: 'mon_werewolf',
        name: 'Werewolf',
        nameKo: '늑대인간',
        spriteKey: 'monster_werewolf',
        type: 'wolf',

        level: 30,
        element: 'dark',
        stats: createCombatStats(30, 350, 45, 18),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_werewolf_fang', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_werewolf_pelt', chance: 12, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 100,
        gold: { min: 32, max: 55 },
        ai: 'aggressive'
    },
    {
        id: 'mon_shrieker',
        name: 'Shrieker',
        nameKo: '슈리커',
        spriteKey: 'monster_shrieker',
        type: 'ghost' as const,
        
        level: 35,
        element: 'earth',
        stats: createCombatStats(35, 400, 50, 25),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_shrieker_spore', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_magic_mushroom', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 130,
        gold: { min: 40, max: 68 },
        ai: 'defensive'
    },
    {
        id: 'mon_wisp',
        name: 'Wisp',
        nameKo: '위스프',
        spriteKey: 'monster_wisp',
        type: 'ghost' as const,
        
        level: 38,
        element: 'dark',
        stats: createCombatStats(38, 320, 55, 15),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_wisp_essence', chance: 18, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_ghost_light', chance: 8, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 150,
        gold: { min: 48, max: 78 },
        ai: 'aggressive'
    },
    {
        id: 'mon_ent',
        name: 'Ent',
        nameKo: '에인트',
        spriteKey: 'monster_ent',
        type: 'demon' as const,
        
        level: 40,
        element: 'earth',
        stats: createCombatStats(40, 500, 60, 30),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_ancient_wood', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_ent_root', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 180,
        gold: { min: 55, max: 90 },
        ai: 'passive'
    }
];

// ============================================================
// 3서클 몬스터 (Lv 41~70) - 아벨 던전, 아벨 해안
// ============================================================

export const MONSTERS_CIRCLE_3: MonsterDefinition[] = [
    {
        id: 'mon_abel_crab',
        name: 'Giant Crab',
        nameKo: '대게',
        spriteKey: 'monster_giant_crab',
        type: 'demon' as const,
        
        level: 45,
        element: 'water',
        stats: createCombatStats(45, 600, 80, 40),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_crab_shell', chance: 22, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_crab_claw', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 200,
        gold: { min: 65, max: 105 },
        ai: 'passive'
    },
    {
        id: 'mon_sea_witch',
        name: 'Sea Witch',
        nameKo: '바다마녀',
        spriteKey: 'monster_sea_witch',
        type: 'demon' as const,
        
        level: 50,
        element: 'water',
        stats: createCombatStats(50, 550, 95, 35),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_sea_wand', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_water_essence', chance: 18, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 250,
        gold: { min: 78, max: 125 },
        ai: 'aggressive'
    },
    {
        id: 'mon_skeleton_warrior',
        name: 'Skeleton Warrior',
        nameKo: '스켈레톤워리어',
        spriteKey: 'monster_skeleton_warrior',
        type: 'skeleton',

        level: 55,
        element: 'dark',
        stats: createCombatStats(55, 700, 110, 45),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_bone_fragment', chance: 35, minQuantity: 1, maxQuantity: 3 },
            { itemId: 'weapon_bone_sword', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 300,
        gold: { min: 95, max: 155 },
        ai: 'aggressive'
    },
    {
        id: 'mon_ghoul',
        name: 'Ghoul',
        nameKo: '구울',
        spriteKey: 'monster_ghoul',
        type: 'skeleton' as const,
        
        level: 60,
        element: 'dark',
        stats: createCombatStats(60, 800, 130, 50),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_ghoul_claw', chance: 20, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_cursed_essence', chance: 12, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 350,
        gold: { min: 115, max: 185 },
        ai: 'aggressive'
    },
    {
        id: 'mon_zombie_knight',
        name: 'Zombie Knight',
        nameKo: '좀비나이트',
        spriteKey: 'monster_zombie_knight',
        type: 'skeleton' as const,
        
        level: 65,
        element: 'dark',
        stats: createCombatStats(65, 950, 150, 60),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_cursed_armor', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'weapon_zombie_sword', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 400,
        gold: { min: 135, max: 218 },
        ai: 'aggressive'
    },
    {
        id: 'mon_vampire',
        name: 'Vampire',
        nameKo: '뱀파이어',
        spriteKey: 'monster_vampire',
        type: 'demon' as const,
        
        level: 70,
        element: 'dark',
        stats: createCombatStats(70, 850, 170, 55),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_vampire_fang', chance: 15, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_blood_vial', chance: 20, minQuantity: 1, maxQuantity: 2 }
        ],
        exp: 480,
        gold: { min: 158, max: 255 },
        ai: 'aggressive'
    }
];

// ============================================================
// 4서클 몬스터 (Lv 71~98) - 뤼케시온 해안, 솔던
// ============================================================

export const MONSTERS_CIRCLE_4: MonsterDefinition[] = [
    {
        id: 'mon_kraken',
        name: 'Kraken Tentacle',
        nameKo: '크라켄촉수',
        spriteKey: 'monster_kraken',
        type: 'demon' as const,
        
        level: 75,
        element: 'water',
        stats: createCombatStats(75, 1200, 200, 80),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_kraken_sucker', chance: 22, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_kraken_ink', chance: 15, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 600,
        gold: { min: 195, max: 315 },
        ai: 'aggressive'
    },
    {
        id: 'mon_sea_serpent',
        name: 'Sea Serpent',
        nameKo: '씨서펀트',
        spriteKey: 'monster_sea_serpent',
        type: 'dragon' as const,
        
        level: 82,
        element: 'water',
        stats: createCombatStats(82, 1400, 230, 95),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_serpent_scale', chance: 18, minQuantity: 1, maxQuantity: 2 },
            { itemId: 'mat_sea_pearl', chance: 6, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 750,
        gold: { min: 245, max: 395 },
        ai: 'aggressive'
    },
    {
        id: 'mon_gargoyle',
        name: 'Gargoyle',
        nameKo: '가고일',
        spriteKey: 'monster_gargoyle',
        type: 'skeleton' as const,
        
        level: 88,
        element: 'earth',
        stats: createCombatStats(88, 1600, 260, 110),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_gargoyle_stone', chance: 20, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_stone_heart', chance: 6, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 900,
        gold: { min: 295, max: 475 },
        ai: 'defensive'
    },
    {
        id: 'mon_lich',
        name: 'Lich',
        nameKo: '리치',
        spriteKey: 'monster_lich',
        type: 'skeleton' as const,
        
        level: 95,
        element: 'dark',
        stats: createCombatStats(95, 1800, 300, 100),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_lich_skull', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_dark_grimoire', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1100,
        gold: { min: 365, max: 590 },
        ai: 'aggressive'
    },
    {
        id: 'mon_dullahan',
        name: 'Dullahan',
        nameKo: '듈라한',
        spriteKey: 'monster_dullahan',
        type: 'skeleton' as const,
        
        level: 98,
        element: 'dark',
        stats: createCombatStats(98, 2200, 330, 130),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_dullahan_head', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'weapon_cursed_sword', chance: 3, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1300,
        gold: { min: 425, max: 685 },
        ai: 'aggressive'
    }
];

// ============================================================
// 5서클 몬스터 (Lv 99+) - 호러케슬, 지존
// ============================================================

export const MONSTERS_CIRCLE_5: MonsterDefinition[] = [
    {
        id: 'mon_horror_knight',
        name: 'Horror Knight',
        nameKo: '호랑나이트',
        spriteKey: 'monster_horror_knight',
        type: 'skeleton' as const,
        
        level: 102,
        element: 'dark',
        stats: createCombatStats(102, 2500, 380, 150),
        attackPattern: 'melee',
        drops: [
            { itemId: 'mat_horror_essence', chance: 12, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_dark_crystal', chance: 6, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 1500,
        gold: { min: 520, max: 840 },
        ai: 'aggressive'
    },
    {
        id: 'mon_blood_countess',
        name: 'Blood Countess',
        nameKo: '블러드카운테스',
        spriteKey: 'monster_blood_countess',
        type: 'demon' as const,
        
        level: 110,
        element: 'dark',
        stats: createCombatStats(110, 2800, 450, 130),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_blood_dress', chance: 8, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_crimson_tear', chance: 5, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 2000,
        gold: { min: 680, max: 1100 },
        ai: 'aggressive'
    },
    {
        id: 'mon_dark_archmage',
        name: 'Dark Archmage',
        nameKo: '대마법사',
        spriteKey: 'monster_dark_archmage',
        type: 'demon' as const,
        
        level: 120,
        element: 'dark',
        stats: createCombatStats(120, 3200, 520, 150),
        attackPattern: 'magic',
        drops: [
            { itemId: 'weapon_archmage_staff', chance: 4, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_ancient_scroll', chance: 10, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 2800,
        gold: { min: 880, max: 1420 },
        ai: 'aggressive'
    },
    {
        id: 'mon_dracula',
        name: 'Dracula',
        nameKo: '드라큘라',
        spriteKey: 'monster_dracula',
        type: 'demon' as const,
        
        level: 130,
        element: 'dark',
        stats: createCombatStats(130, 4000, 620, 180),
        attackPattern: 'magic',
        drops: [
            { itemId: 'mat_vampire_fang_elite', chance: 10, minQuantity: 1, maxQuantity: 1 },
            { itemId: 'mat_blood_gem', chance: 4, minQuantity: 1, maxQuantity: 1 }
        ],
        exp: 3500,
        gold: { min: 1120, max: 1800 },
        ai: 'aggressive'
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
