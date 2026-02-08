/**
 * ============================================================
 * 서클 UI (G 키)
 * ============================================================
 */

import Phaser from 'phaser';
import type { CircleInfo, CircleMember, CircleBuff } from '../systems/CircleSystem';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x3a3a5e,
    PANEL_DARK: 0x0a0a1e,
    TEXT_WHITE: '#ffffff',
    TEXT_GOLD: '#ffd700',
    TEXT_GREEN: '#44ff44',
    TEXT_RED: '#ff4444',
    TEXT_SILVER: '#c0c0c0',
    TEXT_BLUE: '#4488ff',
    MASTER: '#ffd700',
    OFFICER: '#44aaff',
    MEMBER: '#aaaaaa',
};

export class CircleUI extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private circleInfo: CircleInfo | null = null;
    private currentTab: 'info' | 'members' | 'buffs' = 'info';

    private contentContainer!: Phaser.GameObjects.Container;
    private tabButtons: Phaser.GameObjects.Container[] = [];

    constructor(scene: Phaser.Scene) {
        const { width, height } = scene.cameras.main;
        super(scene, width / 2, height / 2);
        scene.add.existing(this);
        this.setDepth(2000);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const panelWidth = 450;
        const panelHeight = 500;

        // 반투명 배경
        const overlay = this.scene.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.5);
        overlay.setInteractive();
        this.add(overlay);

        // 메인 패널
        const bg = this.scene.add.rectangle(0, 0, panelWidth, panelHeight, UI_COLORS.PANEL_BG, 0.95);
        bg.setStrokeStyle(3, UI_COLORS.PANEL_BORDER);
        this.add(bg);

        // 타이틀
        this.createTitle(panelWidth);

        // 탭
        this.createTabs(-panelWidth / 2 + 20, -panelHeight / 2 + 60);

        // 컨텐츠 영역
        this.contentContainer = this.scene.add.container(0, 30);
        this.add(this.contentContainer);

        this.renderContent();
    }

    private createTitle(panelWidth: number): void {
        const container = this.scene.add.container(0, -250 + 20);
        this.add(container);

        const titleBg = this.scene.add.rectangle(0, 0, panelWidth, 40, UI_COLORS.PANEL_DARK);
        titleBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        container.add(titleBg);

        const titleText = this.scene.add.text(0, 0, '⚔️ 서클', {
            fontSize: '18px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(titleText);

        const closeBtn = this.scene.add.text(panelWidth / 2 - 25, 0, '✕', {
            fontSize: '20px',
            color: '#ff4444'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => this.toggle());
        container.add(closeBtn);
    }

    private createTabs(x: number, y: number): void {
        const tabs = [
            { key: 'info' as const, label: '정보' },
            { key: 'members' as const, label: '멤버' },
            { key: 'buffs' as const, label: '버프' }
        ];

        tabs.forEach((tab, i) => {
            const tabX = x + i * 100;
            const tabContainer = this.scene.add.container(tabX, y);

            const bg = this.scene.add.rectangle(0, 0, 90, 28,
                this.currentTab === tab.key ? UI_COLORS.PANEL_BORDER : UI_COLORS.PANEL_DARK);
            bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
            bg.setInteractive({ useHandCursor: true });
            bg.setName('bg');
            tabContainer.add(bg);

            const text = this.scene.add.text(0, 0, tab.label, {
                fontSize: '12px',
                color: this.currentTab === tab.key ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_SILVER
            }).setOrigin(0.5);
            text.setName('text');
            tabContainer.add(text);

            bg.on('pointerdown', () => {
                this.currentTab = tab.key;
                this.updateTabStyles();
                this.renderContent();
            });

            this.tabButtons.push(tabContainer);
            this.add(tabContainer);
        });
    }

    private updateTabStyles(): void {
        const tabs = ['info', 'members', 'buffs'];
        this.tabButtons.forEach((tabContainer, i) => {
            const bg = tabContainer.getByName('bg') as Phaser.GameObjects.Rectangle;
            const text = tabContainer.getByName('text') as Phaser.GameObjects.Text;

            if (tabs[i] === this.currentTab) {
                bg.setFillStyle(UI_COLORS.PANEL_BORDER);
                text.setColor(UI_COLORS.TEXT_WHITE);
            } else {
                bg.setFillStyle(UI_COLORS.PANEL_DARK);
                text.setColor(UI_COLORS.TEXT_SILVER);
            }
        });
    }

    private renderContent(): void {
        this.contentContainer.removeAll(true);

        if (!this.circleInfo) {
            this.renderNoCircle();
            return;
        }

        switch (this.currentTab) {
            case 'info':
                this.renderInfo();
                break;
            case 'members':
                this.renderMembers();
                break;
            case 'buffs':
                this.renderBuffs();
                break;
        }
    }

    private renderNoCircle(): void {
        const text = this.scene.add.text(0, 0, '서클에 가입되어 있지 않습니다.', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_SILVER
        }).setOrigin(0.5);
        this.contentContainer.add(text);

        // 서클 생성 버튼
        const createBtn = this.scene.add.rectangle(0, 50, 150, 36, UI_COLORS.PANEL_BORDER);
        createBtn.setStrokeStyle(1, 0x5a5a8e);
        createBtn.setInteractive({ useHandCursor: true });
        this.contentContainer.add(createBtn);

        const btnText = this.scene.add.text(0, 50, '서클 생성', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5);
        this.contentContainer.add(btnText);

        createBtn.on('pointerdown', () => {
            this.scene.events.emit('createCircle');
        });
    }

    private renderInfo(): void {
        if (!this.circleInfo) return;

        const startY = -150;
        let y = startY;

        // 서클 이름 & 태그
        const nameText = this.scene.add.text(0, y, `${this.circleInfo.tag} ${this.circleInfo.name}`, {
            fontSize: '20px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.contentContainer.add(nameText);
        y += 35;

        // 마스터
        const masterText = this.scene.add.text(0, y, `👑 마스터: ${this.circleInfo.masterName}`, {
            fontSize: '12px',
            color: UI_COLORS.MASTER
        }).setOrigin(0.5);
        this.contentContainer.add(masterText);
        y += 25;

        // 레벨 & 인원
        const levelText = this.scene.add.text(-60, y, `Lv.${this.circleInfo.level}`, {
            fontSize: '14px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);
        this.contentContainer.add(levelText);

        const membersText = this.scene.add.text(60, y, `${this.circleInfo.members.length}/${this.circleInfo.maxMembers}명`, {
            fontSize: '14px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);
        this.contentContainer.add(membersText);
        y += 30;

        // 경험치 바
        const expBarBg = this.scene.add.rectangle(0, y, 300, 16, 0x2a2a4e);
        expBarBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.contentContainer.add(expBarBg);

        const expRatio = this.circleInfo.exp / this.circleInfo.maxExp;
        const expBarFill = this.scene.add.rectangle(-150 + 150 * expRatio, y, 298 * expRatio, 14, 0x44aa44);
        expBarFill.setOrigin(0, 0.5);
        this.contentContainer.add(expBarFill);

        const expText = this.scene.add.text(0, y, `${this.circleInfo.exp}/${this.circleInfo.maxExp}`, {
            fontSize: '10px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);
        this.contentContainer.add(expText);
        y += 40;

        // 공지사항
        const noticeTitle = this.scene.add.text(-150, y, '📢 공지사항:', {
            fontSize: '12px',
            color: UI_COLORS.TEXT_GOLD
        });
        this.contentContainer.add(noticeTitle);
        y += 20;

        const noticeBg = this.scene.add.rectangle(0, y + 30, 320, 80, UI_COLORS.PANEL_DARK, 0.8);
        noticeBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.contentContainer.add(noticeBg);

        const noticeText = this.scene.add.text(-150, y + 5, this.circleInfo.notice, {
            fontSize: '11px',
            color: UI_COLORS.TEXT_WHITE,
            wordWrap: { width: 300 }
        });
        this.contentContainer.add(noticeText);
    }

    private renderMembers(): void {
        if (!this.circleInfo) return;

        const startY = -150;
        let y = startY;

        // 헤더
        const headers = ['등급', '이름', '직업', 'Lv', '기여도'];
        const headerX = [-150, -80, 0, 60, 120];
        headers.forEach((h, i) => {
            const text = this.scene.add.text(headerX[i], y, h, {
                fontSize: '11px',
                color: UI_COLORS.TEXT_GOLD
            });
            this.contentContainer.add(text);
        });
        y += 25;

        // 구분선
        const line = this.scene.add.rectangle(0, y - 5, 350, 1, UI_COLORS.PANEL_BORDER);
        this.contentContainer.add(line);

        // 멤버 목록 (등급순 정렬)
        const sortedMembers = [...this.circleInfo.members].sort((a, b) => {
            const rankOrder = { master: 0, officer: 1, member: 2 };
            return rankOrder[a.rank] - rankOrder[b.rank];
        });

        sortedMembers.forEach((member, i) => {
            if (i >= 12) return; // 최대 12명 표시

            const rowY = y + i * 22;
            const rankIcon = member.rank === 'master' ? '👑' : member.rank === 'officer' ? '⚔️' : '👤';
            const rankColor = member.rank === 'master' ? UI_COLORS.MASTER :
                member.rank === 'officer' ? UI_COLORS.OFFICER : UI_COLORS.MEMBER;

            const rankText = this.scene.add.text(headerX[0], rowY, rankIcon, { fontSize: '12px' });
            const nameText = this.scene.add.text(headerX[1], rowY, member.name, { fontSize: '11px', color: rankColor });
            const classText = this.scene.add.text(headerX[2], rowY, member.class, { fontSize: '11px', color: UI_COLORS.TEXT_SILVER });
            const levelText = this.scene.add.text(headerX[3], rowY, `${member.level}`, { fontSize: '11px', color: UI_COLORS.TEXT_WHITE });
            const contribText = this.scene.add.text(headerX[4], rowY, `${member.contributionPoints.toLocaleString()}`, { fontSize: '11px', color: UI_COLORS.TEXT_GREEN });

            this.contentContainer.add([rankText, nameText, classText, levelText, contribText]);
        });
    }

    private renderBuffs(): void {
        if (!this.circleInfo) return;

        const startY = -150;
        let y = startY;

        // 활성 버프
        const activeTitle = this.scene.add.text(-180, y, '✨ 활성화된 버프:', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GREEN
        });
        this.contentContainer.add(activeTitle);
        y += 30;

        if (this.circleInfo.activeBuffs.length === 0) {
            const noBuffText = this.scene.add.text(0, y, '활성화된 버프가 없습니다.', {
                fontSize: '12px',
                color: UI_COLORS.TEXT_SILVER
            }).setOrigin(0.5);
            this.contentContainer.add(noBuffText);
            y += 30;
        } else {
            this.circleInfo.activeBuffs.forEach(buffId => {
                // 버프 정보 표시 (실제로는 CircleSystem에서 가져와야 함)
                const buffText = this.scene.add.text(-150, y, `🔹 ${buffId}`, {
                    fontSize: '11px',
                    color: UI_COLORS.TEXT_BLUE
                });
                this.contentContainer.add(buffText);
                y += 20;
            });
        }

        y += 20;

        // 사용 가능한 버프
        const availableTitle = this.scene.add.text(-180, y, '📋 사용 가능한 버프:', {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD
        });
        this.contentContainer.add(availableTitle);
        y += 30;

        // 버프 목록 (더미 데이터)
        const buffs = [
            { name: '경험치 증가', level: 1, desc: '획득 경험치 +10%' },
            { name: '골드 증가', level: 2, desc: '획득 골드 +10%' },
            { name: '체력 증가', level: 3, desc: '최대 HP +5%' },
        ];

        buffs.forEach(buff => {
            const available = this.circleInfo!.level >= buff.level;
            const color = available ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_SILVER;

            const buffName = this.scene.add.text(-150, y, `Lv.${buff.level} ${buff.name}`, {
                fontSize: '11px',
                color
            });
            const buffDesc = this.scene.add.text(50, y, buff.desc, {
                fontSize: '10px',
                color: available ? UI_COLORS.TEXT_GREEN : UI_COLORS.TEXT_SILVER
            });

            this.contentContainer.add([buffName, buffDesc]);
            y += 22;
        });
    }

    // ============================================================
    // 공개 메서드
    // ============================================================

    setCircleInfo(info: CircleInfo | null): void {
        this.circleInfo = info;
        if (this.isOpen) {
            this.renderContent();
        }
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
        if (this.isOpen) {
            this.renderContent();
        }
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
