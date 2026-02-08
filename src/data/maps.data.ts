/**
 * ============================================================
 * 어둠의전설(Legend of Darkness) 맵 데이터베이스
 * ============================================================
 * 넥슨 어둠의전설 (1998/2005) 최초 출시 버전 기준
 *
 * [마을 좌표]
 * - 노비스 마을: 시작점
 * - 피에트 마을: (0, 50) - 2서클 포테의 숲 접근
 * - 아벨 마을: (56, 7) - 3서클 아벨 던전 접근
 * - 뤼케시온 마을: (78, 10) - 4서클 뤼케시온 해안 접근
 * - 마인 마을: (7, 6) - 5서클 호러케슬 접근 (백원만 NPC)
 *
 * [사냥터]
 * 1서클: 노비스 던전, 우드랜드 (1~20존)
 * 2서클: 포테의 숲
 * 3서클: 아벨 던전, 아벨 해안던전 (60, 116)
 * 4서클: 솔던 뤼케시온 던전, 뤼케시온 해안
 * 5서클: 호러케슬
 *
 * [에셋 교체]
 * 1. Tiled에서 맵 생성 후 JSON으로 내보내기
 * 2. public/assets/maps/ 폴더에 저장
 * 3. tilemapKey를 실제 파일명으로 변경
 * ============================================================
 */

import type { MapDefinition } from '../types/game.types';

export const MAPS: MapDefinition[] = [
    // ============================================================
    // 1서클 맵 - 노비스 마을, 우드랜드
    // ============================================================

    {
        id: 'map_novis_village',
        name: 'Novice Village',
        nameKo: '노비스 마을',
        tilemapKey: 'map-novis-village',
        tilesetKey: 'tileset-novis',
        bgmKey: 'bgm-village',
        portals: [
            { x: 15, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_1', targetX: 2, targetY: 10 }
        ],
        spawns: [],  // 마을에는 몬스터 없음
        npcs: [
            { npcId: 'npc_novis_elder', x: 5, y: 5, direction: 'se' },
            { npcId: 'npc_blacksmith', x: 10, y: 3, direction: 'sw' },
            { npcId: 'npc_potion_seller', x: 12, y: 7, direction: 'sw' },
            { npcId: 'npc_guard', x: 15, y: 10, direction: 'se' }
        ],
        pvpEnabled: false,
        levelRequirement: 1
    },
    {
        id: 'map_woodland_1',
        name: 'Woodland Zone 1',
        nameKo: '우드랜드 1존',
        tilemapKey: 'map-woodland-1',
        tilesetKey: 'tileset-woodland',
        bgmKey: 'bgm-field',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_novis_village', targetX: 14, targetY: 10 },
            { x: 20, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_2', targetX: 2, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_pampat', x: 5, y: 5, respawnTime: 30000, maxCount: 5 },
            { monsterId: 'mon_nie', x: 8, y: 8, respawnTime: 30000, maxCount: 4 },
            { monsterId: 'mon_wandu', x: 12, y: 4, respawnTime: 30000, maxCount: 4 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 1
    },
    {
        id: 'map_woodland_2',
        name: 'Woodland Zone 2',
        nameKo: '우드랜드 2존',
        tilemapKey: 'map-woodland-2',
        tilesetKey: 'tileset-woodland',
        bgmKey: 'bgm-field',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_1', targetX: 18, targetY: 10 },
            { x: 20, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_3', targetX: 2, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_nie', x: 5, y: 6, respawnTime: 30000, maxCount: 5 },
            { monsterId: 'mon_wandu', x: 10, y: 3, respawnTime: 30000, maxCount: 5 },
            { monsterId: 'mon_mantis', x: 15, y: 8, respawnTime: 45000, maxCount: 3 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 2
    },
    {
        id: 'map_woodland_3',
        name: 'Woodland Zone 3',
        nameKo: '우드랜드 3존',
        tilemapKey: 'map-woodland-3',
        tilesetKey: 'tileset-woodland',
        bgmKey: 'bgm-forest',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_2', targetX: 18, targetY: 10 },
            { x: 20, y: 10, width: 2, height: 1, targetMapId: 'map_novis_dungeon', targetX: 2, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_mantis', x: 5, y: 5, respawnTime: 45000, maxCount: 4 },
            { monsterId: 'mon_wasp', x: 10, y: 10, respawnTime: 40000, maxCount: 5 },
            { monsterId: 'mon_wolf', x: 15, y: 5, respawnTime: 50000, maxCount: 3 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 4
    },
    {
        id: 'map_novis_dungeon',
        name: 'Novice Dungeon',
        nameKo: '노비스 던전',
        tilemapKey: 'map-novis-dungeon',
        tilesetKey: 'tileset-dungeon',
        bgmKey: 'bgm-dungeon',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_woodland_3', targetX: 18, targetY: 10 },
            { x: 20, y: 10, width: 2, height: 1, targetMapId: 'map_novis_dungeon_b1', targetX: 2, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_spider', x: 5, y: 5, respawnTime: 40000, maxCount: 4 },
            { monsterId: 'mon_centipede', x: 10, y: 10, respawnTime: 50000, maxCount: 3 },
            { monsterId: 'mon_orange_rat', x: 15, y: 5, respawnTime: 35000, maxCount: 5 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 7
    },
    {
        id: 'map_novis_dungeon_b1',
        name: 'Novice Dungeon B1',
        nameKo: '노비스 던전 지하 1층',
        tilemapKey: 'map-novis-dungeon-b1',
        tilesetKey: 'tileset-dungeon',
        bgmKey: 'bgm-dungeon',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_novis_dungeon', targetX: 18, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_centipede', x: 5, y: 5, respawnTime: 50000, maxCount: 4 },
            { monsterId: 'mon_orange_rat', x: 10, y: 10, respawnTime: 35000, maxCount: 6 },
            { monsterId: 'mon_curupay', x: 15, y: 5, respawnTime: 120000, maxCount: 1 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 9
    },

    // ============================================================
    // 2서클 맵 - 피에트 마을, 포테의 숲
    // ============================================================

    {
        id: 'map_piet_village',
        name: 'Piet Village',
        nameKo: '피에트 마을',
        tilemapKey: 'map-piet-village',
        tilesetKey: 'tileset-piet',
        bgmKey: 'bgm-village',
        portals: [
            { x: 10, y: 0, width: 2, height: 1, targetMapId: 'map_pote_forest', targetX: 10, targetY: 15 }
        ],
        spawns: [],
        npcs: [
            { npcId: 'npc_piet_elder', x: 5, y: 5, direction: 'se' },
            { npcId: 'npc_skill_trainer', x: 10, y: 3, direction: 'sw' },
            { npcId: 'npc_weapon_shop', x: 15, y: 7, direction: 'sw' }
        ],
        pvpEnabled: false,
        levelRequirement: 11
    },
    {
        id: 'map_pote_forest',
        name: "Pote's Forest",
        nameKo: '포테의 숲',
        tilemapKey: 'map-pote-forest',
        tilesetKey: 'tileset-forest',
        bgmKey: 'bgm-forest',
        portals: [
            { x: 10, y: 0, width: 2, height: 1, targetMapId: 'map_piet_village', targetX: 10, targetY: 2 }
        ],
        spawns: [
            { monsterId: 'mon_goblin_soldier', x: 5, y: 8, respawnTime: 45000, maxCount: 5 },
            { monsterId: 'mon_goblin_warrior', x: 12, y: 5, respawnTime: 60000, maxCount: 4 },
            { monsterId: 'mon_hobgoblin', x: 8, y: 12, respawnTime: 90000, maxCount: 2 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 11
    },

    // ============================================================
    // 3서클 맵 - 아벨 마을, 아벨 던전
    // ============================================================

    {
        id: 'map_abel_village',
        name: 'Abel Village',
        nameKo: '아벨 마을',
        tilemapKey: 'map-abel-village',
        tilesetKey: 'tileset-abel',
        bgmKey: 'bgm-village',
        portals: [
            { x: 10, y: 15, width: 2, height: 1, targetMapId: 'map_abel_dungeon', targetX: 10, targetY: 2 }
        ],
        spawns: [],
        npcs: [
            { npcId: 'npc_abel_elder', x: 5, y: 5, direction: 'se' },
            { npcId: 'npc_ferry npc', x: 10, y: 10, direction: 'sw' },
            { npcId: 'npc_orange_shop', x: 15, y: 5, direction: 'sw' }
        ],
        pvpEnabled: false,
        levelRequirement: 41
    },
    {
        id: 'map_abel_dungeon',
        name: 'Abel Dungeon',
        nameKo: '아벨 던전',
        tilemapKey: 'map-abel-dungeon',
        tilesetKey: 'tileset-dungeon',
        bgmKey: 'bgm-dungeon',
        portals: [
            { x: 10, y: 0, width: 2, height: 1, targetMapId: 'map_abel_village', targetX: 10, targetY: 13 }
        ],
        spawns: [
            { monsterId: 'mon_skeleton_warrior', x: 5, y: 8, respawnTime: 60000, maxCount: 5 },
            { monsterId: 'mon_ghoul', x: 12, y: 5, respawnTime: 75000, maxCount: 4 },
            { monsterId: 'mon_zombie_knight', x: 8, y: 12, respawnTime: 120000, maxCount: 2 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 41
    },
    {
        id: 'map_abel_coast',
        name: 'Abel Coast Dungeon',
        nameKo: '아벨 해안던전',
        tilemapKey: 'map-abel-coast',
        tilesetKey: 'tileset-coast',
        bgmKey: 'bgm-dungeon',
        portals: [
            { x: 0, y: 10, width: 2, height: 1, targetMapId: 'map_abel_village', targetX: 15, targetY: 10 }
        ],
        spawns: [
            { monsterId: 'mon_abel_crab', x: 5, y: 5, respawnTime: 60000, maxCount: 4 },
            { monsterId: 'mon_sea_witch', x: 12, y: 10, respawnTime: 90000, maxCount: 3 },
            { monsterId: 'mon_vampire', x: 8, y: 15, respawnTime: 150000, maxCount: 1 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 50
    },

    // ============================================================
    // 4서클 맵 - 뤼케시온 마을, 솔던 뤼케시온
    // ============================================================

    {
        id: 'map_lucien_village',
        name: 'Lucien Village',
        nameKo: '뤼케시온 마을',
        tilemapKey: 'map-lucien-village',
        tilesetKey: 'tileset-lucien',
        bgmKey: 'bgm-village',
        portals: [
            { x: 10, y: 15, width: 2, height: 1, targetMapId: 'map_lucien_coast', targetX: 10, targetY: 2 }
        ],
        spawns: [],
        npcs: [
            { npcId: 'npc_lucien_elder', x: 5, y: 5, direction: 'se' },
            { npcId: 'npc_high_level_shop', x: 12, y: 8, direction: 'sw' }
        ],
        pvpEnabled: false,
        levelRequirement: 71
    },
    {
        id: 'map_lucien_coast',
        name: 'Lucien Coast Dungeon',
        nameKo: '뤼케시온 해안던전',
        tilemapKey: 'map-lucien-coast',
        tilesetKey: 'tileset-coast',
        bgmKey: 'bgm-dungeon',
        portals: [
            { x: 10, y: 0, width: 2, height: 1, targetMapId: 'map_lucien_village', targetX: 10, targetY: 13 }
        ],
        spawns: [
            { monsterId: 'mon_kraken', x: 5, y: 8, respawnTime: 90000, maxCount: 4 },
            { monsterId: 'mon_sea_serpent', x: 12, y: 5, respawnTime: 120000, maxCount: 3 },
            { monsterId: 'mon_gargoyle', x: 8, y: 12, respawnTime: 150000, maxCount: 2 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 71
    },

    // ============================================================
    // 5서클 맵 - 마인 마을, 호러케슬
    // ============================================================

    {
        id: 'map_mine_village',
        name: 'Mine Village',
        nameKo: '마인 마을',
        tilemapKey: 'map-mine-village',
        tilesetKey: 'tileset-mine',
        bgmKey: 'bgm-village',
        portals: [
            { x: 5, y: 5, width: 2, height: 2, targetMapId: 'map_horror_castle', targetX: 10, targetY: 15 }
        ],
        spawns: [],
        npcs: [
            { npcId: 'npc_baekwonman', x: 5, y: 8, direction: 'se' },  // 호러케슬 입장 NPC
            { npcId: 'npc_mine_elder', x: 12, y: 5, direction: 'sw' }
        ],
        pvpEnabled: false,
        levelRequirement: 99
    },
    {
        id: 'map_horror_castle',
        name: 'Horror Castle',
        nameKo: '호러케슬',
        tilemapKey: 'map-horror-castle',
        tilesetKey: 'tileset-castle',
        bgmKey: 'bgm-battle',
        portals: [
            { x: 10, y: 15, width: 2, height: 1, targetMapId: 'map_mine_village', targetX: 5, targetY: 5 }
        ],
        spawns: [
            { monsterId: 'mon_horror_knight', x: 5, y: 8, respawnTime: 120000, maxCount: 5 },
            { monsterId: 'mon_blood_countess', x: 12, y: 5, respawnTime: 180000, maxCount: 3 },
            { monsterId: 'mon_dark_archmage', x: 8, y: 12, respawnTime: 240000, maxCount: 2 },
            { monsterId: 'mon_dracula', x: 15, y: 10, respawnTime: 600000, maxCount: 1 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 99
    }
];

export function getMapById(id: string): MapDefinition | undefined {
    return MAPS.find(m => m.id === id);
}

/**
 * 절차적 맵 생성 (Tiled 맵이 없을 때 사용)
 * 에셋이 준비되면 실제 Tiled 맵으로 교체
 */
export function generateProceduralMap(width: number, height: number): number[][] {
    const map: number[][] = [];

    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            // 가장자리는 벽
            if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                row.push(0); // 벽
            } else {
                // 랜덤 타일
                const rand = Math.random();
                if (rand < 0.7) row.push(1);      // 잔디
                else if (rand < 0.85) row.push(2); // 잔디2
                else if (rand < 0.95) row.push(3); // 길
                else row.push(4);                  // 장식
            }
        }
        map.push(row);
    }

    return map;
}
