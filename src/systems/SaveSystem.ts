/**
 * ============================================================
 * 저장/로드 시스템
 * ============================================================
 * 
 * LocalStorage를 사용한 게임 저장/로드
 * ============================================================
 */

import type { PlayerSaveData, GameSettings } from '../types/game.types';

const SAVE_KEY = 'shadow_realm_save';
const SETTINGS_KEY = 'shadow_realm_settings';

/** 기본 세이브 데이터 */
export function getDefaultSaveData(): PlayerSaveData {
    return {
        name: 'Hero',
        level: 1,
        exp: 0,
        gold: 100,
        baseStats: { str: 5, dex: 5, con: 5, int: 5, wis: 5, luk: 5 },
        statPoints: 0,
        currentHp: 100,
        currentMp: 50,
        currentMapId: 'map_village',
        position: { x: 5, y: 5 },
        equipment: {
            weapon: null, shield: null, helmet: null, armor: null,
            gloves: null, boots: null, necklace: null, ring1: null, ring2: null
        },
        inventory: Array(30).fill({ itemId: null, quantity: 0 }),
        learnedSkills: ['skill_basic_attack', 'skill_slash'],
        skillLevels: {},
        skillPoints: 0,
        quests: [],
        completedQuests: [],
        skillBar: [null, null, null, null, null, null, null, null],
        playTime: 0,
        savedAt: Date.now()
    };
}

/** 기본 설정 */
export function getDefaultSettings(): GameSettings {
    return {
        masterVolume: 80,
        bgmVolume: 70,
        sfxVolume: 80,
        showDamageNumbers: true,
        autoSaveInterval: 5,
        uiScale: 1
    };
}

export class SaveSystem {
    /** 게임 저장 */
    static save(data: PlayerSaveData): boolean {
        try {
            data.savedAt = Date.now();
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
            console.log('💾 Game saved!');
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            return false;
        }
    }

    /** 게임 로드 */
    static load(): PlayerSaveData | null {
        try {
            const json = localStorage.getItem(SAVE_KEY);
            if (!json) return null;
            const data = JSON.parse(json) as PlayerSaveData;
            console.log('📂 Game loaded!');
            return data;
        } catch (e) {
            console.error('Failed to load game:', e);
            return null;
        }
    }

    /** 세이브 존재 여부 */
    static hasSave(): boolean {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    /** 세이브 삭제 */
    static deleteSave(): void {
        localStorage.removeItem(SAVE_KEY);
        console.log('🗑️ Save deleted!');
    }

    /** 설정 저장 */
    static saveSettings(settings: GameSettings): void {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    /** 설정 로드 */
    static loadSettings(): GameSettings {
        try {
            const json = localStorage.getItem(SETTINGS_KEY);
            if (!json) return getDefaultSettings();
            return JSON.parse(json) as GameSettings;
        } catch {
            return getDefaultSettings();
        }
    }

    /** 플레이 시간 포맷 */
    static formatPlayTime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    /** 마지막 로그아웃 시간 */
    static getLastLogoutTime(): number | null {
        const data = this.load();
        return data?.savedAt || null;
    }

    /** 로그아웃 시간 저장 */
    static saveLogoutTime(): void {
        const data = this.load();
        if (data) {
            data.savedAt = Date.now();
            this.save(data);
        }
    }
}
