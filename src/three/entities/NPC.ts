/**
 * ============================================================
 * NPC - NPC 엔티티 (2.5D)
 * ============================================================
 * 3D 모델 기반 NPC 캐릭터
 * ============================================================
 */

import * as THREE from 'three';
import type { ThreeGame } from '../core/ThreeGame';
import type { NPCDefinition } from '../../types/game.types';
import { IsometricUtils } from '../utils/IsometricUtils';

/**
 * NPC 클래스
 */
export class NPC {
    public readonly mesh: THREE.Group;

    private game: ThreeGame;
    public data: NPCDefinition;

    constructor(game: ThreeGame, data: NPCDefinition, tileX: number, tileY: number) {
        this.game = game;
        this.data = data;

        this.mesh = new THREE.Group();

        // NPC 메시 생성
        this.createNPCMesh(data.type);

        // 위치 설정
        const pos = IsometricUtils.tileToWorld(tileX, tileY, 64, 32);
        this.mesh.position.set(pos.x, pos.y, 0);

        // Z-index 정렬
        this.mesh.position.z = pos.x + pos.y;
    }

    /**
     * NPC 메시 생성 (박스 형태)
     */
    private createNPCMesh(type: string): void {
        // NPC 타입별 색상
        const colors: Record<string, number> = {
            merchant: 0xf39c12,
            quest: 0x9b59b6,
            trainer: 0x2ecc71,
            banker: 0x34495e,
            guard: 0xe74c3c,
            citizen: 0x95a5a6
        };

        const color = colors[type] || 0x95a5a6;

        // 바디
        const bodyGeometry = new THREE.BoxGeometry(28, 44, 14);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 22;
        body.castShadow = true;
        this.mesh.add(body);

        // 머리
        const headGeometry = new THREE.BoxGeometry(20, 20, 20);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf5deb3 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 44;
        head.castShadow = true;
        this.mesh.add(head);

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(16, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -4;
        this.mesh.add(shadow);
    }

    /**
     * 대화 가능 범위 확인
     */
    public isInRange(playerPosition: { x: number; y: number }): boolean {
        const dx = this.mesh.position.x - playerPosition.x;
        const dy = this.mesh.position.y - playerPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 80; // 상호작용 범위
    }

    /**
     * 파괴
     */
    public destroy(): void {
        // 메시 정리
    }
}
