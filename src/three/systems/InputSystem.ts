/**
 * ============================================================
 * InputSystem - 입력 처리 시스템
 * ============================================================
 * 키보드, 마우스 입력을 처리하는 시스템
 * ============================================================
 */

/**
 * 키 상태
 */
interface KeyState {
    isDown: boolean;
    justPressed: boolean;
    justReleased: boolean;
}

/**
 * InputSystem 클래스
 */
export class InputSystem {
    private keys: Map<string, KeyState>;
    private mousePosition: { x: number; y: number };
    private mouseButtons: Map<number, boolean>;

    constructor() {
        this.keys = new Map();
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = new Map();

        this.setupKeyboardListeners();
        this.setupMouseListeners();
    }

    /**
     * 키보드 리스너 설정
     */
    private setupKeyboardListeners(): void {
        window.addEventListener('keydown', (e) => {
            const key = e.code.toLowerCase();
            let state = this.keys.get(key);

            if (!state) {
                state = { isDown: false, justPressed: false, justReleased: false };
                this.keys.set(key, state);
            }

            if (!state.isDown) {
                state.justPressed = true;
            }
            state.isDown = true;
            state.justReleased = false;
        });

        window.addEventListener('keyup', (e) => {
            const key = e.code.toLowerCase();
            let state = this.keys.get(key);

            if (!state) {
                state = { isDown: false, justPressed: false, justReleased: false };
                this.keys.set(key, state);
            }

            state.isDown = false;
            state.justPressed = false;
            state.justReleased = true;
        });
    }

    /**
     * 마우스 리스너 설정
     */
    private setupMouseListeners(): void {
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });

        window.addEventListener('mousedown', (e) => {
            this.mouseButtons.set(e.button, true);
        });

        window.addEventListener('mouseup', (e) => {
            this.mouseButtons.set(e.button, false);
        });
    }

    /**
     * 키가 눌러있는지 확인
     */
    public isDown(keyCode: string): boolean {
        const key = this.keys.get(keyCode.toLowerCase());
        return key ? key.isDown : false;
    }

    /**
     * 키가 이번 프레임에 눌렸는지 확인
     */
    public justPressed(keyCode: string): boolean {
        const key = this.keys.get(keyCode.toLowerCase());
        return key ? key.justPressed : false;
    }

    /**
     * 키가 이번 프레임에 떨어졌는지 확인
     */
    public justReleased(keyCode: string): boolean {
        const key = this.keys.get(keyCode.toLowerCase());
        return key ? key.justReleased : false;
    }

    /**
     * WASD 입력 방향 계산
     */
    public getWASDDirection(): { x: number; y: number } {
        const x = (this.isDown('KeyD') ? 1 : 0) - (this.isDown('KeyA') ? 1 : 0);
        const y = (this.isDown('KeyS') ? 1 : 0) - (this.isDown('KeyW') ? 1 : 0);

        // 대각선 이동 정규화
        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            return { x: x / length, y: y / length };
        }

        return { x: 0, y: 0 };
    }

    /**
     * 방향키 입력 방향 계산
     */
    public getArrowDirection(): { x: number; y: number } {
        const x = (this.isDown('ArrowRight') ? 1 : 0) - (this.isDown('ArrowLeft') ? 1 : 0);
        const y = (this.isDown('ArrowDown') ? 1 : 0) - (this.isDown('ArrowUp') ? 1 : 0);

        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            return { x: x / length, y: y / length };
        }

        return { x: 0, y: 0 };
    }

    /**
     * 마우스 위치 가져오기
     */
    public getMousePosition(): { x: number; y: number } {
        return { ...this.mousePosition };
    }

    /**
     * 마우스 버튼이 눌러있는지 확인
     */
    public isMouseDown(button: number): boolean {
        return this.mouseButtons.get(button) || false;
    }

    /**
     * 프레임 업데이트 (justPressed/justReleased 리셋)
     */
    public update(): void {
        this.keys.forEach((state) => {
            state.justPressed = false;
            state.justReleased = false;
        });
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.keys.clear();
        this.mouseButtons.clear();
    }
}
