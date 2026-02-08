/**
 * ============================================================
 * AssetManager - 에셋 관리 시스템
 * ============================================================
 * 3D 모델, 텍스처, 스프라이트 등의 에셋을 로드하고 캐싱
 * ============================================================
 */

import * as THREE from 'three';

/**
 * 에셋 타입
 */
export const AssetType = {
    MODEL: 'model',
    TEXTURE: 'texture',
    SPRITE: 'sprite',
    AUDIO: 'audio',
    FONT: 'font'
} as const;

export type AssetType = typeof AssetType[keyof typeof AssetType];

/**
 * 에셋 데이터 인터페이스
 */
export interface AssetData {
    id: string;
    type: AssetType;
    url: string;
    data?: any;
    loaded: boolean;
    error?: string;
}

/**
 * 에셋 로드 옵션
 */
export interface AssetLoadOptions {
    onLoad?: (asset: AssetData) => void;
    onError?: (error: string) => void;
    onProgress?: (progress: number) => void;
}

/**
 * AssetManager 싱글톤 클래스
 */
export class AssetManager {
    private static instance: AssetManager | null = null;
    private assets: Map<string, AssetData> = new Map();
    private textureLoader: THREE.TextureLoader;
    private loadingPromises: Map<string, Promise<any>> = new Map();

    private constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    /**
     * 싱글톤 인스턴스 가져오기
     */
    public static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    /**
     * 에셋 등록
     */
    public registerAsset(id: string, type: AssetType, url: string): void {
        this.assets.set(id, {
            id,
            type,
            url,
            loaded: false
        });
    }

    /**
     * 텍스처 로드
     */
    public async loadTexture(id: string, options?: AssetLoadOptions): Promise<THREE.Texture> {
        // 이미 로드된 경우 반환
        const cached = this.assets.get(id);
        if (cached?.loaded && cached.data) {
            return cached.data;
        }

        // 로드 중인 프로미스가 있으면 반환
        const existingPromise = this.loadingPromises.get(id);
        if (existingPromise) {
            return existingPromise;
        }

        // 새로 로드
        const promise = new Promise<THREE.Texture>((resolve, reject) => {
            this.textureLoader.load(
                id,
                (texture) => {
                    // 성공
                    if (cached) {
                        cached.loaded = true;
                        cached.data = texture;
                    }
                    this.loadingPromises.delete(id);
                    options?.onLoad?.(cached!);
                    resolve(texture);
                },
                (progress) => {
                    // 진행률
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total) * 100;
                        options?.onProgress?.(percent);
                    }
                },
                (error) => {
                    // 에러
                    const errorMsg = `Failed to load texture: ${id}`;
                    if (cached) {
                        cached.error = errorMsg;
                    }
                    this.loadingPromises.delete(id);
                    options?.onError?.(errorMsg);
                    reject(new Error(errorMsg));
                }
            );
        });

        this.loadingPromises.set(id, promise);
        return promise;
    }

    /**
     * 플레이스홀더 텍스처 생성 (컬러 기반)
     */
    public createColorTexture(color: number | string): THREE.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const colorStr = typeof color === 'number'
                ? '#' + color.toString(16).padStart(6, '0')
                : color;
            ctx.fillStyle = colorStr;
            ctx.fillRect(0, 0, 64, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * 그리데이션 텍스처 생성
     */
    public createGradientTexture(
        colorStart: number,
        colorEnd: number,
        direction: 'vertical' | 'horizontal' = 'vertical'
    ): THREE.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const gradient = direction === 'vertical'
                ? ctx.createLinearGradient(0, 0, 0, 64)
                : ctx.createLinearGradient(0, 0, 64, 0);

            const color1 = '#' + colorStart.toString(16).padStart(6, '0');
            const color2 = '#' + colorEnd.toString(16).padStart(6, '0');

            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * 원형 텍스처 생성 (그림자 등)
     */
    public createCircleTexture(
        color: number,
        radius: number = 32
    ): THREE.Texture {
        const size = radius * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const colorStr = '#' + color.toString(16).padStart(6, '0');
            ctx.fillStyle = colorStr;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * 텍스처 아틀라스 생성
     */
    public createTextureAtlas(
        frames: { [key: string]: { x: number; y: number; width: number; height: number } },
        atlasWidth: number,
        atlasHeight: number
    ): { texture: THREE.CanvasTexture; frames: typeof frames } {
        const canvas = document.createElement('canvas');
        canvas.width = atlasWidth;
        canvas.height = atlasHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(0, 0, atlasWidth, atlasHeight);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        return { texture, frames };
    }

    /**
     * 프리로드 시스템 에셋
     */
    public async preloadSystemAssets(): Promise<void> {
        const systemAssets = [
            // 플레이어 관련
            { id: 'player_body', type: AssetType.TEXTURE, url: '/assets/textures/player_body.png' },
            { id: 'player_head', type: AssetType.TEXTURE, url: '/assets/textures/player_head.png' },

            // 몬스터 관련
            { id: 'monster_slime', type: AssetType.TEXTURE, url: '/assets/textures/monsters/slime.png' },
            { id: 'monster_goblin', type: AssetType.TEXTURE, url: '/assets/textures/monsters/goblin.png' },
            { id: 'monster_wolf', type: AssetType.TEXTURE, url: '/assets/textures/monsters/wolf.png' },

            // NPC 관련
            { id: 'npc_merchant', type: AssetType.TEXTURE, url: '/assets/textures/npcs/merchant.png' },
            { id: 'npc_quest', type: AssetType.TEXTURE, url: '/assets/textures/npcs/quest.png' },

            // UI 관련
            { id: 'ui_frame', type: AssetType.TEXTURE, url: '/assets/textures/ui/frame.png' },
            { id: 'ui_button', type: AssetType.TEXTURE, url: '/assets/textures/ui/button.png' },
        ];

        // 등록
        systemAssets.forEach(asset => {
            this.registerAsset(asset.id, asset.type, asset.url);
        });

        // TODO: 실제 로딩 (현재는 플레이스홀더 사용)
        console.log('AssetManager: System assets registered (using placeholders)');
    }

    /**
     * 에셋 가져오기
     */
    public getAsset(id: string): AssetData | undefined {
        return this.assets.get(id);
    }

    /**
     * 에셋이 로드되었는지 확인
     */
    public isAssetLoaded(id: string): boolean {
        const asset = this.assets.get(id);
        return asset?.loaded ?? false;
    }

    /**
     * 로드 진행률 가져오기
     */
    public getLoadProgress(): number {
        if (this.assets.size === 0) return 1;

        let loadedCount = 0;
        this.assets.forEach(asset => {
            if (asset.loaded) loadedCount++;
        });

        return loadedCount / this.assets.size;
    }

    /**
     * 모든 에셋 해제
     */
    public dispose(): void {
        this.assets.forEach(asset => {
            if (asset.data && asset.data instanceof THREE.Texture) {
                asset.data.dispose();
            }
        });
        this.assets.clear();
        this.loadingPromises.clear();
    }

    /**
     * 싱글톤 인스턴스 해제
     */
    public static destroy(): void {
        if (AssetManager.instance) {
            AssetManager.instance.dispose();
            AssetManager.instance = null;
        }
    }
}

/**
 * 에셋 라이브러리 상수
 */
export const AssetLibrary = {
    // 플레이어 에셋
    PLAYER: {
        WARRIOR: 'player_warrior',
        MAGE: 'player_mage',
        ROGUE: 'player_rogue',
        CLERIC: 'player_cleric',
        MONK: 'player_monk'
    },

    // 몬스터 에셋
    MONSTERS: {
        SLIME: 'monster_slime',
        GOBLIN: 'monster_goblin',
        ORC: 'monster_orc',
        SKELETON: 'monster_skeleton',
        DEMON: 'monster_demon',
        DRAGON: 'monster_dragon',
        GHOST: 'monster_ghost',
        WOLF: 'monster_wolf'
    },

    // NPC 에셋
    NPCS: {
        MERCHANT: 'npc_merchant',
        QUEST: 'npc_quest',
        TRAINER: 'npc_trainer',
        GUARD: 'npc_guard',
        BANKER: 'npc_banker',
        CITIZEN: 'npc_citizen'
    },

    // UI 에셋
    UI: {
        FRAME: 'ui_frame',
        BUTTON: 'ui_button',
        PANEL: 'ui_panel',
        SLOT: 'ui_slot'
    },

    // 이펙트 에셋
    EFFECTS: {
        ATTACK: 'effect_attack',
        HIT: 'effect_hit',
        LEVEL_UP: 'effect_levelup',
        HEAL: 'effect_heal'
    }
};
