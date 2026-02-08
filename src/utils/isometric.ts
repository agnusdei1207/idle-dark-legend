/**
 * 아이소메트릭 좌표 변환 유틸리티
 */

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

/**
 * 월드 좌표를 아이소메트릭 화면 좌표로 변환
 */
export function worldToScreen(x: number, y: number): { screenX: number; screenY: number } {
    return {
        screenX: (x - y) * (TILE_WIDTH / 2),
        screenY: (x + y) * (TILE_HEIGHT / 2)
    };
}

/**
 * 화면 좌표를 월드 좌표로 변환
 */
export function screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
        x: (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2,
        y: (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2
    };
}

/**
 * 깊이 정렬용 값 계산
 */
export function getDepthValue(x: number, y: number, layer: number = 0): number {
    return (y * 100 + x) + (layer * 10000);
}

/**
 * 타일 좌표 반올림
 */
export function snapToTile(x: number, y: number): { tileX: number; tileY: number } {
    return {
        tileX: Math.floor(x),
        tileY: Math.floor(y)
    };
}
