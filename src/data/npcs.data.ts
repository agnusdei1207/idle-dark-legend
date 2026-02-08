/**
 * ============================================================
 * 어둠의전설(Legend of Darkness) NPC 데이터베이스
 * ============================================================
 * 넥슨 어둠의전설 (1998/2005) 기준 NPC 및 대화 데이터
 *
 * [NPC 목록]
 * - 1서클: 노비스 장로, 대장장이, 포션 상인, 마을 경비병
 * - 2서클: 피에트 장로, 스킬 트레이너, 무기 상인
 * - 3서클: 아벨 장로, 뱃사공, 오렌지 상인
 * - 4서클: 뤼케시온 장로, 고급 상인
 * - 5서클: 백원만 (호러케슬 입장 NPC), 마인 장로
 * ============================================================
 */

import type { NPCDefinition, DialogueDefinition } from '../types/game.types';

export const NPCS: NPCDefinition[] = [
    // 1서클 - 노비스 마을
    {
        id: 'npc_novis_elder', name: 'Novice Elder', nameKo: '노비스 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_novis_elder',
        questIds: ['quest_first_hunt']
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
    },

    // 2서클 - 피에트 마을
    {
        id: 'npc_piet_elder', name: 'Piet Elder', nameKo: '피에트 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_piet_elder',
        questIds: ['quest_pote_forest']
    },
    {
        id: 'npc_skill_trainer', name: 'Skill Trainer', nameKo: '스킬 트레이너',
        type: 'trainer', spriteKey: 'npcs', dialogueId: 'dlg_skill_trainer'
    },
    {
        id: 'npc_weapon_shop', name: 'Weapon Shop', nameKo: '무기 상인',
        type: 'merchant', spriteKey: 'npcs', dialogueId: 'dlg_weapon_shop',
        shopId: 'shop_weapons_2'
    },

    // 3서클 - 아벨 마을
    {
        id: 'npc_abel_elder', name: 'Abel Elder', nameKo: '아벨 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_abel_elder',
        questIds: ['quest_abel_dungeon']
    },
    {
        id: 'npc_ferry_npc', name: 'Ferryman', nameKo: '뱃사공',
        type: 'ferry', spriteKey: 'npcs', dialogueId: 'dlg_ferry'
    },
    {
        id: 'npc_orange_shop', name: 'Orange Shop', nameKo: '오렌지 상인',
        type: 'merchant', spriteKey: 'npcs', dialogueId: 'dlg_orange_shop',
        shopId: 'shop_orange'
    },

    // 4서클 - 뤼케시온 마을
    {
        id: 'npc_lucien_elder', name: 'Lucien Elder', nameKo: '뤼케시온 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_lucien_elder',
        questIds: ['quest_lucien_coast']
    },
    {
        id: 'npc_high_level_shop', name: 'High Level Shop', nameKo: '고급 상인',
        type: 'merchant', spriteKey: 'npcs', dialogueId: 'dlg_high_shop',
        shopId: 'shop_high_level'
    },

    // 5서클 - 마인 마을
    {
        id: 'npc_baekwonman', name: 'Baekwonman', nameKo: '백원만',
        type: 'special', spriteKey: 'npcs', dialogueId: 'dlg_baekwonman'
    },
    {
        id: 'npc_mine_elder', name: 'Mine Elder', nameKo: '마인 장로',
        type: 'quest', spriteKey: 'npcs', dialogueId: 'dlg_mine_elder',
        questIds: ['quest_horror_castle']
    }
];

export const DIALOGUES: DialogueDefinition[] = [
    {
        id: 'dlg_novis_elder',
        nodes: [
            {
                id: 'start', speaker: 'Novice Elder', speakerKo: '노비스 장로',
                text: '어서 오게, 젊은 모험가여. 이 작은 마을에 온 것을 환영하네.',
                nextId: 'intro2'
            },
            {
                id: 'intro2', speaker: 'Novice Elder', speakerKo: '노비스 장로',
                text: '요즘 우드랜드 주변에 몬스터들이 늘어나서 걱정이라네. 도움이 필요하지 않겠나?',
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
    },
    {
        id: 'dlg_piet_elder',
        nodes: [
            {
                id: 'start', speaker: 'Piet Elder', speakerKo: '피에트 장로',
                text: '포테의 숲에 고블린들이 늘어나고 있다네. 조심하게.',
                choices: [
                    { text: '처치하겠습니다.', acceptQuest: 'quest_pote_forest' },
                    { text: '알겠습니다.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_skill_trainer',
        nodes: [
            {
                id: 'start', speaker: 'Skill Trainer', speakerKo: '스킬 트레이너',
                text: '스킬을 배우고 싶은가? 2서클부터 더 강력한 스킬을 배울 수 있다네.',
                choices: [{ text: '알겠습니다.' }]
            }
        ]
    },
    {
        id: 'dlg_weapon_shop',
        nodes: [
            {
                id: 'start', speaker: 'Weapon Shop', speakerKo: '무기 상인',
                text: '2서클 무기를 판매하고 있다네.',
                choices: [
                    { text: '상점 열기', openShop: 'shop_weapons_2' },
                    { text: '나중에 올게요.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_abel_elder',
        nodes: [
            {
                id: 'start', speaker: 'Abel Elder', speakerKo: '아벨 장로',
                text: '아벨 던전에 언데드들이 출몰하고 있다. 큰 위험이다.',
                choices: [
                    { text: '처치하겠습니다.', acceptQuest: 'quest_abel_dungeon' },
                    { text: '알겠습니다.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_ferry',
        nodes: [
            {
                id: 'start', speaker: 'Ferryman', speakerKo: '뱃사공',
                text: '아벨 해안던전으로 가려면 서리케리콜이 필요하네.',
                choices: [{ text: '알겠습니다.' }]
            }
        ]
    },
    {
        id: 'dlg_orange_shop',
        nodes: [
            {
                id: 'start', speaker: 'Orange Shop', speakerKo: '오렌지 상인',
                text: '아벨 지역 특산품을 판매하네.',
                choices: [
                    { text: '상점 열기', openShop: 'shop_orange' },
                    { text: '나중에 올게요.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_lucien_elder',
        nodes: [
            {
                id: 'start', speaker: 'Lucien Elder', speakerKo: '뤼케시온 장로',
                text: '뤼케시온 해안에 바다 몬스터들이 출몰하고 있다.',
                choices: [
                    { text: '처치하겠습니다.', acceptQuest: 'quest_lucien_coast' },
                    { text: '알겠습니다.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_high_shop',
        nodes: [
            {
                id: 'start', speaker: 'High Level Shop', speakerKo: '고급 상인',
                text: '4서클 장비를 판매하고 있다네.',
                choices: [
                    { text: '상점 열기', openShop: 'shop_high_level' },
                    { text: '나중에 올게요.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_baekwonman',
        nodes: [
            {
                id: 'start', speaker: 'Baekwonman', speakerKo: '백원만',
                text: '호러케슬... 가장 위험한 곳이지. 정말 가고 싶은가?',
                choices: [
                    { text: '네, 가겠습니다.' },
                    { text: '아직은 준비가 부족합니다.' }
                ]
            }
        ]
    },
    {
        id: 'dlg_mine_elder',
        nodes: [
            {
                id: 'start', speaker: 'Mine Elder', speakerKo: '마인 장로',
                text: '호러케슬의 뱀파이어들... 그들이 우리 마을을 위협하고 있다네.',
                choices: [
                    { text: '처치하겠습니다.', acceptQuest: 'quest_horror_castle' },
                    { text: '알겠습니다.' }
                ]
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
