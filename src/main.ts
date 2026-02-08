/**
 * ============================================================
 * 어둠의전설 클래식 - 메인 진입점
 * ============================================================
 * Three.js 기반 게임 엔진 시작점
 * ============================================================
 */

import { ThreeGame } from './three/core/ThreeGame';
import { threeGameConfig } from './config/three.config';
import { BootScene } from './three/scenes/BootScene';

// 게임 인스턴스 생성
const game = new ThreeGame(threeGameConfig);

// BootScene 등록
game.sceneManager.registerScene('boot', BootScene);

// 전역 접근용 (디버깅)
if (import.meta.env.DEV) {
    (window as unknown as { game: ThreeGame }).game = game;
}

// 게임 시작
async function startGame() {
    try {
        // BootScene부터 시작
        await game.switchScene('boot');
        game.start();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
}

startGame();

export default game;
