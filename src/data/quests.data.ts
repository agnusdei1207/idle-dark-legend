/**
 * ============================================================
 * 퀘스트 데이터베이스
 * ============================================================
 */

import type { QuestDefinition } from '../types/game.types';

export const QUESTS: QuestDefinition[] = [
    {
        id: 'quest_first_hunt',
        title: 'First Hunt', titleKo: '첫 번째 사냥',
        description: '마을 장로의 부탁으로 슬라임 3마리를 처치하세요.',
        type: 'main',
        startNpcId: 'npc_village_elder',
        endNpcId: 'npc_village_elder',
        requiredLevel: 1,
        objectives: [
            { type: 'kill', targetId: 'mon_slime', targetName: '슬라임', requiredAmount: 3 }
        ],
        rewards: { exp: 50, gold: 100, items: [{ itemId: 'potion_hp_small', quantity: 5 }] },
        startDialogueId: 'dlg_elder_intro',
        progressDialogueId: 'dlg_quest_progress',
        completeDialogueId: 'dlg_quest_complete'
    },
    {
        id: 'quest_slime_extermination',
        title: 'Slime Extermination', titleKo: '슬라임 토벌',
        description: '슬라임 10마리를 처치하고 슬라임 젤리 5개를 수집하세요.',
        type: 'side',
        startNpcId: 'npc_village_elder',
        endNpcId: 'npc_village_elder',
        requiredLevel: 2,
        prerequisiteQuests: ['quest_first_hunt'],
        objectives: [
            { type: 'kill', targetId: 'mon_slime', targetName: '슬라임', requiredAmount: 10 },
            { type: 'collect', targetId: 'mat_slime_jelly', targetName: '슬라임 젤리', requiredAmount: 5 }
        ],
        rewards: { exp: 150, gold: 300, items: [{ itemId: 'weapon_iron_sword', quantity: 1 }] },
        startDialogueId: 'dlg_slime_quest_start',
        progressDialogueId: 'dlg_slime_quest_progress',
        completeDialogueId: 'dlg_slime_quest_complete'
    },
    {
        id: 'quest_wolf_threat',
        title: 'Wolf Threat', titleKo: '늑대의 위협',
        description: '마을을 위협하는 늑대 5마리를 처치하세요.',
        type: 'main',
        startNpcId: 'npc_guard',
        endNpcId: 'npc_guard',
        requiredLevel: 3,
        prerequisiteQuests: ['quest_first_hunt'],
        objectives: [
            { type: 'kill', targetId: 'mon_wolf', targetName: '늑대', requiredAmount: 5 }
        ],
        rewards: { exp: 200, gold: 250, items: [{ itemId: 'armor_leather_armor', quantity: 1 }] },
        startDialogueId: 'dlg_wolf_quest_start',
        progressDialogueId: 'dlg_wolf_quest_progress',
        completeDialogueId: 'dlg_wolf_quest_complete'
    }
];

export function getQuestById(id: string): QuestDefinition | undefined {
    return QUESTS.find(q => q.id === id);
}

export function getAvailableQuests(level: number, completedQuests: string[]): QuestDefinition[] {
    return QUESTS.filter(q => {
        if (q.requiredLevel > level) return false;
        if (q.prerequisiteQuests) {
            return q.prerequisiteQuests.every(pq => completedQuests.includes(pq));
        }
        return true;
    });
}
