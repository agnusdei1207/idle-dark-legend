/**
 * ============================================================
 * 인벤토리 UI
 * ============================================================
 */

import Phaser from 'phaser';
import { InventorySystem } from '../systems/InventorySystem';
import { getItemById } from '../data/items.data';

const SLOT_SIZE = 48;
const SLOTS_PER_ROW = 6;
const ROWS = 5;
const PADDING = 8;

export class InventoryUI extends Phaser.GameObjects.Container {
    private inventory: InventorySystem;
    private background!: Phaser.GameObjects.Rectangle;
    private slots: Phaser.GameObjects.Rectangle[] = [];
    private items: Phaser.GameObjects.Container[] = [];
    private goldText!: Phaser.GameObjects.Text;
    private tooltipContainer!: Phaser.GameObjects.Container;
    private isOpen: boolean = false;

    constructor(scene: Phaser.Scene, inventory: InventorySystem) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        this.inventory = inventory;
        scene.add.existing(this);
        this.setDepth(1000);
        this.setVisible(false);

        this.createUI();
        this.setupEvents();
    }

    private createUI(): void {
        const width = SLOTS_PER_ROW * (SLOT_SIZE + PADDING) + PADDING;
        const height = ROWS * (SLOT_SIZE + PADDING) + PADDING + 80;

        // 배경
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.95);
        this.background.setStrokeStyle(2, 0x4a4a6a);
        this.add(this.background);

        // 제목
        const title = this.scene.add.text(0, -height / 2 + 20, '인벤토리', {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(title);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(width / 2 - 20, -height / 2 + 15, '✕', {
            fontSize: '20px', color: '#ff6666'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggle());
        this.add(closeBtn);

        // 슬롯 생성
        const startX = -width / 2 + PADDING + SLOT_SIZE / 2;
        const startY = -height / 2 + 60 + SLOT_SIZE / 2;

        for (let i = 0; i < 30; i++) {
            const row = Math.floor(i / SLOTS_PER_ROW);
            const col = i % SLOTS_PER_ROW;
            const x = startX + col * (SLOT_SIZE + PADDING);
            const y = startY + row * (SLOT_SIZE + PADDING);

            const slot = this.scene.add.rectangle(x, y, SLOT_SIZE, SLOT_SIZE, 0x2a2a4e);
            slot.setStrokeStyle(1, 0x4a4a6a);
            slot.setInteractive({ useHandCursor: true });
            slot.setData('index', i);

            slot.on('pointerover', () => this.showTooltip(i));
            slot.on('pointerout', () => this.hideTooltip());
            slot.on('pointerdown', () => this.useItem(i));

            this.slots.push(slot);
            this.add(slot);

            // 아이템 컨테이너
            const itemContainer = this.scene.add.container(x, y);
            this.items.push(itemContainer);
            this.add(itemContainer);
        }

        // 골드 표시
        this.goldText = this.scene.add.text(0, height / 2 - 30, '💰 0 Gold', {
            fontSize: '16px', color: '#ffd700'
        }).setOrigin(0.5);
        this.add(this.goldText);

        // 툴팁 컨테이너
        this.tooltipContainer = this.scene.add.container(0, 0).setVisible(false);
        this.add(this.tooltipContainer);
    }

    private setupEvents(): void {
        this.inventory.on('inventoryChanged', () => this.refresh());
        this.inventory.on('goldChanged', (gold: number) => {
            this.goldText.setText(`💰 ${gold.toLocaleString()} Gold`);
        });
    }

    refresh(): void {
        const slots = this.inventory.getSlots();

        for (let i = 0; i < 30; i++) {
            const container = this.items[i];
            container.removeAll(true);

            const slotData = slots[i];
            if (slotData.itemId) {
                const item = getItemById(slotData.itemId);
                if (item) {
                    // 아이템 아이콘 (텍스트 플레이스홀더)
                    const icon = this.scene.add.text(0, 0, this.getItemEmoji(item.type), {
                        fontSize: '24px'
                    }).setOrigin(0.5);
                    container.add(icon);

                    // 수량
                    if (slotData.quantity > 1) {
                        const qty = this.scene.add.text(14, 14, `${slotData.quantity}`, {
                            fontSize: '10px', color: '#ffffff',
                            stroke: '#000000', strokeThickness: 2
                        }).setOrigin(1);
                        container.add(qty);
                    }

                    // 희귀도 테두리
                    const rarityColor = this.getRarityColor(item.rarity);
                    this.slots[i].setStrokeStyle(2, rarityColor);
                }
            } else {
                this.slots[i].setStrokeStyle(1, 0x4a4a6a);
            }
        }
    }

    private getItemEmoji(type: string): string {
        switch (type) {
            case 'weapon': return '⚔️';
            case 'armor': return '🛡️';
            case 'accessory': return '💍';
            case 'consumable': return '🧪';
            case 'material': return '💎';
            default: return '📦';
        }
    }

    private getRarityColor(rarity: string): number {
        switch (rarity) {
            case 'common': return 0xaaaaaa;
            case 'uncommon': return 0x00ff00;
            case 'rare': return 0x0088ff;
            case 'epic': return 0xaa00ff;
            case 'legendary': return 0xff8800;
            default: return 0xffffff;
        }
    }

    private showTooltip(slotIndex: number): void {
        const slots = this.inventory.getSlots();
        const slotData = slots[slotIndex];
        if (!slotData.itemId) return;

        const item = getItemById(slotData.itemId);
        if (!item) return;

        this.tooltipContainer.removeAll(true);

        const bg = this.scene.add.rectangle(0, 0, 180, 100, 0x000000, 0.9);
        bg.setStrokeStyle(1, this.getRarityColor(item.rarity));
        this.tooltipContainer.add(bg);

        const nameText = this.scene.add.text(0, -35, item.nameKo, {
            fontSize: '14px', color: '#' + this.getRarityColor(item.rarity).toString(16).padStart(6, '0'),
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tooltipContainer.add(nameText);

        const descText = this.scene.add.text(0, 0, item.description, {
            fontSize: '11px', color: '#aaaaaa', wordWrap: { width: 160 }
        }).setOrigin(0.5);
        this.tooltipContainer.add(descText);

        const priceText = this.scene.add.text(0, 35, `판매가: ${item.sellPrice}G`, {
            fontSize: '10px', color: '#ffd700'
        }).setOrigin(0.5);
        this.tooltipContainer.add(priceText);

        // 위치
        const slot = this.slots[slotIndex];
        this.tooltipContainer.setPosition(slot.x, slot.y - 80);
        this.tooltipContainer.setVisible(true);
    }

    private hideTooltip(): void {
        this.tooltipContainer.setVisible(false);
    }

    private useItem(slotIndex: number): void {
        this.inventory.useItem(slotIndex);
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
        if (this.isOpen) this.refresh();
    }

    getIsOpen(): boolean { return this.isOpen; }
}
