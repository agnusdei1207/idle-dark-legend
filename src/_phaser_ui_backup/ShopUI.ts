/**
 * ============================================================
 * 상점 UI
 * ============================================================
 */

import Phaser from 'phaser';
import { InventorySystem } from '../systems/InventorySystem';
import { getItemById, CONSUMABLES, WEAPONS, ARMORS } from '../data/items.data';
import type { ItemDefinition } from '../types/game.types';

interface ShopData {
    id: string;
    name: string;
    items: ItemDefinition[];
}

const SHOPS: Record<string, ShopData> = {
    shop_weapons: {
        id: 'shop_weapons',
        name: '무기 상점',
        items: WEAPONS.slice(0, 4)
    },
    shop_potions: {
        id: 'shop_potions',
        name: '포션 상점',
        items: CONSUMABLES
    }
};

export class ShopUI extends Phaser.GameObjects.Container {
    private inventory: InventorySystem;
    private currentShop: ShopData | null = null;
    private background!: Phaser.GameObjects.Rectangle;
    private itemsContainer!: Phaser.GameObjects.Container;
    private goldText!: Phaser.GameObjects.Text;
    private isOpen: boolean = false;

    constructor(scene: Phaser.Scene, inventory: InventorySystem) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        this.inventory = inventory;
        scene.add.existing(this);
        this.setDepth(1000);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const width = 400;
        const height = 450;

        // 배경
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.95);
        this.background.setStrokeStyle(2, 0x4a9a4a);
        this.add(this.background);

        // 제목 (동적)
        const title = this.scene.add.text(0, -height / 2 + 25, '상점', {
            fontSize: '20px', color: '#88ff88', fontStyle: 'bold'
        }).setOrigin(0.5);
        title.setName('title');
        this.add(title);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(width / 2 - 20, -height / 2 + 20, '✕', {
            fontSize: '20px', color: '#ff6666'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.close());
        this.add(closeBtn);

        // 아이템 목록 컨테이너
        this.itemsContainer = this.scene.add.container(0, -height / 2 + 70);
        this.add(this.itemsContainer);

        // 골드 표시
        this.goldText = this.scene.add.text(0, height / 2 - 30, '', {
            fontSize: '16px', color: '#ffd700'
        }).setOrigin(0.5);
        this.add(this.goldText);
    }

    open(shopId: string): void {
        const shop = SHOPS[shopId];
        if (!shop) return;

        this.currentShop = shop;
        this.isOpen = true;
        this.setVisible(true);
        this.refresh();
    }

    close(): void {
        this.isOpen = false;
        this.setVisible(false);
        this.currentShop = null;
    }

    refresh(): void {
        if (!this.currentShop) return;

        this.itemsContainer.removeAll(true);

        // 제목 업데이트
        const title = this.getByName('title') as Phaser.GameObjects.Text;
        if (title) title.setText(`🏪 ${this.currentShop.name}`);

        // 골드 업데이트
        this.goldText.setText(`💰 보유 골드: ${this.inventory.getGold().toLocaleString()}`);

        // 아이템 목록
        this.currentShop.items.forEach((item, index) => {
            const y = index * 55;

            // 아이템 배경
            const itemBg = this.scene.add.rectangle(0, y, 350, 50, 0x2a2a4e);
            itemBg.setStrokeStyle(1, 0x4a4a6a);
            this.itemsContainer.add(itemBg);

            // 아이템 이름
            const nameText = this.scene.add.text(-150, y - 10, item.nameKo, {
                fontSize: '14px', color: '#ffffff'
            });
            this.itemsContainer.add(nameText);

            // 가격
            const priceText = this.scene.add.text(-150, y + 10, `💰 ${item.buyPrice}`, {
                fontSize: '12px', color: '#ffd700'
            });
            this.itemsContainer.add(priceText);

            // 구매 버튼
            const canBuy = this.inventory.getGold() >= item.buyPrice;
            const buyBtn = this.scene.add.text(130, y, '[ 구매 ]', {
                fontSize: '13px',
                color: canBuy ? '#00ff00' : '#666666'
            }).setOrigin(0.5).setInteractive({ useHandCursor: canBuy });

            if (canBuy) {
                buyBtn.on('pointerover', () => buyBtn.setColor('#88ff88'));
                buyBtn.on('pointerout', () => buyBtn.setColor('#00ff00'));
                buyBtn.on('pointerdown', () => this.buyItem(item));
            }

            this.itemsContainer.add(buyBtn);
        });
    }

    private buyItem(item: ItemDefinition): void {
        if (!this.inventory.spendGold(item.buyPrice)) {
            // 골드 부족 메시지
            return;
        }

        if (!this.inventory.addItem(item.id, 1)) {
            // 인벤토리 가득 참 - 골드 환불
            this.inventory.addGold(item.buyPrice);
            return;
        }

        this.scene.events.emit('itemPurchased', item);
        this.refresh();
    }

    getIsOpen(): boolean { return this.isOpen; }
}
