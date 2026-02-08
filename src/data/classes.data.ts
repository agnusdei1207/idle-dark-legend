/**
 * ============================================================
 * 어둠의전설(Legend of Darkness) 직업 시스템
 * ============================================================
 * 넥슨 어둠의전설 (1998/2005) 기준 직업 데이터
 *
 * [전직 시스템]
 * - 1차 전직: Lv 6 (기본 직업 획득)
 *   - 전사, 마법사, 도적, 성직자 중 선택
 *   - 무도가: 전직 불가 (처음부터 무도가로 시작 가능)
 * - 2차 전직: Lv 30
 * - 3차 전직: Lv 60
 *
 * [5대 직업 특징]
 * 1. 전사 (Warrior): STR 위주, 근접 전투, 탱커
 * 2. 마법사 (Mage): INT 위주, 원거리 마법, 딜러
 * 3. 도적 (Rogue): DEX 위주, 은신, 크리티컬
 * 4. 성직자 (Cleric): WIS 위주, 힐러, 버퍼
 * 5. 무도가 (Monk): STR+CON 위주, 하이브리드, 전직 불가
 *
 * [스탯별 영향]
 * - STR (힘): 물리 공격력, 전사/무도가 주력
 * - DEX (민첩): 명중률, 회피율, 도적 주력
 * - CON (체력): Max HP, 방어력, 무도가 주력
 * - INT (지능): 마법 공격력, Max MP, 마법사 주력
 * - WIS (지혜): 힐량, MP 회복, 성직자 주력
 * - LUK (행운): 크리티컬 확률, 드롭률
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
    secondaryStat?: keyof BaseStats;
    skillIds: string[];  // 해당 직업 스킬 ID 목록
    weaponTypes: string[];
    armorTypes: string[];
    spriteKey: string;
}

/** 전직 정보 */
export interface ClassChange {
    level: number;
    name: string;
    nameKo: string;
    description: string;
    bonusSkills: string[];  // 전직 시 해금 스킬
}

// ============================================================
// 기본 직업 정의 (어둠의전설 5대 직업)
// ============================================================

export const CLASSES: ClassDefinition[] = [
    // 전사 - 근접 전투, 탱커
    {
        id: 'warrior',
        name: 'Warrior',
        nameKo: '전사',
        description: '강인한 체력과 근접 전투에 특화된 직업. 파티의 방패.',
        baseStats: { str: 10, dex: 5, con: 10, int: 2, wis: 3, luk: 5 },
        statGrowth: { str: 2.5, dex: 0.5, con: 2.0, int: 0, wis: 0.5, luk: 0.5 },
        primaryStat: 'str',
        secondaryStat: 'con',
        skillIds: [
            'skill_slash', 'skill_double_attack', 'skill_charge', 'skill_focus',
            'skill_triple_attack', 'skill_rescue', 'skill_mega_attack', 'skill_crasher'
        ],
        weaponTypes: ['sword', 'blade', 'axe', 'spear'],
        armorTypes: ['heavy', 'medium', 'light'],
        spriteKey: 'class_warrior'
    },
    // 마법사 - 원거리 마법, 딜러
    {
        id: 'mage',
        name: 'Mage',
        nameKo: '마법사',
        description: '강력한 속성 마법을 다루는 직업. 광역 공격 specialist.',
        baseStats: { str: 2, dex: 3, con: 5, int: 12, wis: 10, luk: 3 },
        statGrowth: { str: 0, dex: 0.5, con: 0.5, int: 3.0, wis: 2.0, luk: 0 },
        primaryStat: 'int',
        secondaryStat: 'wis',
        skillIds: [
            'skill_flamera', 'skill_teramiera', 'skill_magic_protection', 'skill_pravo',
            'skill_flare', 'skill_ice_blast', 'skill_pravera',
            'skill_ragnarok', 'skill_meteor'
        ],
        weaponTypes: ['staff', 'wand', 'orb'],
        armorTypes: ['cloth', 'light'],
        spriteKey: 'class_mage'
    },
    // 도적 - 은신, 크리티컬
    {
        id: 'rogue',
        name: 'Rogue',
        nameKo: '도적',
        description: '은신과 치명타에 특화된 암살자. 높은 순간 딜.',
        baseStats: { str: 5, dex: 12, con: 5, int: 2, wis: 2, luk: 10 },
        statGrowth: { str: 1.0, dex: 3.0, con: 0.5, int: 0, wis: 0, luk: 1.5 },
        primaryStat: 'dex',
        secondaryStat: 'luk',
        skillIds: [
            'skill_stab', 'skill_hide', 'skill_assault',
            'skill_backstep', 'skill_amnesia'
        ],
        weaponTypes: ['dagger', 'claw', 'short_sword'],
        armorTypes: ['light'],
        spriteKey: 'class_rogue'
    },
    // 성직자 - 힐러, 버퍼
    {
        id: 'cleric',
        name: 'Cleric',
        nameKo: '성직자',
        description: '신성한 힘으로 치유와 보조를 담당. 파티의 생명선.',
        baseStats: { str: 3, dex: 3, con: 6, int: 6, wis: 12, luk: 5 },
        statGrowth: { str: 0, dex: 0.5, con: 1.0, int: 1.0, wis: 3.0, luk: 0.5 },
        primaryStat: 'wis',
        secondaryStat: 'int',
        skillIds: [
            'skill_kuro', 'skill_divenomo', 'skill_dispella', 'skill_holy_bolt',
            'skill_kurano', 'skill_kurus', 'skill_immortal', 'skill_kuranoso'
        ],
        weaponTypes: ['mace', 'staff', 'hammer', 'shield'],
        armorTypes: ['cloth', 'medium', 'light'],
        spriteKey: 'class_cleric'
    },
    // 무도가 - 하이브리드, 전직 불가
    {
        id: 'monk',
        name: 'Monk',
        nameKo: '무도가',
        description: '맨손 격투와 기공술에 특화된 직업. 전직 불가.',
        baseStats: { str: 10, dex: 6, con: 10, int: 2, wis: 5, luk: 5 },
        statGrowth: { str: 2.0, dex: 1.0, con: 2.0, int: 0, wis: 0.5, luk: 0.5 },
        primaryStat: 'str',
        secondaryStat: 'con',
        skillIds: [
            'skill_jeongkwon', 'skill_dangak', 'skill_yangui', 'skill_kuranoto',
            'skill_ihyeong', 'skill_jangpung', 'skill_geumgang', 'skill_dalma'
        ],
        weaponTypes: ['fist', 'knuckle', 'claw'],
        armorTypes: ['light', 'cloth'],
        spriteKey: 'class_monk'
    }
];

// ============================================================
// 전직 시스템 (서클별 전직 정보)
// ============================================================

/**
 * 직업별 전직 정보
 * - 1차 전직: Lv 6 (노비스 → 기본 직업)
 * - 2차 전직: Lv 30
 * - 3차 전직: Lv 60
 */
export const CLASS_CHANGES: Record<ClassType, ClassChange[]> = {
    warrior: [
        { level: 6, name: 'Warrior', nameKo: '전사', description: '1차 전직', bonusSkills: ['skill_slash'] },
        { level: 30, name: 'Gladiator', nameKo: '검투사', description: '2차 전직', bonusSkills: ['skill_charge', 'skill_focus'] },
        { level: 60, name: 'Champion', nameKo: '챔피언', description: '3차 전직', bonusSkills: ['skill_mega_attack', 'skill_rescue'] },
        { level: 99, name: 'Warlord', nameKo: '워로드', description: '4서클 최상위', bonusSkills: ['skill_crasher'] }
    ],
    mage: [
        { level: 6, name: 'Mage', nameKo: '마법사', description: '1차 전직', bonusSkills: ['skill_flamera', 'skill_teramiera'] },
        { level: 30, name: 'Wizard', nameKo: '위자드', description: '2차 전직', bonusSkills: ['skill_magic_protection', 'skill_pravo'] },
        { level: 60, name: 'Archmage', nameKo: '대마법사', description: '3차 전직', bonusSkills: ['skill_flare', 'skill_ice_blast'] },
        { level: 99, name: 'Sorcerer', nameKo: '소서러', description: '4서클 최상위', bonusSkills: ['skill_ragnarok', 'skill_pravera'] },
        { level: 110, name: 'Grand Mage', nameKo: '그랜드메이지', description: '5서클 최상위', bonusSkills: ['skill_meteor'] }
    ],
    rogue: [
        { level: 6, name: 'Rogue', nameKo: '도적', description: '1차 전직', bonusSkills: ['skill_stab'] },
        { level: 30, name: 'Assassin', nameKo: '암살자', description: '2차 전직', bonusSkills: ['skill_hide', 'skill_assault'] },
        { level: 60, name: 'Shadow Master', nameKo: '섀도우마스터', description: '3차 전직', bonusSkills: ['skill_backstep'] },
        { level: 99, name: 'Ninja', nameKo: '닌자', description: '4서클 최상위', bonusSkills: ['skill_amnesia'] }
    ],
    cleric: [
        { level: 6, name: 'Cleric', nameKo: '성직자', description: '1차 전직', bonusSkills: ['skill_kuro', 'skill_divenomo'] },
        { level: 30, name: 'Priest', nameKo: '사제', description: '2차 전직', bonusSkills: ['skill_dispella', 'skill_holy_bolt'] },
        { level: 60, name: 'Bishop', nameKo: '비숍', description: '3차 전직', bonusSkills: ['skill_kurano', 'skill_kurus'] },
        { level: 99, name: 'Saint', nameKo: '성자', description: '4서클 최상위', bonusSkills: ['skill_immortal', 'skill_kuranoso'] }
    ],
    monk: [
        { level: 1, name: 'Monk', nameKo: '무도가', description: '전직 불가', bonusSkills: ['skill_jeongkwon'] },
        { level: 30, name: 'Master Monk', nameKo: '마스터몽크', description: '2서클 습득', bonusSkills: ['skill_yangui', 'skill_kuranoto'] },
        { level: 60, name: 'Grand Master', nameKo: '그랜드마스터', description: '3서클 습득', bonusSkills: ['skill_ihyeong', 'skill_jangpung'] },
        { level: 99, name: 'Enlightened One', nameKo: '각성자', description: '4서클 최상위', bonusSkills: ['skill_geumgang', 'skill_dalma'] }
    ]
};

// ============================================================
// 서클 정보
// ============================================================

export const CIRCLE_INFO = [
    { level: 1, name: 'Novice', nameKo: '노비스', description: '초심자 마을' },
    { level: 6, name: '1 Circle', nameKo: '1서클', description: '1차 전직 가능 (우드랜드)' },
    { level: 11, name: '2 Circle', nameKo: '2서클', description: '피에트 마을, 포테의 숲' },
    { level: 41, name: '3 Circle', nameKo: '3서클', description: '아벨 마을, 아벨 던전' },
    { level: 71, name: '4 Circle', nameKo: '4서클', description: '뤼케시온 마을, 뤼케시온 해안' },
    { level: 99, name: '5 Circle', nameKo: '5서클', description: '마인 마을, 호러케슬' }
];

// ============================================================
// 헬퍼 함수
// ============================================================

/**
 * 직업 ID로 직업 정보 반환
 */
export function getClassById(id: ClassType): ClassDefinition | undefined {
    return CLASSES.find(c => c.id === id);
}

/**
 * 해당 레벨에서 가능한 전직 정보 반환
 */
export function getClassChangeAt(classId: ClassType, level: number): ClassChange | null {
    const changes = CLASS_CHANGES[classId];
    if (!changes) return null;

    // 해당 레벨 이하의 전직 중 가장 높은 등급 반환
    for (let i = changes.length - 1; i >= 0; i--) {
        if (level >= changes[i].level) {
            return changes[i];
        }
    }
    return null;
}

/**
 * 다음 전직 가능 레벨 반환
 */
export function getNextClassLevel(classId: ClassType, currentLevel: number): number | null {
    const changes = CLASS_CHANGES[classId];
    if (!changes) return null;

    for (const change of changes) {
        if (change.level > currentLevel) {
            return change.level;
        }
    }
    return null; // 더 이상 전직 없음
}

/**
 * 해당 레벨에서 배울 수 있는 스킬 목록 반환
 */
export function getAvailableSkills(classId: ClassType, level: number): string[] {
    const classData = getClassById(classId);
    if (!classData) return [];

    // 직업의 모든 스킬 중 레벨 요구사항 충족하는 것만 반환
    // 스킬 데이터에서 requiredLevel 확인 필요
    return classData.skillIds.filter(skillId => {
        // 실제로는 skills.data.ts의 requiredLevel 확인 필요
        // 여기서는 간단히 레벨 체크만
        return true;
    });
}

/**
 * 레벨에 따른 서클 정보 반환
 */
export function getCircleAtLevel(level: number): typeof CIRCLE_INFO[0] {
    for (let i = CIRCLE_INFO.length - 1; i >= 0; i--) {
        if (level >= CIRCLE_INFO[i].level) {
            return CIRCLE_INFO[i];
        }
    }
    return CIRCLE_INFO[0];
}

/**
 * 직업 선택 가능 여부 (Lv 6 이상)
 */
export function canSelectClass(level: number): boolean {
    return level >= 6;
}

/**
 * 무도가 시작 가능 여부
 */
export function canStartAsMonk(): boolean {
    return true; // 어둠의전설에서는 처음부터 무도가 선택 가능
}
