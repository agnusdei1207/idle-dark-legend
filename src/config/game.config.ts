import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { UIScene } from '../scenes/UIScene';

/**
 * Phaser 3 게임 설정
 * - 반응형 스케일링
 * - WebGL 우선, Canvas 폴백
 * - 모바일 터치 지원
 */
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
