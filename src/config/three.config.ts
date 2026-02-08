/**
 * ============================================================
 * 어둠의전설 클래식 - Three.js 게임 설정
 * ============================================================
 * Three.js 기반 게임 엔진 설정
 *
 * [그래픽]
 * - WebGL 전용
 * - 픽셀 아트 렌더링
 * - 1280x720 기본 해상도 (16:9)
 *
 * [입력]
 * - 키보드 (WASD, 방향키)
 * - 마우스
 *
 * [카메라]
 * - Orthographic Camera (2D 아이소메트릭)
 * ============================================================
 */

import type { GameConfig } from '../three/core/ThreeGame';

export const threeGameConfig: GameConfig = {
    parent: 'game-container',

    // 기본 해상도 (16:9)
    width: 1280,
    height: 720,

    // 배경색 (다크 판타지)
    backgroundColor: 0x1a1a2e,

    // 안티앨리어스 (픽셀 아트용으로 끔)
    antialias: false,

    // 픽셀 비율 (레티나 디스플레이 제한)
    pixelRatio: Math.min(window.devicePixelRatio, 2)
};

// 타일 관련 상수
export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;
export const ISO_TILE_WIDTH = 64;
export const ISO_TILE_HEIGHT = 32;

// 게임 상수
export const GAME_CONSTANTS = {
    PLAYER_SPEED: 150,
    ANIMATION_FRAMERATE: 8,
    CAMERA_LERP: 0.1,
    TILE_WIDTH: 64,
    TILE_HEIGHT: 32
};
