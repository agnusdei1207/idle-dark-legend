/**
 * ============================================================
 * 스킬 데이터베이스 - 어둠의전설 스타일
 * ============================================================
 */

import type { SkillDefinition } from '../types/game.types';

// ============================================================
// 전사 스킬
// ============================================================

export const WARRIOR_SKILLS: SkillDefinition[] = [
    // 기본 스킬
    {
        id: 'skill_slash', name: 'Slash', nameKo: '베기',
        description: '강력하게 적을 벤다. 150% 데미지.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 0, effectKey: 'effect-slash',
        mpCost: 5, cooldown: 2000, castTime: 0, range: 1,
        basePower: 150, scaling: [{ stat: 'str', ratio: 1.5 }], requiredLevel: 1
    },
    {
        id: 'skill_double_attack', name: 'Double Attack', nameKo: '더블어택',
        description: '연속 2회 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 1, effectKey: 'effect-double',
        mpCost: 8, cooldown: 3000, castTime: 0, range: 1,
        basePower: 100, scaling: [{ stat: 'str', ratio: 1.0 }], requiredLevel: 5
    },
    {
        id: 'skill_triple_attack', name: 'Triple Attack', nameKo: '트리플어택',
        description: '연속 3회 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 2, effectKey: 'effect-triple',
        mpCost: 15, cooldown: 5000, castTime: 0, range: 1,
        basePower: 80, scaling: [{ stat: 'str', ratio: 0.8 }], requiredLevel: 15
    },
    {
        id: 'skill_mega_attack', name: 'Mega Attack', nameKo: '메가어택',
        description: '기본 공격력 4배 증가.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 3, effectKey: 'effect-mega',
        mpCost: 30, cooldown: 8000, castTime: 0, range: 1,
        basePower: 400, scaling: [{ stat: 'str', ratio: 2.0 }], requiredLevel: 30
    },
    {
        id: 'skill_charge', name: 'Charge', nameKo: '돌진',
        description: '전방 5칸 돌진 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 4, effectKey: 'effect-charge',
        mpCost: 20, cooldown: 6000, castTime: 300, range: 5,
        basePower: 250, scaling: [{ stat: 'str', ratio: 1.8 }], requiredLevel: 20
    },
    {
        id: 'skill_focus', name: 'Focus', nameKo: '집중',
        description: '다음 스킬 위력 2배 증가.',
        type: 'buff', target: 'self', element: 'none',
        iconKey: 'skill-icons', iconFrame: 5, effectKey: 'effect-focus',
        mpCost: 10, cooldown: 10000, castTime: 500, range: 0,
        basePower: 0, scaling: [], requiredLevel: 25
    },
    {
        id: 'skill_crasher', name: 'Crasher', nameKo: '크래셔',
        description: '체력 비례 강력한 필살기.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 6, effectKey: 'effect-crasher',
        mpCost: 50, cooldown: 15000, castTime: 1000, range: 1,
        basePower: 500, scaling: [{ stat: 'str', ratio: 3.0 }, { stat: 'con', ratio: 1.0 }], requiredLevel: 40
    },
    {
        id: 'skill_rescue', name: 'Rescue', nameKo: '레스큐',
        description: '몬스터 어그로 끌어오기.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 7, effectKey: 'effect-rescue',
        mpCost: 15, cooldown: 8000, castTime: 0, range: 3,
        basePower: 50, scaling: [], requiredLevel: 12
    }
];

// ============================================================
// 마법사 스킬
// ============================================================

export const MAGE_SKILLS: SkillDefinition[] = [
    // 화염 계열
    {
        id: 'skill_flamera', name: 'Flamera', nameKo: '플라메라',
        description: '화염 속성 공격 마법.',
        type: 'active', target: 'single', element: 'fire',
        iconKey: 'skill-icons', iconFrame: 10, effectKey: 'effect-fire',
        mpCost: 8, cooldown: 1500, castTime: 500, range: 5,
        basePower: 120, scaling: [{ stat: 'int', ratio: 1.8 }], requiredLevel: 1
    },
    {
        id: 'skill_flare', name: 'Flare', nameKo: '플레어',
        description: '플라메라 상위 마법. 강력한 화염.',
        type: 'active', target: 'single', element: 'fire',
        iconKey: 'skill-icons', iconFrame: 11, effectKey: 'effect-flare',
        mpCost: 25, cooldown: 4000, castTime: 800, range: 6,
        basePower: 280, scaling: [{ stat: 'int', ratio: 2.5 }], requiredLevel: 25
    },
    // 빙결 계열
    {
        id: 'skill_teramiera', name: 'Teramiera', nameKo: '테라미에라',
        description: '냉기 속성 공격 마법.',
        type: 'active', target: 'single', element: 'ice',
        iconKey: 'skill-icons', iconFrame: 12, effectKey: 'effect-ice',
        mpCost: 10, cooldown: 2000, castTime: 600, range: 5,
        basePower: 130, scaling: [{ stat: 'int', ratio: 1.9 }], requiredLevel: 5
    },
    {
        id: 'skill_ice_blast', name: 'Ice Blast', nameKo: '아이스블러스트',
        description: '테라미에라 상위 마법.',
        type: 'active', target: 'single', element: 'ice',
        iconKey: 'skill-icons', iconFrame: 13, effectKey: 'effect-ice-blast',
        mpCost: 30, cooldown: 5000, castTime: 1000, range: 6,
        basePower: 300, scaling: [{ stat: 'int', ratio: 2.8 }], requiredLevel: 30
    },
    // 저주 계열
    {
        id: 'skill_pravo', name: 'Pravo', nameKo: '프라보',
        description: '대상에게 저주를 건다.',
        type: 'debuff', target: 'single', element: 'dark',
        iconKey: 'skill-icons', iconFrame: 14, effectKey: 'effect-curse',
        mpCost: 15, cooldown: 6000, castTime: 800, range: 5,
        basePower: 0, scaling: [{ stat: 'int', ratio: 1.0 }], requiredLevel: 15
    },
    {
        id: 'skill_pravera', name: 'Pravera', nameKo: '프라베라',
        description: '화면 전체에 저주 시전.',
        type: 'debuff', target: 'area', element: 'dark', areaRadius: 10,
        iconKey: 'skill-icons', iconFrame: 15, effectKey: 'effect-pravera',
        mpCost: 80, cooldown: 20000, castTime: 2000, range: 0,
        basePower: 0, scaling: [{ stat: 'int', ratio: 1.5 }], requiredLevel: 50
    },
    // 광역 공격
    {
        id: 'skill_ragnarok', name: 'Ragnarok', nameKo: '라그나로크',
        description: '화면 전체 공격 마법.',
        type: 'active', target: 'area', element: 'dark', areaRadius: 10,
        iconKey: 'skill-icons', iconFrame: 16, effectKey: 'effect-ragnarok',
        mpCost: 100, cooldown: 30000, castTime: 3000, range: 0,
        basePower: 400, scaling: [{ stat: 'int', ratio: 3.0 }], requiredLevel: 60
    },
    {
        id: 'skill_meteor', name: 'Meteor', nameKo: '메테오',
        description: '마나 전체 소모 최강 마법.',
        type: 'active', target: 'area', element: 'fire', areaRadius: 8,
        iconKey: 'skill-icons', iconFrame: 17, effectKey: 'effect-meteor',
        mpCost: 999, cooldown: 60000, castTime: 5000, range: 0,
        basePower: 800, scaling: [{ stat: 'int', ratio: 5.0 }], requiredLevel: 80
    },
    // 보조 마법
    {
        id: 'skill_magic_protection', name: 'Magic Protection', nameKo: '매직프로텍션',
        description: '방어력 증가.',
        type: 'buff', target: 'self', element: 'none',
        iconKey: 'skill-icons', iconFrame: 18, effectKey: 'effect-shield',
        mpCost: 20, cooldown: 30000, castTime: 1000, range: 0,
        basePower: 0, scaling: [{ stat: 'int', ratio: 0.5 }], requiredLevel: 10
    }
];

// ============================================================
// 도적 스킬
// ============================================================

export const ROGUE_SKILLS: SkillDefinition[] = [
    {
        id: 'skill_stab', name: 'Stab', nameKo: '찌르기',
        description: '빠른 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 20, effectKey: 'effect-stab',
        mpCost: 5, cooldown: 1000, castTime: 0, range: 1,
        basePower: 130, scaling: [{ stat: 'dex', ratio: 1.5 }], requiredLevel: 1
    },
    {
        id: 'skill_hide', name: 'Hide', nameKo: '하이드',
        description: '은신 상태가 된다.',
        type: 'buff', target: 'self', element: 'none',
        iconKey: 'skill-icons', iconFrame: 21, effectKey: 'effect-hide',
        mpCost: 30, cooldown: 10000, castTime: 0, range: 0,
        basePower: 0, scaling: [], requiredLevel: 10
    },
    {
        id: 'skill_backstep', name: 'Backstep', nameKo: '백스텝',
        description: '뒤에서 강력한 찌르기.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 22, effectKey: 'effect-backstep',
        mpCost: 25, cooldown: 8000, castTime: 0, range: 1,
        basePower: 350, scaling: [{ stat: 'dex', ratio: 2.5 }], requiredLevel: 25
    },
    {
        id: 'skill_assault', name: 'Assault', nameKo: '습격',
        description: '급습 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 23, effectKey: 'effect-assault',
        mpCost: 15, cooldown: 5000, castTime: 0, range: 2,
        basePower: 200, scaling: [{ stat: 'dex', ratio: 1.8 }], requiredLevel: 15
    },
    {
        id: 'skill_amnesia', name: 'Amnesia', nameKo: '아무네지아',
        description: '대상의 인식 초기화.',
        type: 'debuff', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 24, effectKey: 'effect-amnesia',
        mpCost: 20, cooldown: 15000, castTime: 500, range: 3,
        basePower: 0, scaling: [], requiredLevel: 20
    }
];

// ============================================================
// 성직자 스킬
// ============================================================

export const CLERIC_SKILLS: SkillDefinition[] = [
    // 힐 계열
    {
        id: 'skill_kuro', name: 'Kuro', nameKo: '쿠로',
        description: '기본 힐링 마법.',
        type: 'heal', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 30, effectKey: 'effect-heal',
        mpCost: 10, cooldown: 2000, castTime: 500, range: 5,
        basePower: 100, scaling: [{ stat: 'wis', ratio: 1.5 }], requiredLevel: 1
    },
    {
        id: 'skill_kurano', name: 'Kurano', nameKo: '쿠라노',
        description: '중급 힐링 마법.',
        type: 'heal', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 31, effectKey: 'effect-heal',
        mpCost: 25, cooldown: 4000, castTime: 800, range: 5,
        basePower: 250, scaling: [{ stat: 'wis', ratio: 2.0 }], requiredLevel: 15
    },
    {
        id: 'skill_kuranoso', name: 'Kuranoso', nameKo: '쿠라노소',
        description: '고급 힐링 마법.',
        type: 'heal', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 32, effectKey: 'effect-heal-strong',
        mpCost: 50, cooldown: 6000, castTime: 1200, range: 5,
        basePower: 500, scaling: [{ stat: 'wis', ratio: 3.0 }], requiredLevel: 35
    },
    {
        id: 'skill_kurus', name: 'Kurus', nameKo: '쿠러스',
        description: '그룹 힐링 마법.',
        type: 'heal', target: 'area', element: 'light', areaRadius: 5,
        iconKey: 'skill-icons', iconFrame: 33, effectKey: 'effect-group-heal',
        mpCost: 40, cooldown: 8000, castTime: 1500, range: 0,
        basePower: 150, scaling: [{ stat: 'wis', ratio: 1.5 }], requiredLevel: 25
    },
    // 보호 마법
    {
        id: 'skill_immortal', name: 'Immortal', nameKo: '이모탈',
        description: '무적 상태가 된다 (18초).',
        type: 'buff', target: 'self', element: 'light',
        iconKey: 'skill-icons', iconFrame: 34, effectKey: 'effect-immortal',
        mpCost: 80, cooldown: 120000, castTime: 2000, range: 0,
        basePower: 0, scaling: [], requiredLevel: 40
    },
    // 디스펠 계열
    {
        id: 'skill_dispella', name: 'Dispella', nameKo: '디스펠라',
        description: '저주 해제.',
        type: 'heal', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 35, effectKey: 'effect-dispel',
        mpCost: 20, cooldown: 5000, castTime: 500, range: 5,
        basePower: 0, scaling: [], requiredLevel: 20
    },
    {
        id: 'skill_divenomo', name: 'Divenomo', nameKo: '디베노모',
        description: '중독 해제.',
        type: 'heal', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 36, effectKey: 'effect-antidote',
        mpCost: 15, cooldown: 3000, castTime: 500, range: 5,
        basePower: 0, scaling: [], requiredLevel: 10
    },
    // 공격 마법
    {
        id: 'skill_holy_bolt', name: 'Holy Bolt', nameKo: '홀리볼트',
        description: '신성 공격 마법.',
        type: 'active', target: 'single', element: 'light',
        iconKey: 'skill-icons', iconFrame: 37, effectKey: 'effect-holy',
        mpCost: 15, cooldown: 2000, castTime: 600, range: 5,
        basePower: 150, scaling: [{ stat: 'wis', ratio: 1.5 }, { stat: 'int', ratio: 0.5 }], requiredLevel: 5
    }
];

// ============================================================
// 무도가 스킬
// ============================================================

export const MONK_SKILLS: SkillDefinition[] = [
    {
        id: 'skill_jeongkwon', name: 'Jeongkwon', nameKo: '정권',
        description: '기본 맨손 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 40, effectKey: 'effect-punch',
        mpCost: 3, cooldown: 1000, castTime: 0, range: 1,
        basePower: 120, scaling: [{ stat: 'str', ratio: 1.0 }, { stat: 'con', ratio: 0.5 }], requiredLevel: 1
    },
    {
        id: 'skill_dangak', name: 'Dangak', nameKo: '단각',
        description: '발차기 기술.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 41, effectKey: 'effect-kick',
        mpCost: 8, cooldown: 2000, castTime: 0, range: 1,
        basePower: 150, scaling: [{ stat: 'str', ratio: 1.0 }, { stat: 'con', ratio: 1.0 }], requiredLevel: 5
    },
    {
        id: 'skill_yangui', name: 'Yangui Shingwon', nameKo: '양의신권',
        description: '두 번 연속 공격.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 42, effectKey: 'effect-double-punch',
        mpCost: 12, cooldown: 3000, castTime: 0, range: 1,
        basePower: 100, scaling: [{ stat: 'str', ratio: 0.8 }, { stat: 'con', ratio: 0.8 }], requiredLevel: 15
    },
    {
        id: 'skill_ihyeong', name: 'Ihyeonghwanwi', nameKo: '이형환위',
        description: '대상 뒤로 이동.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 43, effectKey: 'effect-teleport',
        mpCost: 15, cooldown: 5000, castTime: 0, range: 3,
        basePower: 80, scaling: [{ stat: 'dex', ratio: 1.0 }], requiredLevel: 20
    },
    {
        id: 'skill_geumgang', name: 'Geumgangbulgoe', nameKo: '금강불괴',
        description: '9초간 무적.',
        type: 'buff', target: 'self', element: 'none',
        iconKey: 'skill-icons', iconFrame: 44, effectKey: 'effect-invincible',
        mpCost: 45, cooldown: 60000, castTime: 0, range: 0,
        basePower: 0, scaling: [], requiredLevel: 30
    },
    {
        id: 'skill_jangpung', name: 'Jangpung', nameKo: '장풍',
        description: '바람 속성 원거리 공격.',
        type: 'active', target: 'single', element: 'wind',
        iconKey: 'skill-icons', iconFrame: 45, effectKey: 'effect-wind',
        mpCost: 20, cooldown: 4000, castTime: 500, range: 5,
        basePower: 180, scaling: [{ stat: 'con', ratio: 1.5 }], requiredLevel: 25
    },
    {
        id: 'skill_dalma', name: 'Dalma Shingong', nameKo: '달마신공',
        description: '체력 60% 소모 필살기.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 46, effectKey: 'effect-dalma',
        mpCost: 30, cooldown: 30000, castTime: 1500, range: 2,
        basePower: 600, scaling: [{ stat: 'con', ratio: 3.0 }], requiredLevel: 50
    },
    {
        id: 'skill_kuranoto', name: 'Kuranoto', nameKo: '쿠라노토',
        description: '자가 힐링.',
        type: 'heal', target: 'self', element: 'light',
        iconKey: 'skill-icons', iconFrame: 47, effectKey: 'effect-self-heal',
        mpCost: 25, cooldown: 10000, castTime: 1000, range: 0,
        basePower: 500, scaling: [{ stat: 'wis', ratio: 1.0 }], requiredLevel: 20
    }
];

// ============================================================
// 통합 및 헬퍼
// ============================================================

export const ALL_SKILLS: SkillDefinition[] = [
    ...WARRIOR_SKILLS,
    ...MAGE_SKILLS,
    ...ROGUE_SKILLS,
    ...CLERIC_SKILLS,
    ...MONK_SKILLS
];

export function getSkillById(id: string): SkillDefinition | undefined {
    return ALL_SKILLS.find(skill => skill.id === id);
}

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
