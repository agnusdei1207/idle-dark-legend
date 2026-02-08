/**
 * ============================================================
 * AssetManager - 에셋 로딩 관리 클래스
 * ============================================================
 * Phaser의 Loader를 대체하는 Three.js 에셋 로딩 시스템
 *
 * [기능]
 * - Texture 로딩
 * - Sprite 로딩
 * - 에셋 캐싱
 * - 로딩 진행률 추적
 * ============================================================
 */

import * as THREE from 'three';
import { TextureLoader } from 'three';

/**
 * 로딩 진행률 콜백
 */
export interface ProgressCallback {
    (progress: number, loaded: number, total: number): void;
}

/**
 * 로딩 완료 콜백
 */
export interface CompleteCallback {
    (): void;
}

/**
 * 로딩 에러 콜백
 */
export interface ErrorCallback {
    (error: Error): void;
}

/**
 * 로딩 작업
 */
interface LoadingTask {
    url: string;
    type: 'texture' | 'json' | 'audio';
    key: string;
}

/**
 * AssetManager 클래스
 */
export class AssetManager {
    private renderer: THREE.WebGLRenderer;
    private textureLoader: THREE.TextureLoader;
    private cache: Map<string, any>;
    private loadingQueue: LoadingTask[];

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.textureLoader = new TextureLoader();
        this.cache = new Map();
        this.loadingQueue = [];
    }

    // ========================================
    // Texture 로딩
    // ========================================

    /**
     * Texture 로드
     */
    public loadTexture(key: string, url: string): Promise<THREE.Texture> {
        // 캐시 확인
        if (this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key) as THREE.Texture);
        }

        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    this.cache.set(key, texture);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    reject(new Error(`Failed to load texture: ${url}`));
                }
            );
        });
    }

    /**
     * 여러 Texture 로드
     */
    public loadTextures(
        textures: { key: string; url: string }[],
        onProgress?: ProgressCallback
    ): Promise<THREE.Texture[]> {
        const promises = textures.map(({ key, url }, index) => {
            return this.loadTexture(key, url).then((texture) => {
                if (onProgress) {
                    onProgress((index + 1) / textures.length, index + 1, textures.length);
                }
                return texture;
            });
        });

        return Promise.all(promises);
    }

    /**
     * Sprite 시트 로드
     */
    public loadSpriteSheet(
        key: string,
        url: string,
        frameWidth: number,
        frameHeight: number
    ): Promise<THREE.Texture[]> {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    const frames: THREE.Texture[] = [];
                    const image = texture.image;

                    if (!(image instanceof HTMLImageElement)) {
                        reject(new Error('Sprite sheet must be an image'));
                        return;
                    }

                    const cols = Math.floor(image.width / frameWidth);
                    const rows = Math.floor(image.height / frameHeight);

                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            const canvas = document.createElement('canvas');
                            canvas.width = frameWidth;
                            canvas.height = frameHeight;
                            const ctx = canvas.getContext('2d');

                            if (ctx) {
                                ctx.drawImage(
                                    image,
                                    col * frameWidth, row * frameHeight,
                                    frameWidth, frameHeight,
                                    0, 0,
                                    frameWidth, frameHeight
                                );
                            }

                            const frameTexture = new THREE.CanvasTexture(canvas);
                            frameTexture.magFilter = THREE.NearestFilter;
                            frameTexture.minFilter = THREE.NearestFilter;
                            frames.push(frameTexture);
                        }
                    }

                    this.cache.set(key, frames);
                    resolve(frames);
                },
                undefined,
                (error) => {
                    reject(new Error(`Failed to load sprite sheet: ${url}`));
                }
            );
        });
    }

    // ========================================
    // JSON 로딩
    // ========================================

    /**
     * JSON 로드
     */
    public loadJSON(key: string, url: string): Promise<any> {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load JSON: ${url}`);
                }
                return response.json();
            })
            .then(data => {
                this.cache.set(key, data);
                return data;
            });
    }

    // ========================================
    // 캐시 관리
    // ========================================

    /**
     * 에셋 가져오기
     */
    public get(key: string): any {
        return this.cache.get(key);
    }

    /**
     * 에셋 존재 여부 확인
     */
    public has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * 캐시 비우기
     */
    public clear(): void {
        // 캐시된 에셋 메모리 해제
        this.cache.forEach((value) => {
            if (value instanceof THREE.Texture) {
                value.dispose();
            }
        });
        this.cache.clear();
    }

    // ========================================
    // 파괴
    // ========================================

    /**
     * 파괴
     */
    public destroy(): void {
        this.clear();
        this.loadingQueue = [];
    }
}
