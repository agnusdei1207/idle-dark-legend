/**
 * ============================================================
 * IsometricUtils - 아이소메트릭 유틸리티
 * ============================================================
 * 아이소메트릭 투영 및 좌표 변환 유틸리티
 * ============================================================
 */

import * as THREE from 'three';

/**
 * 아이소메트릭 변환 상수
 */
const ISO_ANGLE = Math.PI / 6; // 30도
const COS_30 = Math.cos(ISO_ANGLE);
const SIN_30 = Math.sin(ISO_ANGLE);

/**
 * 2D 타일 좌표
 */
export interface TileCoord {
    x: number;
    y: number;
}

/**
 * 월드 좌표
 */
export interface WorldCoord {
    x: number;
    y: number;
    z: number;
}

/**
 * IsometricUtils 클래스
 */
export class IsometricUtils {
    /**
     * 2D 타일 좌표 → 월드 좌표 (아이소메트릭)
     */
    public static tileToWorld(tileX: number, tileY: number, tileWidth: number = 64, tileHeight: number = 32): WorldCoord {
        const worldX = (tileX - tileY) * (tileWidth / 2);
        const worldY = (tileX + tileY) * (tileHeight / 2);
        return { x: worldX, y: worldY, z: 0 };
    }

    /**
     * 월드 좌표 → 2D 타일 좌표
     */
    public static worldToTile(worldX: number, worldY: number, tileWidth: number = 64, tileHeight: number = 32): TileCoord {
        const tileX = Math.floor((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2);
        const tileY = Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);
        return { x: tileX, y: tileY };
    }

    /**
     * 화면 좌표 → 월드 좌표
     */
    public static screenToWorld(
        screenX: number,
        screenY: number,
        camera: THREE.Camera,
        canvasWidth: number,
        canvasHeight: number
    ): { x: number; y: number } {
        // NDC (Normalized Device Coordinates)로 변환
        const ndcX = (screenX / canvasWidth) * 2 - 1;
        const ndcY = -(screenY / canvasHeight) * 2 + 1;

        // Orthographic camera인 경우
        if (camera instanceof THREE.OrthographicCamera) {
            const worldX = ndcX * camera.right * camera.zoom;
            const worldY = ndcY * camera.top * camera.zoom;
            return { x: worldX, y: worldY };
        }

        // Perspective camera인 경우 (raycasting)
        // TODO: raycasting 구현 필요
        return { x: ndcX, y: ndcY };
    }

    /**
     * 아이소메트릭 행렬 생성
     */
    public static createIsometricMatrix(): THREE.Matrix4 {
        const matrix = new THREE.Matrix4();
        matrix.makeRotationX(ISO_ANGLE);
        return matrix;
    }

    /**
     * 아이소메트릭 Orthographic Camera 생성
     */
    public static createIsometricCamera(
        viewWidth: number,
        viewHeight: number,
        near: number = 0.1,
        far: number = 1000
    ): THREE.OrthographicCamera {
        const aspectRatio = viewWidth / viewHeight;
        const frustumSize = viewHeight;

        const camera = new THREE.OrthographicCamera(
            (frustumSize * aspectRatio) / -2,
            (frustumSize * aspectRatio) / 2,
            frustumSize / 2,
            frustumSize / -2,
            near,
            far
        );

        // 아이소메트릭 뷰 각도
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        // X축 회전으로 아이소메트릭 뷰
        camera.rotateX(ISO_ANGLE);

        return camera;
    }

    /**
     * Z-index 정렬 (깊이 정렬)
     */
    public static sortDepth(objects: THREE.Object3D[]): void {
        objects.sort((a, b) => {
            return (a.position.y + a.position.x) - (b.position.y + b.position.x);
        });
    }

    /**
     * 아이소메트릭 타일 메시 생성
     */
    public static createTileMesh(
        width: number = 64,
        height: number = 32,
        color: number = 0xffffff
    ): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // 평평하게

        return mesh;
    }

    /**
     * 타일 그리드 생성
     */
    public static createTileGrid(
        width: number,
        height: number,
        tileSize: { width: number; height: number } = { width: 64, height: 32 },
        color: number = 0x444444
    ): THREE.Group {
        const group = new THREE.Group();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pos = this.tileToWorld(x, y, tileSize.width, tileSize.height);
                const tile = this.createTileMesh(tileSize.width, tileSize.height, color);
                tile.position.set(pos.x, pos.y, 0);

                // 그리드 라인 효과를 위해 색상 번갈아가며
                if ((x + y) % 2 === 0) {
                    (tile.material as THREE.MeshBasicMaterial).color.setHex(0x555555);
                }

                group.add(tile);
            }
        }

        return group;
    }

    /**
     * 아이소메트릭 방향 벡터 (8방향)
     */
    public static getDirectionVector(direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): THREE.Vector2 {
        const vectors: THREE.Vector2[] = [
            new THREE.Vector2(0, 1),    // N (위)
            new THREE.Vector2(1, 1),    // NE
            new THREE.Vector2(1, 0),    // E (오른쪽)
            new THREE.Vector2(1, -1),   // SE
            new THREE.Vector2(0, -1),   // S (아래)
            new THREE.Vector2(-1, -1),  // SW
            new THREE.Vector2(-1, 0),   // W (왼쪽)
            new THREE.Vector2(-1, 1),   // NW
        ];

        return vectors[direction] || vectors[0];
    }

    /**
     * 방향 계산 (0-7)
     */
    public static getDirection(from: { x: number; y: number }, to: { x: number; y: number }): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);

        // 8방향으로 변환
        const octant = Math.round(8 * angle / (2 * Math.PI) + 8) % 8;

        // 아이소메트릭 보정
        return (octant + 6) % 8;
    }
}
