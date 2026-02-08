import Phaser from 'phaser';

/**
 * 부트 씬 - 에셋 로딩 담당
 *
 * 에셋 로딩 시스템:
 * - 실제 에셋이 없을 때는 플레이스홀더 사용
 * - 에셋을 추가하면 BootScene만 수정하면 됨
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
        // 플레이스홀더 에셋 생성 (에셋이 없을 때 사용)
        // ============================================

        // 콘솔에 안내 메시지
        console.log('🎮 Dark Legend Classic - Asset Loading');
        console.log('📝 실제 에셋을 추가하려면 public/assets/ 폴더에 이미지를 넣고');
        console.log('   아래 주석을 해제하여 에셋을 로드하세요.');

        // ============================================
        // 타일셋 (scrabling의 32x32 Pixel Isometric Tiles)
        // License: CC BY 4.0
        // URL: https://scrabling.itch.io/pixel-isometric-tiles
        // ============================================
        // this.load.image('tiles-nature', 'assets/tilesets/isometric-tiles.png');

        // ============================================
        // 플레이어 스프라이트
        // ============================================
        // this.load.spritesheet('class_warrior', 'assets/sprites/player/warrior.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });
        // this.load.spritesheet('class_mage', 'assets/sprites/player/mage.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });
        // this.load.spritesheet('class_rogue', 'assets/sprites/player/rogue.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });
        // this.load.spritesheet('class_cleric', 'assets/sprites/player/cleric.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });
        // this.load.spritesheet('class_monk', 'assets/sprites/player/monk.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });

        // ============================================
        // 몬스터 스프라이트
        // ============================================
        // 1써클 몬스터
        // this.load.spritesheet('monster_rat', 'assets/sprites/monsters/rat.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_bat', 'assets/sprites/monsters/bat.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_spider', 'assets/sprites/monsters/spider.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_goblin', 'assets/sprites/monsters/goblin.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_slime', 'assets/sprites/monsters/slime.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_wolf', 'assets/sprites/monsters/wolf.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_orc', 'assets/sprites/monsters/orc.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_troll', 'assets/sprites/monsters/troll.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });
        // this.load.spritesheet('monster_bear', 'assets/sprites/monsters/bear.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });

        // ============================================
        // NPC 스프라이트
        // ============================================
        // this.load.spritesheet('npcs', 'assets/sprites/npcs/npcs.png', {
        //     frameWidth: 32,
        //     frameHeight: 48
        // });

        // ============================================
        // 스킬 아이콘
        // ============================================
        // this.load.spritesheet('skill-icons', 'assets/ui/skills/skill-icons.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });

        // ============================================
        // 아이템 아이콘
        // ============================================
        // this.load.spritesheet('item-icons', 'assets/ui/items/item-icons.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });

        // ============================================
        // 스킬 이펙트
        // ============================================
        // this.load.spritesheet('effect_fire', 'assets/effects/fire/fireball.png', {
        //     frameWidth: 64,
        //     frameHeight: 64
        // });
        // this.load.spritesheet('effect_ice', 'assets/effects/ice/iceball.png', {
        //     frameWidth: 64,
        //     frameHeight: 64
        // });
        // this.load.spritesheet('effect_heal', 'assets/effects/heal/heal.png', {
        //     frameWidth: 64,
        //     frameHeight: 64
        // });

        // ============================================
        // UI 요소
        // ============================================
        // this.load.image('ui-button', 'assets/ui/button.png');
        // this.load.image('ui-panel', 'assets/ui/panel.png');
        // this.load.image('ui-frame', 'assets/ui/frame.png');

        // ============================================
        // 맵 데이터 (Tiled JSON)
        // ============================================
        // this.load.tilemapTiledJSON('map-village', 'assets/maps/village.json');
        // this.load.tilemapTiledJSON('map-field', 'assets/maps/field.json');
        // this.load.tilemapTiledJSON('map-forest', 'assets/maps/forest.json');

        // ============================================
        // 오디오
        // ============================================
        // BGM
        // this.load.audio('bgm-village', 'assets/audio/bgm/village.mp3');
        // this.load.audio('bgm-field', 'assets/audio/bgm/field.mp3');
        // this.load.audio('bgm-forest', 'assets/audio/bgm/forest.mp3');
        // this.load.audio('bgm-dungeon', 'assets/audio/bgm/dungeon.mp3');
        // this.load.audio('bgm-battle', 'assets/audio/bgm/battle.mp3');

        // SFX
        // this.load.audio('sfx-attack', 'assets/audio/sfx/attack.wav');
        // this.load.audio('sfx-hit', 'assets/audio/sfx/hit.wav');
        // this.load.audio('sfx-skill', 'assets/audio/sfx/skill.wav');
        // this.load.audio('sfx-heal', 'assets/audio/sfx/heal.wav');
        // this.load.audio('sfx-levelup', 'assets/audio/sfx/levelup.wav');
        // this.load.audio('sfx-item', 'assets/audio/sfx/item.wav');
        // this.load.audio('sfx-gold', 'assets/audio/sfx/gold.wav');
        // this.load.audio('sfx-ui-click', 'assets/audio/sfx/ui-click.wav');
    }

    create(): void {
        console.log('🎮 Dark Legend Classic - Boot Complete!');
        console.log('📋 게임 시스템 초기화 완료');
        console.log('⚠️  현재 플레이스홀더 그래픽 사용 중');
        console.log('   실제 에셋을 추가하려면 public/assets/ 폴더를 확인하세요');

        // 로딩 화면 숨기기
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        // 메뉴 씬으로 전환
        this.scene.start('MenuScene');
    }
}
