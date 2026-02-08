/**
 * ============================================================
 * ObjectPool - 오브젝트 풀 시스템
 * ============================================================
 * 파티클, 이펙트 등을 위한 오브젝트 풀링
 * ============================================================
 */

/**
 * 풀링 가능한 오브젝트 인터페이스
 */
export interface PoolableObject {
    reset(): void;
    update(deltaTime: number): void;
    isAlive(): boolean;
}

/**
 * ObjectPool 클래스
 */
export class ObjectPool<T extends PoolableObject> {
    private available: T[] = [];
    private active: Set<T> = new Set();
    private factory: () => T;
    private initialSize: number;
    private maxSize: number;

    /**
     * 생성자
     */
    constructor(factory: () => T, initialSize: number = 10, maxSize: number = 100) {
        this.factory = factory;
        this.initialSize = initialSize;
        this.maxSize = maxSize;

        // 초기 풀 생성
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.factory());
        }
    }

    /**
     * 오브젝트 가져오기
     */
    public acquire(): T {
        let obj: T;

        if (this.available.length > 0) {
            obj = this.available.pop()!;
        } else if (this.active.size < this.maxSize) {
            obj = this.factory();
        } else {
            // 풀이 가득 찼으면 가장 오래된 오브젝트 재사용
            const oldest = this.active.values().next().value;
            if (oldest) {
                this.active.delete(oldest);
                obj = oldest;
            } else {
                obj = this.factory();
            }
        }

        this.active.add(obj);
        return obj;
    }

    /**
     * 오브젝트 반환
     */
    public release(obj: T): void {
        if (this.active.has(obj)) {
            this.active.delete(obj);
            obj.reset();
            this.available.push(obj);
        }
    }

    /**
     * 모든 활성 오브젝트 업데이트
     */
    public update(deltaTime: number): void {
        const toRelease: T[] = [];

        this.active.forEach(obj => {
            obj.update(deltaTime);
            if (!obj.isAlive()) {
                toRelease.push(obj);
            }
        });

        toRelease.forEach(obj => this.release(obj));
    }

    /**
     * 모든 오브젝트 반환
     */
    public releaseAll(): void {
        this.active.forEach(obj => {
            obj.reset();
            this.available.push(obj);
        });
        this.active.clear();
    }

    /**
     * 활성 오브젝트 수
     */
    public getActiveCount(): number {
        return this.active.size;
    }

    /**
     * 사용 가능한 오브젝트 수
     */
    public getAvailableCount(): number {
        return this.available.length;
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.releaseAll();
        this.available = [];
    }
}

/**
 * 플로팅 텍스트 파티클
 */
export class FloatingText implements PoolableObject {
    private element: HTMLElement | null = null;
    private position: { x: number; y: number };
    private velocity: { x: number; y: number };
    private lifetime: number = 1.0;
    private maxLifetime: number = 1.0;
    private text: string = '';
    private color: string = '#ffffff';
    private fontSize: number = 24;
    private alive: boolean = true;

    constructor() {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: -50 };
    }

    /**
     * 플로팅 텍스트 초기화
     */
    public init(
        container: HTMLElement,
        text: string,
        x: number,
        y: number,
        color: string = '#ffffff',
        fontSize: number = 24,
        lifetime: number = 1.0
    ): void {
        this.text = text;
        this.position = { x, y };
        this.color = color;
        this.fontSize = fontSize;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.velocity = { x: (Math.random() - 0.5) * 20, y: -50 };
        this.alive = true;

        // DOM 요소 생성
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.pointerEvents = 'none';
            this.element.style.zIndex = '3000';
            this.element.style.fontWeight = 'bold';
            this.element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        }

        this.element.textContent = text;
        this.element.style.color = color;
        this.element.style.fontSize = `${fontSize}px`;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.transform = 'translate(-50%, -50%)';
        this.element.style.opacity = '1';

        container.appendChild(this.element);
    }

    public reset(): void {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.alive = true;
        this.lifetime = this.maxLifetime;
    }

    public update(deltaTime: number): void {
        if (!this.alive) return;

        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.alive = false;
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            return;
        }

        // 위치 업데이트
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // 페이드 아웃
        const alpha = this.lifetime / this.maxLifetime;
        const scale = 1 + (1 - alpha) * 0.2;

        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y}px`;
            this.element.style.opacity = alpha.toString();
            this.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    }

    public isAlive(): boolean {
        return this.alive;
    }

    public destroy(): void {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * 파티클 시스템 매니저
 */
export class ParticleSystem {
    private static instance: ParticleSystem | null = null;
    private textPool: ObjectPool<FloatingText>;
    private container: HTMLElement | null = null;

    private constructor() {
        this.textPool = new ObjectPool(
            () => new FloatingText(),
            50, // initialSize
            200 // maxSize
        );

        // 컨테이너 찾기
        this.container = document.getElementById('game-container');
    }

    /**
     * 싱글톤 인스턴스 가져오기
     */
    public static getInstance(): ParticleSystem {
        if (!ParticleSystem.instance) {
            ParticleSystem.instance = new ParticleSystem();
        }
        return ParticleSystem.instance;
    }

    /**
     * 플로팅 텍스트 생성
     */
    public spawnFloatingText(
        text: string,
        x: number,
        y: number,
        color: string = '#ffffff',
        fontSize: number = 24,
        lifetime: number = 1.0
    ): void {
        if (!this.container) return;

        const floatingText = this.textPool.acquire();
        floatingText.init(this.container, text, x, y, color, fontSize, lifetime);
    }

    /**
     * 데미지 텍스트 생성
     */
    public spawnDamageText(damage: number, x: number, y: number, isPlayer: boolean = false): void {
        const color = isPlayer ? '#e74c3c' : '#f39c12';
        this.spawnFloatingText(`-${damage}`, x, y, color, 24, 1.0);
    }

    /**
     * 경험치 텍스트 생성
     */
    public spawnExpText(exp: number, x: number, y: number): void {
        this.spawnFloatingText(`+${exp} EXP`, x, y, '#f39c12', 18, 2.0);
    }

    /**
     * 골드 텍스트 생성
     */
    public spawnGoldText(gold: number, x: number, y: number): void {
        this.spawnFloatingText(`+${gold} G`, x, y, '#f1c40f', 18, 2.0);
    }

    /**
     * 업데이트
     */
    public update(deltaTime: number): void {
        this.textPool.update(deltaTime);
    }

    /**
     * 파괴
     */
    public destroy(): void {
        this.textPool.destroy();
        ParticleSystem.instance = null;
    }
}
