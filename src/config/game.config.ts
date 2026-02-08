/**
 * ============================================================
 * 어둠의전설 클래식 - 게임 설정
 * ============================================================
 * Phaser 3 기반 게임 엔진 설정
 *
 * [그래픽]
 * - WebGL 우선, Canvas 폴백
 * - 픽셀 아트 렌더링 최적화
 * - 1280x720 기본 해상도 (16:9)
 *
 * [입력]
 * - 키보드 (WASD, 방향키)
 * - 마우스
 * - 멀티터치 지원 (최대 3포인트)
 *
 * [물리]
 * - Arcade Physics (탑다운/아이소메트릭용)
 * - 중력 비활성화
 * ============================================================
 */

import Phaser from 'phaser';
import { BootScene, MenuScene, GameScene, UIScene } from '../scenes';

export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // WebGL 우선, 지원 안되면 Canvas

    parent: 'game-container',

    // 기본 해상도 (16:9)
    width: 1280,
    height: 720,

    // 반응형 스케일 설정
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 640,
            height: 360
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // 픽셀아트 렌더링 최적화
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },

    // 물리 엔진 (기본 Arcade)
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // 탑다운/아이소메트릭이므로 중력 없음
            debug: import.meta.env.DEV // 개발 모드에서만 디버그 표시
        }
    },

    // 입력 설정
    input: {
        activePointers: 3, // 멀티터치 지원
        keyboard: true,
        mouse: true,
        touch: true
    },

    // 씬 등록
    scene: [BootScene, MenuScene, GameScene, UIScene],

    // 배경색
    backgroundColor: '#1a1a2e'
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
