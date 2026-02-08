/**
 * ============================================================
 * NPC 및 대화 데이터베이스
 * ============================================================
 */

import type { NPCDefinition, DialogueDefinition } from '../types/game.types';

export const NPCS: NPCDefinition[] = [
    {
        id: 'npc_village_elder', name: 'Village Elder', nameKo: '마을 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_elder_intro',
        questIds: ['quest_first_hunt', 'quest_slime_extermination']
    },
    {
        id: 'npc_blacksmith', name: 'Blacksmith', nameKo: '대장장이',
        type: 'merchant', spriteKey: 'npcs', dialogueId: 'dlg_blacksmith',
        shopId: 'shop_weapons'
    },
    {
        id: 'npc_potion_seller', name: 'Potion Seller', nameKo: '포션 상인',
        type: 'merchant', spriteKey: 'npcs', dialogueId: 'dlg_potion_seller',
        shopId: 'shop_potions'
    },
    {
        id: 'npc_guard', name: 'Town Guard', nameKo: '마을 경비병',
        type: 'guard', spriteKey: 'npcs', dialogueId: 'dlg_guard'
    }
];

export const DIALOGUES: DialogueDefinition[] = [
    {
        id: 'dlg_elder_intro',
        nodes: [
            {
                id: 'start', speaker: 'Village Elder', speakerKo: '마을 장로',
                text: '어서 오게, 젊은 모험가여. 이 작은 마을에 온 것을 환영하네.',
                nextId: 'intro2'
            },
            {
                id: 'intro2', speaker: 'Village Elder', speakerKo: '마을 장로',
                text: '요즘 마을 주변에 몬스터들이 늘어나서 걱정이라네. 도움이 필요하지 않겠나?',
                choices: [
                    { text: '네, 도와드리겠습니다.', acceptQuest: 'quest_first_hunt' },
                    { text: '잠시 후에 다시 오겠습니다.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_blacksmith',
        nodes: [
            {
                id: 'start', speaker: 'Blacksmith', speakerKo: '대장장이',
                text: '좋은 무기와 방어구가 필요한가? 여기서 구할 수 있네.',
                choices: [
                    { text: '상점 열기', openShop: 'shop_weapons' },
                    { text: '나중에 올게요.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_potion_seller',
        nodes: [
            {
                id: 'start', speaker: 'Potion Seller', speakerKo: '포션 상인',
                text: '회복 포션이 필요하신가요? 모험에 꼭 필요하지요!',
                choices: [
                    { text: '상점 열기', openShop: 'shop_potions' },
                    { text: '나중에 올게요.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_guard',
        nodes: [
            {
                id: 'start', speaker: 'Town Guard', speakerKo: '마을 경비병',
                text: '마을 밖은 위험하니 조심하게. 레벨이 낮으면 멀리 가지 마시게.',
                choices: [{ text: '알겠습니다.' }]
            }
        ]
    }
];

export function getNpcById(id: string): NPCDefinition | undefined {
    return NPCS.find(n => n.id === id);
}

export function getDialogueById(id: string): DialogueDefinition | undefined {
    return DIALOGUES.find(d => d.id === id);
}
