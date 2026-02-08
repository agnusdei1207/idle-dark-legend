/**
 * ============================================================
 * IsometricUtils - 아이소메트릭 유틸리티
 * ============================================================
 * 아이소메트릭 투영 및 좌표 변환 유틸리티
 * ============================================================
 */

import * as THREE from 'three';

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
        const worldZ = worldX + worldY; // Z-index용
        return { x: worldX, y: worldY, z: worldZ };
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
     * 아이소메트릭 Orthographic Camera 생성
     * 2D 평면 위에서 아이소메트릭 뷰를 위한 카메라
     */
    public static createIsometricCamera(
        viewWidth: number,
        viewHeight: number,
        near: number = -1000,
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

        // 2D 아이소메트릭 뷰: 카메라는 Z축 위에서 내려다보는 형태
        // 회전 없이 직접 위에서 바라봄
        camera.position.set(0, 0, 1);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);

        return camera;
    }

    /**
     * Z-index 정렬 (깊이 정렬)
     * 엔티티의 Z-position을 업데이트하여 올바른 렌더링 순서 보장
     */
    public static updateObjectDepth(object: THREE.Object3D): void {
        // 아이소메트릭에서는 y + x 값이 클수록 더 앞에 있음
        // Three.js에서는 Z-position이 렌더링 순서를 결정 (음수일수록 뒤, 양수일수록 앞)
        const depth = object.position.y + object.position.x;
        object.position.z = depth;

        // 그룹의 모든 자식도 같은 Z-position을 가지도록
        if (object instanceof THREE.Group) {
            object.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    child.position.z = depth;
                    child.renderOrder = Math.floor(depth);
                }
            });
        }
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
                tile.position.set(pos.x, pos.y, pos.z);

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
     * 화면 방향을 아이소메트릭 방향으로 변환
     * 화면에서의 입력 방향(위, 아래, 좌, 우)을 아이소메트릭 타일 방향으로 변환
     */
    public static screenDirectionToIsometric(
        screenDir: { x: number; y: number }
    ): { x: number; y: number } {
        // 화면 방향을 아이소메트릭 방향으로 변환
        // 위(+y) → 북동쪽 (타일 x+1, y+0)
        // 아래(-y) → 남서쪽 (타일 x-1, y-0)
        // 오른쪽(+x) → 남동쪽 (타일 x+0, y+1)
        // 왼쪽(-x) → 북서쪽 (타일 x-0, y-1)

        // 45도 회전 행렬 적용
        const cos45 = Math.cos(Math.PI / 4);
        const sin45 = Math.sin(Math.PI / 4);

        return {
            x: screenDir.x * cos45 - screenDir.y * sin45,
            y: screenDir.x * sin45 + screenDir.y * cos45
        };
    }

    /**
     * 아이소메트릭 방향 벡터 (8방향)
     */
    public static getDirectionVector(direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): THREE.Vector2 {
        const vectors: THREE.Vector2[] = [
            new THREE.Vector2(0, 1),     // N (위)
            new THREE.Vector2(1, 1),     // NE
            new THREE.Vector2(1, 0),     // E (오른쪽)
            new THREE.Vector2(1, -1),    // SE
            new THREE.Vector2(0, -1),    // S (아래)
            new THREE.Vector2(-1, -1),   // SW
            new THREE.Vector2(-1, 0),    // W (왼쪽)
            new THREE.Vector2(-1, 1),    // NW
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

    /**
     * 색상 스프라이트 생성 (간단한 박스)
     */
    public static createColorSprite(
        color: number,
        width: number,
        height: number
    ): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide
        });
        const sprite = new THREE.Mesh(geometry, material);
        return sprite;
    }
}
