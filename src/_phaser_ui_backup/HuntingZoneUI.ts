/**
 * ============================================================
 * 사냥터 선택 UI - Idle 자동 사냥 (개선판)
 * ============================================================
 */

import Phaser from 'phaser';
import { HUNTING_ZONES, type HuntingZone, type IdleSystem } from '../systems';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x4a4a6a,
    SELECTED: 0x8b5cf6,
    HOVER: 0x3a3a5e,
    GOLD: 0xffd700,
    GREEN: 0x4ade80,
    RED: 0xef4444,
    BLUE: 0x60a5fa
};

// 써클별 색상
const CIRCLE_COLORS: { [key: number]: number } = {
    1: 0x4ade80,  // 초록
    2: 0x60a5fa,  // 파랑
    3: 0xfbbf24,  // 노랑
    4: 0xf97316,  // 주황
    5: 0xef4444   // 빨강
};

export class HuntingZoneUI extends Phaser.GameObjects.Container {
    private idleSystem: IdleSystem;
    private playerLevel: number = 1;
    private selectedZone: HuntingZone | null = null;
    private isOpen: boolean = false;
    private panel!: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, idleSystem: IdleSystem) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.idleSystem = idleSystem;
        this.setDepth(2000);
        this.setScrollFactor(0);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const { width, height } = this.scene.cameras.main;
        const panelWidth = 420;
        const panelHeight = 500; // 높이 줄임
        const panelX = (width - panelWidth) / 2;
        const panelY = (height - panelHeight) / 2;

        this.panel = this.scene.add.container(0, 0);
        this.add(this.panel);

        // 반투명 배경
        const overlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
        overlay.setInteractive();
        overlay.on('pointerdown', () => this.close());
        this.panel.add(overlay);

        // 메인 패널
        const bg = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + panelHeight / 2,
            panelWidth,
            panelHeight,
            UI_COLORS.PANEL_BG,
            0.98
        );
        bg.setStrokeStyle(3, UI_COLORS.SELECTED);
        this.panel.add(bg);

        // 타이틀
        const title = this.scene.add.text(panelX + panelWidth / 2, panelY + 25, '⚔️ 사냥터 선택', {
            fontSize: '22px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.panel.add(title);

        // 플레이어 레벨 표시
        const levelText = this.scene.add.text(panelX + panelWidth / 2, panelY + 50, `현재 레벨: Lv.${this.playerLevel}`, {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        levelText.setName('levelText');
        this.panel.add(levelText);

        // 구분선
        const line = this.scene.add.rectangle(panelX + panelWidth / 2, panelY + 70, panelWidth - 40, 2, UI_COLORS.PANEL_BORDER);
        this.panel.add(line);

        // 스크롤 가능한 사냥터 목록
        this.renderZoneList(panelX + 20, panelY + 85, panelWidth - 40, panelHeight - 180);

        // 하단 버튼 영역
        this.createButtonArea(panelX, panelY + panelHeight - 80, panelWidth);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(panelX + panelWidth - 20, panelY + 15, '✕', {
            fontSize: '22px',
            color: '#888888'
        }).setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setColor('#ff4444'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#888888'));
        closeBtn.on('pointerdown', () => this.close());
        this.panel.add(closeBtn);
    }

    private renderZoneList(x: number, y: number, width: number, height: number): void {
        const itemHeight = 55;
        let currentY = y;

        // 써클별로 그룹화
        for (let circle = 1; circle <= 5; circle++) {
            const zones = HUNTING_ZONES.filter(z => z.circle === circle);
            if (zones.length === 0) continue;

            // 써클 헤더
            const colorHex = CIRCLE_COLORS[circle].toString(16).padStart(6, '0');
            const circleHeader = this.scene.add.text(x, currentY, `◆ ${circle}써클 (Lv ${zones[0].minLevel}~${zones[zones.length - 1].maxLevel})`, {
                fontSize: '13px',
                color: `#${colorHex}`,
                fontStyle: 'bold'
            });
            this.panel.add(circleHeader);
            currentY += 22;

            // 해당 써클 사냥터들
            for (const zone of zones) {
                this.createZoneButton(x, currentY, width, itemHeight - 5, zone);
                currentY += itemHeight;
            }

            currentY += 8;
        }
    }

    private createZoneButton(x: number, y: number, width: number, height: number, zone: HuntingZone): void {
        const isAvailable = this.playerLevel >= zone.minLevel - 5;
        const isRecommended = this.playerLevel >= zone.minLevel && this.playerLevel <= zone.maxLevel;

        // 배경
        const bgColor = isRecommended ? 0x2a3a4e : (isAvailable ? 0x252535 : 0x1a1a2a);
        const bg = this.scene.add.rectangle(x + width / 2, y + height / 2, width, height, bgColor, 0.9);
        bg.setStrokeStyle(isRecommended ? 2 : 1, isRecommended ? UI_COLORS.GREEN : UI_COLORS.PANEL_BORDER);
        this.panel.add(bg);

        // 사냥터 이름
        const nameColor = isAvailable ? '#ffffff' : '#555555';
        const name = this.scene.add.text(x + 10, y + 8, zone.name, {
            fontSize: '15px',
            color: nameColor,
            fontStyle: isRecommended ? 'bold' : 'normal'
        });
        this.panel.add(name);

        // 추천 배지
        if (isRecommended) {
            const badge = this.scene.add.text(x + width - 10, y + 8, '⭐ 추천', {
                fontSize: '12px',
                color: '#4ade80'
            }).setOrigin(1, 0);
            this.panel.add(badge);
        }

        // 레벨 범위
        const levelRange = this.scene.add.text(x + 10, y + 28, `Lv ${zone.minLevel}~${zone.maxLevel}`, {
            fontSize: '12px',
            color: isAvailable ? '#888888' : '#444444'
        });
        this.panel.add(levelRange);

        // 효율 정보
        const efficiency = zone.avgExpPerKill * zone.avgKillsPerMinute;
        const effText = this.scene.add.text(x + width - 10, y + 28, `💎 ${Math.floor(efficiency)} EXP/분`, {
            fontSize: '12px',
            color: isAvailable ? '#60a5fa' : '#444444'
        }).setOrigin(1, 0);
        this.panel.add(effText);

        // 상호작용
        if (isAvailable) {
            bg.setInteractive({ useHandCursor: true });

            bg.on('pointerover', () => {
                bg.setFillStyle(UI_COLORS.HOVER);
            });

            bg.on('pointerout', () => {
                bg.setFillStyle(bgColor);
            });

            bg.on('pointerdown', () => {
                this.selectZone(zone);
            });
        }
    }

    private createButtonArea(x: number, y: number, width: number): void {
        // 선택된 사냥터 표시
        const statusText = this.scene.add.text(x + width / 2, y + 10, '사냥터를 선택하세요', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        statusText.setName('statusText');
        this.panel.add(statusText);

        // 사냥 시작 버튼
        const btnWidth = 160;
        const btnHeight = 45;
        const huntBtn = this.scene.add.rectangle(x + width / 2, y + 50, btnWidth, btnHeight, UI_COLORS.GREEN, 0.9);
        huntBtn.setStrokeStyle(2, 0x2a8a50);
        huntBtn.setInteractive({ useHandCursor: true });
        huntBtn.setName('huntBtn');
        this.panel.add(huntBtn);

        const huntBtnText = this.scene.add.text(x + width / 2, y + 50, '🎯 사냥 시작!', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        huntBtnText.setName('huntBtnText');
        this.panel.add(huntBtnText);

        huntBtn.on('pointerover', () => {
            huntBtn.setScale(1.05);
        });

        huntBtn.on('pointerout', () => {
            huntBtn.setScale(1);
        });

        huntBtn.on('pointerdown', () => this.startHunting());
    }

    private selectZone(zone: HuntingZone): void {
        this.selectedZone = zone;
        this.idleSystem.selectZone(zone.id);

        // 상태 텍스트 업데이트
        const statusText = this.panel.getByName('statusText') as Phaser.GameObjects.Text;
        if (statusText) {
            statusText.setText(`📍 ${zone.name} (Lv ${zone.minLevel}~${zone.maxLevel})`);
            statusText.setColor('#ffffff');
        }
    }

    private startHunting(): void {
        if (!this.selectedZone) {
            // 추천 사냥터 자동 선택
            const recommended = this.idleSystem.getRecommendedZone(this.playerLevel);
            if (recommended) {
                this.selectedZone = recommended;
            } else {
                return;
            }
        }

        // GameScene의 startAutoHunt 호출
        const gameScene = this.scene.scene.get('GameScene') as any;
        if (gameScene && gameScene.startAutoHunt) {
            gameScene.startAutoHunt(this.selectedZone.id);
        }

        this.close();
    }

    /**
     * 플레이어 레벨 업데이트
     */
    setPlayerLevel(level: number): void {
        this.playerLevel = level;

        const levelText = this.panel?.getByName('levelText') as Phaser.GameObjects.Text;
        if (levelText) {
            levelText.setText(`현재 레벨: Lv.${level}`);
        }
    }

    toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open(): void {
        this.setVisible(true);
        this.isOpen = true;
    }

    close(): void {
        this.setVisible(false);
        this.isOpen = false;
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
