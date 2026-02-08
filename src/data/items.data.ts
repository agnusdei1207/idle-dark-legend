/**
 * ============================================================
 * 아이템 데이터베이스
 * ============================================================
 * 
 * 게임에서 사용하는 모든 아이템을 정의합니다.
 * 에셋(spriteKey)은 나중에 실제 이미지로 교체하세요.
 * 
 * [에셋 교체 방법]
 * 1. public/assets/items/ 폴더에 아이템 스프라이트 추가
 * 2. BootScene에서 로드
 * 3. spriteKey를 실제 키로 변경
 * ============================================================
 */

import type {
    EquipmentDefinition,
    ConsumableDefinition,
    ItemDefinition
} from '../types/game.types';

// ============================================================
// 무기
// ============================================================

export const WEAPONS: EquipmentDefinition[] = [
    {
        id: 'weapon_wooden_sword',
        name: 'Wooden Sword',
        nameKo: '나무 검',
        description: '초보 모험가용 나무 검',
        type: 'weapon',
        slot: 'weapon',
        rarity: 'common',
        spriteKey: 'items',  // 에셋 교체 필요
        spriteFrame: 0,
        sellPrice: 10,
        buyPrice: 50,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { str: 2 },
        combatStats: { attack: 5 }
    },
    {
        id: 'weapon_iron_sword',
        name: 'Iron Sword',
        nameKo: '철 검',
        description: '단단한 철로 만든 검',
        type: 'weapon',
        slot: 'weapon',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 1,
        sellPrice: 50,
        buyPrice: 200,
        stackable: false,
        maxStack: 1,
        requiredLevel: 5,
        element: 'none',
        stats: { str: 5 },
        combatStats: { attack: 15 }
    },
    {
        id: 'weapon_steel_sword',
        name: 'Steel Sword',
        nameKo: '강철 검',
        description: '정제된 강철로 만든 검',
        type: 'weapon',
        slot: 'weapon',
        rarity: 'uncommon',
        spriteKey: 'items',
        spriteFrame: 2,
        sellPrice: 150,
        buyPrice: 500,
        stackable: false,
        maxStack: 1,
        requiredLevel: 10,
        element: 'none',
        stats: { str: 8, dex: 2 },
        combatStats: { attack: 30, accuracy: 5 }
    },
    {
        id: 'weapon_fire_blade',
        name: 'Fire Blade',
        nameKo: '화염검',
        description: '불의 속성이 깃든 검',
        type: 'weapon',
        slot: 'weapon',
        rarity: 'rare',
        spriteKey: 'items',
        spriteFrame: 3,
        sellPrice: 500,
        buyPrice: 2000,
        stackable: false,
        maxStack: 1,
        requiredLevel: 15,
        element: 'fire',
        stats: { str: 12, int: 5 },
        combatStats: { attack: 50, magicAttack: 20 }
    },
    {
        id: 'weapon_staff_apprentice',
        name: 'Apprentice Staff',
        nameKo: '견습 지팡이',
        description: '마법사 견습생용 지팡이',
        type: 'weapon',
        slot: 'weapon',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 10,
        sellPrice: 15,
        buyPrice: 60,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { int: 3 },
        combatStats: { magicAttack: 8 }
    }
];

// ============================================================
// 방어구
// ============================================================

export const ARMORS: EquipmentDefinition[] = [
    // 투구
    {
        id: 'armor_leather_helm',
        name: 'Leather Helm',
        nameKo: '가죽 투구',
        description: '가죽으로 만든 투구',
        type: 'armor',
        slot: 'helmet',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 20,
        sellPrice: 20,
        buyPrice: 80,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { con: 1 },
        combatStats: { defense: 3 }
    },
    // 갑옷
    {
        id: 'armor_cloth_robe',
        name: 'Cloth Robe',
        nameKo: '천 로브',
        description: '가벼운 천으로 만든 로브',
        type: 'armor',
        slot: 'armor',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 30,
        sellPrice: 25,
        buyPrice: 100,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { int: 2 },
        combatStats: { defense: 2, magicDefense: 5 }
    },
    {
        id: 'armor_leather_armor',
        name: 'Leather Armor',
        nameKo: '가죽 갑옷',
        description: '가죽으로 만든 갑옷',
        type: 'armor',
        slot: 'armor',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 31,
        sellPrice: 40,
        buyPrice: 150,
        stackable: false,
        maxStack: 1,
        requiredLevel: 3,
        element: 'none',
        stats: { con: 3 },
        combatStats: { defense: 8 }
    },
    // 장갑
    {
        id: 'armor_leather_gloves',
        name: 'Leather Gloves',
        nameKo: '가죽 장갑',
        description: '가죽으로 만든 장갑',
        type: 'armor',
        slot: 'gloves',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 40,
        sellPrice: 15,
        buyPrice: 60,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { dex: 1 },
        combatStats: { defense: 2, accuracy: 2 }
    },
    // 신발
    {
        id: 'armor_leather_boots',
        name: 'Leather Boots',
        nameKo: '가죽 신발',
        description: '가죽으로 만든 신발',
        type: 'armor',
        slot: 'boots',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 50,
        sellPrice: 20,
        buyPrice: 80,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: { dex: 1 },
        combatStats: { defense: 2, evasion: 2, moveSpeed: 5 }
    }
];

// ============================================================
// 악세서리
// ============================================================

export const ACCESSORIES: EquipmentDefinition[] = [
    {
        id: 'acc_copper_ring',
        name: 'Copper Ring',
        nameKo: '구리 반지',
        description: '간단한 구리 반지',
        type: 'accessory',
        slot: 'ring1',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 60,
        sellPrice: 30,
        buyPrice: 100,
        stackable: false,
        maxStack: 1,
        requiredLevel: 1,
        element: 'none',
        stats: {},
        combatStats: { maxHp: 20 }
    },
    {
        id: 'acc_fire_necklace',
        name: 'Fire Necklace',
        nameKo: '화염의 목걸이',
        description: '불의 속성이 깃든 목걸이',
        type: 'accessory',
        slot: 'necklace',
        rarity: 'rare',
        spriteKey: 'items',
        spriteFrame: 70,
        sellPrice: 200,
        buyPrice: 800,
        stackable: false,
        maxStack: 1,
        requiredLevel: 10,
        element: 'fire',
        stats: { int: 5 },
        combatStats: { magicAttack: 15, magicDefense: 10 }
    }
];

// ============================================================
// 소비 아이템
// ============================================================

export const CONSUMABLES: ConsumableDefinition[] = [
    {
        id: 'potion_hp_small',
        name: 'Small HP Potion',
        nameKo: '작은 HP 포션',
        description: 'HP를 50 회복합니다',
        type: 'consumable',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 100,
        sellPrice: 10,
        buyPrice: 30,
        stackable: true,
        maxStack: 99,
        requiredLevel: 1,
        healHp: 50,
        cooldown: 1000
    },
    {
        id: 'potion_hp_medium',
        name: 'Medium HP Potion',
        nameKo: '중급 HP 포션',
        description: 'HP를 150 회복합니다',
        type: 'consumable',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 101,
        sellPrice: 30,
        buyPrice: 100,
        stackable: true,
        maxStack: 99,
        requiredLevel: 5,
        healHp: 150,
        cooldown: 1000
    },
    {
        id: 'potion_hp_large',
        name: 'Large HP Potion',
        nameKo: '고급 HP 포션',
        description: 'HP를 400 회복합니다',
        type: 'consumable',
        rarity: 'uncommon',
        spriteKey: 'items',
        spriteFrame: 102,
        sellPrice: 80,
        buyPrice: 300,
        stackable: true,
        maxStack: 99,
        requiredLevel: 15,
        healHp: 400,
        cooldown: 1000
    },
    {
        id: 'potion_mp_small',
        name: 'Small MP Potion',
        nameKo: '작은 MP 포션',
        description: 'MP를 30 회복합니다',
        type: 'consumable',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 110,
        sellPrice: 15,
        buyPrice: 40,
        stackable: true,
        maxStack: 99,
        requiredLevel: 1,
        healMp: 30,
        cooldown: 1000
    },
    {
        id: 'potion_mp_medium',
        name: 'Medium MP Potion',
        nameKo: '중급 MP 포션',
        description: 'MP를 100 회복합니다',
        type: 'consumable',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 111,
        sellPrice: 40,
        buyPrice: 120,
        stackable: true,
        maxStack: 99,
        requiredLevel: 5,
        healMp: 100,
        cooldown: 1000
    }
];

// ============================================================
// 재료 아이템
// ============================================================

export const MATERIALS: ItemDefinition[] = [
    {
        id: 'mat_slime_jelly',
        name: 'Slime Jelly',
        nameKo: '슬라임 젤리',
        description: '슬라임에서 얻은 젤리',
        type: 'material',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 200,
        sellPrice: 5,
        buyPrice: 0,
        stackable: true,
        maxStack: 999,
        requiredLevel: 1
    },
    {
        id: 'mat_wolf_pelt',
        name: 'Wolf Pelt',
        nameKo: '늑대 가죽',
        description: '늑대에서 얻은 가죽',
        type: 'material',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 201,
        sellPrice: 15,
        buyPrice: 0,
        stackable: true,
        maxStack: 999,
        requiredLevel: 1
    },
    {
        id: 'mat_iron_ore',
        name: 'Iron Ore',
        nameKo: '철광석',
        description: '제련하면 철이 되는 광석',
        type: 'material',
        rarity: 'common',
        spriteKey: 'items',
        spriteFrame: 210,
        sellPrice: 20,
        buyPrice: 50,
        stackable: true,
        maxStack: 999,
        requiredLevel: 1
    }
];

// ============================================================
// 아이템 조회 함수
// ============================================================

/** 모든 아이템 */
export const ALL_ITEMS: (ItemDefinition | EquipmentDefinition | ConsumableDefinition)[] = [
    ...WEAPONS,
    ...ARMORS,
    ...ACCESSORIES,
    ...CONSUMABLES,
    ...MATERIALS
];

/** ID로 아이템 찾기 */
export function getItemById(id: string): ItemDefinition | undefined {
    return ALL_ITEMS.find(item => item.id === id);
}

/** 장비 아이템인지 확인 */
export function isEquipment(item: ItemDefinition): item is EquipmentDefinition {
    return item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory';
}

/** 소비 아이템인지 확인 */
export function isConsumable(item: ItemDefinition): item is ConsumableDefinition {
    return item.type === 'consumable';
}
