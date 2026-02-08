/**
 * ============================================================
 * 직업 선택 UI
 * ============================================================
 * 
 * 레벨 6에서 직업을 선택할 수 있는 UI
 * ============================================================
 */

import Phaser from 'phaser';
import { CLASSES } from '../data/classes.data';
import type { ClassType, ClassDefinition } from '../data/classes.data';

export class JobSelectionUI extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private background!: Phaser.GameObjects.Rectangle;
    private jobCards: Phaser.GameObjects.Container[] = [];
    private selectedJob: ClassType | null = null;
    private confirmButton!: Phaser.GameObjects.Container;
    private onSelectCallback?: (job: ClassType) => void;

    constructor(scene: Phaser.Scene) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        scene.add.existing(this);
        this.setDepth(2000);
        this.setVisible(false);
        this.createUI();
    }

    private createUI(): void {
        const width = 800;
        const height = 500;

        // 배경
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x0a0a14, 0.98);
        this.background.setStrokeStyle(3, 0x6a4aef);
        this.add(this.background);

        // 제목
        const title = this.scene.add.text(0, -height / 2 + 40, '🎭 직업 선택', {
            fontSize: '28px',
            color: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(title);

        const subtitle = this.scene.add.text(0, -height / 2 + 75, '레벨 6 달성! 직업을 선택하세요.', {
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.add(subtitle);

        // 직업 카드들
        const cardWidth = 140;
        const cardHeight = 280;
        const cardSpacing = 15;
        const totalWidth = CLASSES.length * cardWidth + (CLASSES.length - 1) * cardSpacing;
        const startX = -totalWidth / 2 + cardWidth / 2;

        CLASSES.forEach((classDef, index) => {
            const x = startX + index * (cardWidth + cardSpacing);
            const card = this.createJobCard(classDef, x, 20, cardWidth, cardHeight);
            this.jobCards.push(card);
            this.add(card);
        });

        // 확인 버튼
        this.confirmButton = this.createConfirmButton(0, height / 2 - 50);
        this.add(this.confirmButton);
    }

    private createJobCard(classDef: ClassDefinition, x: number, y: number, width: number, height: number): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        // 카드 배경
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 1);
        bg.setStrokeStyle(2, 0x3a3a5e);
        container.add(bg);

        // 직업 이모지
        const emoji = this.getJobEmoji(classDef.id as ClassType);
        const emojiText = this.scene.add.text(0, -height / 2 + 40, emoji, {
            fontSize: '42px'
        }).setOrigin(0.5);
        container.add(emojiText);

        // 직업 이름
        const nameText = this.scene.add.text(0, -height / 2 + 90, classDef.nameKo, {
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(nameText);

        // 설명
        const descText = this.scene.add.text(0, -20, classDef.description, {
            fontSize: '10px',
            color: '#aaaaaa',
            wordWrap: { width: width - 20 },
            align: 'center'
        }).setOrigin(0.5);
        container.add(descText);

        // 주요 스탯
        const primaryStat = this.getStatName(classDef.primaryStat);
        const statText = this.scene.add.text(0, height / 2 - 50, `주요: ${primaryStat}`, {
            fontSize: '11px',
            color: '#88ff88'
        }).setOrigin(0.5);
        container.add(statText);

        // 무도가 특수 표시
        if (classDef.id === 'monk') {
            const specialText = this.scene.add.text(0, height / 2 - 30, '⚠️ 전직 불가', {
                fontSize: '10px',
                color: '#ff8866'
            }).setOrigin(0.5);
            container.add(specialText);
        }

        // 인터랙션
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => {
            if (this.selectedJob !== classDef.id) {
                bg.setFillStyle(0x2a2a4e);
            }
        });
        bg.on('pointerout', () => {
            if (this.selectedJob !== classDef.id) {
                bg.setFillStyle(0x1a1a2e);
            }
        });
        bg.on('pointerdown', () => {
            this.selectJob(classDef.id as ClassType, container, bg);
        });

        container.setData('classDef', classDef);
        container.setData('bg', bg);

        return container;
    }

    private selectJob(jobId: ClassType, _card: Phaser.GameObjects.Container, bg: Phaser.GameObjects.Rectangle): void {
        // 이전 선택 해제
        this.jobCards.forEach(c => {
            const prevBg = c.getData('bg') as Phaser.GameObjects.Rectangle;
            prevBg.setFillStyle(0x1a1a2e);
            prevBg.setStrokeStyle(2, 0x3a3a5e);
        });

        // 새 선택
        this.selectedJob = jobId;
        bg.setFillStyle(0x2a4a6e);
        bg.setStrokeStyle(3, 0x6a4aef);

        // 확인 버튼 활성화
        this.updateConfirmButton(true);
    }

    private createConfirmButton(x: number, y: number): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        const bg = this.scene.add.rectangle(0, 0, 200, 50, 0x333344, 1);
        bg.setStrokeStyle(2, 0x555566);
        container.add(bg);

        const text = this.scene.add.text(0, 0, '직업을 선택하세요', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        container.add(text);

        container.setData('bg', bg);
        container.setData('text', text);

        return container;
    }

    private updateConfirmButton(enabled: boolean): void {
        const bg = this.confirmButton.getData('bg') as Phaser.GameObjects.Rectangle;
        const text = this.confirmButton.getData('text') as Phaser.GameObjects.Text;

        if (enabled && this.selectedJob) {
            const jobName = CLASSES.find(c => c.id === this.selectedJob)?.nameKo || '';
            bg.setFillStyle(0x4a6a9f);
            bg.setStrokeStyle(2, 0x6a8acf);
            text.setText(`${jobName} 선택`);
            text.setColor('#ffffff');

            bg.setInteractive({ useHandCursor: true });
            bg.off('pointerdown');
            bg.on('pointerdown', () => this.confirmSelection());
        } else {
            bg.setFillStyle(0x333344);
            bg.setStrokeStyle(2, 0x555566);
            text.setText('직업을 선택하세요');
            text.setColor('#666666');
            bg.disableInteractive();
        }
    }

    private confirmSelection(): void {
        if (this.selectedJob && this.onSelectCallback) {
            this.onSelectCallback(this.selectedJob);
            this.close();
        }
    }

    private getJobEmoji(jobId: ClassType): string {
        switch (jobId) {
            case 'warrior': return '⚔️';
            case 'mage': return '🔮';
            case 'rogue': return '🗡️';
            case 'cleric': return '✨';
            case 'monk': return '👊';
            default: return '❓';
        }
    }

    private getStatName(stat: string): string {
        switch (stat) {
            case 'str': return '힘';
            case 'dex': return '민첩';
            case 'con': return '체력';
            case 'int': return '지능';
            case 'wis': return '지혜';
            case 'luk': return '운';
            default: return stat;
        }
    }

    open(onSelect: (job: ClassType) => void): void {
        this.onSelectCallback = onSelect;
        this.selectedJob = null;
        this.isOpen = true;
        this.setVisible(true);

        // 초기화
        this.jobCards.forEach(c => {
            const bg = c.getData('bg') as Phaser.GameObjects.Rectangle;
            bg.setFillStyle(0x1a1a2e);
            bg.setStrokeStyle(2, 0x3a3a5e);
        });
        this.updateConfirmButton(false);
    }

    close(): void {
        this.isOpen = false;
        this.setVisible(false);
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
