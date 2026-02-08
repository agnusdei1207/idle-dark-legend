/**
 * ============================================================
 * OfflineRewardSystem - 오프라인 보상 시스템
 * ============================================================
 * 플레이어가 오프라인 동안 획득한 보상을 관리
 * ============================================================
 */

export interface OfflineReward {
    exp: number;
    gold: number;
    duration: number; // 오프라인 시간 (초)
    maxDuration: number; // 최대 보상 시간 (초)
}

export interface OfflineRewardOptions {
    onClaim?: (reward: OfflineReward) => void;
    onClose?: () => void;
}

/**
 * OfflineRewardSystem 클래스
 */
export class OfflineRewardSystem {
    private static readonly STORAGE_KEY = 'dark_legend_last_play_time';
    private static readonly MAX_OFFLINE_REWARD_HOURS = 24;
    private static readonly EXP_PER_MINUTE = 10;
    private static readonly GOLD_PER_MINUTE = 5;

    private currentReward: OfflineReward | null = null;
    private onClaimCallback?: (reward: OfflineReward) => void;
    private onCloseCallback?: () => void;

    /**
     * 마지막 플레이 시간 저장
     */
    public static saveLastPlayTime(): void {
        const now = Date.now();
        localStorage.setItem(this.STORAGE_KEY, now.toString());
    }

    /**
     * 마지막 플레이 시간 로드
     */
    public static loadLastPlayTime(): number {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            return parseInt(saved, 10);
        }
        return Date.now();
    }

    /**
     * 오프라인 보상 계산
     */
    public static calculateOfflineReward(): OfflineReward | null {
        const lastPlayTime = this.loadLastPlayTime();
        const now = Date.now();
        const offlineDuration = Math.floor((now - lastPlayTime) / 1000); // 초

        // 1분 미만이면 보상 없음
        if (offlineDuration < 60) {
            return null;
        }

        // 최대 보상 시간 제한
        const maxDuration = this.MAX_OFFLINE_REWARD_HOURS * 60 * 60; // 시간을 초로 변환
        const rewardDuration = Math.min(offlineDuration, maxDuration);

        // 보상 계산
        const minutes = Math.floor(rewardDuration / 60);
        const exp = minutes * this.EXP_PER_MINUTE;
        const gold = minutes * this.GOLD_PER_MINUTE;

        return {
            exp,
            gold,
            duration: offlineDuration,
            maxDuration
        };
    }

    /**
     * 오프라인 보합 표시
     */
    public showOfflineReward(reward: OfflineReward, options?: OfflineRewardOptions): void {
        this.currentReward = reward;
        this.onClaimCallback = options?.onClaim;
        this.onCloseCallback = options?.onClose;

        this.showUI();
    }

    /**
     * UI 표시
     */
    private showUI(): void {
        if (!this.currentReward) return;

        const container = document.getElementById('game-container');
        if (!container) return;

        const hours = Math.floor(this.currentReward.duration / 3600);
        const minutes = Math.floor((this.currentReward.duration % 3600) / 60);

        const rewardHtml = `
            <div id="offline-reward-modal" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 5000;
                animation: fadeIn 0.3s ease-out;
            ">
                <div style="
                    width: 400px;
                    background: linear-gradient(135deg, #1a1a2e 0%, #2c3e50 100%);
                    border: 3px solid #f39c12;
                    border-radius: 16px;
                    padding: 30px;
                    text-align: center;
                    box-shadow: 0 0 40px rgba(243, 156, 18, 0.3);
                    animation: slideUp 0.4s ease-out;
                ">
                    <!-- 아이콘 -->
                    <div style="
                        font-size: 64px;
                        margin-bottom: 20px;
                        animation: bounce 1s infinite;
                    ">🎁</div>

                    <!-- 타이틀 -->
                    <h2 style="
                        color: #f39c12;
                        font-size: 28px;
                        margin: 0 0 10px 0;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    ">환영합니다!</h2>

                    <!-- 설명 -->
                    <p style="
                        color: #e0e0e0;
                        font-size: 14px;
                        margin: 0 0 20px 0;
                        opacity: 0.9;
                    ">
                        ${hours > 0 ? `${hours}시간 ` : ''}${minutes}분 동안
                        <br>떨어져 있었습니다
                    </p>

                    <!-- 보상 아이템 -->
                    <div style="
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 12px;
                        padding: 15px;
                        margin-bottom: 20px;
                    ">
                        <div style="
                            display: flex;
                            justify-content: space-around;
                            gap: 20px;
                        ">
                            <!-- 경험치 -->
                            <div style="
                                text-align: center;
                            ">
                                <div style="
                                    font-size: 32px;
                                    margin-bottom: 5px;
                                ">⭐</div>
                                <div style="
                                    color: #f39c12;
                                    font-size: 20px;
                                    font-weight: bold;
                                ">+${this.currentReward.exp.toLocaleString()}</div>
                                <div style="
                                    color: #7f8c8d;
                                    font-size: 12px;
                                ">EXP</div>
                            </div>

                            <!-- 골드 -->
                            <div style="
                                text-align: center;
                            ">
                                <div style="
                                    font-size: 32px;
                                    margin-bottom: 5px;
                                ">💰</div>
                                <div style="
                                    color: #f1c40f;
                                    font-size: 20px;
                                    font-weight: bold;
                                ">+${this.currentReward.gold.toLocaleString()}</div>
                                <div style="
                                    color: #7f8c8d;
                                    font-size: 12px;
                                ">GOLD</div>
                            </div>
                        </div>
                    </div>

                    <!-- 받기 버튼 -->
                    <button id="claim-reward-btn" style="
                        background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 8px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
                    ">
                        보상 받기
                    </button>
                </div>

                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    #claim-reward-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(243, 156, 18, 0.6);
                    }
                    #claim-reward-btn:active {
                        transform: translateY(0);
                    }
                </style>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', rewardHtml);

        // 버튼 이벤트
        const claimBtn = document.getElementById('claim-reward-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => this.claimReward());
        }

        // ESC 키로 닫기
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') {
                this.claimReward();
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
    }

    /**
     * 보상 수령
     */
    private claimReward(): void {
        if (this.currentReward && this.onClaimCallback) {
            this.onClaimCallback(this.currentReward);
        }

        this.hideUI();

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }

        this.currentReward = null;
    }

    /**
     * UI 숨김
     */
    private hideUI(): void {
        const modal = document.getElementById('offline-reward-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.hideUI();
    }
}
