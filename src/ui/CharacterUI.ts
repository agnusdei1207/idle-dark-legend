/**
 * ============================================================
 * 캐릭터 정보 UI (C 키)
 * ============================================================
 * 
 * 어둠의전설 스타일:
 * - 캐릭터 전신 이미지
 * - 장비 슬롯 (8방향 배치)
 * - 스탯 정보
 * - 장비 보너스
 * ============================================================
 */

import Phaser from 'phaser';
import type { BaseStats, CombatStats, EquipSlot } from '../types/game.types';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x3a3a5e,
    PANEL_DARK: 0x0a0a1e,
    SLOT_EMPTY: 0x2a2a4e,
    SLOT_EQUIPPED: 0x3a4a3e,
    TEXT_WHITE: '#ffffff',
    TEXT_GOLD: '#ffd700',
    TEXT_GREEN: '#44ff44',
    TEXT_RED: '#ff4444',
    TEXT_SILVER: '#c0c0c0',
};

export class CharacterUI extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private background!: Phaser.GameObjects.Rectangle;
    private titleBar!: Phaser.GameObjects.Container;
    private equipmentSlots: Map<EquipSlot, Phaser.GameObjects.Container> = new Map();
    private statTexts: Map<string, Phaser.GameObjects.Text> = new Map();
    private combatStatTexts: Map<string, Phaser.GameObjects.Text> = new Map();

    // 현재 데이터
    private playerName: string = 'Hero';
    private playerClass: string = '전사';
    private playerLevel: number = 1;
    private baseStats: BaseStats = { str: 5, dex: 5, con: 5, int: 5, wis: 5, luk: 5 };
    private combatStats: CombatStats = {} as CombatStats;
    private statPoints: number = 0;
    private equipment: Record<EquipSlot, string | null> = {
        weapon: null, shield: null, helmet: null, armor: null,
        gloves: null, boots: null, necklace: null, ring1: null, ring2: null
    };

    constructor(scene: Phaser.Scene) {
        const { width, height } = scene.cameras.main;
        super(scene, width / 2, height / 2);
        scene.add.existing(this);
        this.setDepth(2000);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const panelWidth = 400;
        const panelHeight = 500;

        // 반투명 배경
        const overlay = this.scene.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.5);
        overlay.setInteractive();
        this.add(overlay);

        // 메인 패널
        this.background = this.scene.add.rectangle(0, 0, panelWidth, panelHeight, UI_COLORS.PANEL_BG, 0.95);
        this.background.setStrokeStyle(3, UI_COLORS.PANEL_BORDER);
        this.add(this.background);

        // 타이틀 바
        this.createTitleBar(panelWidth);

        // 캐릭터 영역 (좌측)
        this.createCharacterArea(-panelWidth / 4 - 20, -50);

        // 스탯 영역 (우측)
        this.createStatArea(panelWidth / 4 + 20, -100);

        // 장비 영역 (하단)
        this.createEquipmentInfo(0, panelHeight / 2 - 80);
    }

    private createTitleBar(panelWidth: number): void {
        this.titleBar = this.scene.add.container(0, -250 + 20);
        this.add(this.titleBar);

        // 타이틀 배경
        const titleBg = this.scene.add.rectangle(0, 0, panelWidth, 40, UI_COLORS.PANEL_DARK);
        titleBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.titleBar.add(titleBg);

        // 타이틀 텍스트
        const titleText = this.scene.add.text(0, 0, '캐릭터 정보', {
            fontSize: '18px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.titleBar.add(titleText);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(panelWidth / 2 - 25, 0, '✕', {
            fontSize: '20px',
            color: UI_COLORS.TEXT_RED
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggle());
        closeBtn.on('pointerover', () => closeBtn.setColor('#ff8888'));
        closeBtn.on('pointerout', () => closeBtn.setColor(UI_COLORS.TEXT_RED));
        this.titleBar.add(closeBtn);
    }

    private createCharacterArea(x: number, y: number): void {
        const container = this.scene.add.container(x, y);
        this.add(container);

        // 캐릭터 전신 프레임
        const frame = this.scene.add.rectangle(0, 0, 120, 180, UI_COLORS.PANEL_DARK);
        frame.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        container.add(frame);

        // 캐릭터 이미지 (플레이스홀더)
        const charIcon = this.scene.add.text(0, 0, '🧙', {
            fontSize: '64px'
        }).setOrigin(0.5);
        container.add(charIcon);

        // 이름 & 직업
        const nameText = this.scene.add.text(0, 100, this.playerName, {
            fontSize: '16px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(nameText);

        const classText = this.scene.add.text(0, 120, `Lv.${this.playerLevel} ${this.playerClass}`, {
            fontSize: '12px',
            color: UI_COLORS.TEXT_SILVER
        }).setOrigin(0.5);
        container.add(classText);

        // 장비 슬롯 배치 (주변)
        const slotSize = 36;
        const slotPositions: { slot: EquipSlot; x: number; y: number; icon: string }[] = [
            { slot: 'helmet', x: 0, y: -110, icon: '🪖' },
            { slot: 'necklace', x: 50, y: -80, icon: '📿' },
            { slot: 'weapon', x: -75, y: 0, icon: '⚔️' },
            { slot: 'shield', x: 75, y: 0, icon: '🛡️' },
            { slot: 'armor', x: 0, y: 0, icon: '🥋' },
            { slot: 'gloves', x: -75, y: 50, icon: '🧤' },
            { slot: 'boots', x: 75, y: 50, icon: '👢' },
            { slot: 'ring1', x: -50, y: 80, icon: '💍' },
            { slot: 'ring2', x: 50, y: 80, icon: '💎' },
        ];

        slotPositions.forEach(({ slot, x, y, icon }) => {
            const slotContainer = this.createEquipSlot(x, y, slotSize, slot, icon);
            container.add(slotContainer);
            this.equipmentSlots.set(slot, slotContainer);
        });
    }

    private createEquipSlot(x: number, y: number, size: number, slot: EquipSlot, icon: string): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        const bg = this.scene.add.rectangle(0, 0, size, size, UI_COLORS.SLOT_EMPTY);
        bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        bg.setInteractive({ useHandCursor: true });
        container.add(bg);

        const iconText = this.scene.add.text(0, 0, icon, {
            fontSize: '16px'
        }).setOrigin(0.5).setAlpha(0.3);
        iconText.setName('icon');
        container.add(iconText);

        // 호버 효과
        bg.on('pointerover', () => bg.setStrokeStyle(2, 0xffffff));
        bg.on('pointerout', () => bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER));

        return container;
    }

    private createStatArea(x: number, y: number): void {
        const container = this.scene.add.container(x, y);
        this.add(container);

        // 기본 스탯 섹션
        const statTitle = this.scene.add.text(0, 0, '[ 기본 스탯 ]', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5, 0);
        container.add(statTitle);

        const statNames: { key: keyof BaseStats; nameKo: string }[] = [
            { key: 'str', nameKo: '힘' },
            { key: 'dex', nameKo: '민첩' },
            { key: 'con', nameKo: '체력' },
            { key: 'int', nameKo: '지능' },
            { key: 'wis', nameKo: '지혜' },
            { key: 'luk', nameKo: '행운' },
        ];

        statNames.forEach(({ key, nameKo }, i) => {
            const row = i;
            const yPos = 25 + row * 22;

            // 스탯 이름
            const label = this.scene.add.text(-60, yPos, nameKo, {
                fontSize: '12px',
                color: UI_COLORS.TEXT_WHITE
            });
            container.add(label);

            // 스탯 값
            const value = this.scene.add.text(20, yPos, `${this.baseStats[key]}`, {
                fontSize: '12px',
                color: UI_COLORS.TEXT_GREEN
            });
            this.statTexts.set(key, value);
            container.add(value);

            // + 버튼 (스탯 포인트)
            const plusBtn = this.scene.add.text(50, yPos, '[+]', {
                fontSize: '12px',
                color: UI_COLORS.TEXT_GOLD
            }).setInteractive({ useHandCursor: true });
            plusBtn.on('pointerdown', () => this.onAddStat(key));
            container.add(plusBtn);
        });

        // 스탯 포인트
        const pointsText = this.scene.add.text(0, 165, `남은 포인트: ${this.statPoints}`, {
            fontSize: '11px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5, 0);
        pointsText.setName('statPoints');
        container.add(pointsText);

        // 전투 스탯 섹션
        const combatTitle = this.scene.add.text(0, 195, '[ 전투 스탯 ]', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5, 0);
        container.add(combatTitle);

        const combatStats = [
            { key: 'attack', nameKo: '공격력' },
            { key: 'defense', nameKo: '방어력' },
            { key: 'magicAttack', nameKo: '마법 공격력' },
            { key: 'magicDefense', nameKo: '마법 방어력' },
            { key: 'critRate', nameKo: '치명타 확률' },
            { key: 'accuracy', nameKo: '명중률' },
        ];

        combatStats.forEach(({ key, nameKo }, i) => {
            const yPos = 220 + i * 18;

            const label = this.scene.add.text(-70, yPos, nameKo, {
                fontSize: '10px',
                color: UI_COLORS.TEXT_SILVER
            });
            container.add(label);

            const value = this.scene.add.text(50, yPos, '0', {
                fontSize: '10px',
                color: UI_COLORS.TEXT_WHITE
            });
            this.combatStatTexts.set(key, value);
            container.add(value);
        });
    }

    private createEquipmentInfo(x: number, y: number): void {
        const container = this.scene.add.container(x, y);
        this.add(container);

        // 장비 정보 패널
        const infoBg = this.scene.add.rectangle(0, 0, 380, 60, UI_COLORS.PANEL_DARK, 0.8);
        infoBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        container.add(infoBg);

        const infoText = this.scene.add.text(0, 0, '장비를 클릭하면 상세 정보가 표시됩니다.', {
            fontSize: '11px',
            color: UI_COLORS.TEXT_SILVER
        }).setOrigin(0.5);
        container.add(infoText);
    }

    private onAddStat(stat: keyof BaseStats): void {
        if (this.statPoints <= 0) return;
        this.scene.events.emit('addStatPoint', stat);
    }

    // ============================================================
    // 업데이트 메서드
    // ============================================================

    updateStats(baseStats: BaseStats, statPoints: number): void {
        this.baseStats = baseStats;
        this.statPoints = statPoints;

        for (const [key, text] of this.statTexts) {
            text.setText(`${baseStats[key as keyof BaseStats]}`);
        }

        const pointsText = this.getByName('statPoints') as Phaser.GameObjects.Text;
        if (pointsText) {
            pointsText.setText(`남은 포인트: ${statPoints}`);
        }
    }

    updateCombatStats(stats: CombatStats): void {
        this.combatStats = stats;

        const mapping: { [key: string]: keyof CombatStats } = {
            attack: 'attack',
            defense: 'defense',
            magicAttack: 'magicAttack',
            magicDefense: 'magicDefense',
            critRate: 'critRate',
            accuracy: 'accuracy'
        };

        for (const [key, statKey] of Object.entries(mapping)) {
            const text = this.combatStatTexts.get(key);
            if (text) {
                const value = stats[statKey];
                if (key === 'critRate') {
                    text.setText(`${value.toFixed(1)}%`);
                } else if (key === 'accuracy') {
                    text.setText(`${value.toFixed(0)}%`);
                } else {
                    text.setText(`${Math.floor(value)}`);
                }
            }
        }
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
