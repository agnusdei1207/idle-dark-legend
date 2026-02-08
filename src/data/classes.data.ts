/**
 * ============================================================
 * 직업(클래스) 시스템 데이터
 * ============================================================
 * 
 * 어둠의전설 스타일 5대 직업:
 * - 전사 (Warrior) - 근접, 고체력, 탱커
 * - 마법사 (Mage) - 원거리, 속성 마법, 딜러
 * - 도적 (Rogue) - 근접, 크리티컬, 암살
 * - 성직자 (Cleric) - 힐러, 버퍼
 * - 무도가 (Monk) - 하이브리드, 전직 불가
 * ============================================================
 */

import type { BaseStats } from '../types/game.types';

/** 직업 타입 */
export type ClassType = 'warrior' | 'mage' | 'rogue' | 'cleric' | 'monk';

/** 직업 정의 */
export interface ClassDefinition {
    id: ClassType;
    name: string;
    nameKo: string;
    description: string;
    baseStats: BaseStats;
    statGrowth: BaseStats;  // 레벨업 시 스탯 증가량
    primaryStat: keyof BaseStats;
    skillTreeIds: string[];
    weaponTypes: string[];  // 장비 가능 무기 타입
    armorTypes: string[];   // 장비 가능 방어구 타입
    spriteKey: string;
}

/** 전직 정보 */
export interface AdvancedClass {
    id: string;
    name: string;
    nameKo: string;
    baseClass: ClassType;
    requiredLevel: number;
    description: string;
    bonusStats: Partial<BaseStats>;
    unlockSkills: string[];
}

/** 직업별 스킬 트리 노드 */
export interface SkillTreeNode {
    skillId: string;
    tier: number;         // 1-5 티어
    position: number;     // 같은 티어 내 위치 (0-2)
    requiredPoints: number;  // 이 스킬 해금에 필요한 총 포인트
    maxLevel: number;     // 스킬 최대 레벨
    prerequisites: string[];  // 선행 스킬
}

export interface SkillTree {
    id: string;
    name: string;
    nameKo: string;
    classId: ClassType;
    nodes: SkillTreeNode[];
}

// ============================================================
// 기본 직업 정의
// ============================================================

export const CLASSES: ClassDefinition[] = [
    {
        id: 'warrior',
        name: 'Warrior',
        nameKo: '전사',
        description: '강인한 체력과 근접 전투에 특화된 직업. 파티의 방패 역할.',
        baseStats: { str: 8, dex: 4, con: 8, int: 2, wis: 3, luk: 5 },
        statGrowth: { str: 3, dex: 1, con: 3, int: 0, wis: 1, luk: 1 },
        primaryStat: 'str',
        skillTreeIds: ['tree_warrior_combat', 'tree_warrior_defense'],
        weaponTypes: ['sword', 'axe', 'mace', 'spear'],
        armorTypes: ['heavy', 'medium'],
        spriteKey: 'class_warrior'
    },
    {
        id: 'mage',
        name: 'Mage',
        nameKo: '마법사',
        description: '강력한 속성 마법을 다루는 직업. 광역 딜러.',
        baseStats: { str: 2, dex: 3, con: 4, int: 10, wis: 8, luk: 3 },
        statGrowth: { str: 0, dex: 1, con: 1, int: 4, wis: 3, luk: 0 },
        primaryStat: 'int',
        skillTreeIds: ['tree_mage_fire', 'tree_mage_ice', 'tree_mage_dark'],
        weaponTypes: ['staff', 'wand', 'orb'],
        armorTypes: ['cloth', 'light'],
        spriteKey: 'class_mage'
    },
    {
        id: 'rogue',
        name: 'Rogue',
        nameKo: '도적',
        description: '은신과 치명타에 특화된 암살자. 높은 순간 딜.',
        baseStats: { str: 5, dex: 8, con: 4, int: 3, wis: 2, luk: 8 },
        statGrowth: { str: 2, dex: 3, con: 1, int: 0, wis: 0, luk: 3 },
        primaryStat: 'dex',
        skillTreeIds: ['tree_rogue_assassination', 'tree_rogue_shadow'],
        weaponTypes: ['dagger', 'claw', 'short_sword'],
        armorTypes: ['light'],
        spriteKey: 'class_rogue'
    },
    {
        id: 'cleric',
        name: 'Cleric',
        nameKo: '성직자',
        description: '신성한 힘으로 치유와 보조를 담당. 파티의 생명선.',
        baseStats: { str: 3, dex: 3, con: 5, int: 6, wis: 10, luk: 3 },
        statGrowth: { str: 0, dex: 1, con: 2, int: 2, wis: 4, luk: 0 },
        primaryStat: 'wis',
        skillTreeIds: ['tree_cleric_heal', 'tree_cleric_holy'],
        weaponTypes: ['mace', 'staff', 'hammer'],
        armorTypes: ['cloth', 'medium'],
        spriteKey: 'class_cleric'
    },
    {
        id: 'monk',
        name: 'Monk',
        nameKo: '무도가',
        description: '맨손 격투에 특화된 하이브리드 직업. 전직 불가.',
        baseStats: { str: 7, dex: 5, con: 7, int: 3, wis: 4, luk: 4 },
        statGrowth: { str: 2, dex: 2, con: 3, int: 0, wis: 1, luk: 1 },
        primaryStat: 'con',
        skillTreeIds: ['tree_monk_fist', 'tree_monk_spirit'],
        weaponTypes: ['fist', 'knuckle'],
        armorTypes: ['light', 'cloth'],
        spriteKey: 'class_monk'
    }
];

// ============================================================
// 전직 시스템
// ============================================================

export const ADVANCED_CLASSES: AdvancedClass[] = [
    // 전사 전직
    {
        id: 'knight', name: 'Knight', nameKo: '기사',
        baseClass: 'warrior', requiredLevel: 30,
        description: '정의를 수호하는 성스러운 기사.',
        bonusStats: { str: 5, con: 10 },
        unlockSkills: ['skill_holy_strike', 'skill_divine_shield']
    },
    {
        id: 'berserker', name: 'Berserker', nameKo: '광전사',
        baseClass: 'warrior', requiredLevel: 30,
        description: '분노로 전투력을 극대화하는 광전사.',
        bonusStats: { str: 15, dex: 3 },
        unlockSkills: ['skill_berserk', 'skill_blood_frenzy']
    },
    // 마법사 전직
    {
        id: 'archmage', name: 'Archmage', nameKo: '대마법사',
        baseClass: 'mage', requiredLevel: 30,
        description: '모든 속성을 마스터한 대마법사.',
        bonusStats: { int: 15, wis: 5 },
        unlockSkills: ['skill_meteor', 'skill_absolute_zero']
    },
    {
        id: 'warlock', name: 'Warlock', nameKo: '흑마법사',
        baseClass: 'mage', requiredLevel: 30,
        description: '어둠의 힘을 다루는 흑마법사.',
        bonusStats: { int: 10, luk: 8 },
        unlockSkills: ['skill_dark_pact', 'skill_soul_drain']
    },
    // 도적 전직
    {
        id: 'assassin', name: 'Assassin', nameKo: '암살자',
        baseClass: 'rogue', requiredLevel: 30,
        description: '어둠 속에서 치명적인 일격을 가하는 암살자.',
        bonusStats: { dex: 8, luk: 12 },
        unlockSkills: ['skill_death_mark', 'skill_vanish']
    },
    {
        id: 'shadow_dancer', name: 'Shadow Dancer', nameKo: '그림자 무희',
        baseClass: 'rogue', requiredLevel: 30,
        description: '그림자를 자유자재로 다루는 암흑의 무희.',
        bonusStats: { dex: 12, luk: 8 },
        unlockSkills: ['skill_shadow_step', 'skill_blade_dance']
    },
    // 성직자 전직
    {
        id: 'bishop', name: 'Bishop', nameKo: '비숍',
        baseClass: 'cleric', requiredLevel: 30,
        description: '신의 축복을 내리는 고위 성직자.',
        bonusStats: { wis: 15, int: 5 },
        unlockSkills: ['skill_resurrection', 'skill_mass_heal']
    },
    {
        id: 'paladin', name: 'Paladin', nameKo: '팔라딘',
        baseClass: 'cleric', requiredLevel: 30,
        description: '검과 신앙을 함께 다루는 성기사.',
        bonusStats: { str: 10, wis: 8, con: 5 },
        unlockSkills: ['skill_holy_sword', 'skill_divine_aura']
    }
    // 무도가는 전직 불가
];

// ============================================================
// 스킬 트리
// ============================================================

export const SKILL_TREES: SkillTree[] = [
    // 전사 - 전투 트리
    {
        id: 'tree_warrior_combat',
        name: 'Combat Mastery',
        nameKo: '전투 숙련',
        classId: 'warrior',
        nodes: [
            { skillId: 'skill_slash', tier: 1, position: 1, requiredPoints: 0, maxLevel: 5, prerequisites: [] },
            { skillId: 'skill_power_strike', tier: 2, position: 0, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_slash'] },
            { skillId: 'skill_whirlwind', tier: 2, position: 2, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_slash'] },
            { skillId: 'skill_charge', tier: 3, position: 1, requiredPoints: 10, maxLevel: 5, prerequisites: ['skill_power_strike', 'skill_whirlwind'] },
            { skillId: 'skill_fury', tier: 4, position: 1, requiredPoints: 20, maxLevel: 3, prerequisites: ['skill_charge'] },
            { skillId: 'skill_earthquake', tier: 5, position: 1, requiredPoints: 30, maxLevel: 1, prerequisites: ['skill_fury'] }
        ]
    },
    // 전사 - 방어 트리
    {
        id: 'tree_warrior_defense',
        name: 'Defense Mastery',
        nameKo: '방어 숙련',
        classId: 'warrior',
        nodes: [
            { skillId: 'skill_block', tier: 1, position: 1, requiredPoints: 0, maxLevel: 5, prerequisites: [] },
            { skillId: 'skill_iron_skin', tier: 2, position: 0, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_block'] },
            { skillId: 'skill_taunt', tier: 2, position: 2, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_block'] },
            { skillId: 'skill_shield_wall', tier: 3, position: 1, requiredPoints: 10, maxLevel: 5, prerequisites: ['skill_iron_skin'] },
            { skillId: 'skill_last_stand', tier: 4, position: 1, requiredPoints: 20, maxLevel: 3, prerequisites: ['skill_shield_wall'] }
        ]
    },
    // 마법사 - 화염 트리
    {
        id: 'tree_mage_fire',
        name: 'Fire Magic',
        nameKo: '화염 마법',
        classId: 'mage',
        nodes: [
            { skillId: 'skill_fireball', tier: 1, position: 1, requiredPoints: 0, maxLevel: 5, prerequisites: [] },
            { skillId: 'skill_flame_wave', tier: 2, position: 0, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_fireball'] },
            { skillId: 'skill_fire_shield', tier: 2, position: 2, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_fireball'] },
            { skillId: 'skill_inferno', tier: 3, position: 1, requiredPoints: 10, maxLevel: 5, prerequisites: ['skill_flame_wave'] },
            { skillId: 'skill_meteor', tier: 5, position: 1, requiredPoints: 30, maxLevel: 1, prerequisites: ['skill_inferno'] }
        ]
    },
    // 마법사 - 빙결 트리
    {
        id: 'tree_mage_ice',
        name: 'Ice Magic',
        nameKo: '빙결 마법',
        classId: 'mage',
        nodes: [
            { skillId: 'skill_ice_bolt', tier: 1, position: 1, requiredPoints: 0, maxLevel: 5, prerequisites: [] },
            { skillId: 'skill_frost_nova', tier: 2, position: 0, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_ice_bolt'] },
            { skillId: 'skill_ice_armor', tier: 2, position: 2, requiredPoints: 5, maxLevel: 5, prerequisites: ['skill_ice_bolt'] },
            { skillId: 'skill_blizzard', tier: 3, position: 1, requiredPoints: 10, maxLevel: 5, prerequisites: ['skill_frost_nova'] },
            { skillId: 'skill_absolute_zero', tier: 5, position: 1, requiredPoints: 30, maxLevel: 1, prerequisites: ['skill_blizzard'] }
        ]
    }
];

// ============================================================
// 헬퍼 함수
// ============================================================

export function getClassById(id: ClassType): ClassDefinition | undefined {
    return CLASSES.find(c => c.id === id);
}

export function getAdvancedClassesFor(baseClass: ClassType): AdvancedClass[] {
    return ADVANCED_CLASSES.filter(ac => ac.baseClass === baseClass);
}

export function getSkillTreesFor(classId: ClassType): SkillTree[] {
    return SKILL_TREES.filter(st => st.classId === classId);
}

export function canAdvanceClass(level: number, baseClass: ClassType, targetAdvanced: string): boolean {
    const advanced = ADVANCED_CLASSES.find(ac => ac.id === targetAdvanced);
    if (!advanced) return false;
    return advanced.baseClass === baseClass && level >= advanced.requiredLevel;
}
