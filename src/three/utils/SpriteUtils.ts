/**
 * ============================================================
 * SpriteUtils - 스프라이트 유틸리티
 * ============================================================
 * 스프라이트 생성 및 관련 유틸리티 함수
 * ============================================================
 */

import * as THREE from 'three';

/**
 * 스프라이트 생성 옵션
 */
export interface SpriteOptions {
    texture: THREE.Texture | THREE.CanvasTexture;
    x?: number;
    y?: number;
    z?: number;
    scaleX?: number;
    scaleY?: number;
    opacity?: number;
}

/**
 * SpriteUtils 클래스
 */
export class SpriteUtils {
    /**
     * 기본 Sprite 생성
     */
    public static createSprite(options: SpriteOptions): THREE.Sprite {
        const {
            texture,
            x = 0,
            y = 0,
            z = 0,
            scaleX = 1,
            scaleY = 1,
            opacity = 1
        } = options;

        const sprite = new THREE.Sprite(texture);
        sprite.position.set(x, y, z);
        sprite.scale.set(scaleX, scaleY, 1);
        sprite.material.opacity = opacity;
        sprite.material.transparent = opacity < 1;

        return sprite;
    }

    /**
     * 애니메이션 스프라이트 생성
     */
    public static createAnimatedSprite(
        textures: THREE.Texture[],
        frameRate: number = 8
    ): {
        sprite: THREE.Sprite;
        update: (deltaTime: number) => void;
        play: (animation: string) => void;
        stop: () => void;
    } {
        const sprite = new THREE.Sprite(textures[0]);
        let currentFrame = 0;
        let frameTime = 0;
        let isPlaying = true;
        const frameDuration = 1 / frameRate;

        const update = (deltaTime: number) => {
            if (!isPlaying) return;

            frameTime += deltaTime;
            if (frameTime >= frameDuration) {
                frameTime = 0;
                currentFrame = (currentFrame + 1) % textures.length;
                sprite.material.map = textures[currentFrame];
            }
        };

        const play = () => {
            isPlaying = true;
        };

        const stop = () => {
            isPlaying = false;
        };

        return { sprite, update, play, stop };
    }

    /**
     * 픽셀 느낌의 Texture 설정
     */
    public static setPixelated(texture: THREE.Texture): void {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
    }

    /**
     * 부드러운 Texture 설정
     */
    public static setSmooth(texture: THREE.Texture): void {
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
    }

    /**
     * 캔버스에서 Texture 생성
     */
    public static createCanvasTexture(
        draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
        width: number = 64,
        height: number = 64
    ): THREE.CanvasTexture {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            draw(ctx, canvas);
        }

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    /**
     * 단색 스프라이트 생성
     */
    public static createColorSprite(
        color: string | number,
        width: number = 32,
        height: number = 32
    ): THREE.Sprite {
        const texture = this.createCanvasTexture((ctx, canvas) => {
            ctx.fillStyle = typeof color === 'string' ? color : `#${color.toString(16).padStart(6, '0')}`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, width, height);

        return this.createSprite({ texture, scaleX: width, scaleY: height });
    }

    /**
     * 텍스트 스프라이트 생성
     */
    public static createTextSprite(
        text: string,
        options: {
            fontSize?: number;
            fontFamily?: string;
            color?: string;
            backgroundColor?: string;
            padding?: number;
        } = {}
    ): THREE.Sprite {
        const {
            fontSize = 16,
            fontFamily = 'Arial',
            color = '#ffffff',
            backgroundColor,
            padding = 8
        } = options;

        const texture = this.createCanvasTexture((ctx, canvas) => {
            ctx.font = `${fontSize}px ${fontFamily}`;
            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = fontSize;

            canvas.width = textWidth + padding * 2;
            canvas.height = textHeight + padding * 2;

            if (backgroundColor) {
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.fillStyle = color;
            ctx.textBaseline = 'top';
            ctx.fillText(text, padding, padding);
        });

        return this.createSprite({ texture });
    }

    /**
     * 이미지 로딩 (Promise)
     */
    public static async loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = path;
        });
    }

    /**
     * 텍스처 로딩 (Promise)
     */
    public static async loadTexture(path: string, pixelated: boolean = true): Promise<THREE.Texture> {
        const img = await this.loadImage(path);
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;

        if (pixelated) {
            this.setPixelated(texture);
        } else {
            this.setSmooth(texture);
        }

        return texture;
    }

    /**
     * 스프라이트 시트에서 프레임 추출
     */
    public static extractFrames(
        texture: THREE.Texture,
        frameWidth: number,
        frameHeight: number,
        rows: number,
        cols: number
    ): THREE.Texture[] {
        const frames: THREE.Texture[] = [];
        const image = texture.image;

        if (!(image instanceof HTMLImageElement)) {
            return frames;
        }

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
                this.setPixelated(frameTexture);
                frames.push(frameTexture);
            }
        }

        return frames;
    }
}
