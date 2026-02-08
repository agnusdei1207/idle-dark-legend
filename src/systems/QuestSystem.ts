/**
 * ============================================================
 * 퀘스트 시스템
 * ============================================================
 */

import Phaser from 'phaser';
import type { QuestProgress, QuestStatus, QuestObjective } from '../types/game.types';
import { getQuestById, QUESTS } from '../data/quests.data';

export class QuestSystem extends Phaser.Events.EventEmitter {
    private activeQuests: Map<string, QuestProgress> = new Map();
    private completedQuests: Set<string> = new Set();

    constructor() {
        super();
    }

    /** 퀘스트 수락 */
    acceptQuest(questId: string): boolean {
        if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
            return false;
        }

        const quest = getQuestById(questId);
        if (!quest) return false;

        const progress: QuestProgress = {
            questId,
            status: 'active',
            objectives: quest.objectives.map(obj => ({ ...obj, currentAmount: 0 })),
            startedAt: Date.now()
        };

        this.activeQuests.set(questId, progress);
        this.emit('questAccepted', questId, progress);
        return true;
    }

    /** 퀘스트 진행 업데이트 */
    updateProgress(type: 'kill' | 'collect' | 'talk', targetId: string, amount: number = 1): void {
        for (const [questId, progress] of this.activeQuests) {
            if (progress.status !== 'active') continue;

            let updated = false;
            for (const objective of progress.objectives) {
                if (objective.type === type && objective.targetId === targetId) {
                    objective.currentAmount = Math.min(
                        objective.currentAmount + amount,
                        objective.requiredAmount
                    );
                    updated = true;
                }
            }

            if (updated) {
                this.emit('questProgressUpdated', questId, progress);
                this.checkQuestCompletion(questId);
            }
        }
    }

    /** 퀘스트 완료 체크 */
    private checkQuestCompletion(questId: string): void {
        const progress = this.activeQuests.get(questId);
        if (!progress) return;

        const allComplete = progress.objectives.every(
            obj => obj.currentAmount >= obj.requiredAmount
        );

        if (allComplete && progress.status === 'active') {
            progress.status = 'completed';
            progress.completedAt = Date.now();
            this.emit('questCompleted', questId, progress);
        }
    }

    /** 퀘스트 보상 수령 */
    claimReward(questId: string): boolean {
        const progress = this.activeQuests.get(questId);
        if (!progress || progress.status !== 'completed') return false;

        const quest = getQuestById(questId);
        if (!quest) return false;

        progress.status = 'turned_in';
        this.completedQuests.add(questId);
        this.activeQuests.delete(questId);

        this.emit('questRewardClaimed', questId, quest.rewards);
        return true;
    }

    /** 퀘스트 포기 */
    abandonQuest(questId: string): boolean {
        if (!this.activeQuests.has(questId)) return false;
        this.activeQuests.delete(questId);
        this.emit('questAbandoned', questId);
        return true;
    }

    /** 활성 퀘스트 가져오기 */
    getActiveQuests(): QuestProgress[] {
        return Array.from(this.activeQuests.values());
    }

    /** 완료된 퀘스트 목록 */
    getCompletedQuests(): string[] {
        return Array.from(this.completedQuests);
    }

    /** 수락 가능한 퀘스트 목록 */
    getAvailableQuests(playerLevel: number): string[] {
        return QUESTS
            .filter(q => {
                if (this.activeQuests.has(q.id) || this.completedQuests.has(q.id)) return false;
                if (q.requiredLevel > playerLevel) return false;
                if (q.prerequisiteQuests) {
                    return q.prerequisiteQuests.every(pq => this.completedQuests.has(pq));
                }
                return true;
            })
            .map(q => q.id);
    }

    /** 저장 데이터 */
    getSaveData() {
        return {
            active: Array.from(this.activeQuests.entries()),
            completed: Array.from(this.completedQuests)
        };
    }

    /** 로드 */
    loadSaveData(data: { active: [string, QuestProgress][], completed: string[] }) {
        this.activeQuests = new Map(data.active);
        this.completedQuests = new Set(data.completed);
    }
}
