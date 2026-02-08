/**
 * ============================================================
 * NPC 엔티티
 * ============================================================
 */

import Phaser from 'phaser';
import type { NPCDefinition, Position } from '../types/game.types';
import { getNpcById } from '../data/npcs.data';
import { GAME_CONSTANTS } from '../config/game.config';

export class NPC extends Phaser.GameObjects.Container {
    private definition: NPCDefinition;
    private worldPos: Position;
    private sprite!: Phaser.GameObjects.Rectangle;
    private nameText!: Phaser.GameObjects.Text;
    private interactIcon!: Phaser.GameObjects.Text;
    private isPlayerNear: boolean = false;

    constructor(
        scene: Phaser.Scene,
        npcId: string,
        worldX: number,
        worldY: number
    ) {
        super(scene, 0, 0);

        const def = getNpcById(npcId);
        if (!def) throw new Error(`NPC not found: ${npcId}`);

        this.definition = def;
        this.worldPos = { x: worldX, y: worldY };

        this.updateScreenPosition();
        scene.add.existing(this);

        // 스프라이트 (플레이스홀더 - 타입에 따라 색상)
        const color = this.getColorByType(def.type);
        this.sprite = scene.add.rectangle(0, -16, 24, 32, color);
        this.add(this.sprite);

        // 이름
        this.nameText = scene.add.text(0, -55, def.nameKo, {
            fontSize: '12px',
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.add(this.nameText);

        // 상호작용 아이콘 (말풍선)
        this.interactIcon = scene.add.text(0, -75, '💬', {
            fontSize: '16px'
        }).setOrigin(0.5).setVisible(false);
        this.add(this.interactIcon);

        // 클릭 이벤트
        this.sprite.setInteractive({ useHandCursor: true });
        this.sprite.on('pointerdown', () => this.onInteract());
    }

    /** NPC 타입에 따른 색상 */
    private getColorByType(type: string): number {
        switch (type) {
            case 'merchant': return 0x88ff88; // 초록 (상인)
            case 'quest': return 0xffff00;    // 노랑 (퀘스트)
            case 'trainer': return 0x8888ff;  // 파랑 (트레이너)
            case 'guard': return 0xaaaaaa;    // 회색 (경비)
            default: return 0xffffff;
        }
    }

    /** 화면 좌표 업데이트 */
    private updateScreenPosition(): void {
        const tileW = GAME_CONSTANTS.TILE_WIDTH;
        const tileH = GAME_CONSTANTS.TILE_HEIGHT;
        const offsetX = this.scene.cameras.main.width / 2;
        const offsetY = 150;

        this.x = (this.worldPos.x - this.worldPos.y) * (tileW / 2) + offsetX;
        this.y = (this.worldPos.x + this.worldPos.y) * (tileH / 2) + offsetY;
        this.setDepth((this.worldPos.x + this.worldPos.y) * 10 + 100);
    }

    /** 플레이어 근접 체크 */
    checkPlayerDistance(playerPos: Position): void {
        const dist = Math.sqrt(
            Math.pow(playerPos.x - this.worldPos.x, 2) +
            Math.pow(playerPos.y - this.worldPos.y, 2)
        );

        const wasNear = this.isPlayerNear;
        this.isPlayerNear = dist <= 1.5;

        if (this.isPlayerNear !== wasNear) {
            this.interactIcon.setVisible(this.isPlayerNear);

            if (this.isPlayerNear) {
                // 상호작용 가능 표시
                this.scene.tweens.add({
                    targets: this.interactIcon,
                    y: this.interactIcon.y - 5,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                this.scene.tweens.killTweensOf(this.interactIcon);
            }
        }
    }

    /** 상호작용 */
    onInteract(): void {
        if (!this.isPlayerNear) return;

        this.scene.events.emit('npcInteract', {
            npc: this.definition,
            dialogueId: this.definition.dialogueId,
            shopId: this.definition.shopId,
            questIds: this.definition.questIds
        });
    }

    getDefinition(): NPCDefinition { return this.definition; }
    getWorldPos(): Position { return { ...this.worldPos }; }
}
