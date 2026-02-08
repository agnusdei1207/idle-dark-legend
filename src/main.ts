/**
 * Shadow Realm Tribute
 * 
 * 90년대 한국 클래식 아이소메트릭 MMORPG에서 영감받은
 * 웹 기반 싱글플레이 RPG
 * 
 * @license MIT
 */

import Phaser from 'phaser';
import { gameConfig } from './config/game.config';

// 게임 인스턴스 생성
const game = new Phaser.Game(gameConfig);

// 전역 접근용 (디버깅)
if (import.meta.env.DEV) {
  (window as unknown as { game: Phaser.Game }).game = game;
}

export default game;
