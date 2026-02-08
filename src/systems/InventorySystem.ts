/**
 * ============================================================
 * 인벤토리 시스템
 * ============================================================
 * 
 * 아이템 보관, 장착, 사용을 관리합니다.
 * ============================================================
 */

import Phaser from 'phaser';
import type { InventorySlot, EquipSlot, ItemDefinition } from '../types/game.types';
import { getItemById, isEquipment, isConsumable } from '../data/items.data';

/** 인벤토리 크기 */
const INVENTORY_SIZE = 30;

export class InventorySystem extends Phaser.Events.EventEmitter {
    private slots: InventorySlot[] = [];
    private equipment: Record<EquipSlot, string | null>;
    private gold: number = 0;

    constructor() {
        super();
        // 인벤토리 초기화
        for (let i = 0; i < INVENTORY_SIZE; i++) {
            this.slots.push({ itemId: null, quantity: 0 });
        }
        // 장비 슬롯 초기화
        this.equipment = {
            weapon: null, shield: null, helmet: null, armor: null,
            gloves: null, boots: null, necklace: null, ring1: null, ring2: null
        };
    }

    /** 아이템 추가 */
    addItem(itemId: string, quantity: number = 1): boolean {
        const item = getItemById(itemId);
        if (!item) return false;

        if (item.stackable) {
            // 기존 스택에 추가 시도
            const existingSlot = this.slots.find(
                s => s.itemId === itemId && s.quantity < item.maxStack
            );
            if (existingSlot) {
                const canAdd = Math.min(quantity, item.maxStack - existingSlot.quantity);
                existingSlot.quantity += canAdd;
                quantity -= canAdd;
                this.emit('inventoryChanged', this.slots);
                if (quantity <= 0) return true;
            }
        }

        // 빈 슬롯에 추가
        while (quantity > 0) {
            const emptySlot = this.slots.find(s => s.itemId === null);
            if (!emptySlot) {
                this.emit('inventoryFull');
                return false;
            }
            const addAmount = item.stackable ? Math.min(quantity, item.maxStack) : 1;
            emptySlot.itemId = itemId;
            emptySlot.quantity = addAmount;
            quantity -= addAmount;
        }

        this.emit('inventoryChanged', this.slots);
        this.emit('itemAdded', itemId, quantity);
        return true;
    }

    /** 아이템 제거 */
    removeItem(itemId: string, quantity: number = 1): boolean {
        let remaining = quantity;
        for (const slot of this.slots) {
            if (slot.itemId === itemId && remaining > 0) {
                const removeAmount = Math.min(remaining, slot.quantity);
                slot.quantity -= removeAmount;
                remaining -= removeAmount;
                if (slot.quantity <= 0) {
                    slot.itemId = null;
                    slot.quantity = 0;
                }
            }
        }
        if (remaining < quantity) {
            this.emit('inventoryChanged', this.slots);
            return true;
        }
        return false;
    }

    /** 아이템 개수 확인 */
    getItemCount(itemId: string): number {
        return this.slots
            .filter(s => s.itemId === itemId)
            .reduce((sum, s) => sum + s.quantity, 0);
    }

    /** 아이템 사용 */
    useItem(slotIndex: number): boolean {
        const slot = this.slots[slotIndex];
        if (!slot || !slot.itemId) return false;

        const item = getItemById(slot.itemId);
        if (!item) return false;

        if (isConsumable(item)) {
            this.emit('useConsumable', item);
            this.removeItem(item.id, 1);
            return true;
        }

        if (isEquipment(item)) {
            return this.equipItem(slotIndex);
        }

        return false;
    }

    /** 장비 장착 */
    equipItem(slotIndex: number): boolean {
        const slot = this.slots[slotIndex];
        if (!slot || !slot.itemId) return false;

        const item = getItemById(slot.itemId);
        if (!item || !isEquipment(item)) return false;

        // 기존 장비 해제
        const currentEquipped = this.equipment[item.slot];

        // 새 장비 장착
        this.equipment[item.slot] = item.id;
        slot.itemId = null;
        slot.quantity = 0;

        // 기존 장비를 인벤토리에 추가
        if (currentEquipped) {
            this.addItem(currentEquipped, 1);
        }

        this.emit('equipmentChanged', this.equipment);
        this.emit('inventoryChanged', this.slots);
        return true;
    }

    /** 장비 해제 */
    unequipItem(equipSlot: EquipSlot): boolean {
        const itemId = this.equipment[equipSlot];
        if (!itemId) return false;

        if (!this.addItem(itemId, 1)) return false;
        this.equipment[equipSlot] = null;
        this.emit('equipmentChanged', this.equipment);
        return true;
    }

    /** 골드 추가 */
    addGold(amount: number): void {
        this.gold += amount;
        this.emit('goldChanged', this.gold);
    }

    /** 골드 사용 */
    spendGold(amount: number): boolean {
        if (this.gold < amount) return false;
        this.gold -= amount;
        this.emit('goldChanged', this.gold);
        return true;
    }

    /** 상태 가져오기 */
    getSlots(): InventorySlot[] { return [...this.slots]; }
    getEquipment(): Record<EquipSlot, string | null> { return { ...this.equipment }; }
    getGold(): number { return this.gold; }

    /** 저장 데이터 생성 */
    getSaveData() {
        return { slots: this.slots, equipment: this.equipment, gold: this.gold };
    }

    /** 저장 데이터 로드 */
    loadSaveData(data: { slots: InventorySlot[], equipment: Record<EquipSlot, string | null>, gold: number }) {
        this.slots = data.slots;
        this.equipment = data.equipment;
        this.gold = data.gold;
        this.emit('inventoryChanged', this.slots);
        this.emit('equipmentChanged', this.equipment);
        this.emit('goldChanged', this.gold);
    }
}
