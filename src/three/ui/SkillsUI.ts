/**
 * ============================================================
 * SkillsUI - 스킬 UI (Three.js)
 * ============================================================
 * 플레이어 스킬을 표시하고 관리하는 UI
 * ============================================================
 */

import type { SkillDefinition } from '../../types/game.types';

/**
 * SkillsUI 클래스
 */
export class SkillsUI {
    private isOpen: boolean = false;
    private skills: SkillDefinition[] = [];
    private skillLevels: Map<string, number> = new Map();

    /**
     * 스킬 UI 초기화
     */
    constructor(learnedSkills: string[], skillLevels: Map<string, number>) {
        // TODO: 실제 스킬 데이터 로드
        this.skillLevels = skillLevels;
    }

    /**
     * 스킬 창 열기
     */
    public open(): void {
        if (this.isOpen) return;

        this.isOpen = true;
        this.showUI();
    }

    /**
     * 스킬 창 닫기
     */
    public close(): void {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.hideUI();
    }

    /**
     * 토글
     */
    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * UI 표시
     */
    private showUI(): void {
        const container = document.getElementById('game-container');
        if (!container) return;

        // 기존 스킬 UI 제거
        this.hideUI();

        const skillsHtml = `
            <div id="skills-ui" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                height: 400px;
                background: rgba(26, 26, 46, 0.98);
                border: 2px solid #34495e;
                border-radius: 12px;
                z-index: 2000;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0,0,0,0.7);
            ">
                <!-- 헤더 -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #34495e;
                    background: rgba(52, 73, 94, 0.3);
                    border-radius: 12px 12px 0 0;
                ">
                    <h2 style="
                        color: #e0e0e0;
                        font-size: 20px;
                        margin: 0;
                    ">스킬</h2>
                    <button id="close-skills" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        width: 30px;
                        height: 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 18px;
                        line-height: 1;
                        transition: background 0.3s;
                    ">×</button>
                </div>

                <!-- 스킬 포인트 -->
                <div style="
                    padding: 10px 20px;
                    text-align: center;
                    color: #f39c12;
                    font-size: 14px;
                    border-bottom: 1px solid #34495e;
                ">
                    스킬 포인트: 5
                </div>

                <!-- 스킬 리스트 -->
                <div id="skills-list" style="
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                ">
                    ${this.generateSkillsHtml()}
                </div>

                <style>
                    #close-skills:hover {
                        background: #c0392b;
                    }
                    .skill-item {
                        background: rgba(44, 62, 80, 0.5);
                        border: 2px solid #34495e;
                        border-radius: 8px;
                        padding: 12px 15px;
                        cursor: pointer;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    .skill-item:hover {
                        border-color: #9b59b6;
                        background: rgba(155, 89, 182, 0.3);
                    }
                    .skill-icon {
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                    }
                    .skill-info {
                        flex: 1;
                    }
                    .skill-name {
                        color: #e0e0e0;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .skill-level {
                        color: #7f8c8d;
                        font-size: 12px;
                    }
                </style>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', skillsHtml);

        // 이벤트 리스너
        const closeBtn = document.getElementById('close-skills');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // ESC 키로 닫기
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape' || e.code === 'KeyK') {
                this.close();
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
    }

    /**
     * 스킬 HTML 생성
     */
    private generateSkillsHtml(): string {
        // 임시 스킬 데이터
        const tempSkills = [
            { id: 'skill_1', name: 'Power Strike', nameKo: '파워 스트라이크', level: 1, mpCost: 10 },
            { id: 'skill_2', name: 'Fireball', nameKo: '파이어볼', level: 5, mpCost: 25 },
            { id: 'skill_3', name: 'Heal', nameKo: '힐', level: 1, mpCost: 15 }
        ];

        return tempSkills.map(skill => `
            <div class="skill-item" data-skill="${skill.id}">
                <div class="skill-icon">⚡</div>
                <div class="skill-info">
                    <div class="skill-name">${skill.nameKo}</div>
                    <div class="skill-level">Lv.${skill.level} - MP: ${skill.mpCost}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * UI 숨김
     */
    private hideUI(): void {
        const ui = document.getElementById('skills-ui');
        if (ui) {
            ui.remove();
        }
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.close();
    }
}
