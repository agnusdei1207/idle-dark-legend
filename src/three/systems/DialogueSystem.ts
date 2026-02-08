/**
 * ============================================================
 * DialogueSystem - 대화 시스템 (Three.js)
 * ============================================================
 * NPC와의 대화를 처리하는 시스템
 * ============================================================
 */

import type { DialogueNode, DialogueChoice } from '../../types/game.types';

/**
 * 대화 옵션
 */
export interface DialogueOptions {
    onStart?: () => void;
    onEnd?: () => void;
    onChoice?: (choice: DialogueChoice) => void;
}

/**
 * DialogueSystem 클래스
 */
export class DialogueSystem {
    private currentDialogue: DialogueNode[] | null = null;
    private currentNode: DialogueNode | null = null;
    private isActive: boolean = false;
    private options: DialogueOptions | null = null;

    /**
     * 대화 시작
     */
    public start(dialogue: DialogueNode[], options?: DialogueOptions): void {
        this.currentDialogue = dialogue;
        this.options = options || null;
        this.isActive = true;

        // 첫 번째 노드로 시작
        if (dialogue.length > 0) {
            this.showNode(dialogue[0]);
        }

        // 콜백
        if (this.options?.onStart) {
            this.options.onStart();
        }

        this.updateUI();
    }

    /**
     * 대화 종료
     */
    public end(): void {
        this.currentDialogue = null;
        this.currentNode = null;
        this.isActive = false;

        // UI 제거
        this.hideUI();

        // 콜백
        if (this.options?.onEnd) {
            this.options.onEnd();
        }

        this.options = null;
    }

    /**
     * 노드 표시
     */
    private showNode(node: DialogueNode): void {
        this.currentNode = node;
    }

    /**
     * 다음 노드로 이동
     */
    public next(nextId?: string): void {
        if (!this.currentNode) return;

        const targetId = nextId || this.currentNode.nextId;

        if (targetId) {
            const nextNode = this.currentDialogue?.find(n => n.id === targetId);
            if (nextNode) {
                this.showNode(nextNode);
                this.updateUI();
                return;
            }
        }

        // 다음 노드가 없으면 대화 종료
        this.end();
    }

    /**
     * 선택지 선택
     */
    public selectChoice(choiceIndex: number): void {
        if (!this.currentNode?.choices || choiceIndex < 0 || choiceIndex >= this.currentNode.choices.length) {
            return;
        }

        const choice = this.currentNode.choices[choiceIndex];

        // 조건 체크
        if (choice.condition) {
            if (!this.checkCondition(choice.condition)) {
                console.log('Choice condition not met');
                return;
            }
        }

        // 콜백
        if (this.options?.onChoice) {
            this.options.onChoice(choice);
        }

        // 퀘스트 수락
        if (choice.acceptQuest) {
            console.log('Accept quest:', choice.acceptQuest);
            // TODO: 퀘스트 수락 처리
        }

        // 상점 열기
        if (choice.openShop) {
            console.log('Open shop:', choice.openShop);
            // TODO: 상점 열기
        }

        // 다음 대화로 이동
        if (choice.nextDialogueId) {
            this.next(choice.nextDialogueId);
        } else {
            this.end();
        }
    }

    /**
     * 조건 체크
     */
    private checkCondition(condition: DialogueChoice['condition']): boolean {
        if (!condition) return true;

        // TODO: 실제 조건 체크 구현
        switch (condition.type) {
            case 'quest':
                return true; // 임시
            case 'item':
                return true; // 임시
            case 'level':
                return true; // 임시
            default:
                return true;
        }
    }

    /**
     * UI 업데이트
     */
    private updateUI(): void {
        if (!this.currentNode) return;

        const container = document.getElementById('game-container');
        if (!container) return;

        // 기존 대화 UI 제거
        this.hideUI();

        const node = this.currentNode;
        const speaker = node.speakerKo || node.speaker;
        const text = node.text;

        // 선택지 HTML
        let choicesHtml = '';
        if (node.choices && node.choices.length > 0) {
            choicesHtml = '<div class="dialogue-choices" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">';
            node.choices.forEach((choice, index) => {
                choicesHtml += `
                    <button class="dialogue-choice-btn" data-index="${index}" style="
                        padding: 12px 20px;
                        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: all 0.3s;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">${choice.text}</button>
                `;
            });
            choicesHtml += '</div>';
        }

        // 계속 버튼 (선택지가 없을 때)
        let continueHtml = '';
        if (!node.choices || node.choices.length === 0) {
            continueHtml = `
                <button class="dialogue-continue-btn" style="
                    margin-top: 20px;
                    padding: 12px 40px;
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                ">계속 (Space)</button>
            `;
        }

        // 대화 UI HTML
        const dialogueHtml = `
            <div id="dialogue-ui" style="
                position: absolute;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                max-width: 800px;
                background: rgba(26, 26, 46, 0.95);
                border: 2px solid #34495e;
                border-radius: 12px;
                padding: 20px;
                z-index: 2000;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            ">
                <div style="display: flex; align-items: flex-start; gap: 20px;">
                    <!-- 초상화 (임시) -->
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                        border-radius: 8px;
                        flex-shrink: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        color: white;
                    ">💬</div>

                    <!-- 대화 내용 -->
                    <div style="flex: 1;">
                        <div class="dialogue-speaker" style="
                            font-size: 20px;
                            font-weight: bold;
                            color: #f39c12;
                            margin-bottom: 10px;
                        ">${speaker}</div>

                        <div class="dialogue-text" style="
                            font-size: 16px;
                            color: #e0e0e0;
                            line-height: 1.6;
                            min-height: 60px;
                        ">${text}</div>

                        ${choicesHtml}

                        ${continueHtml}
                    </div>
                </div>

                <style>
                    .dialogue-choice-btn:hover {
                        transform: scale(1.02);
                        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
                    }
                    .dialogue-continue-btn:hover {
                        transform: scale(1.02);
                        box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
                    }
                </style>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', dialogueHtml);

        // 이벤트 리스너 등록
        const continueBtn = document.querySelector('.dialogue-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.next());
        }

        const choiceBtns = document.querySelectorAll('.dialogue-choice-btn');
        choiceBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = parseInt((e.currentTarget as HTMLElement).dataset.index || '0');
                this.selectChoice(index);
            });
        });

        // ESC로 대화 종료
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') {
                this.end();
            } else if (e.code === 'Space' && continueBtn) {
                this.next();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
    }

    /**
     * UI 숨김
     */
    private hideUI(): void {
        const dialogue = document.getElementById('dialogue-ui');
        if (dialogue) {
            dialogue.remove();
        }
    }

    /**
     * 활성 상태 확인
     */
    public isDialogueActive(): boolean {
        return this.isActive;
    }

    /**
     * 현재 노드 확인
     */
    public getCurrentNode(): DialogueNode | null {
        return this.currentNode;
    }
}
