import Phaser from 'phaser';

/**
 * 부트 씬 - 에셋 로딩 담당
 */
export class BootScene extends Phaser.Scene {
    private loadingBar!: HTMLElement | null;
    private loadingText!: HTMLElement | null;

    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // HTML 로딩 요소 참조
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingText = document.getElementById('loading-text');

        // 로딩 진행률 표시
        this.load.on('progress', (value: number) => {
            const percent = Math.round(value * 100);
            if (this.loadingBar) {
                this.loadingBar.style.width = `${percent}%`;
            }
            if (this.loadingText) {
                this.loadingText.textContent = `Loading... ${percent}%`;
            }
        });

        this.load.on('complete', () => {
            if (this.loadingText) {
                this.loadingText.textContent = 'Complete!';
            }
        });

        // ============================================
        // 에셋 로딩
        // ============================================

        // 타일셋 (scrabling의 32x32 Pixel Isometric Tiles)
        // License: CC BY 4.0
        // URL: https://scrabling.itch.io/pixel-isometric-tiles
        this.load.image('tiles-nature', 'assets/tilesets/isometric-tiles.png');

        // 플레이스홀더 스프라이트 (나중에 교체)
        this.load.spritesheet('player', 'assets/sprites/player.png', {
            frameWidth: 32,
            frameHeight: 48
        });

        // UI 요소
        // this.load.image('button', 'assets/ui/button.png');

        // 맵 데이터 (Tiled JSON)
        // this.load.tilemapTiledJSON('map-village', 'assets/maps/village.json');

        // 오디오
        // this.load.audio('bgm-town', 'assets/audio/bgm/town.mp3');
        // this.load.audio('sfx-click', 'assets/audio/sfx/click.wav');
    }

    create(): void {
        console.log('🎮 Shadow Realm Tribute - Boot Complete!');

        // 로딩 화면 숨기기
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        // 메뉴 씬으로 전환 (또는 바로 게임 씬)
        this.scene.start('MenuScene');
    }
}
