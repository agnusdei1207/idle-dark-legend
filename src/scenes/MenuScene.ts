import Phaser from 'phaser';

/**
 * 메인 메뉴 씬
 * 어둠의전설 클래식
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
        const title = this.add.text(width / 2, height * 0.25, '어둠의전설', {
            fontFamily: 'Georgia, serif',
            fontSize: '72px',
            color: '#e94560',
            stroke: '#0f3460',
            strokeThickness: 6,
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // 부제
        const subtitle = this.add.text(width / 2, height * 0.35, '클래식', {
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#ffd700',
            stroke: '#0f3460',
            strokeThickness: 3
        });
        subtitle.setOrigin(0.5);

        // 설명
        const description = this.add.text(width / 2, height * 0.45, '방치형 RPG - 클래식의 향취', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#aaa'
        });
        description.setOrigin(0.5);

        // 시작 버튼
        const startBtn = this.add.text(width / 2, height * 0.6, '[ 게임 시작 ]', {
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            color: '#fff',
            backgroundColor: '#e94560',
            padding: { x: 40, y: 15 }
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
        this.add.text(10, height - 30, 'v0.2.0 - 팬 프로젝트', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#555'
        });

        // 법적 고지
        this.add.text(width - 10, height - 30, '어둠의전설은 넥슨의 등록상표입니다', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#555'
        }).setOrigin(1, 0);

        // 크레딧
        this.add.text(width - 10, height - 50, '본 게임은 팬 프로젝트로 제작되었습니다', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#666'
        }).setOrigin(1, 0);

        // 페이드 인
        this.cameras.main.fadeIn(500);
    }
}
