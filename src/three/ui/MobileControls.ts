/**
 * ============================================================
 * MobileControls - 모바일 터치 컨트롤
 * ============================================================
 * 가상 조이스틱 및 액션 버튼
 * ============================================================
 */

export class MobileControls {
    private container: HTMLElement | null = null;
    private joystick: HTMLElement | null = null;
    private joystickKnob: HTMLElement | null = null;
    private joystickActive: boolean = false;
    private joystickStartPos: { x: number; y: number } = { x: 0, y: 0 };
    private joystickDirection: { x: number; y: number } = { x: 0, y: 0 };
    private touchId: number | null = null;

    // 버튼 상태
    private attackPressed: boolean = false;
    private skillPressed: number[] = [false, false, false, false];

    constructor() {
        this.init();
    }

    /**
     * 초기화
     */
    private init(): void {
        // 모바일인지 확인
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (!isMobile && window.innerWidth > 768) {
            return; // PC에서는 표시하지 않음 (단, 작은 화면에서는 표시)
        }

        this.createMobileUI();
        this.setupTouchEvents();
    }

    /**
     * 모바일 UI 생성
     */
    private createMobileUI(): void {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        // 모바일 컨트롤 컨테이너
        this.container = document.createElement('div');
        this.container.id = 'mobile-controls';
        this.container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;

        // 좌측 조이스틱
        this.joystick = document.createElement('div');
        this.joystick.id = 'joystick';
        this.joystick.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 40px;
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.1);
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: auto;
            touch-action: none;
        `;

        this.joystickKnob = document.createElement('div');
        this.joystickKnob.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            background: rgba(52, 152, 219, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;

        this.joystick.appendChild(this.joystickKnob);
        this.container.appendChild(this.joystick);

        // 우측 버튼들
        this.createActionButtons();

        gameContainer.appendChild(this.container);
    }

    /**
     * 액션 버튼 생성
     */
    private createActionButtons(): void {
        if (!this.container) return;

        // 공격 버튼 (크고 아래쪽)
        const attackBtn = document.createElement('button');
        attackBtn.id = 'attack-btn';
        attackBtn.innerHTML = '⚔️';
        attackBtn.style.cssText = `
            position: absolute;
            bottom: 40px;
            right: 40px;
            width: 80px;
            height: 80px;
            background: rgba(231, 76, 60, 0.7);
            border: 3px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            color: white;
            font-size: 32px;
            pointer-events: auto;
            touch-action: none;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        attackBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.attackPressed = true;
        });
        attackBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.attackPressed = false;
        });
        this.container.appendChild(attackBtn);

        // 스킬 버튼 (작고 위쪽)
        const skillIcons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
        for (let i = 0; i < 4; i++) {
            const skillBtn = document.createElement('button');
            skillBtn.id = `skill-btn-${i}`;
            skillBtn.innerHTML = skillIcons[i];
            skillBtn.style.cssText = `
                position: absolute;
                bottom: ${150 + i * 65}px;
                right: 40px;
                width: 60px;
                height: 60px;
                background: rgba(52, 152, 219, 0.7);
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                color: white;
                font-size: 24px;
                pointer-events: auto;
                touch-action: none;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            skillBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.skillPressed[i] = true;
            });
            skillBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.skillPressed[i] = false;
            });
            this.container.appendChild(skillBtn);
        }

        // UI 토글 버튼 (인벤토리, 스킬, 퀘스트)
        const uiButtons = [
            { label: '🎒', id: 'inventory', top: 20, color: 'rgba(155, 89, 182, 0.7)' },
            { label: '⚡', id: 'skills', top: 90, color: 'rgba(241, 196, 15, 0.7)' },
            { label: '📜', id: 'quests', top: 160, color: 'rgba(46, 204, 113, 0.7)' }
        ];

        uiButtons.forEach(btn => {
            const uiBtn = document.createElement('button');
            uiBtn.id = `${btn.id}-btn`;
            uiBtn.innerHTML = btn.label;
            uiBtn.style.cssText = `
                position: absolute;
                top: ${btn.top}px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: ${btn.color};
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 10px;
                color: white;
                font-size: 24px;
                pointer-events: auto;
                touch-action: none;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            this.container!.appendChild(uiBtn);
        });
    }

    /**
     * 터치 이벤트 설정
     */
    private setupTouchEvents(): void {
        if (!this.joystick) return;

        this.joystick.addEventListener('touchstart', (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchId = touch.identifier;
            this.joystickActive = true;

            const rect = this.joystick!.getBoundingClientRect();
            this.joystickStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        });

        document.addEventListener('touchmove', (e: TouchEvent) => {
            if (!this.joystickActive || !this.joystickKnob) return;

            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === this.touchId) {
                    e.preventDefault();
                    const touch = e.touches[i];

                    const dx = touch.clientX - this.joystickStartPos.x;
                    const dy = touch.clientY - this.joystickStartPos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 35;

                    if (distance > 0) {
                        const angle = Math.atan2(dy, dx);
                        const limitedDistance = Math.min(distance, maxDistance);

                        const knobX = Math.cos(angle) * limitedDistance;
                        const knobY = Math.sin(angle) * limitedDistance;

                        this.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

                        // 방향 계산 (-1 ~ 1)
                        this.joystickDirection = {
                            x: knobX / maxDistance,
                            y: -knobY / maxDistance  // Y축 반전 (위가 양수)
                        };
                    }
                    break;
                }
            }
        });

        document.addEventListener('touchend', (e: TouchEvent) => {
            if (!this.joystickActive) return;

            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.touchId) {
                    e.preventDefault();
                    this.joystickActive = false;
                    this.touchId = null;
                    this.joystickDirection = { x: 0, y: 0 };

                    if (this.joystickKnob) {
                        this.joystickKnob.style.transform = 'translate(-50%, -50%)';
                    }
                    break;
                }
            }
        });
    }

    /**
     * 조이스틱 방향 가져오기
     */
    public getDirection(): { x: number; y: number } {
        return { ...this.joystickDirection };
    }

    /**
     * 공격 버튼 눌림 확인
     */
    public isAttackPressed(): boolean {
        const pressed = this.attackPressed;
        if (pressed) {
            this.attackPressed = false; // 한 번만 트리거
        }
        return pressed;
    }

    /**
     * 스킬 버튼 눌림 확인
     */
    public isSkillPressed(index: number): boolean {
        if (index < 0 || index >= 4) return false;
        const pressed = this.skillPressed[index];
        if (pressed) {
            this.skillPressed[index] = false; // 한 번만 트리거
        }
        return pressed;
    }

    /**
     * 정리
     */
    public destroy(): void {
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }
}
