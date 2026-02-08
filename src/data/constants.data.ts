/**
 * ============================================================
 * 게임 상수 및 레벨 테이블
 * ============================================================
 */

/** 레벨별 필요 경험치 */
export const EXP_TABLE: number[] = [
    0,      // Lv 1 (시작)
    100,    // Lv 2
    250,    // Lv 3
    450,    // Lv 4
    700,    // Lv 5
    1000,   // Lv 6
    1400,   // Lv 7
    1900,   // Lv 8
    2500,   // Lv 9
    3200,   // Lv 10
    4000,   // Lv 11
    5000,   // Lv 12
    6200,   // Lv 13
    7600,   // Lv 14
    9200,   // Lv 15
    11000,  // Lv 16
    13000,  // Lv 17
    15500,  // Lv 18
    18500,  // Lv 19
    22000,  // Lv 20
];

/** 최대 레벨 */
export const MAX_LEVEL = 99;

/** 레벨업 시 스탯 포인트 지급량 */
export const STAT_POINTS_PER_LEVEL = 5;

/** 레벨업 시 스킬 포인트 지급량 */
export const SKILL_POINTS_PER_LEVEL = 1;

/** 인벤토리 크기 */
export const INVENTORY_SIZE = 30;

/** 스킬바 슬롯 수 */
export const SKILL_BAR_SIZE = 8;

/** 아이템 희귀도 색상 */
export const RARITY_COLORS = {
    common: '#aaaaaa',
    uncommon: '#00ff00',
    rare: '#0088ff',
    epic: '#aa00ff',
    legendary: '#ff8800'
};

/** 속성 색상 */
export const ELEMENT_COLORS = {
    none: '#ffffff',
    fire: '#ff4444',
    water: '#4444ff',
    earth: '#88aa44',
    wind: '#44ffaa',
    light: '#ffff44',
    dark: '#aa44aa'
};

/** 속성 이름 (한글) */
export const ELEMENT_NAMES = {
    none: '무속성',
    fire: '불',
    water: '물',
    earth: '땅',
    wind: '바람',
    light: '빛',
    dark: '어둠'
};

/** 필요 경험치 계산 */
export function getRequiredExp(level: number): number {
    if (level <= 0) return 0;
    if (level < EXP_TABLE.length) return EXP_TABLE[level];
    // 20레벨 이후는 공식 사용
    return Math.floor(22000 + (level - 20) * 5000 * Math.pow(1.1, level - 20));
}

/** 총 경험치로 레벨 계산 */
export function getLevelFromTotalExp(totalExp: number): { level: number, currentExp: number } {
    let level = 1;
    let remaining = totalExp;

    while (level < MAX_LEVEL) {
        const required = getRequiredExp(level);
        if (remaining < required) break;
        remaining -= required;
        level++;
    }

    return { level, currentExp: remaining };
}
