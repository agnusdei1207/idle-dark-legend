/**
 * ============================================================
 * 어둠의전설(Legend of Darkness) 스킬 데이터베이스
 * ============================================================
 * 넥슨 어둠의전설 (1998/2005) 기준 스킬 시스템
 *
 * [전직 시스템]
 * - 1차 전직: Lv 6 (기본 직업 획득)
 * - 2차 전직: Lv 30
 * - 3차 전직: Lv 60
 *
 * [스킬 레벨]
 * - 기본 스킬: Lv 1부터 사용 가능
 * - 1서클 스킬: Lv 6~
 * - 2서클 스킬: Lv 11~
 * - 3서클 스킬: Lv 41~
 * - 4서클 스킬: Lv 71~
 * - 5서클 스킬: Lv 99~
 *
 * [MP 소모 공식]
 * - 기본: 스킬 레벨 × 2 + 5
 * - 중급: 스킬 레벨 × 3 + 10
 * - 고급: 스킬 레벨 × 5 + 20
 * - 특수: 고정값 또는 비율
 * ============================================================
 */

import type { SkillDefinition } from '../types/game.types';

// ============================================================
// 기본 스킬 (모든 직업 공통, Lv 1)
// ============================================================

export const BASIC_SKILLS: SkillDefinition[] = [
    {
        id: 'skill_basic_attack',
        name: 'Basic Attack',
        nameKo: '기본 공격',
        description: '기본적인 물리 공격',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 0,
        effectKey: 'effect-basic',
        mpCost: 0,
        cooldown: 1000,
        castTime: 0,
        range: 1,
        basePower: 100,
        scaling: [{ stat: 'str', ratio: 1.0 }],
        requiredLevel: 1
    }
];

// ============================================================
// 전사 (Warrior) 스킬
// ============================================================
// 주요 스탯: STR (힘)
// 특징: 근접 전투, 높은 체력, 탱커

export const WARRIOR_SKILLS: SkillDefinition[] = [
    // 1서클 스킬 (Lv 6~)
    {
        id: 'skill_slash',
        name: 'Slash',
        nameKo: '베기',
        description: '적을 강하게 베어 공격한다',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 1,
        effectKey: 'effect-slash',
        mpCost: 8,
        cooldown: 2000,
        castTime: 0,
        range: 1,
        basePower: 130,
        scaling: [{ stat: 'str', ratio: 1.3 }],
        requiredLevel: 6
    },
    {
        id: 'skill_double_attack',
        name: 'Double Attack',
        nameKo: '더블어택',
        description: '연속으로 2회 공격한다',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 2,
        effectKey: 'effect-double',
        mpCost: 12,
        cooldown: 3000,
        castTime: 0,
        range: 1,
        basePower: 90,
        scaling: [{ stat: 'str', ratio: 0.9 }],
        requiredLevel: 12
    },

    // 2서클 스킬 (Lv 11~)
    {
        id: 'skill_charge',
        name: 'Charge',
        nameKo: '돌진',
        description: '전방으로 돌진하며 적을 공격한다 (5칸)',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 3,
        effectKey: 'effect-charge',
        mpCost: 20,
        cooldown: 6000,
        castTime: 300,
        range: 5,
        basePower: 200,
        scaling: [{ stat: 'str', ratio: 1.8 }],
        requiredLevel: 18
    },
    {
        id: 'skill_focus',
        name: 'Focus',
        nameKo: '집중',
        description: '다음 공격의 위력을 2배로 증가시킨다',
        type: 'buff',
        target: 'self',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 4,
        effectKey: 'effect-focus',
        mpCost: 15,
        cooldown: 10000,
        castTime: 500,
        range: 0,
        basePower: 0,
        scaling: [],
        requiredLevel: 22
    },

    // 3서클 스킬 (Lv 41~)
    {
        id: 'skill_triple_attack',
        name: 'Triple Attack',
        nameKo: '트리플어택',
        description: '연속으로 3회 공격한다',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 5,
        effectKey: 'effect-triple',
        mpCost: 25,
        cooldown: 5000,
        castTime: 0,
        range: 1,
        basePower: 85,
        scaling: [{ stat: 'str', ratio: 0.85 }],
        requiredLevel: 45
    },
    {
        id: 'skill_rescue',
        name: 'Rescue',
        nameKo: '레스큐',
        description: '적의 어그로를 끌어당긴다',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 6,
        effectKey: 'effect-rescue',
        mpCost: 30,
        cooldown: 8000,
        castTime: 500,
        range: 3,
        basePower: 50,
        scaling: [{ stat: 'str', ratio: 0.5 }],
        requiredLevel: 50
    },

    // 4서클 스킬 (Lv 71~)
    {
        id: 'skill_mega_attack',
        name: 'Mega Attack',
        nameKo: '메가어택',
        description: '기본 공격력의 4배 데미지',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 7,
        effectKey: 'effect-mega',
        mpCost: 50,
        cooldown: 10000,
        castTime: 0,
        range: 1,
        basePower: 400,
        scaling: [{ stat: 'str', ratio: 3.0 }],
        requiredLevel: 75
    },

    // 5서클 스킬 (Lv 99~)
    {
        id: 'skill_crasher',
        name: 'Crasher',
        nameKo: '크래셔',
        description: '집중 상태에서 시전 시 필살기',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 8,
        effectKey: 'effect-crasher',
        mpCost: 80,
        cooldown: 20000,
        castTime: 1500,
        range: 1,
        basePower: 800,
        scaling: [{ stat: 'str', ratio: 5.0 }, { stat: 'con', ratio: 2.0 }],
        requiredLevel: 99
    }
];

// ============================================================
// 마법사 (Mage) 스킬
// ============================================================
// 주요 스탯: INT (지능)
// 특징: 원거리 마법 공격, 속성 마법

export const MAGE_SKILLS: SkillDefinition[] = [
    // 1서클 스킬 (Lv 6~)
    {
        id: 'skill_flamera',
        name: 'Flamera',
        nameKo: '플라메라',
        description: '화염 속성 기본 마법',
        type: 'active',
        target: 'single',
        element: 'fire',
        iconKey: 'skill-icons',
        iconFrame: 10,
        effectKey: 'effect-fire',
        mpCost: 10,
        cooldown: 1500,
        castTime: 500,
        range: 5,
        basePower: 120,
        scaling: [{ stat: 'int', ratio: 1.5 }],
        requiredLevel: 6
    },
    {
        id: 'skill_teramiera',
        name: 'Teramiera',
        nameKo: '테라미에라',
        description: '빙결 속성 기본 마법',
        type: 'active',
        target: 'single',
        element: 'ice',
        iconKey: 'skill-icons',
        iconFrame: 11,
        effectKey: 'effect-ice',
        mpCost: 12,
        cooldown: 2000,
        castTime: 600,
        range: 5,
        basePower: 130,
        scaling: [{ stat: 'int', ratio: 1.6 }],
        requiredLevel: 10
    },
    {
        id: 'skill_magic_protection',
        name: 'Magic Protection',
        nameKo: '매직프로텍션',
        description: '마법 방어력을 증가시킨다',
        type: 'buff',
        target: 'self',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 12,
        effectKey: 'effect-shield',
        mpCost: 15,
        cooldown: 30000,
        castTime: 1000,
        range: 0,
        basePower: 0,
        scaling: [],
        requiredLevel: 14
    },

    // 2서클 스킬 (Lv 11~)
    {
        id: 'skill_pravo',
        name: 'Pravo',
        nameKo: '프라보',
        description: '단일 대상 저주 (공격력 감소)',
        type: 'debuff',
        target: 'single',
        element: 'dark',
        iconKey: 'skill-icons',
        iconFrame: 13,
        effectKey: 'effect-curse',
        mpCost: 20,
        cooldown: 8000,
        castTime: 800,
        range: 5,
        basePower: 0,
        scaling: [{ stat: 'int', ratio: 1.0 }],
        requiredLevel: 25
    },

    // 3서클 스킬 (Lv 41~)
    {
        id: 'skill_flare',
        name: 'Flare',
        nameKo: '플레어',
        description: '플라메라의 상위 화염 마법',
        type: 'active',
        target: 'single',
        element: 'fire',
        iconKey: 'skill-icons',
        iconFrame: 14,
        effectKey: 'effect-flare',
        mpCost: 35,
        cooldown: 4000,
        castTime: 1000,
        range: 6,
        basePower: 300,
        scaling: [{ stat: 'int', ratio: 2.8 }],
        requiredLevel: 45
    },
    {
        id: 'skill_ice_blast',
        name: 'Ice Blast',
        nameKo: '아이스블러스트',
        description: '테라미에라의 상위 빙결 마법',
        type: 'active',
        target: 'single',
        element: 'ice',
        iconKey: 'skill-icons',
        iconFrame: 15,
        effectKey: 'effect-ice-blast',
        mpCost: 40,
        cooldown: 5000,
        castTime: 1200,
        range: 6,
        basePower: 320,
        scaling: [{ stat: 'int', ratio: 3.0 }],
        requiredLevel: 50
    },

    // 4서클 스킬 (Lv 71~)
    {
        id: 'skill_pravera',
        name: 'Pravera',
        nameKo: '프라베라',
        description: '화면 전체 저주 마법',
        type: 'debuff',
        target: 'area',
        element: 'dark',
        areaRadius: 10,
        iconKey: 'skill-icons',
        iconFrame: 16,
        effectKey: 'effect-pravera',
        mpCost: 100,
        cooldown: 25000,
        castTime: 2000,
        range: 0,
        basePower: 0,
        scaling: [{ stat: 'int', ratio: 2.0 }],
        requiredLevel: 75
    },

    // 5서클 스킬 (Lv 99~)
    {
        id: 'skill_ragnarok',
        name: 'Ragnarok',
        nameKo: '라그나로크',
        description: '화면 전체 파괴 마법',
        type: 'active',
        target: 'area',
        element: 'dark',
        areaRadius: 10,
        iconKey: 'skill-icons',
        iconFrame: 17,
        effectKey: 'effect-ragnarok',
        mpCost: 150,
        cooldown: 40000,
        castTime: 3000,
        range: 0,
        basePower: 500,
        scaling: [{ stat: 'int', ratio: 4.0 }],
        requiredLevel: 99
    },
    {
        id: 'skill_meteor',
        name: 'Meteor',
        nameKo: '메테오',
        description: '최강 화염 마법 (MP 전체 소모)',
        type: 'active',
        target: 'area',
        element: 'fire',
        areaRadius: 8,
        iconKey: 'skill-icons',
        iconFrame: 18,
        effectKey: 'effect-meteor',
        mpCost: 999,
        cooldown: 60000,
        castTime: 5000,
        range: 0,
        basePower: 1000,
        scaling: [{ stat: 'int', ratio: 6.0 }],
        requiredLevel: 110
    }
];

// ============================================================
// 도적 (Rogue) 스킬
// ============================================================
// 주요 스탯: DEX (민첩)
// 특징: 은신, 크리티컬, 기습 공격

export const ROGUE_SKILLS: SkillDefinition[] = [
    // 1서클 스킬 (Lv 6~)
    {
        id: 'skill_stab',
        name: 'Stab',
        nameKo: '슬래쉬',
        description: '단검으로 빠르게 찌른다',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 20,
        effectKey: 'effect-stab',
        mpCost: 6,
        cooldown: 1000,
        castTime: 0,
        range: 1,
        basePower: 125,
        scaling: [{ stat: 'dex', ratio: 1.4 }],
        requiredLevel: 6
    },

    // 2서클 스킬 (Lv 11~)
    {
        id: 'skill_hide',
        name: 'Hide',
        nameKo: '하이드',
        description: '적에게 보이지 않는 은신 상태가 된다',
        type: 'buff',
        target: 'self',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 21,
        effectKey: 'effect-hide',
        mpCost: 25,
        cooldown: 12000,
        castTime: 0,
        range: 0,
        basePower: 0,
        scaling: [],
        requiredLevel: 20
    },
    {
        id: 'skill_assault',
        name: 'Assault',
        nameKo: '습격',
        description: '은신 상태에서 강력한 기습 공격',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 22,
        effectKey: 'effect-assault',
        mpCost: 20,
        cooldown: 6000,
        castTime: 0,
        range: 2,
        basePower: 250,
        scaling: [{ stat: 'dex', ratio: 2.2 }],
        requiredLevel: 28
    },

    // 3서클 스킬 (Lv 41~)
    {
        id: 'skill_backstep',
        name: 'Backstep',
        nameKo: '백스텝',
        description: '뒤로 이동하며 강력한 찌르기',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 23,
        effectKey: 'effect-backstep',
        mpCost: 30,
        cooldown: 8000,
        castTime: 0,
        range: 1,
        basePower: 350,
        scaling: [{ stat: 'dex', ratio: 3.0 }],
        requiredLevel: 45
    },

    // 4서클 스킬 (Lv 71~)
    {
        id: 'skill_amnesia',
        name: 'Amnesia',
        nameKo: '아무네지아',
        description: '대상의 공격 대상에서 제외 (인식 초기화)',
        type: 'debuff',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 24,
        effectKey: 'effect-amnesia',
        mpCost: 40,
        cooldown: 20000,
        castTime: 500,
        range: 3,
        basePower: 0,
        scaling: [],
        requiredLevel: 75
    }
];

// ============================================================
// 성직자 (Cleric) 스킬
// ============================================================
// 주요 스탯: WIS (지혜)
// 특징: 힐러, 버퍼, 디버프 해제

export const CLERIC_SKILLS: SkillDefinition[] = [
    // 1서클 스킬 (Lv 6~)
    {
        id: 'skill_kuro',
        name: 'Kuro',
        nameKo: '쿠로',
        description: '기본 힐링 마법',
        type: 'heal',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 30,
        effectKey: 'effect-heal',
        mpCost: 10,
        cooldown: 2000,
        castTime: 500,
        range: 5,
        basePower: 100,
        scaling: [{ stat: 'wis', ratio: 1.5 }],
        requiredLevel: 6
    },
    {
        id: 'skill_divenomo',
        name: 'Divenomo',
        nameKo: '디베노모',
        description: '중독 상태 해제',
        type: 'heal',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 31,
        effectKey: 'effect-antidote',
        mpCost: 15,
        cooldown: 3000,
        castTime: 500,
        range: 5,
        basePower: 0,
        scaling: [],
        requiredLevel: 10
    },

    // 2서클 스킬 (Lv 11~)
    {
        id: 'skill_dispella',
        name: 'Dispella',
        nameKo: '디스펠라',
        description: '저주 상태 해제',
        type: 'heal',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 32,
        effectKey: 'effect-dispel',
        mpCost: 20,
        cooldown: 5000,
        castTime: 500,
        range: 5,
        basePower: 0,
        scaling: [],
        requiredLevel: 22
    },
    {
        id: 'skill_holy_bolt',
        name: 'Holy Bolt',
        nameKo: '홀리볼트',
        description: '신성 속성 공격 마법',
        type: 'active',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 33,
        effectKey: 'effect-holy',
        mpCost: 18,
        cooldown: 2500,
        castTime: 600,
        range: 5,
        basePower: 160,
        scaling: [{ stat: 'wis', ratio: 1.6 }, { stat: 'int', ratio: 0.4 }],
        requiredLevel: 26
    },

    // 3서클 스킬 (Lv 41~)
    {
        id: 'skill_kurano',
        name: 'Kurano',
        nameKo: '쿠라노',
        description: '중급 힐링 마법',
        type: 'heal',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 34,
        effectKey: 'effect-heal-mid',
        mpCost: 30,
        cooldown: 4000,
        castTime: 800,
        range: 5,
        basePower: 250,
        scaling: [{ stat: 'wis', ratio: 2.2 }],
        requiredLevel: 45
    },

    // 4서클 스킬 (Lv 71~)
    {
        id: 'skill_kurus',
        name: 'Kurus',
        nameKo: '쿠러스',
        description: '파티 전체 힐링',
        type: 'heal',
        target: 'area',
        element: 'light',
        areaRadius: 5,
        iconKey: 'skill-icons',
        iconFrame: 35,
        effectKey: 'effect-group-heal',
        mpCost: 50,
        cooldown: 10000,
        castTime: 1500,
        range: 0,
        basePower: 200,
        scaling: [{ stat: 'wis', ratio: 2.0 }],
        requiredLevel: 75
    },
    {
        id: 'skill_immortal',
        name: 'Immortal',
        nameKo: '이모탈',
        description: '18초간 무적 상태',
        type: 'buff',
        target: 'self',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 36,
        effectKey: 'effect-immortal',
        mpCost: 100,
        cooldown: 180000,
        castTime: 2000,
        range: 0,
        basePower: 0,
        scaling: [],
        requiredLevel: 80
    },

    // 5서클 스킬 (Lv 99~)
    {
        id: 'skill_kuranoso',
        name: 'Kuranoso',
        nameKo: '쿠라노소',
        description: '최상급 힐링 마법',
        type: 'heal',
        target: 'single',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 37,
        effectKey: 'effect-heal-max',
        mpCost: 80,
        cooldown: 8000,
        castTime: 1500,
        range: 5,
        basePower: 600,
        scaling: [{ stat: 'wis', ratio: 4.0 }],
        requiredLevel: 99
    }
];

// ============================================================
// 무도가 (Monk) 스킬
// ============================================================
// 주요 스탯: STR + CON (근력 + 체력)
// 특징: 하이브리드, 전직 불가

export const MONK_SKILLS: SkillDefinition[] = [
    // 1서클 스킬 (Lv 6~)
    {
        id: 'skill_jeongkwon',
        name: 'Jeongkwon',
        nameKo: '정권',
        description: '기본 맨손 공격',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 40,
        effectKey: 'effect-punch',
        mpCost: 5,
        cooldown: 1000,
        castTime: 0,
        range: 1,
        basePower: 115,
        scaling: [{ stat: 'str', ratio: 0.8 }, { stat: 'con', ratio: 0.5 }],
        requiredLevel: 6
    },
    {
        id: 'skill_dangak',
        name: 'Dangak',
        nameKo: '단각',
        description: '강력한 발차기',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 41,
        effectKey: 'effect-kick',
        mpCost: 10,
        cooldown: 2000,
        castTime: 0,
        range: 1,
        basePower: 140,
        scaling: [{ stat: 'str', ratio: 1.0 }, { stat: 'con', ratio: 0.6 }],
        requiredLevel: 12
    },

    // 2서클 스킬 (Lv 11~)
    {
        id: 'skill_yangui',
        name: 'Yangui Shingwon',
        nameKo: '양의신권',
        description: '연속 2회 공격',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 42,
        effectKey: 'effect-double-punch',
        mpCost: 15,
        cooldown: 3000,
        castTime: 0,
        range: 1,
        basePower: 100,
        scaling: [{ stat: 'str', ratio: 0.7 }, { stat: 'con', ratio: 0.7 }],
        requiredLevel: 22
    },
    {
        id: 'skill_kuranoto',
        name: 'Kuranoto',
        nameKo: '쿠라노토',
        description: '기공으로 자가 힐링',
        type: 'heal',
        target: 'self',
        element: 'light',
        iconKey: 'skill-icons',
        iconFrame: 43,
        effectKey: 'effect-self-heal',
        mpCost: 30,
        cooldown: 12000,
        castTime: 1000,
        range: 0,
        basePower: 200,
        scaling: [{ stat: 'wis', ratio: 1.5 }, { stat: 'con', ratio: 1.0 }],
        requiredLevel: 28
    },

    // 3서클 스킬 (Lv 41~)
    {
        id: 'skill_ihyeong',
        name: 'Ihyeonghwanwi',
        nameKo: '이형환위',
        description: '대상 뒤로 순간 이동',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 44,
        effectKey: 'effect-teleport',
        mpCost: 25,
        cooldown: 6000,
        castTime: 0,
        range: 3,
        basePower: 0,
        scaling: [],
        requiredLevel: 45
    },
    {
        id: 'skill_jangpung',
        name: 'Jangpung',
        nameKo: '장풍',
        description: '기운을 모아 원거리 공격',
        type: 'active',
        target: 'single',
        element: 'wind',
        iconKey: 'skill-icons',
        iconFrame: 45,
        effectKey: 'effect-wind',
        mpCost: 25,
        cooldown: 5000,
        castTime: 500,
        range: 5,
        basePower: 200,
        scaling: [{ stat: 'con', ratio: 1.8 }],
        requiredLevel: 50
    },

    // 4서클 스킬 (Lv 71~)
    {
        id: 'skill_geumgang',
        name: 'Geumgangbulgoe',
        nameKo: '금강불괴',
        description: '9초간 무적 상태 (불가사신)',
        type: 'buff',
        target: 'self',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 46,
        effectKey: 'effect-invincible',
        mpCost: 60,
        cooldown: 90000,
        castTime: 500,
        range: 0,
        basePower: 0,
        scaling: [],
        requiredLevel: 75
    },

    // 5서클 스킬 (Lv 99~)
    {
        id: 'skill_dalma',
        name: 'Dalma Shingong',
        nameKo: '달마신공',
        description: '현재 체력의 30%를 소모하여 필살기',
        type: 'active',
        target: 'single',
        element: 'none',
        iconKey: 'skill-icons',
        iconFrame: 47,
        effectKey: 'effect-dalma',
        mpCost: 50,
        cooldown: 30000,
        castTime: 2000,
        range: 2,
        basePower: 700,
        scaling: [{ stat: 'con', ratio: 4.0 }, { stat: 'str', ratio: 2.0 }],
        requiredLevel: 99
    }
];

// ============================================================
// 스킬 획득 레벨 매핑
// ============================================================

export const SKILL_LEVEL_REQUIREMENTS: Record<string, number[]> = {
    // 전사
    'warrior': [6, 12, 18, 22, 45, 50, 75, 99],
    // 마법사
    'mage': [6, 10, 14, 25, 45, 50, 75, 99, 110],
    // 도적
    'rogue': [6, 20, 28, 45, 75],
    // 성직자
    'cleric': [6, 10, 22, 26, 45, 75, 80, 99],
    // 무도가
    'monk': [6, 12, 22, 28, 45, 50, 75, 99]
};

// ============================================================
// 통합 및 헬퍼 함수
// ============================================================

export const ALL_SKILLS: SkillDefinition[] = [
    ...BASIC_SKILLS,
    ...WARRIOR_SKILLS,
    ...MAGE_SKILLS,
    ...ROGUE_SKILLS,
    ...CLERIC_SKILLS,
    ...MONK_SKILLS
];

/**
 * 스킬 ID로 스킬 검색
 */
export function getSkillById(id: string): SkillDefinition | undefined {
    return ALL_SKILLS.find(skill => skill.id === id);
}

/**
 * 직업별 스킬 목록 반환
 */
export function getSkillsByClass(classId: string): SkillDefinition[] {
    switch (classId) {
        case 'warrior': return WARRIOR_SKILLS;
        case 'mage': return MAGE_SKILLS;
        case 'rogue': return ROGUE_SKILLS;
        case 'cleric': return CLERIC_SKILLS;
        case 'monk': return MONK_SKILLS;
        default: return [];
    }
}

/**
 * 직업별 스킬 획득 가능 레벨 반환
 */
export function getSkillLevels(classId: string): number[] {
    return SKILL_LEVEL_REQUIREMENTS[classId] || [];
}

/**
 * 특정 레벨에서 배울 수 있는 스킬 목록 반환
 */
export function getSkillsAtLevel(classId: string, level: number): SkillDefinition[] {
    const classSkills = getSkillsByClass(classId);
    return classSkills.filter(skill => skill.requiredLevel <= level);
}
