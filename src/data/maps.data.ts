/**
 * ============================================================
 * 맵 데이터베이스
 * ============================================================
 * 
 * [에셋 교체]
 * 1. Tiled에서 맵 생성 후 JSON으로 내보내기
 * 2. public/assets/maps/ 폴더에 저장
 * 3. tilemapKey를 실제 파일명으로 변경
 * ============================================================
 */

import type { MapDefinition } from '../types/game.types';

export const MAPS: MapDefinition[] = [
    {
        id: 'map_village',
        name: 'Starting Village',
        nameKo: '시작 마을',
        tilemapKey: 'map-village',
        tilesetKey: 'tileset-village',
        bgmKey: 'bgm-village',
        portals: [
            { x: 9, y: 5, width: 1, height: 1, targetMapId: 'map_field', targetX: 1, targetY: 5 }
        ],
        spawns: [],  // 마을에는 몬스터 없음
        npcs: [
            { npcId: 'npc_village_elder', x: 3, y: 3, direction: 'se' },
            { npcId: 'npc_blacksmith', x: 6, y: 2, direction: 'sw' },
            { npcId: 'npc_potion_seller', x: 6, y: 5, direction: 'sw' },
            { npcId: 'npc_guard', x: 8, y: 5, direction: 'se' }
        ],
        pvpEnabled: false,
        levelRequirement: 1
    },
    {
        id: 'map_field',
        name: 'Grassland',
        nameKo: '초원',
        tilemapKey: 'map-field',
        tilesetKey: 'tileset-field',
        bgmKey: 'bgm-field',
        portals: [
            { x: 0, y: 5, width: 1, height: 1, targetMapId: 'map_village', targetX: 8, targetY: 5 },
            { x: 15, y: 8, width: 1, height: 1, targetMapId: 'map_forest', targetX: 1, targetY: 5 }
        ],
        spawns: [
            { monsterId: 'mon_slime', x: 5, y: 3, respawnTime: 30000, maxCount: 3 },
            { monsterId: 'mon_slime', x: 8, y: 6, respawnTime: 30000, maxCount: 2 },
            { monsterId: 'mon_wolf', x: 12, y: 4, respawnTime: 45000, maxCount: 2 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 1
    },
    {
        id: 'map_forest',
        name: 'Dark Forest',
        nameKo: '어두운 숲',
        tilemapKey: 'map-forest',
        tilesetKey: 'tileset-forest',
        bgmKey: 'bgm-forest',
        portals: [
            { x: 0, y: 5, width: 1, height: 1, targetMapId: 'map_field', targetX: 14, targetY: 8 }
        ],
        spawns: [
            { monsterId: 'mon_wolf', x: 5, y: 3, respawnTime: 40000, maxCount: 3 },
            { monsterId: 'mon_goblin', x: 8, y: 6, respawnTime: 60000, maxCount: 2 },
            { monsterId: 'mon_goblin', x: 12, y: 4, respawnTime: 60000, maxCount: 2 },
            { monsterId: 'mon_skeleton', x: 10, y: 8, respawnTime: 90000, maxCount: 1 }
        ],
        npcs: [],
        pvpEnabled: false,
        levelRequirement: 5
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
