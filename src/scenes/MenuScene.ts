import Phaser from 'phaser';

/**
 * 메인 메뉴 씬
 */
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // 배경 그라디언트 효과
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);

        // 타이틀
        const title = this.add.text(width / 2, height * 0.3, 'Shadow Realm', {
            fontFamily: 'Georgia, serif',
            fontSize: '64px',
            color: '#e94560',
            stroke: '#0f3460',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // 부제
        const subtitle = this.add.text(width / 2, height * 0.4, 'A Tribute to Classic Korean MMORPGs', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#aaa'
        });
        subtitle.setOrigin(0.5);

        // 시작 버튼
        const startBtn = this.add.text(width / 2, height * 0.6, '[ 게임 시작 ]', {
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#fff',
            backgroundColor: '#e94560',
            padding: { x: 30, y: 15 }
        });
        startBtn.setOrigin(0.5);
        startBtn.setInteractive({ useHandCursor: true });

        // 호버 효과
        startBtn.on('pointerover', () => {
            startBtn.setStyle({ backgroundColor: '#ff6b6b' });
            this.tweens.add({
                targets: startBtn,
                scale: 1.05,
                duration: 100
            });
        });

        startBtn.on('pointerout', () => {
            startBtn.setStyle({ backgroundColor: '#e94560' });
            this.tweens.add({
                targets: startBtn,
                scale: 1,
                duration: 100
            });
        });

        startBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        // 버전 정보
        this.add.text(10, height - 30, 'v0.1.0 - Fan Project', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#555'
        });

        // 법적 고지
        this.add.text(width - 10, height - 30, 'Not affiliated with any game company', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#555'
        }).setOrigin(1, 0);

        // 페이드 인
        this.cameras.main.fadeIn(500);
    }
}
