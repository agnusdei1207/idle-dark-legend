/**
 * ============================================================
 * 퀘스트 UI
 * ============================================================
 */

import Phaser from 'phaser';
import { QuestSystem } from '../systems/QuestSystem';
import { getQuestById } from '../data/quests.data';

export class QuestUI extends Phaser.GameObjects.Container {
    private questSystem: QuestSystem;
    private background!: Phaser.GameObjects.Rectangle;
    private questListContainer!: Phaser.GameObjects.Container;
    private detailContainer!: Phaser.GameObjects.Container;
    private isOpen: boolean = false;

    constructor(scene: Phaser.Scene, questSystem: QuestSystem) {
        super(scene, scene.cameras.main.width / 2, scene.cameras.main.height / 2);
        this.questSystem = questSystem;
        scene.add.existing(this);
        this.setDepth(1000);
        this.setVisible(false);

        this.createUI();
        this.setupEvents();
    }

    private createUI(): void {
        const width = 500;
        const height = 400;

        // 배경
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.95);
        this.background.setStrokeStyle(2, 0x4a4a6a);
        this.add(this.background);

        // 제목
        const title = this.scene.add.text(0, -height / 2 + 25, '📜 퀘스트', {
            fontSize: '22px', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(title);

        // 닫기 버튼
        const closeBtn = this.scene.add.text(width / 2 - 20, -height / 2 + 20, '✕', {
            fontSize: '20px', color: '#ff6666'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggle());
        this.add(closeBtn);

        // 퀘스트 목록 컨테이너
        this.questListContainer = this.scene.add.container(-width / 4, -height / 2 + 60);
        this.add(this.questListContainer);

        // 퀘스트 상세 컨테이너
        this.detailContainer = this.scene.add.container(width / 4, -height / 2 + 60);
        this.add(this.detailContainer);

        // 구분선
        const divider = this.scene.add.rectangle(0, 0, 2, height - 80, 0x4a4a6a);
        this.add(divider);
    }

    private setupEvents(): void {
        this.questSystem.on('questAccepted', () => this.refresh());
        this.questSystem.on('questProgressUpdated', () => this.refresh());
        this.questSystem.on('questCompleted', () => this.refresh());
        this.questSystem.on('questRewardClaimed', () => this.refresh());
    }

    refresh(): void {
        this.questListContainer.removeAll(true);
        this.detailContainer.removeAll(true);

        const quests = this.questSystem.getActiveQuests();

        if (quests.length === 0) {
            const noQuest = this.scene.add.text(0, 20, '진행 중인 퀘스트가 없습니다', {
                fontSize: '12px', color: '#888888'
            }).setOrigin(0.5, 0);
            this.questListContainer.add(noQuest);
            return;
        }

        quests.forEach((progress, index) => {
            const quest = getQuestById(progress.questId);
            if (!quest) return;

            // 상태 아이콘
            const statusIcon = progress.status === 'completed' ? '✅' : '📋';

            const questItem = this.scene.add.text(0, index * 35, `${statusIcon} ${quest.titleKo}`, {
                fontSize: '13px',
                color: progress.status === 'completed' ? '#00ff00' : '#ffffff'
            }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

            questItem.on('pointerover', () => questItem.setColor('#88ccff'));
            questItem.on('pointerout', () => questItem.setColor(
                progress.status === 'completed' ? '#00ff00' : '#ffffff'
            ));
            questItem.on('pointerdown', () => this.showQuestDetail(progress.questId));

            this.questListContainer.add(questItem);
        });

        // 첫 번째 퀘스트 상세 표시
        if (quests.length > 0) {
            this.showQuestDetail(quests[0].questId);
        }
    }

    private showQuestDetail(questId: string): void {
        this.detailContainer.removeAll(true);

        const quest = getQuestById(questId);
        const progress = this.questSystem.getActiveQuests().find(q => q.questId === questId);
        if (!quest || !progress) return;

        // 퀘스트 제목
        const title = this.scene.add.text(0, 0, quest.titleKo, {
            fontSize: '16px', color: '#ffcc00', fontStyle: 'bold'
        }).setOrigin(0.5, 0);
        this.detailContainer.add(title);

        // 설명
        const desc = this.scene.add.text(0, 30, quest.description, {
            fontSize: '11px', color: '#aaaaaa',
            wordWrap: { width: 200 }
        }).setOrigin(0.5, 0);
        this.detailContainer.add(desc);

        // 목표
        const objTitle = this.scene.add.text(0, 90, '[ 목표 ]', {
            fontSize: '12px', color: '#88ccff'
        }).setOrigin(0.5, 0);
        this.detailContainer.add(objTitle);

        progress.objectives.forEach((obj, i) => {
            const complete = obj.currentAmount >= obj.requiredAmount;
            const objText = this.scene.add.text(0, 110 + i * 20,
                `${complete ? '✓' : '○'} ${obj.targetName} (${obj.currentAmount}/${obj.requiredAmount})`,
                {
                    fontSize: '11px',
                    color: complete ? '#00ff00' : '#ffffff'
                }
            ).setOrigin(0.5, 0);
            this.detailContainer.add(objText);
        });

        // 보상
        const rewardY = 120 + progress.objectives.length * 20;
        const rewardTitle = this.scene.add.text(0, rewardY, '[ 보상 ]', {
            fontSize: '12px', color: '#ffcc00'
        }).setOrigin(0.5, 0);
        this.detailContainer.add(rewardTitle);

        let rewardText = '';
        if (quest.rewards.exp) rewardText += `경험치 ${quest.rewards.exp} `;
        if (quest.rewards.gold) rewardText += `💰 ${quest.rewards.gold} `;

        const reward = this.scene.add.text(0, rewardY + 20, rewardText, {
            fontSize: '11px', color: '#ffd700'
        }).setOrigin(0.5, 0);
        this.detailContainer.add(reward);

        // 완료 버튼
        if (progress.status === 'completed') {
            const claimBtn = this.scene.add.text(0, rewardY + 60, '[ 보상 받기 ]', {
                fontSize: '14px', color: '#00ff88', fontStyle: 'bold'
            }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

            claimBtn.on('pointerdown', () => {
                this.questSystem.claimReward(questId);
                this.refresh();
            });

            this.detailContainer.add(claimBtn);
        }
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
        if (this.isOpen) this.refresh();
    }

    getIsOpen(): boolean { return this.isOpen; }
}
