/**
 * ============================================================
 * Idle 시스템 - 자동 사냥 및 오프라인 진행
 * ============================================================
 */

import Phaser from 'phaser';

// 사냥터 정보
export interface HuntingZone {
    id: string;
    name: string;
    minLevel: number;
    maxLevel: number;
    circle: number;          // 써클 (1-5)
    monsters: string[];      // 출현 몬스터 ID 목록
    bossId?: string;         // 보스 몬스터 ID

    // 사냥 효율
    avgKillsPerMinute: number;  // 분당 킬 수
    avgExpPerKill: number;
    avgGoldPerKill: number;

    // 배경
    bgmKey: string;
    tilesetKey: string;
}

// 오프라인 진행 결과
export interface OfflineProgress {
    lastLogoutTime: number;
    offlineSeconds: number;
    effectiveSeconds: number;  // 최대 8시간

    monstersKilled: number;
    earnedExp: number;
    earnedGold: number;
    earnedItems: { itemId: string; quantity: number }[];
    levelsGained: number;
}

// 자동 사냥 설정
export interface IdleConfig {
    autoHuntEnabled: boolean;
    autoPickupEnabled: boolean;
    autoSkillEnabled: boolean;
    autoPotionEnabled: boolean;
    potionThreshold: number;   // HP% 이하시 포션 사용
    preferredSkills: string[]; // 우선 사용 스킬
}

// 어둠의전설 원작 사냥터 데이터
export const HUNTING_ZONES: HuntingZone[] = [
    // ========== 1써클 (Lv 1~10) ==========
    {
        id: 'novice_dungeon',
        name: '노비스 마을 던전',
        minLevel: 1,
        maxLevel: 5,
        circle: 1,
        monsters: ['rat', 'bat', 'spider'],
        avgKillsPerMinute: 4,
        avgExpPerKill: 5,
        avgGoldPerKill: 2,
        bgmKey: 'bgm_dungeon_1',
        tilesetKey: 'tileset_dungeon'
    },
    {
        id: 'woodland_1',
        name: '우드랜드 1존',
        minLevel: 5,
        maxLevel: 8,
        circle: 1,
        monsters: ['goblin', 'slime', 'wolf'],
        avgKillsPerMinute: 3,
        avgExpPerKill: 12,
        avgGoldPerKill: 5,
        bgmKey: 'bgm_forest',
        tilesetKey: 'tileset_forest'
    },
    {
        id: 'woodland_2',
        name: '우드랜드 2존',
        minLevel: 8,
        maxLevel: 10,
        circle: 1,
        monsters: ['orc', 'troll', 'bear'],
        bossId: 'boss_orc_chief',
        avgKillsPerMinute: 2.5,
        avgExpPerKill: 20,
        avgGoldPerKill: 8,
        bgmKey: 'bgm_forest',
        tilesetKey: 'tileset_forest'
    },

    // ========== 2써클 (Lv 11~40) ==========
    {
        id: 'forest_of_pote',
        name: '포테의 숲',
        minLevel: 11,
        maxLevel: 20,
        circle: 2,
        monsters: ['mushroom_fairy', 'treant', 'dryad'],
        avgKillsPerMinute: 2.5,
        avgExpPerKill: 35,
        avgGoldPerKill: 15,
        bgmKey: 'bgm_mystic_forest',
        tilesetKey: 'tileset_mystic'
    },
    {
        id: 'piet_dungeon_1f',
        name: '피에트 던전 1층',
        minLevel: 20,
        maxLevel: 30,
        circle: 2,
        monsters: ['skeleton', 'zombie', 'ghoul'],
        avgKillsPerMinute: 2,
        avgExpPerKill: 60,
        avgGoldPerKill: 25,
        bgmKey: 'bgm_dungeon_2',
        tilesetKey: 'tileset_undead'
    },
    {
        id: 'piet_dungeon_2f',
        name: '피에트 던전 2층',
        minLevel: 30,
        maxLevel: 40,
        circle: 2,
        monsters: ['zombie_knight', 'wraith', 'vampire_bat'],
        bossId: 'boss_lich_apprentice',
        avgKillsPerMinute: 1.8,
        avgExpPerKill: 100,
        avgGoldPerKill: 40,
        bgmKey: 'bgm_dungeon_2',
        tilesetKey: 'tileset_undead'
    },

    // ========== 3써클 (Lv 41~70) ==========
    {
        id: 'abel_coast',
        name: '아벨 해안던전',
        minLevel: 41,
        maxLevel: 50,
        circle: 3,
        monsters: ['crab', 'pirate', 'merman'],
        avgKillsPerMinute: 1.8,
        avgExpPerKill: 150,
        avgGoldPerKill: 60,
        bgmKey: 'bgm_coast',
        tilesetKey: 'tileset_coast'
    },
    {
        id: 'abel_dungeon_1f',
        name: '아벨 던전 1층',
        minLevel: 50,
        maxLevel: 60,
        circle: 3,
        monsters: ['gargoyle', 'mimic', 'death_eye'],
        avgKillsPerMinute: 1.5,
        avgExpPerKill: 220,
        avgGoldPerKill: 90,
        bgmKey: 'bgm_dungeon_3',
        tilesetKey: 'tileset_dark'
    },
    {
        id: 'abel_dungeon_2f',
        name: '아벨 던전 2층',
        minLevel: 60,
        maxLevel: 70,
        circle: 3,
        monsters: ['lich', 'dullahan', 'demon_archer'],
        bossId: 'boss_demon_lord',
        avgKillsPerMinute: 1.3,
        avgExpPerKill: 350,
        avgGoldPerKill: 140,
        bgmKey: 'bgm_dungeon_3',
        tilesetKey: 'tileset_dark'
    },

    // ========== 4써클 (Lv 71~98) ==========
    {
        id: 'lukession_coast',
        name: '뤼케시온 해안던전',
        minLevel: 71,
        maxLevel: 80,
        circle: 4,
        monsters: ['kraken_tentacle', 'sea_pirate', 'deep_one'],
        avgKillsPerMinute: 1.2,
        avgExpPerKill: 500,
        avgGoldPerKill: 200,
        bgmKey: 'bgm_deep_sea',
        tilesetKey: 'tileset_underwater'
    },
    {
        id: 'underwater_dungeon',
        name: '해저 던전',
        minLevel: 80,
        maxLevel: 90,
        circle: 4,
        monsters: ['mermaid_warrior', 'sea_dragon', 'poseidon_guard'],
        avgKillsPerMinute: 1,
        avgExpPerKill: 750,
        avgGoldPerKill: 300,
        bgmKey: 'bgm_deep_sea',
        tilesetKey: 'tileset_underwater'
    },
    {
        id: 'shipwreck',
        name: '난파선',
        minLevel: 90,
        maxLevel: 98,
        circle: 4,
        monsters: ['ghost_captain', 'cursed_sailor', 'leviathan_spawn'],
        bossId: 'boss_leviathan',
        avgKillsPerMinute: 0.8,
        avgExpPerKill: 1100,
        avgGoldPerKill: 450,
        bgmKey: 'bgm_ghost_ship',
        tilesetKey: 'tileset_shipwreck'
    },

    // ========== 5써클 (Lv 99+) ==========
    {
        id: 'horror_castle',
        name: '호러캐슬',
        minLevel: 99,
        maxLevel: 120,
        circle: 5,
        monsters: ['dracula', 'werewolf', 'frankenstein'],
        bossId: 'boss_vampire_count',
        avgKillsPerMinute: 0.7,
        avgExpPerKill: 1800,
        avgGoldPerKill: 700,
        bgmKey: 'bgm_horror',
        tilesetKey: 'tileset_castle'
    },
    {
        id: 'countess_villa',
        name: '백작부인의 별장',
        minLevel: 99,
        maxLevel: 130,
        circle: 5,
        monsters: ['maid_ghost', 'iron_maiden', 'blood_countess'],
        bossId: 'boss_blood_countess',
        avgKillsPerMinute: 0.6,
        avgExpPerKill: 2500,
        avgGoldPerKill: 1000,
        bgmKey: 'bgm_horror',
        tilesetKey: 'tileset_villa'
    },
    {
        id: 'vecna_tower',
        name: '베크나 탑',
        minLevel: 99,
        maxLevel: 150,
        circle: 5,
        monsters: ['dark_witch', 'vecna_servant', 'archmage'],
        bossId: 'boss_vecna',
        avgKillsPerMinute: 0.5,
        avgExpPerKill: 3500,
        avgGoldPerKill: 1500,
        bgmKey: 'bgm_final',
        tilesetKey: 'tileset_tower'
    }
];

/**
 * Idle 시스템 클래스
 */
export class IdleSystem extends Phaser.Events.EventEmitter {
    private config: IdleConfig;
    private currentZone: HuntingZone | null = null;
    private isHunting: boolean = false;
    private huntTimer: Phaser.Time.TimerEvent | null = null;
    private scene: Phaser.Scene | null = null;

    // 통계
    private sessionKills: number = 0;
    private sessionExp: number = 0;
    private sessionGold: number = 0;
    private sessionStartTime: number = 0;

    // 최대 오프라인 시간 (8시간 = 28800초)
    private static readonly MAX_OFFLINE_SECONDS = 8 * 60 * 60;

    constructor() {
        super();

        this.config = {
            autoHuntEnabled: true,
            autoPickupEnabled: true,
            autoSkillEnabled: true,
            autoPotionEnabled: true,
            potionThreshold: 30,
            preferredSkills: []
        };
    }

    /**
     * 씬 연결
     */
    setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    /**
     * 사냥터 선택
     */
    selectZone(zoneId: string): boolean {
        const zone = HUNTING_ZONES.find(z => z.id === zoneId);
        if (!zone) return false;

        this.currentZone = zone;
        this.emit('zoneChanged', zone);
        return true;
    }

    /**
     * 레벨에 맞는 사냥터 목록
     */
    getAvailableZones(playerLevel: number): HuntingZone[] {
        return HUNTING_ZONES.filter(zone =>
            playerLevel >= zone.minLevel - 5 // 5레벨 낮아도 입장 가능
        );
    }

    /**
     * 추천 사냥터 (레벨 기준)
     */
    getRecommendedZone(playerLevel: number): HuntingZone | null {
        // 레벨에 가장 적합한 사냥터 찾기
        const suitable = HUNTING_ZONES.filter(zone =>
            playerLevel >= zone.minLevel && playerLevel <= zone.maxLevel
        );

        if (suitable.length === 0) {
            // 레벨 초과 시 가장 높은 사냥터
            const sorted = [...HUNTING_ZONES].sort((a, b) => b.minLevel - a.minLevel);
            return sorted.find(z => playerLevel >= z.minLevel) || null;
        }

        // 적합한 사냥터 중 가장 효율 좋은 곳
        return suitable.reduce((best, zone) =>
            zone.avgExpPerKill * zone.avgKillsPerMinute >
                best.avgExpPerKill * best.avgKillsPerMinute ? zone : best
        );
    }

    /**
     * 자동 사냥 시작
     */
    startHunting(): void {
        if (!this.currentZone || !this.scene) return;
        if (this.isHunting) return;

        this.isHunting = true;
        this.sessionKills = 0;
        this.sessionExp = 0;
        this.sessionGold = 0;
        this.sessionStartTime = Date.now();

        // 킬 간격 계산 (밀리초)
        const killIntervalMs = (60 / this.currentZone.avgKillsPerMinute) * 1000;

        this.huntTimer = this.scene.time.addEvent({
            delay: killIntervalMs,
            callback: () => this.processKill(),
            loop: true
        });

        this.emit('huntingStarted', this.currentZone);
    }

    /**
     * 자동 사냥 중지
     */
    stopHunting(): void {
        if (!this.isHunting) return;

        this.isHunting = false;
        if (this.huntTimer) {
            this.huntTimer.destroy();
            this.huntTimer = null;
        }

        const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
        this.emit('huntingStopped', {
            duration: sessionDuration,
            kills: this.sessionKills,
            exp: this.sessionExp,
            gold: this.sessionGold
        });
    }

    /**
     * 킬 처리
     */
    private processKill(): void {
        if (!this.currentZone) return;

        // 랜덤 몬스터 선택
        const monsters = this.currentZone.monsters;
        const monsterId = monsters[Math.floor(Math.random() * monsters.length)];

        // 경험치/골드 변동 (±20%)
        const expVariance = 0.8 + Math.random() * 0.4;
        const goldVariance = 0.8 + Math.random() * 0.4;

        const exp = Math.floor(this.currentZone.avgExpPerKill * expVariance);
        const gold = Math.floor(this.currentZone.avgGoldPerKill * goldVariance);

        this.sessionKills++;
        this.sessionExp += exp;
        this.sessionGold += gold;

        // 아이템 드롭 (10% 확률)
        let droppedItem: { itemId: string; quantity: number } | null = null;
        if (Math.random() < 0.1) {
            droppedItem = {
                itemId: `drop_${monsterId}`,
                quantity: 1
            };
        }

        this.emit('monsterKilled', {
            monsterId,
            exp,
            gold,
            item: droppedItem,
            totalKills: this.sessionKills,
            totalExp: this.sessionExp,
            totalGold: this.sessionGold
        });
    }

    /**
     * 오프라인 보상 계산
     */
    calculateOfflineProgress(
        lastLogoutTime: number,
        playerLevel: number,
        zoneId?: string
    ): OfflineProgress {
        const now = Date.now();
        const offlineSeconds = Math.floor((now - lastLogoutTime) / 1000);
        const effectiveSeconds = Math.min(offlineSeconds, IdleSystem.MAX_OFFLINE_SECONDS);

        // 사냥터 결정
        let zone: HuntingZone | null;
        if (zoneId) {
            zone = HUNTING_ZONES.find(z => z.id === zoneId) || null;
        } else {
            zone = this.getRecommendedZone(playerLevel);
        }

        if (!zone || effectiveSeconds < 60) {
            // 1분 미만이면 보상 없음
            return {
                lastLogoutTime,
                offlineSeconds,
                effectiveSeconds: 0,
                monstersKilled: 0,
                earnedExp: 0,
                earnedGold: 0,
                earnedItems: [],
                levelsGained: 0
            };
        }

        // 오프라인 사냥 효율 (온라인의 50%)
        const efficiency = 0.5;
        const effectiveMinutes = effectiveSeconds / 60;
        const kills = Math.floor(zone.avgKillsPerMinute * effectiveMinutes * efficiency);

        const earnedExp = Math.floor(zone.avgExpPerKill * kills);
        const earnedGold = Math.floor(zone.avgGoldPerKill * kills);

        // 아이템 드롭 (오프라인은 5% 확률)
        const itemDrops: { itemId: string; quantity: number }[] = [];
        const dropCount = Math.floor(kills * 0.05);
        for (let i = 0; i < dropCount; i++) {
            const monsterId = zone.monsters[Math.floor(Math.random() * zone.monsters.length)];
            itemDrops.push({ itemId: `drop_${monsterId}`, quantity: 1 });
        }

        return {
            lastLogoutTime,
            offlineSeconds,
            effectiveSeconds,
            monstersKilled: kills,
            earnedExp,
            earnedGold,
            earnedItems: itemDrops,
            levelsGained: 0 // 실제 적용 시 계산
        };
    }

    /**
     * 설정 변경
     */
    setConfig(newConfig: Partial<IdleConfig>): void {
        this.config = { ...this.config, ...newConfig };
        this.emit('configChanged', this.config);
    }

    getConfig(): IdleConfig {
        return { ...this.config };
    }

    getCurrentZone(): HuntingZone | null {
        return this.currentZone;
    }

    isCurrentlyHunting(): boolean {
        return this.isHunting;
    }

    getSessionStats(): { kills: number; exp: number; gold: number; duration: number } {
        return {
            kills: this.sessionKills,
            exp: this.sessionExp,
            gold: this.sessionGold,
            duration: this.isHunting ? (Date.now() - this.sessionStartTime) / 1000 : 0
        };
    }
}
