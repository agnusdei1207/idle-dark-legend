/**
 * ============================================================
 * UI 씬 - HUD 오버레이
 * ============================================================
 */

import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
    private hpBar!: Phaser.GameObjects.Graphics;
    private mpBar!: Phaser.GameObjects.Graphics;
    private expBar!: Phaser.GameObjects.Graphics;
    private levelText!: Phaser.GameObjects.Text;
    private goldText!: Phaser.GameObjects.Text;
    private skillBarSlots: Phaser.GameObjects.Container[] = [];

    // 현재 상태
    private currentHp: number = 100;
    private maxHp: number = 100;
    private currentMp: number = 50;
    private maxMp: number = 50;
    private currentExp: number = 0;
    private expToNext: number = 100;
    private level: number = 1;
    private gold: number = 100;

    constructor() {
        super({ key: 'UIScene' });
    }

    create(): void {
        this.createStatusBars();
        this.createLevelDisplay();
        this.createGoldDisplay();
        this.createSkillBar();
        this.createMiniMap();
        this.createHelpText();

        // 이벤트 리스너 설정
        this.setupListeners();
    }

    /**
     * HP/MP/EXP 바
     */
    private createStatusBars(): void {
        const x = 20;
        const y = 20;
        const width = 180;
        const height = 16;

        // 배경 패널
        const panel = this.add.rectangle(x + width / 2, y + 40, width + 20, 100, 0x1a1a2e, 0.8);
        panel.setStrokeStyle(1, 0x4a4a6a);
        panel.setOrigin(0.5, 0);

        // HP 바
        this.add.text(x, y + 50, 'HP', { fontSize: '12px', color: '#ff6666' });
        this.hpBar = this.add.graphics();
        this.updateHpBar();

        // MP 바
        this.add.text(x, y + 75, 'MP', { fontSize: '12px', color: '#6666ff' });
        this.mpBar = this.add.graphics();
        this.updateMpBar();

        // 경험치 바
        this.add.text(x, y + 100, 'EXP', { fontSize: '12px', color: '#66ff66' });
        this.expBar = this.add.graphics();
        this.updateExpBar();
    }

    private updateHpBar(): void {
        const x = 50, y = 70, width = 140, height = 12;
        this.hpBar.clear();
        this.hpBar.fillStyle(0x333333, 1);
        this.hpBar.fillRect(x, y, width, height);
        this.hpBar.fillStyle(0xff4444, 1);
        this.hpBar.fillRect(x, y, width * (this.currentHp / this.maxHp), height);

        // 텍스트
        const text = this.add.text(x + width / 2, y + height / 2, `${this.currentHp}/${this.maxHp}`, {
            fontSize: '10px', color: '#ffffff'
        }).setOrigin(0.5).setName('hpText');
    }

    private updateMpBar(): void {
        const x = 50, y = 95, width = 140, height = 12;
        this.mpBar.clear();
        this.mpBar.fillStyle(0x333333, 1);
        this.mpBar.fillRect(x, y, width, height);
        this.mpBar.fillStyle(0x4444ff, 1);
        this.mpBar.fillRect(x, y, width * (this.currentMp / this.maxMp), height);
    }

    private updateExpBar(): void {
        const x = 50, y = 120, width = 140, height = 8;
        this.expBar.clear();
        this.expBar.fillStyle(0x333333, 1);
        this.expBar.fillRect(x, y, width, height);
        this.expBar.fillStyle(0x44ff44, 1);
        this.expBar.fillRect(x, y, width * (this.currentExp / this.expToNext), height);
    }

    /**
     * 레벨 표시
     */
    private createLevelDisplay(): void {
        const { width } = this.cameras.main;

        this.levelText = this.add.text(width - 20, 20, `Lv.${this.level}`, {
            fontSize: '24px',
            color: '#ffcc00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);
    }

    /**
     * 골드 표시
     */
    private createGoldDisplay(): void {
        const { width } = this.cameras.main;

        this.goldText = this.add.text(width - 20, 50, `💰 ${this.gold.toLocaleString()}`, {
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(1, 0);
    }

    /**
     * 스킬바 (1-8)
     */
    private createSkillBar(): void {
        const { width, height } = this.cameras.main;
        const slotSize = 48;
        const padding = 8;
        const totalWidth = 8 * (slotSize + padding) - padding;
        const startX = (width - totalWidth) / 2;
        const y = height - slotSize - 20;

        for (let i = 0; i < 8; i++) {
            const x = startX + i * (slotSize + padding);

            const container = this.add.container(x, y);

            // 슬롯 배경
            const bg = this.add.rectangle(0, 0, slotSize, slotSize, 0x2a2a4e, 0.9);
            bg.setStrokeStyle(1, 0x4a90e2);
            container.add(bg);

            // 단축키 번호
            const keyText = this.add.text(-slotSize / 2 + 4, -slotSize / 2 + 2, `${i + 1}`, {
                fontSize: '10px',
                color: '#888888'
            });
            container.add(keyText);

            // 스킬 아이콘 (플레이스홀더)
            const skillIcon = this.add.text(0, 0, '', {
                fontSize: '24px'
            }).setOrigin(0.5);
            skillIcon.setName('icon');
            container.add(skillIcon);

            // 쿨다운 오버레이
            const cooldown = this.add.rectangle(0, 0, slotSize, slotSize, 0x000000, 0);
            cooldown.setName('cooldown');
            container.add(cooldown);

            this.skillBarSlots.push(container);
        }

        // 기본 스킬 배치
        this.setSkillSlot(0, '⚔️'); // 기본 공격
        this.setSkillSlot(1, '🔪'); // 베기
    }

    /**
     * 스킬 슬롯 설정
     */
    setSkillSlot(index: number, emoji: string): void {
        if (index < 0 || index >= this.skillBarSlots.length) return;
        const container = this.skillBarSlots[index];
        const icon = container.getByName('icon') as Phaser.GameObjects.Text;
        if (icon) icon.setText(emoji);
    }

    /**
     * 미니맵 (플레이스홀더)
     */
    private createMiniMap(): void {
        const { width } = this.cameras.main;
        const size = 120;
        const x = width - size - 20;
        const y = 80;

        const bg = this.add.rectangle(x + size / 2, y + size / 2, size, size, 0x1a1a2e, 0.7);
        bg.setStrokeStyle(1, 0x4a4a6a);

        this.add.text(x + size / 2, y + 10, '🗺️ 미니맵', {
            fontSize: '10px', color: '#888888'
        }).setOrigin(0.5);

        // 플레이어 점
        this.add.circle(x + size / 2, y + size / 2, 4, 0xff4444);
    }

    /**
     * 도움말
     */
    private createHelpText(): void {
        const { height } = this.cameras.main;

        this.add.text(20, height - 30, '[I] 인벤토리  [Q] 퀘스트  [C] 캐릭터  [K] 스킬  [G] 서클  [Space] 대화  [ESC] 메뉴', {
            fontSize: '11px',
            color: '#666666'
        });
    }

    /**
     * 이벤트 리스너
     */
    private setupListeners(): void {
        const gameScene = this.scene.get('GameScene');

        gameScene.events.on('expChanged', (exp: number, level: number) => {
            this.currentExp = exp;
            this.level = level;
            this.levelText.setText(`Lv.${level}`);
            this.updateExpBar();
        });

        gameScene.events.on('levelUp', (level: number) => {
            this.level = level;
            this.levelText.setText(`Lv.${level}`);

            // 레벨업 이펙트
            this.tweens.add({
                targets: this.levelText,
                scale: 1.5,
                duration: 200,
                yoyo: true
            });
        });
    }

    /**
     * HP/MP 업데이트
     */
    updateStats(hp: number, maxHp: number, mp: number, maxMp: number): void {
        this.currentHp = hp;
        this.maxHp = maxHp;
        this.currentMp = mp;
        this.maxMp = maxMp;
        this.updateHpBar();
        this.updateMpBar();
    }

    /**
     * 골드 업데이트
     */
    updateGold(gold: number): void {
        this.gold = gold;
        this.goldText.setText(`💰 ${gold.toLocaleString()}`);
    }
}
