/**
 * ============================================================
 * 대화 UI
 * ============================================================
 */

import Phaser from 'phaser';
import { DialogueSystem } from '../systems/DialogueSystem';
import type { DialogueNode } from '../types/game.types';

export class DialogueUI extends Phaser.GameObjects.Container {
    private dialogueSystem: DialogueSystem;
    private background!: Phaser.GameObjects.Rectangle;
    private speakerText!: Phaser.GameObjects.Text;
    private dialogueText!: Phaser.GameObjects.Text;
    private choicesContainer!: Phaser.GameObjects.Container;
    private continueIndicator!: Phaser.GameObjects.Text;
    private isOpen: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height - 120);
        this.dialogueSystem = new DialogueSystem();
        scene.add.existing(this);
        this.setDepth(900);
        this.setVisible(false);

        this.createUI();
        this.setupEvents();
    }

    private createUI(): void {
        const width = 700;
        const height = 160;

        // 배경
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.95);
        this.background.setStrokeStyle(2, 0x4a90a4);
        this.add(this.background);

        // 화자 이름
        this.speakerText = this.scene.add.text(-width / 2 + 20, -height / 2 + 15, '', {
            fontSize: '16px', color: '#4a90e2', fontStyle: 'bold'
        });
        this.add(this.speakerText);

        // 대화 내용
        this.dialogueText = this.scene.add.text(-width / 2 + 20, -height / 2 + 45, '', {
            fontSize: '14px', color: '#ffffff',
            wordWrap: { width: width - 40 },
            lineSpacing: 6
        });
        this.add(this.dialogueText);

        // 선택지 컨테이너
        this.choicesContainer = this.scene.add.container(0, 30);
        this.add(this.choicesContainer);

        // 계속 표시
        this.continueIndicator = this.scene.add.text(width / 2 - 30, height / 2 - 20, '▼', {
            fontSize: '14px', color: '#ffffff'
        });
        this.add(this.continueIndicator);

        // 계속 애니메이션
        this.scene.tweens.add({
            targets: this.continueIndicator,
            y: this.continueIndicator.y + 5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // 클릭 이벤트
        this.background.setInteractive();
        this.background.on('pointerdown', () => this.advance());
    }

    private setupEvents(): void {
        this.dialogueSystem.on('dialogueStarted', () => {
            this.isOpen = true;
            this.setVisible(true);
        });

        this.dialogueSystem.on('showNode', (node: DialogueNode) => {
            this.showNode(node);
        });

        this.dialogueSystem.on('dialogueEnded', () => {
            this.isOpen = false;
            this.setVisible(false);
            this.scene.events.emit('dialogueClosed');
        });

        this.dialogueSystem.on('acceptQuest', (questId: string) => {
            this.scene.events.emit('acceptQuest', questId);
        });

        this.dialogueSystem.on('openShop', (shopId: string) => {
            this.scene.events.emit('openShop', shopId);
        });
    }

    private showNode(node: DialogueNode): void {
        this.speakerText.setText(node.speakerKo || node.speaker);
        this.dialogueText.setText(node.text);
        this.choicesContainer.removeAll(true);

        if (node.choices && node.choices.length > 0) {
            // 선택지가 있으면 표시
            this.continueIndicator.setVisible(false);

            node.choices.forEach((choice, index) => {
                const choiceBtn = this.scene.add.text(0, index * 30, `▸ ${choice.text}`, {
                    fontSize: '13px', color: '#88ccff'
                }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

                choiceBtn.on('pointerover', () => choiceBtn.setColor('#ffffff'));
                choiceBtn.on('pointerout', () => choiceBtn.setColor('#88ccff'));
                choiceBtn.on('pointerdown', () => this.selectChoice(index));

                this.choicesContainer.add(choiceBtn);
            });
        } else {
            this.continueIndicator.setVisible(true);
        }
    }

    private advance(): void {
        this.dialogueSystem.advance();
    }

    private selectChoice(index: number): void {
        this.dialogueSystem.selectChoice(index);
    }

    startDialogue(dialogueId: string): boolean {
        return this.dialogueSystem.startDialogue(dialogueId);
    }

    getIsOpen(): boolean { return this.isOpen; }
    getDialogueSystem(): DialogueSystem { return this.dialogueSystem; }
}
