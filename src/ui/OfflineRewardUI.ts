/**
 * ============================================================
 * 오프라인 보상 UI
 * ============================================================
 * 
 * 게임 재접속 시 8시간 동안의 오프라인 보상을 표시합니다.
 */

import Phaser from 'phaser';
import type { OfflineProgress } from '../systems';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x4a4a6a,
    GOLD: 0xffd700,
    GREEN: 0x4ade80,
    BLUE: 0x60a5fa,
    WHITE: 0xffffff,
    ACCENT: 0x8b5cf6
};

export class OfflineRewardUI extends Phaser.GameObjects.Container {
    private panel!: Phaser.GameObjects.Rectangle;
    private isOpen: boolean = false;
    private progress: OfflineProgress | null = null;
    private claimCallback: (() => void) | null = null;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.setDepth(2000);
        this.setScrollFactor(0);
        this.setVisible(false);
    }

    /**
     * 오프라인 보상 표시
     */
    show(progress: OfflineProgress, onClaim: () => void): void {
        if (progress.effectiveSeconds < 60) {
            // 1분 미만이면 표시하지 않음
            onClaim();
            return;
        }

        this.progress = progress;
        this.claimCallback = onClaim;
        this.createUI();
        this.setVisible(true);
        this.isOpen = true;

        // 등장 애니메이션
        this.setAlpha(0);
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 300,
            ease: 'Cubic.easeOut'
        });
    }

    private createUI(): void {
        this.removeAll(true);

        if (!this.progress) return;

        const { width, height } = this.scene.cameras.main;
        const panelWidth = 400;
        const panelHeight = 450;
        const centerX = width / 2;
        const centerY = height / 2;

        // 배경 어둡게
        const backdrop = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        backdrop.setOrigin(0);
        this.add(backdrop);

        // 메인 패널
        this.panel = this.scene.add.rectangle(centerX, centerY, panelWidth, panelHeight, UI_COLORS.PANEL_BG, 0.95);
        this.panel.setStrokeStyle(2, UI_COLORS.ACCENT);
        this.add(this.panel);

        // 타이틀
        const title = this.scene.add.text(centerX, centerY - 190, '🎁 오프라인 보상', {
            fontSize: '24px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(title);

        // 부제목 (오프라인 시간)
        const hours = Math.floor(this.progress.effectiveSeconds / 3600);
        const minutes = Math.floor((this.progress.effectiveSeconds % 3600) / 60);
        const timeText = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

        const subtitle = this.scene.add.text(centerX, centerY - 155, `자동 사냥 ${timeText} 결과`, {
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);
        this.add(subtitle);

        // 구분선
        const line = this.scene.add.rectangle(centerX, centerY - 130, panelWidth - 40, 2, UI_COLORS.PANEL_BORDER);
        this.add(line);

        // 보상 항목들
        let yOffset = centerY - 90;
        const rowHeight = 50;

        // 처치한 몬스터
        this.addRewardRow('🗡️ 처치 몬스터', `${this.progress.monstersKilled.toLocaleString()}마리`, yOffset, '#ffffff');
        yOffset += rowHeight;

        // 획득 경험치
        this.addRewardRow('⭐ 획득 경험치', `+${this.progress.earnedExp.toLocaleString()} EXP`, yOffset, '#4ade80');
        yOffset += rowHeight;

        // 획득 골드
        this.addRewardRow('💰 획득 골드', `+${this.progress.earnedGold.toLocaleString()} G`, yOffset, '#ffd700');
        yOffset += rowHeight;

        // 획득 아이템
        const itemCount = this.progress.earnedItems.length;
        this.addRewardRow('📦 획득 아이템', `${itemCount}개`, yOffset, '#60a5fa');
        yOffset += rowHeight;

        // 레벨업 (있는 경우)
        if (this.progress.levelsGained > 0) {
            this.addRewardRow('🎉 레벨업!', `+${this.progress.levelsGained} Level`, yOffset, '#f472b6');
            yOffset += rowHeight;
        }

        // 구분선
        const line2 = this.scene.add.rectangle(centerX, yOffset + 10, panelWidth - 40, 2, UI_COLORS.PANEL_BORDER);
        this.add(line2);

        // 효율 정보
        const efficiencyText = this.scene.add.text(centerX, yOffset + 40, '💡 오프라인 사냥 효율: 50%', {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(0.5);
        this.add(efficiencyText);

        // 수령 버튼
        const claimBtn = this.scene.add.rectangle(centerX, centerY + 170, 200, 50, UI_COLORS.ACCENT);
        claimBtn.setStrokeStyle(2, 0xffffff);
        claimBtn.setInteractive({ useHandCursor: true });
        this.add(claimBtn);

        const claimText = this.scene.add.text(centerX, centerY + 170, '보상 수령', {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(claimText);

        // 버튼 호버 효과
        claimBtn.on('pointerover', () => {
            claimBtn.setFillStyle(0xa78bfa);
        });
        claimBtn.on('pointerout', () => {
            claimBtn.setFillStyle(UI_COLORS.ACCENT);
        });
        claimBtn.on('pointerdown', () => {
            this.claim();
        });
    }

    private addRewardRow(label: string, value: string, y: number, valueColor: string): void {
        const { width } = this.scene.cameras.main;
        const centerX = width / 2;

        const labelText = this.scene.add.text(centerX - 120, y, label, {
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0, 0.5);
        this.add(labelText);

        const valueText = this.scene.add.text(centerX + 120, y, value, {
            fontSize: '18px',
            color: valueColor,
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);
        this.add(valueText);
    }

    private claim(): void {
        // 닫기 애니메이션
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.setVisible(false);
                this.isOpen = false;
                if (this.claimCallback) {
                    this.claimCallback();
                }
            }
        });
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
