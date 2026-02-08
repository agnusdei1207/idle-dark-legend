/**
 * ============================================================
 * 파티 UI
 * ============================================================
 * 
 * 어둠의전설 스타일:
 * - 파티원 HP/MP 바
 * - 파티장 표시
 * - 최대 6인 파티
 * ============================================================
 */

import Phaser from 'phaser';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x3a3a5e,
    PANEL_DARK: 0x0a0a1e,
    HP_BAR: 0xcc3333,
    HP_BAR_BG: 0x4a1a1a,
    MP_BAR: 0x3333cc,
    MP_BAR_BG: 0x1a1a4a,
    TEXT_WHITE: '#ffffff',
    TEXT_GOLD: '#ffd700',
    TEXT_SILVER: '#c0c0c0',
    LEADER: '#ffd700',
};

export interface PartyMember {
    id: string;
    name: string;
    class: string;
    level: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    isLeader: boolean;
    isOnline: boolean;
}

export class PartyUI extends Phaser.GameObjects.Container {
    private members: PartyMember[] = [];
    private memberSlots: Phaser.GameObjects.Container[] = [];
    private isExpanded: boolean = true;
    private headerText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        const x = 10;
        const y = 120; // 캐릭터 패널 아래
        super(scene, x, y);
        scene.add.existing(this);
        this.setDepth(1000);
        this.setVisible(false); // 파티가 없으면 숨김

        this.createUI();
    }

    private createUI(): void {
        // 헤더
        const header = this.scene.add.container(0, 0);
        this.add(header);

        const headerBg = this.scene.add.rectangle(0, 0, 180, 24, UI_COLORS.PANEL_DARK, 0.9);
        headerBg.setOrigin(0, 0);
        headerBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        headerBg.setInteractive({ useHandCursor: true });
        header.add(headerBg);

        this.headerText = this.scene.add.text(10, 12, '👥 파티 (0/6)', {
            fontSize: '11px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0, 0.5);
        header.add(this.headerText);

        // 토글 버튼
        const toggleBtn = this.scene.add.text(165, 12, '▼', {
            fontSize: '10px',
            color: UI_COLORS.TEXT_SILVER
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        toggleBtn.on('pointerdown', () => this.toggleExpand());
        header.add(toggleBtn);

        // 파티원 슬롯 6개 생성
        for (let i = 0; i < 6; i++) {
            const slot = this.createMemberSlot(i);
            slot.setPosition(0, 28 + i * 50);
            slot.setVisible(false);
            this.add(slot);
            this.memberSlots.push(slot);
        }
    }

    private createMemberSlot(index: number): Phaser.GameObjects.Container {
        const container = this.scene.add.container(0, 0);
        const slotHeight = 46;

        // 배경
        const bg = this.scene.add.rectangle(0, 0, 180, slotHeight, UI_COLORS.PANEL_BG, 0.85);
        bg.setOrigin(0, 0);
        bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        bg.setInteractive({ useHandCursor: true });
        container.add(bg);

        // 클래스 아이콘
        const classIcon = this.scene.add.text(8, slotHeight / 2, '👤', {
            fontSize: '18px'
        }).setOrigin(0, 0.5);
        classIcon.setName('classIcon');
        container.add(classIcon);

        // 이름 (+ 파티장 마크)
        const nameText = this.scene.add.text(32, 8, '', {
            fontSize: '11px',
            color: UI_COLORS.TEXT_WHITE
        });
        nameText.setName('name');
        container.add(nameText);

        // 레벨
        const levelText = this.scene.add.text(32, 22, '', {
            fontSize: '9px',
            color: UI_COLORS.TEXT_SILVER
        });
        levelText.setName('level');
        container.add(levelText);

        // HP 바
        const hpBg = this.scene.add.rectangle(35, 34, 100, 8, UI_COLORS.HP_BAR_BG);
        hpBg.setOrigin(0, 0.5);
        container.add(hpBg);

        const hpFill = this.scene.add.rectangle(35, 34, 100, 6, UI_COLORS.HP_BAR);
        hpFill.setOrigin(0, 0.5);
        hpFill.setName('hpBar');
        container.add(hpFill);

        // MP 바
        const mpBg = this.scene.add.rectangle(140, 34, 35, 6, UI_COLORS.MP_BAR_BG);
        mpBg.setOrigin(0, 0.5);
        container.add(mpBg);

        const mpFill = this.scene.add.rectangle(140, 34, 35, 4, UI_COLORS.MP_BAR);
        mpFill.setOrigin(0, 0.5);
        mpFill.setName('mpBar');
        container.add(mpFill);

        // 우클릭 메뉴 이벤트
        bg.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.scene.events.emit('partyContextMenu', index);
            }
        });

        return container;
    }

    private toggleExpand(): void {
        this.isExpanded = !this.isExpanded;

        this.memberSlots.forEach((slot, i) => {
            if (i < this.members.length) {
                slot.setVisible(this.isExpanded);
            }
        });
    }

    private getClassEmoji(className: string): string {
        const emojiMap: { [key: string]: string } = {
            '전사': '⚔️',
            '마법사': '🧙',
            '궁수': '🏹',
            '도적': '🗡️',
            '기사': '🛡️',
            '광전사': '😤',
            '대마법사': '🔮',
            '흑마법사': '👿',
            '저격수': '🎯',
            '레인저': '🦅',
            '암살자': '💀',
            '그림자 무희': '👤',
        };
        return emojiMap[className] || '👤';
    }

    // ============================================================
    // 공개 메서드
    // ============================================================

    /**
     * 파티원 목록 업데이트
     */
    setMembers(members: PartyMember[]): void {
        this.members = members;
        this.setVisible(members.length > 0);

        this.headerText.setText(`👥 파티 (${members.length}/6)`);

        // 슬롯 업데이트
        this.memberSlots.forEach((slot, i) => {
            if (i < members.length) {
                const member = members[i];
                slot.setVisible(this.isExpanded);

                const classIcon = slot.getByName('classIcon') as Phaser.GameObjects.Text;
                const nameText = slot.getByName('name') as Phaser.GameObjects.Text;
                const levelText = slot.getByName('level') as Phaser.GameObjects.Text;
                const hpBar = slot.getByName('hpBar') as Phaser.GameObjects.Rectangle;
                const mpBar = slot.getByName('mpBar') as Phaser.GameObjects.Rectangle;

                if (classIcon) classIcon.setText(this.getClassEmoji(member.class));
                if (nameText) {
                    const prefix = member.isLeader ? '👑 ' : '';
                    nameText.setText(prefix + member.name);
                    nameText.setColor(member.isLeader ? UI_COLORS.LEADER : UI_COLORS.TEXT_WHITE);
                }
                if (levelText) levelText.setText(`Lv.${member.level} ${member.class}`);
                if (hpBar) hpBar.setScale(member.hp / member.maxHp, 1);
                if (mpBar) mpBar.setScale(member.mp / member.maxMp, 1);
            } else {
                slot.setVisible(false);
            }
        });
    }

    /**
     * 특정 멤버 HP 업데이트
     */
    updateMemberHP(memberId: string, hp: number, maxHp: number): void {
        const index = this.members.findIndex(m => m.id === memberId);
        if (index === -1) return;

        this.members[index].hp = hp;
        this.members[index].maxHp = maxHp;

        const slot = this.memberSlots[index];
        const hpBar = slot.getByName('hpBar') as Phaser.GameObjects.Rectangle;
        if (hpBar) hpBar.setScale(hp / maxHp, 1);
    }

    /**
     * 특정 멤버 MP 업데이트
     */
    updateMemberMP(memberId: string, mp: number, maxMp: number): void {
        const index = this.members.findIndex(m => m.id === memberId);
        if (index === -1) return;

        this.members[index].mp = mp;
        this.members[index].maxMp = maxMp;

        const slot = this.memberSlots[index];
        const mpBar = slot.getByName('mpBar') as Phaser.GameObjects.Rectangle;
        if (mpBar) mpBar.setScale(mp / maxMp, 1);
    }

    /**
     * 파티 해제
     */
    clearParty(): void {
        this.members = [];
        this.setVisible(false);
        this.memberSlots.forEach(slot => slot.setVisible(false));
    }
}
