/**
 * ============================================================
 * 게임 타입 정의
 * ============================================================
 * 
 * 모든 게임 시스템에서 사용하는 공통 타입들을 정의합니다.
 * 에셋 교체 시 이 타입들을 참고하여 데이터를 구성하세요.
 * ============================================================
 */

// ============================================================
// 기본 타입
// ============================================================

/** 2D 좌표 */
export interface Position {
    x: number;
    y: number;
}

/** 방향 (8방향) */
export type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

/** 4방향 (아이소메트릭 기준) */
export type IsoDirection = 'nw' | 'ne' | 'se' | 'sw';

// ============================================================
// 속성 시스템 (6속성)
// ============================================================

/**
 * 어둠의전설 스타일 6속성 시스템
 * - 물(Water) ↔ 불(Fire)
 * - 땅(Earth) ↔ 바람(Wind)  
 * - 빛(Light) ↔ 어둠(Dark)
 */
export type ElementType = 'water' | 'fire' | 'earth' | 'wind' | 'light' | 'dark' | 'none';

/** 속성 상성표 */
export const ELEMENT_WEAKNESS: Record<ElementType, ElementType> = {
    water: 'fire',
    fire: 'water',
    earth: 'wind',
    wind: 'earth',
    light: 'dark',
    dark: 'light',
    none: 'none'
};

/** 속성 강점표 */
export const ELEMENT_STRENGTH: Record<ElementType, ElementType> = {
    water: 'fire',
    fire: 'earth',
    earth: 'wind',
    wind: 'water',
    light: 'dark',
    dark: 'light',
    none: 'none'
};

// ============================================================
// 스탯 시스템
// ============================================================

/** 기본 스탯 */
export interface BaseStats {
    /** 힘 - 물리 공격력 */
    str: number;
    /** 민첩 - 회피, 명중, 크리티컬 */
    dex: number;
    /** 체력 - HP, 방어력 */
    con: number;
    /** 지능 - 마법 공격력, MP */
    int: number;
    /** 지혜 - 마법 방어력, MP 회복 */
    wis: number;
    /** 운 - 드롭률, 크리티컬 데미지 */
    luk: number;
}

/** 전투 스탯 (계산된 값) */
export interface CombatStats {
    maxHp: number;
    maxMp: number;
    currentHp: number;
    currentMp: number;
    attack: number;
    defense: number;
    magicAttack: number;
    magicDefense: number;
    accuracy: number;
    evasion: number;
    critRate: number;
    critDamage: number;
    attackSpeed: number;
    moveSpeed: number;
}

// ============================================================
// 아이템 시스템
// ============================================================

/** 아이템 타입 */
export type ItemType =
    | 'weapon'      // 무기
    | 'armor'       // 방어구
    | 'accessory'   // 악세서리
    | 'consumable'  // 소비 아이템
    | 'material'    // 재료
    | 'quest';      // 퀘스트 아이템

/** 장비 슬롯 */
export type EquipSlot =
    | 'weapon'      // 무기
    | 'shield'      // 방패
    | 'helmet'      // 투구
    | 'armor'       // 갑옷
    | 'gloves'      // 장갑
    | 'boots'       // 신발
    | 'necklace'    // 목걸이
    | 'ring1'       // 반지1
    | 'ring2';      // 반지2

/** 아이템 희귀도 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** 아이템 정의 */
export interface ItemDefinition {
    id: string;
    name: string;
    nameKo: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    /** 스프라이트 키 (에셋) */
    spriteKey: string;
    /** 스프라이트 프레임 */
    spriteFrame?: number;
    /** 판매 가격 */
    sellPrice: number;
    /** 구매 가격 */
    buyPrice: number;
    /** 스택 가능 여부 */
    stackable: boolean;
    /** 최대 스택 수 */
    maxStack: number;
    /** 레벨 제한 */
    requiredLevel: number;
}

/** 장비 아이템 정의 */
export interface EquipmentDefinition extends ItemDefinition {
    type: 'weapon' | 'armor' | 'accessory';
    slot: EquipSlot;
    /** 스탯 보너스 */
    stats: Partial<BaseStats>;
    /** 전투 스탯 보너스 */
    combatStats: Partial<CombatStats>;
    /** 속성 */
    element: ElementType;
}

/** 소비 아이템 정의 */
export interface ConsumableDefinition extends ItemDefinition {
    type: 'consumable';
    /** HP 회복량 */
    healHp?: number;
    /** MP 회복량 */
    healMp?: number;
    /** 버프 효과 ID */
    buffId?: string;
    /** 쿨다운 (ms) */
    cooldown: number;
}

/** 인벤토리 슬롯 */
export interface InventorySlot {
    itemId: string | null;
    quantity: number;
}

// ============================================================
// 스킬 시스템
// ============================================================

/** 스킬 타입 */
export type SkillType = 'active' | 'passive' | 'buff' | 'debuff';

/** 스킬 대상 */
export type SkillTarget = 'self' | 'single' | 'area' | 'allies' | 'all';

/** 스킬 정의 */
export interface SkillDefinition {
    id: string;
    name: string;
    nameKo: string;
    description: string;
    type: SkillType;
    target: SkillTarget;
    /** 속성 */
    element: ElementType;
    /** 스프라이트 키 (아이콘) */
    iconKey: string;
    iconFrame?: number;
    /** 이펙트 스프라이트 키 */
    effectKey?: string;
    /** MP 소모량 */
    mpCost: number;
    /** 쿨다운 (ms) */
    cooldown: number;
    /** 캐스팅 시간 (ms) */
    castTime: number;
    /** 사거리 (타일) */
    range: number;
    /** 범위 (area 타입일 때) */
    areaRadius?: number;
    /** 기본 데미지 / 회복량 */
    basePower: number;
    /** 스탯 스케일링 */
    scaling: {
        stat: keyof BaseStats;
        ratio: number;
    }[];
    /** 레벨 제한 */
    requiredLevel: number;
    /** 선행 스킬 */
    prerequisiteSkills?: string[];
}

// ============================================================
// NPC & 몬스터
// ============================================================

/** NPC 타입 */
export type NPCType = 'merchant' | 'quest' | 'trainer' | 'banker' | 'guard' | 'citizen';

/** NPC 정의 */
export interface NPCDefinition {
    id: string;
    name: string;
    nameKo: string;
    type: NPCType;
    /** 스프라이트 키 */
    spriteKey: string;
    /** 대화 ID */
    dialogueId: string;
    /** 상점 ID (merchant일 때) */
    shopId?: string;
    /** 퀘스트 ID 목록 */
    questIds?: string[];
}

/** 몬스터 정의 */
export interface MonsterDefinition {
    id: string;
    name: string;
    nameKo: string;
    /** 스프라이트 키 */
    spriteKey: string;
    /** 레벨 */
    level: number;
    /** 속성 */
    element: ElementType;
    /** 기본 스탯 */
    stats: CombatStats;
    /** 공격 패턴 */
    attackPattern: 'melee' | 'ranged' | 'magic';
    /** 공격 사거리 */
    attackRange: number;
    /** 감지 범위 */
    aggroRange: number;
    /** 드롭 테이블 */
    drops: {
        itemId: string;
        chance: number; // 0-100
        minQuantity: number;
        maxQuantity: number;
    }[];
    /** 경험치 */
    exp: number;
    /** 골드 */
    gold: { min: number; max: number };
    /** AI 타입 */
    aiType: 'passive' | 'aggressive' | 'defensive';
}

// ============================================================
// 퀘스트 시스템
// ============================================================

/** 퀘스트 타입 */
export type QuestType = 'main' | 'side' | 'daily' | 'repeatable';

/** 퀘스트 조건 타입 */
export type QuestObjectiveType =
    | 'kill'        // 몬스터 처치
    | 'collect'     // 아이템 수집
    | 'talk'        // NPC 대화
    | 'explore'     // 지역 탐험
    | 'escort'      // 호위
    | 'deliver';    // 아이템 전달

/** 퀘스트 목표 */
export interface QuestObjective {
    type: QuestObjectiveType;
    targetId: string;  // 몬스터ID, 아이템ID, NPC ID 등
    targetName: string;
    requiredAmount: number;
    currentAmount: number;
}

/** 퀘스트 보상 */
export interface QuestReward {
    exp?: number;
    gold?: number;
    items?: { itemId: string; quantity: number }[];
    skillPoints?: number;
}

/** 퀘스트 정의 */
export interface QuestDefinition {
    id: string;
    title: string;
    titleKo: string;
    description: string;
    type: QuestType;
    /** 시작 NPC */
    startNpcId: string;
    /** 완료 NPC */
    endNpcId: string;
    /** 레벨 제한 */
    requiredLevel: number;
    /** 선행 퀘스트 */
    prerequisiteQuests?: string[];
    /** 목표 */
    objectives: Omit<QuestObjective, 'currentAmount'>[];
    /** 보상 */
    rewards: QuestReward;
    /** 시작 대화 */
    startDialogueId: string;
    /** 진행 중 대화 */
    progressDialogueId: string;
    /** 완료 대화 */
    completeDialogueId: string;
}

/** 퀘스트 상태 */
export type QuestStatus = 'available' | 'active' | 'completed' | 'turned_in';

/** 퀘스트 진행 상황 */
export interface QuestProgress {
    questId: string;
    status: QuestStatus;
    objectives: QuestObjective[];
    startedAt?: number;
    completedAt?: number;
}

// ============================================================
// 대화 시스템
// ============================================================

/** 대화 선택지 */
export interface DialogueChoice {
    text: string;
    nextDialogueId?: string;
    /** 퀘스트 수락 */
    acceptQuest?: string;
    /** 상점 열기 */
    openShop?: string;
    /** 조건 */
    condition?: {
        type: 'quest' | 'item' | 'level';
        id?: string;
        value?: number;
    };
}

/** 대화 노드 */
export interface DialogueNode {
    id: string;
    speaker: string;
    speakerKo: string;
    text: string;
    /** 다음 대화 ID (자동 진행) */
    nextId?: string;
    /** 선택지 */
    choices?: DialogueChoice[];
    /** 초상화 키 */
    portraitKey?: string;
}

/** 대화 정의 */
export interface DialogueDefinition {
    id: string;
    nodes: DialogueNode[];
}

// ============================================================
// 맵 시스템
// ============================================================

/** 맵 포탈 */
export interface MapPortal {
    x: number;
    y: number;
    width: number;
    height: number;
    targetMapId: string;
    targetX: number;
    targetY: number;
}

/** 맵 스폰 포인트 */
export interface MapSpawn {
    monsterId: string;
    x: number;
    y: number;
    respawnTime: number; // ms
    maxCount: number;
}

/** 맵 NPC 배치 */
export interface MapNPC {
    npcId: string;
    x: number;
    y: number;
    direction: IsoDirection;
}

/** 맵 정의 */
export interface MapDefinition {
    id: string;
    name: string;
    nameKo: string;
    /** Tiled JSON 파일 키 */
    tilemapKey: string;
    /** 타일셋 이미지 키 */
    tilesetKey: string;
    /** BGM 키 */
    bgmKey?: string;
    /** 포탈 목록 */
    portals: MapPortal[];
    /** 몬스터 스폰 */
    spawns: MapSpawn[];
    /** NPC 배치 */
    npcs: MapNPC[];
    /** PvP 가능 여부 */
    pvpEnabled: boolean;
    /** 레벨 제한 */
    levelRequirement: number;
}

// ============================================================
// 플레이어 데이터 (저장용)
// ============================================================

/** 플레이어 저장 데이터 */
export interface PlayerSaveData {
    /** 기본 정보 */
    name: string;
    level: number;
    exp: number;
    gold: number;

    /** 스탯 */
    baseStats: BaseStats;
    statPoints: number;

    /** 현재 상태 */
    currentHp: number;
    currentMp: number;
    currentMapId: string;
    position: Position;

    /** 장비 */
    equipment: Record<EquipSlot, string | null>;

    /** 인벤토리 (30칸) */
    inventory: InventorySlot[];

    /** 스킬 */
    learnedSkills: string[];
    skillLevels: Record<string, number>;
    skillPoints: number;

    /** 퀘스트 */
    quests: QuestProgress[];
    completedQuests: string[];

    /** 스킬바 단축키 (1-8) */
    skillBar: (string | null)[];

    /** 플레이 시간 (초) */
    playTime: number;

    /** 저장 시간 */
    savedAt: number;
}

// ============================================================
// 게임 설정
// ============================================================

/** 게임 설정 */
export interface GameSettings {
    /** 마스터 볼륨 (0-100) */
    masterVolume: number;
    /** BGM 볼륨 (0-100) */
    bgmVolume: number;
    /** 효과음 볼륨 (0-100) */
    sfxVolume: number;
    /** 데미지 표시 */
    showDamageNumbers: boolean;
    /** 자동 저장 간격 (분) */
    autoSaveInterval: number;
    /** UI 크기 배율 */
    uiScale: number;
}
