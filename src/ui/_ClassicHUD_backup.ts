/**
 * ============================================================
 * 어둠의전설 스타일 클래식 HUD
 * ============================================================
 * 
 * 원작 UI 벤치마크:
 * - 좌상단: 캐릭터 얼굴 + HP/MP/EXP 바
 * - 우상단: 미니맵 (원형)
 * - 하단: 스킬바 + 퀵슬롯 + 채팅창
 * - 우하단: 메뉴 버튼들
 * ============================================================
 */

import Phaser from 'phaser';

/** UI 색상 상수 (어둠의전설 스타일) */
const UI_COLORS = {
    // 패널 색상
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x3a3a5e,
    PANEL_DARK: 0x0a0a1e,

    // 바 색상
    HP_BAR: 0xcc3333,
    HP_BAR_BG: 0x4a1a1a,
    MP_BAR: 0x3333cc,
    MP_BAR_BG: 0x1a1a4a,
    EXP_BAR: 0x33cc33,
    EXP_BAR_BG: 0x1a4a1a,

    // 텍스트 색상
    TEXT_WHITE: '#ffffff',
    TEXT_GOLD: '#ffd700',
    TEXT_SILVER: '#c0c0c0',
    TEXT_RED: '#ff4444',
    TEXT_BLUE: '#4444ff',
    TEXT_GREEN: '#44ff44',

    // 스킬바 색상
    SKILL_SLOT_BG: 0x2a2a4e,
    SKILL_SLOT_BORDER: 0x5a5a8e,
    SKILL_COOLDOWN: 0x000000,
};

export class ClassicHUD extends Phaser.GameObjects.Container {

    // 캐릭터 정보 패널 (좌상단)
    private characterPanel!: Phaser.GameObjects.Container;
    private portraitFrame!: Phaser.GameObjects.Rectangle;
    private hpBar!: { bg: Phaser.GameObjects.Rectangle, fill: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text };
    private mpBar!: { bg: Phaser.GameObjects.Rectangle, fill: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text };
    private expBar!: { bg: Phaser.GameObjects.Rectangle, fill: Phaser.GameObjects.Rectangle };
    private levelText!: Phaser.GameObjects.Text;
    private nameText!: Phaser.GameObjects.Text;
    private classText!: Phaser.GameObjects.Text;

    // 미니맵 (우상단)
    private minimapContainer!: Phaser.GameObjects.Container;

    // 스킬바 (하단 중앙)
    private skillbarContainer!: Phaser.GameObjects.Container;
    private skillSlots: Phaser.GameObjects.Container[] = [];

    // 퀵슬롯 (스킬바 옆)
    private quickSlotContainer!: Phaser.GameObjects.Container;

    // 메뉴 버튼 (우하단)
    private menuContainer!: Phaser.GameObjects.Container;

    // 채팅창 (좌하단)
    private chatContainer!: Phaser.GameObjects.Container;

    // 타겟 정보 (상단 중앙)
    private targetContainer!: Phaser.GameObjects.Container;

    // 상태 값
    private playerData = {
        name: 'Hero',
        class: '전사',
        level: 1,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        exp: 0,
        maxExp: 100,
        gold: 1000
    };

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        scene.add.existing(this);
        this.setDepth(1000);
        this.setScrollFactor(0);

        this.createCharacterPanel();
        this.createMinimap();
        this.createSkillbar();
        this.createQuickSlots();
        this.createMenuButtons();
        this.createChatWindow();
        this.createTargetInfo();
    }

    /**
     * 캐릭터 정보 패널 (좌상단)
     */
    private createCharacterPanel(): void {
        const x = 10;
        const y = 10;

        this.characterPanel = this.scene.add.container(x, y);
        this.add(this.characterPanel);

        // 패널 배경
        const panelBg = this.scene.add.rectangle(0, 0, 220, 90, UI_COLORS.PANEL_BG, 0.9);
        panelBg.setOrigin(0, 0);
        panelBg.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        this.characterPanel.add(panelBg);

        // 캐릭터 초상화 프레임
        this.portraitFrame = this.scene.add.rectangle(8, 8, 50, 50, UI_COLORS.PANEL_DARK);
        this.portraitFrame.setOrigin(0, 0);
        this.portraitFrame.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        this.characterPanel.add(this.portraitFrame);

        // 초상화 (플레이스홀더 - 이모지)
        const portrait = this.scene.add.text(33, 33, '⚔️', {
            fontSize: '24px'
        }).setOrigin(0.5);
        this.characterPanel.add(portrait);

        // 캐릭터 이름
        this.nameText = this.scene.add.text(65, 8, this.playerData.name, {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        });
        this.characterPanel.add(this.nameText);

        // 직업 & 레벨
        this.classText = this.scene.add.text(65, 24, `Lv.${this.playerData.level} ${this.playerData.class}`, {
            fontSize: '11px',
            color: UI_COLORS.TEXT_SILVER
        });
        this.characterPanel.add(this.classText);

        // HP 바
        const barX = 65;
        const barWidth = 145;
        const barHeight = 14;

        const hpBg = this.scene.add.rectangle(barX, 42, barWidth, barHeight, UI_COLORS.HP_BAR_BG);
        hpBg.setOrigin(0, 0);
        const hpFill = this.scene.add.rectangle(barX + 1, 43, barWidth - 2, barHeight - 2, UI_COLORS.HP_BAR);
        hpFill.setOrigin(0, 0);
        const hpText = this.scene.add.text(barX + barWidth / 2, 49, `${this.playerData.hp}/${this.playerData.maxHp}`, {
            fontSize: '10px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);

        this.hpBar = { bg: hpBg, fill: hpFill, text: hpText };
        this.characterPanel.add([hpBg, hpFill, hpText]);

        // MP 바
        const mpBg = this.scene.add.rectangle(barX, 58, barWidth, barHeight, UI_COLORS.MP_BAR_BG);
        mpBg.setOrigin(0, 0);
        const mpFill = this.scene.add.rectangle(barX + 1, 59, barWidth - 2, barHeight - 2, UI_COLORS.MP_BAR);
        mpFill.setOrigin(0, 0);
        const mpText = this.scene.add.text(barX + barWidth / 2, 65, `${this.playerData.mp}/${this.playerData.maxMp}`, {
            fontSize: '10px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);

        this.mpBar = { bg: mpBg, fill: mpFill, text: mpText };
        this.characterPanel.add([mpBg, mpFill, mpText]);

        // EXP 바 (패널 하단)
        const expBg = this.scene.add.rectangle(8, 75, 204, 8, UI_COLORS.EXP_BAR_BG);
        expBg.setOrigin(0, 0);
        const expFill = this.scene.add.rectangle(9, 76, 202, 6, UI_COLORS.EXP_BAR);
        expFill.setOrigin(0, 0);

        this.expBar = { bg: expBg, fill: expFill };
        this.characterPanel.add([expBg, expFill]);
    }

    /**
     * 미니맵 (우상단)
     */
    private createMinimap(): void {
        const { width } = this.scene.cameras.main;
        const x = width - 130;
        const y = 10;
        const size = 120;

        this.minimapContainer = this.scene.add.container(x, y);
        this.add(this.minimapContainer);

        // 원형 미니맵 배경
        const mapBg = this.scene.add.circle(size / 2, size / 2, size / 2, UI_COLORS.PANEL_DARK, 0.8);
        mapBg.setStrokeStyle(3, UI_COLORS.PANEL_BORDER);
        this.minimapContainer.add(mapBg);

        // 미니맵 내용 (플레이스홀더)
        const mapContent = this.scene.add.rectangle(size / 2, size / 2, size - 20, size - 20, 0x2a4a2a, 0.5);
        this.minimapContainer.add(mapContent);

        // 플레이어 위치 (중앙 점)
        const playerDot = this.scene.add.circle(size / 2, size / 2, 4, 0xff4444);
        this.minimapContainer.add(playerDot);

        // 방향 표시
        const directions = ['N', 'E', 'S', 'W'];
        const positions = [
            { x: size / 2, y: 8 },
            { x: size - 8, y: size / 2 },
            { x: size / 2, y: size - 8 },
            { x: 8, y: size / 2 }
        ];
        directions.forEach((dir, i) => {
            const text = this.scene.add.text(positions[i].x, positions[i].y, dir, {
                fontSize: '10px',
                color: UI_COLORS.TEXT_GOLD
            }).setOrigin(0.5);
            this.minimapContainer.add(text);
        });

        // 맵 이름
        const mapName = this.scene.add.text(size / 2, size + 5, '시작 마을', {
            fontSize: '11px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5, 0);
        this.minimapContainer.add(mapName);
    }

    /**
     * 스킬바 (하단 중앙)
     */
    private createSkillbar(): void {
        const { width, height } = this.scene.cameras.main;
        const slotSize = 44;
        const slotPadding = 4;
        const slots = 10; // F1-F10
        const totalWidth = slots * (slotSize + slotPadding) - slotPadding;
        const x = (width - totalWidth) / 2;
        const y = height - slotSize - 20;

        this.skillbarContainer = this.scene.add.container(x, y);
        this.add(this.skillbarContainer);

        // 배경 패널
        const panelBg = this.scene.add.rectangle(-10, -10, totalWidth + 20, slotSize + 20, UI_COLORS.PANEL_BG, 0.85);
        panelBg.setOrigin(0, 0);
        panelBg.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        this.skillbarContainer.add(panelBg);

        // 스킬 슬롯 생성
        const skillLabels = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'];
        for (let i = 0; i < slots; i++) {
            const slotX = i * (slotSize + slotPadding);
            const slot = this.createSkillSlot(slotX, 0, slotSize, skillLabels[i]);
            this.skillSlots.push(slot);
            this.skillbarContainer.add(slot);
        }
    }

    /**
     * 스킬 슬롯 생성
     */
    private createSkillSlot(x: number, y: number, size: number, label: string): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        // 슬롯 배경
        const bg = this.scene.add.rectangle(0, 0, size, size, UI_COLORS.SKILL_SLOT_BG);
        bg.setOrigin(0, 0);
        bg.setStrokeStyle(1, UI_COLORS.SKILL_SLOT_BORDER);
        bg.setInteractive({ useHandCursor: true });
        container.add(bg);

        // 스킬 아이콘 (플레이스홀더)
        const icon = this.scene.add.text(size / 2, size / 2, '', {
            fontSize: '20px'
        }).setOrigin(0.5);
        icon.setName('icon');
        container.add(icon);

        // 쿨다운 오버레이
        const cooldown = this.scene.add.rectangle(0, 0, size, size, UI_COLORS.SKILL_COOLDOWN, 0);
        cooldown.setOrigin(0, 0);
        cooldown.setName('cooldown');
        container.add(cooldown);

        // 단축키 레이블
        const keyLabel = this.scene.add.text(size - 2, 2, label, {
            fontSize: '8px',
            color: UI_COLORS.TEXT_SILVER
        }).setOrigin(1, 0);
        container.add(keyLabel);

        // 호버 효과
        bg.on('pointerover', () => bg.setStrokeStyle(2, 0xffffff));
        bg.on('pointerout', () => bg.setStrokeStyle(1, UI_COLORS.SKILL_SLOT_BORDER));

        return container;
    }

    /**
     * 퀵슬롯 (스킬바 우측)
     */
    private createQuickSlots(): void {
        const { width, height } = this.scene.cameras.main;
        const slotSize = 36;
        const x = width - 200;
        const y = height - slotSize * 2 - 30;

        this.quickSlotContainer = this.scene.add.container(x, y);
        this.add(this.quickSlotContainer);

        // 퀵슬롯 배경
        const bg = this.scene.add.rectangle(0, 0, slotSize * 4 + 20, slotSize * 2 + 10, UI_COLORS.PANEL_BG, 0.8);
        bg.setOrigin(0, 0);
        bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.quickSlotContainer.add(bg);

        // 8개 퀵슬롯 (1-8)
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const slotX = 5 + col * slotSize;
                const slotY = 5 + row * slotSize;
                const index = row * 4 + col + 1;

                const slot = this.scene.add.rectangle(slotX, slotY, slotSize - 2, slotSize - 2, UI_COLORS.SKILL_SLOT_BG);
                slot.setOrigin(0, 0);
                slot.setStrokeStyle(1, UI_COLORS.SKILL_SLOT_BORDER);
                this.quickSlotContainer.add(slot);

                // 번호
                const num = this.scene.add.text(slotX + slotSize - 4, slotY + 2, `${index}`, {
                    fontSize: '8px',
                    color: UI_COLORS.TEXT_SILVER
                }).setOrigin(1, 0);
                this.quickSlotContainer.add(num);
            }
        }

        // 골드 표시
        const goldText = this.scene.add.text(slotSize * 2 + 10, slotSize * 2 + 12, `💰 ${this.playerData.gold.toLocaleString()}`, {
            fontSize: '11px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5, 0);
        this.quickSlotContainer.add(goldText);
    }

    /**
     * 메뉴 버튼 (우하단)
     */
    private createMenuButtons(): void {
        const { width, height } = this.scene.cameras.main;
        const btnSize = 32;
        const padding = 4;
        const x = width - 180;
        const y = height - btnSize - 10;

        this.menuContainer = this.scene.add.container(x, y);
        this.add(this.menuContainer);

        const buttons = [
            { icon: '👤', tooltip: '캐릭터 (C)', key: 'C' },
            { icon: '🎒', tooltip: '인벤토리 (I)', key: 'I' },
            { icon: '📜', tooltip: '스킬 (K)', key: 'K' },
            { icon: '📋', tooltip: '퀘스트 (Q)', key: 'Q' },
            { icon: '🗺️', tooltip: '지도 (M)', key: 'M' },
        ];

        buttons.forEach((btn, i) => {
            const bx = i * (btnSize + padding);

            const bg = this.scene.add.rectangle(bx, 0, btnSize, btnSize, UI_COLORS.PANEL_BG);
            bg.setOrigin(0, 0);
            bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
            bg.setInteractive({ useHandCursor: true });

            const icon = this.scene.add.text(bx + btnSize / 2, btnSize / 2, btn.icon, {
                fontSize: '18px'
            }).setOrigin(0.5);

            // 호버 효과
            bg.on('pointerover', () => {
                bg.setStrokeStyle(2, 0xffffff);
                // 툴팁 표시 가능
            });
            bg.on('pointerout', () => bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER));

            bg.on('pointerdown', () => {
                this.scene.events.emit('menuButton', btn.key);
            });

            this.menuContainer.add([bg, icon]);
        });
    }

    /**
     * 채팅창 (좌하단)
     */
    private createChatWindow(): void {
        const { height } = this.scene.cameras.main;
        const x = 10;
        const y = height - 150;

        this.chatContainer = this.scene.add.container(x, y);
        this.add(this.chatContainer);

        // 채팅창 배경
        const chatBg = this.scene.add.rectangle(0, 0, 300, 130, UI_COLORS.PANEL_BG, 0.7);
        chatBg.setOrigin(0, 0);
        chatBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.chatContainer.add(chatBg);

        // 채팅 탭
        const tabs = ['전체', '일반', '파티', '서클', '귓속말'];
        tabs.forEach((tab, i) => {
            const tabBg = this.scene.add.rectangle(i * 60, 0, 58, 18, i === 0 ? UI_COLORS.PANEL_BORDER : UI_COLORS.PANEL_DARK);
            tabBg.setOrigin(0, 0);
            tabBg.setInteractive({ useHandCursor: true });

            const tabText = this.scene.add.text(i * 60 + 29, 9, tab, {
                fontSize: '10px',
                color: i === 0 ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_SILVER
            }).setOrigin(0.5);

            this.chatContainer.add([tabBg, tabText]);
        });

        // 채팅 메시지 영역
        const msgArea = this.scene.add.rectangle(5, 22, 290, 85, UI_COLORS.PANEL_DARK, 0.5);
        msgArea.setOrigin(0, 0);
        this.chatContainer.add(msgArea);

        // 샘플 메시지
        const sampleMsgs = [
            '[시스템] 어둠의전설 클래식에 오신 것을 환영합니다!',
            '[일반] 홍길동: 파티 구해요~',
            '[귓말] → 김철수: 안녕하세요!'
        ];
        sampleMsgs.forEach((msg, i) => {
            const msgText = this.scene.add.text(10, 25 + i * 15, msg, {
                fontSize: '10px',
                color: msg.includes('[시스템]') ? UI_COLORS.TEXT_GREEN :
                    msg.includes('[귓말]') ? '#ff88ff' : UI_COLORS.TEXT_WHITE
            });
            this.chatContainer.add(msgText);
        });

        // 입력창
        const inputBg = this.scene.add.rectangle(5, 110, 290, 16, UI_COLORS.PANEL_DARK);
        inputBg.setOrigin(0, 0);
        inputBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.chatContainer.add(inputBg);

        const inputHint = this.scene.add.text(10, 118, '메시지를 입력하세요... (Enter)', {
            fontSize: '9px',
            color: '#666666'
        });
        this.chatContainer.add(inputHint);
    }

    /**
     * 타겟 정보 (상단 중앙)
     */
    private createTargetInfo(): void {
        const { width } = this.scene.cameras.main;
        const x = width / 2;
        const y = 10;

        this.targetContainer = this.scene.add.container(x, y);
        this.targetContainer.setVisible(false); // 타겟 없으면 숨김
        this.add(this.targetContainer);

        // 타겟 패널
        const panelBg = this.scene.add.rectangle(0, 0, 200, 50, UI_COLORS.PANEL_BG, 0.9);
        panelBg.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        this.targetContainer.add(panelBg);

        // 타겟 이름
        const targetName = this.scene.add.text(0, -15, '슬라임 Lv.3', {
            fontSize: '12px',
            color: UI_COLORS.TEXT_RED,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        targetName.setName('targetName');
        this.targetContainer.add(targetName);

        // 타겟 HP 바
        const hpBg = this.scene.add.rectangle(-80, 8, 160, 12, UI_COLORS.HP_BAR_BG);
        hpBg.setOrigin(0, 0);
        const hpFill = this.scene.add.rectangle(-79, 9, 158, 10, UI_COLORS.HP_BAR);
        hpFill.setOrigin(0, 0);
        hpFill.setName('targetHp');
        this.targetContainer.add([hpBg, hpFill]);
    }

    // ============================================================
    // 업데이트 메서드
    // ============================================================

    /**
     * HP 업데이트
     */
    updateHP(current: number, max: number): void {
        this.playerData.hp = current;
        this.playerData.maxHp = max;

        const ratio = Math.max(0, current / max);
        this.hpBar.fill.setScale(ratio, 1);
        this.hpBar.text.setText(`${current}/${max}`);
    }

    /**
     * MP 업데이트
     */
    updateMP(current: number, max: number): void {
        this.playerData.mp = current;
        this.playerData.maxMp = max;

        const ratio = Math.max(0, current / max);
        this.mpBar.fill.setScale(ratio, 1);
        this.mpBar.text.setText(`${current}/${max}`);
    }

    /**
     * EXP 업데이트
     */
    updateEXP(current: number, max: number): void {
        this.playerData.exp = current;
        this.playerData.maxExp = max;

        const ratio = Math.max(0, current / max);
        this.expBar.fill.setScale(ratio, 1);
    }

    /**
     * 레벨 업데이트
     */
    updateLevel(level: number): void {
        this.playerData.level = level;
        this.classText.setText(`Lv.${level} ${this.playerData.class}`);
    }

    /**
     * 스킬 슬롯 설정
     */
    setSkillSlot(index: number, iconEmoji: string): void {
        if (index < 0 || index >= this.skillSlots.length) return;
        const slot = this.skillSlots[index];
        const icon = slot.getByName('icon') as Phaser.GameObjects.Text;
        if (icon) icon.setText(iconEmoji);
    }

    /**
     * 타겟 설정
     */
    setTarget(name: string, level: number, hpRatio: number): void {
        this.targetContainer.setVisible(true);
        const nameText = this.targetContainer.getByName('targetName') as Phaser.GameObjects.Text;
        const hpFill = this.targetContainer.getByName('targetHp') as Phaser.GameObjects.Rectangle;

        if (nameText) nameText.setText(`${name} Lv.${level}`);
        if (hpFill) hpFill.setScale(hpRatio, 1);
    }

    /**
     * 타겟 해제
     */
    clearTarget(): void {
        this.targetContainer.setVisible(false);
    }
}
