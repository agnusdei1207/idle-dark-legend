/**
 * ============================================================
 * 스킬 데이터베이스
 * ============================================================
 */

import type { SkillDefinition } from '../types/game.types';

export const WARRIOR_SKILLS: SkillDefinition[] = [
    {
        id: 'skill_slash', name: 'Slash', nameKo: '베기',
        description: '강력하게 적을 벤다. 150% 데미지.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 0, effectKey: 'effect-slash',
        mpCost: 5, cooldown: 2000, castTime: 0, range: 1,
        basePower: 150, scaling: [{ stat: 'str', ratio: 1.5 }], requiredLevel: 1
    },
    {
        id: 'skill_power_strike', name: 'Power Strike', nameKo: '강타',
        description: '힘을 모아 적을 강타. 200% 데미지.',
        type: 'active', target: 'single', element: 'none',
        iconKey: 'skill-icons', iconFrame: 1, effectKey: 'effect-power-strike',
        mpCost: 12, cooldown: 5000, castTime: 500, range: 1,
        basePower: 200, scaling: [{ stat: 'str', ratio: 2.0 }], requiredLevel: 5
    },
    {
        id: 'skill_whirlwind', name: 'Whirlwind', nameKo: '회전베기',
        description: '주변 적 범위 공격. 120% 데미지.',
        type: 'active', target: 'area', element: 'none',
        iconKey: 'skill-icons', iconFrame: 2, areaRadius: 2,
        mpCost: 20, cooldown: 8000, castTime: 300, range: 0,
        basePower: 120, scaling: [{ stat: 'str', ratio: 1.2 }], requiredLevel: 10
    }
];

export const MAGE_SKILLS: SkillDefinition[] = [
    {
        id: 'skill_fire_bolt', name: 'Fire Bolt', nameKo: '화염탄',
        description: '불덩이를 발사한다.',
        type: 'active', target: 'single', element: 'fire',
        iconKey: 'skill-icons', iconFrame: 10, effectKey: 'effect-fire-bolt',
        mpCost: 8, cooldown: 1500, castTime: 500, range: 5,
        basePower: 120, scaling: [{ stat: 'int', ratio: 1.8 }], requiredLevel: 1
    },
    {
        id: 'skill_heal', name: 'Heal', nameKo: '치유',
        description: 'HP를 회복한다.',
        type: 'active', target: 'self', element: 'light',
        iconKey: 'skill-icons', iconFrame: 20, effectKey: 'effect-heal',
        mpCost: 20, cooldown: 5000, castTime: 1000, range: 0,
        basePower: 100, scaling: [{ stat: 'wis', ratio: 2.0 }], requiredLevel: 5
    }
];

export const ALL_SKILLS: SkillDefinition[] = [...WARRIOR_SKILLS, ...MAGE_SKILLS];

export function getSkillById(id: string): SkillDefinition | undefined {
    return ALL_SKILLS.find(skill => skill.id === id);
}
