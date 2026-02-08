/**
 * ============================================================
 * 사냥터 선택 UI - Idle 자동 사냥
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
    private zoneButtons: Phaser.GameObjects.Container[] = [];
    private scrollOffset: number = 0;

    constructor(scene: Phaser.Scene, idleSystem: IdleSystem) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.idleSystem = idleSystem;
        this.setDepth(1000);
        this.setScrollFactor(0);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const { width, height } = this.scene.cameras.main;
        const panelWidth = 350;
        const panelHeight = 500;
        const panelX = width - panelWidth - 20;
        const panelY = 100;

        // 메인 패널
        const panel = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + panelHeight / 2,
            panelWidth,
            panelHeight,
            UI_COLORS.PANEL_BG,
            0.95
        );
        panel.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        this.add(panel);

        // 타이틀
        const title = this.scene.add.text(panelX + panelWidth / 2, panelY + 25, '⚔️ 사냥터 선택', {
            fontSize: '20px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(title);

        // 플레이어 레벨 표시
        const levelText = this.scene.add.text(panelX + panelWidth / 2, panelY + 50, `현재 레벨: ${this.playerLevel}`, {
            fontSize: '12px',
            color: '#888888'
        }).setOrigin(0.5);
        levelText.setName('levelText');
        this.add(levelText);

        // 구분선
        const line = this.scene.add.rectangle(panelX + panelWidth / 2, panelY + 70, panelWidth - 20, 2, UI_COLORS.PANEL_BORDER);
        this.add(line);

        // 사냥터 목록 컨테이너
        this.renderZoneList(panelX + 10, panelY + 80, panelWidth - 20, panelHeight - 150);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(panelX + panelWidth - 15, panelY + 10, '✕', {
            fontSize: '18px',
            color: '#888888'
        }).setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#888888'));
        closeBtn.on('pointerdown', () => this.close());
        this.add(closeBtn);

        // 현재 상태 표시 영역
        this.createStatusArea(panelX, panelY + panelHeight - 70, panelWidth);
    }

    private renderZoneList(x: number, y: number, width: number, height: number): void {
        // 기존 버튼 정리
        this.zoneButtons.forEach(btn => btn.destroy());
        this.zoneButtons = [];

        const itemHeight = 60;
        const spacing = 5;
        let currentY = y;

        // 써클별로 그룹화
        for (let circle = 1; circle <= 5; circle++) {
            const zones = HUNTING_ZONES.filter(z => z.circle === circle);
            if (zones.length === 0) continue;

            // 써클 헤더
            const circleHeader = this.scene.add.text(x + 5, currentY, `◆ ${circle}써클 (Lv ${zones[0].minLevel}~${zones[zones.length - 1].maxLevel})`, {
                fontSize: '12px',
                color: `#${CIRCLE_COLORS[circle].toString(16).padStart(6, '0')}`
            });
            this.add(circleHeader);
            currentY += 20;

            // 해당 써클 사냥터들
            for (const zone of zones) {
                const btn = this.createZoneButton(x, currentY, width, itemHeight - spacing, zone);
                this.zoneButtons.push(btn);
                currentY += itemHeight;
            }

            currentY += 10; // 써클 사이 간격
        }
    }

    private createZoneButton(x: number, y: number, width: number, height: number, zone: HuntingZone): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        const isAvailable = this.playerLevel >= zone.minLevel - 5;
        const isRecommended = this.playerLevel >= zone.minLevel && this.playerLevel <= zone.maxLevel;
        const isSelected = this.selectedZone?.id === zone.id;

        // 배경
        const bgColor = isSelected ? UI_COLORS.SELECTED : (isAvailable ? UI_COLORS.PANEL_BG : 0x2a2a3e);
        const bg = this.scene.add.rectangle(width / 2, height / 2, width, height, bgColor, 0.8);
        bg.setStrokeStyle(1, isRecommended ? UI_COLORS.GREEN : UI_COLORS.PANEL_BORDER);
        container.add(bg);

        // 사냥터 이름
        const nameColor = isAvailable ? '#ffffff' : '#666666';
        const name = this.scene.add.text(10, 8, zone.name, {
            fontSize: '14px',
            color: nameColor,
            fontStyle: isRecommended ? 'bold' : 'normal'
        });
        container.add(name);

        // 추천 배지
        if (isRecommended) {
            const badge = this.scene.add.text(width - 10, 8, '추천', {
                fontSize: '10px',
                color: '#4ade80'
            }).setOrigin(1, 0);
            container.add(badge);
        }

        // 레벨 범위
        const levelRange = this.scene.add.text(10, 28, `Lv ${zone.minLevel}~${zone.maxLevel}`, {
            fontSize: '11px',
            color: isAvailable ? '#888888' : '#555555'
        });
        container.add(levelRange);

        // 효율 정보
        const efficiency = zone.avgExpPerKill * zone.avgKillsPerMinute;
        const effText = this.scene.add.text(width - 10, 28, `${Math.floor(efficiency)} EXP/분`, {
            fontSize: '11px',
            color: isAvailable ? '#60a5fa' : '#555555'
        }).setOrigin(1, 0);
        container.add(effText);

        // 상호작용
        if (isAvailable) {
            bg.setInteractive({ useHandCursor: true });

            bg.on('pointerover', () => {
                if (!isSelected) bg.setFillStyle(UI_COLORS.HOVER);
            });

            bg.on('pointerout', () => {
                if (!isSelected) bg.setFillStyle(UI_COLORS.PANEL_BG);
            });

            bg.on('pointerdown', () => {
                this.selectZone(zone);
            });
        }

        this.add(container);
        return container;
    }

    private createStatusArea(x: number, y: number, width: number): void {
        // 현재 사냥 상태
        const statusBg = this.scene.add.rectangle(x + width / 2, y + 30, width - 20, 50, UI_COLORS.PANEL_BG, 0.9);
        statusBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.add(statusBg);

        const statusText = this.scene.add.text(x + width / 2, y + 20, '선택된 사냥터: 없음', {
            fontSize: '12px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        statusText.setName('statusText');
        this.add(statusText);

        // 사냥 시작/중지 버튼
        const huntBtn = this.scene.add.rectangle(x + width / 2, y + 45, 120, 30, UI_COLORS.SELECTED);
        huntBtn.setInteractive({ useHandCursor: true });
        huntBtn.setName('huntBtn');
        this.add(huntBtn);

        const huntBtnText = this.scene.add.text(x + width / 2, y + 45, '사냥 시작', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        huntBtnText.setName('huntBtnText');
        this.add(huntBtnText);

        huntBtn.on('pointerdown', () => this.toggleHunting());
    }

    private selectZone(zone: HuntingZone): void {
        this.selectedZone = zone;
        this.idleSystem.selectZone(zone.id);

        // 상태 텍스트 업데이트
        const statusText = this.getByName('statusText') as Phaser.GameObjects.Text;
        if (statusText) {
            statusText.setText(`선택: ${zone.name}`);
        }

        // UI 갱신
        this.refreshZoneList();
    }

    private toggleHunting(): void {
        if (!this.selectedZone) return;

        const isHunting = this.idleSystem.isCurrentlyHunting();
        const huntBtn = this.getByName('huntBtn') as Phaser.GameObjects.Rectangle;
        const huntBtnText = this.getByName('huntBtnText') as Phaser.GameObjects.Text;

        if (isHunting) {
            this.idleSystem.stopHunting();
            if (huntBtn) huntBtn.setFillStyle(UI_COLORS.SELECTED);
            if (huntBtnText) huntBtnText.setText('사냥 시작');
        } else {
            this.idleSystem.startHunting();
            if (huntBtn) huntBtn.setFillStyle(UI_COLORS.RED);
            if (huntBtnText) huntBtnText.setText('사냥 중지');
        }
    }

    private refreshZoneList(): void {
        const { width, height } = this.scene.cameras.main;
        const panelWidth = 350;
        const panelX = width - panelWidth - 20;
        const panelY = 100;
        const panelHeight = 500;

        this.renderZoneList(panelX + 10, panelY + 80, panelWidth - 20, panelHeight - 150);
    }

    /**
     * 플레이어 레벨 업데이트
     */
    setPlayerLevel(level: number): void {
        this.playerLevel = level;

        const levelText = this.getByName('levelText') as Phaser.GameObjects.Text;
        if (levelText) {
            levelText.setText(`현재 레벨: ${level}`);
        }

        // 추천 사냥터 자동 선택
        const recommended = this.idleSystem.getRecommendedZone(level);
        if (recommended && !this.selectedZone) {
            this.selectZone(recommended);
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
        this.refreshZoneList();
    }

    close(): void {
        this.setVisible(false);
        this.isOpen = false;
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
