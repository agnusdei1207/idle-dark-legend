/**
 * ============================================================
 * 대화 시스템
 * ============================================================
 */

import Phaser from 'phaser';
import type { DialogueDefinition, DialogueNode, DialogueChoice } from '../types/game.types';
import { getDialogueById } from '../data/npcs.data';

export class DialogueSystem extends Phaser.Events.EventEmitter {
    private currentDialogue: DialogueDefinition | null = null;
    private currentNodeIndex: number = 0;
    private isActive: boolean = false;

    constructor() {
        super();
    }

    /** 대화 시작 */
    startDialogue(dialogueId: string): boolean {
        const dialogue = getDialogueById(dialogueId);
        if (!dialogue || dialogue.nodes.length === 0) return false;

        this.currentDialogue = dialogue;
        this.currentNodeIndex = 0;
        this.isActive = true;

        this.emit('dialogueStarted', dialogue);
        this.showCurrentNode();
        return true;
    }

    /** 현재 노드 표시 */
    private showCurrentNode(): void {
        if (!this.currentDialogue) return;

        const node = this.currentDialogue.nodes[this.currentNodeIndex];
        if (!node) {
            this.endDialogue();
            return;
        }

        this.emit('showNode', node);
    }

    /** 다음 진행 (클릭 시) */
    advance(): void {
        if (!this.currentDialogue || !this.isActive) return;

        const currentNode = this.currentDialogue.nodes[this.currentNodeIndex];

        // 선택지가 있으면 선택을 기다림
        if (currentNode.choices && currentNode.choices.length > 0) {
            return;
        }

        // 다음 노드로
        if (currentNode.nextId) {
            const nextIndex = this.currentDialogue.nodes.findIndex(n => n.id === currentNode.nextId);
            if (nextIndex !== -1) {
                this.currentNodeIndex = nextIndex;
                this.showCurrentNode();
                return;
            }
        }

        // 다음 노드 없으면 종료
        this.currentNodeIndex++;
        if (this.currentNodeIndex >= this.currentDialogue.nodes.length) {
            this.endDialogue();
        } else {
            this.showCurrentNode();
        }
    }

    /** 선택지 선택 */
    selectChoice(choiceIndex: number): void {
        if (!this.currentDialogue || !this.isActive) return;

        const currentNode = this.currentDialogue.nodes[this.currentNodeIndex];
        if (!currentNode.choices || !currentNode.choices[choiceIndex]) return;

        const choice = currentNode.choices[choiceIndex];

        // 퀘스트 수락
        if (choice.acceptQuest) {
            this.emit('acceptQuest', choice.acceptQuest);
        }

        // 상점 열기
        if (choice.openShop) {
            this.emit('openShop', choice.openShop);
        }

        // 다음 대화로
        if (choice.nextDialogueId) {
            const nextIndex = this.currentDialogue.nodes.findIndex(n => n.id === choice.nextDialogueId);
            if (nextIndex !== -1) {
                this.currentNodeIndex = nextIndex;
                this.showCurrentNode();
                return;
            }
        }

        // 다음 없으면 종료
        this.endDialogue();
    }

    /** 대화 종료 */
    endDialogue(): void {
        this.currentDialogue = null;
        this.currentNodeIndex = 0;
        this.isActive = false;
        this.emit('dialogueEnded');
    }

    /** 대화 중인지 확인 */
    isDialogueActive(): boolean {
        return this.isActive;
    }

    /** 현재 노드 가져오기 */
    getCurrentNode(): DialogueNode | null {
        if (!this.currentDialogue) return null;
        return this.currentDialogue.nodes[this.currentNodeIndex] || null;
    }
}
