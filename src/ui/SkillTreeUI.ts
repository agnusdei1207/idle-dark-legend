/**
 * ============================================================
 * 스킬 트리 UI (K 키)
 * ============================================================
 * 
 * 어둠의전설 스타일:
 * - 직업별 스킬 트리
 * - 티어별 스킬 배치
 * - 연결선으로 선행 스킬 표시
 * - 스킬 레벨업 시스템
 * ============================================================
 */

import Phaser from 'phaser';
import { SKILL_TREES, getSkillTreesFor } from '../data/classes.data';
import type { SkillTree, SkillTreeNode, ClassType } from '../data/classes.data';
import { getSkillById } from '../data/skills.data';

const UI_COLORS = {
    PANEL_BG: 0x1a1a2e,
    PANEL_BORDER: 0x3a3a5e,
    PANEL_DARK: 0x0a0a1e,
    SKILL_LOCKED: 0x333344,
    SKILL_AVAILABLE: 0x444466,
    SKILL_LEARNED: 0x4a6a4a,
    SKILL_MAXED: 0x6a6a3a,
    LINE_LOCKED: 0x444444,
    LINE_UNLOCKED: 0x88ff88,
    TEXT_WHITE: '#ffffff',
    TEXT_GOLD: '#ffd700',
    TEXT_GRAY: '#888888',
    TEXT_GREEN: '#44ff44',
};

export class SkillTreeUI extends Phaser.GameObjects.Container {
    private isOpen: boolean = false;
    private currentClass: ClassType = 'warrior';
    private currentTreeIndex: number = 0;
    private skillPoints: number = 0;
    private learnedSkills: Map<string, number> = new Map(); // skillId -> level

    private treeContainer!: Phaser.GameObjects.Container;
    private skillNodes: Map<string, Phaser.GameObjects.Container> = new Map();
    private connectionLines: Phaser.GameObjects.Graphics[] = [];
    private tabButtons: Phaser.GameObjects.Container[] = [];
    private tooltipContainer!: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        const { width, height } = scene.cameras.main;
        super(scene, width / 2, height / 2);
        scene.add.existing(this);
        this.setDepth(2000);
        this.setVisible(false);

        this.createUI();
    }

    private createUI(): void {
        const panelWidth = 500;
        const panelHeight = 550;

        // 반투명 배경
        const overlay = this.scene.add.rectangle(0, 0, 2000, 2000, 0x000000, 0.5);
        overlay.setInteractive();
        this.add(overlay);

        // 메인 패널
        const bg = this.scene.add.rectangle(0, 0, panelWidth, panelHeight, UI_COLORS.PANEL_BG, 0.95);
        bg.setStrokeStyle(3, UI_COLORS.PANEL_BORDER);
        this.add(bg);

        // 타이틀
        this.createTitleBar(panelWidth);

        // 스킬 트리 탭
        this.createTreeTabs(-panelWidth / 2 + 20, -panelHeight / 2 + 60);

        // 스킬 트리 컨테이너
        this.treeContainer = this.scene.add.container(0, 50);
        this.add(this.treeContainer);

        // 스킬 포인트 표시
        const pointsText = this.scene.add.text(0, panelHeight / 2 - 40, `스킬 포인트: ${this.skillPoints}`, {
            fontSize: '14px',
            color: UI_COLORS.TEXT_GOLD
        }).setOrigin(0.5);
        pointsText.setName('skillPoints');
        this.add(pointsText);

        // 툴팁 컨테이너
        this.tooltipContainer = this.scene.add.container(0, 0).setVisible(false);
        this.add(this.tooltipContainer);

        // 초기 트리 렌더링
        this.renderSkillTree();
    }

    private createTitleBar(panelWidth: number): void {
        const container = this.scene.add.container(0, -275 + 20);
        this.add(container);

        const titleBg = this.scene.add.rectangle(0, 0, panelWidth, 40, UI_COLORS.PANEL_DARK);
        titleBg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        container.add(titleBg);

        const titleText = this.scene.add.text(0, 0, '스킬 트리', {
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

    private createTreeTabs(x: number, y: number): void {
        const trees = getSkillTreesFor(this.currentClass);

        trees.forEach((tree, i) => {
            const tabX = x + i * 120;
            const tab = this.scene.add.container(tabX, y);

            const bg = this.scene.add.rectangle(0, 0, 110, 30, i === 0 ? UI_COLORS.PANEL_BORDER : UI_COLORS.PANEL_DARK);
            bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
            bg.setInteractive({ useHandCursor: true });
            bg.setName('bg');
            tab.add(bg);

            const text = this.scene.add.text(0, 0, tree.nameKo, {
                fontSize: '12px',
                color: i === 0 ? UI_COLORS.TEXT_WHITE : UI_COLORS.TEXT_GRAY
            }).setOrigin(0.5);
            text.setName('text');
            tab.add(text);

            bg.on('pointerdown', () => this.selectTree(i));

            this.tabButtons.push(tab);
            this.add(tab);
        });
    }

    private selectTree(index: number): void {
        this.currentTreeIndex = index;

        // 탭 스타일 업데이트
        this.tabButtons.forEach((tab, i) => {
            const bg = tab.getByName('bg') as Phaser.GameObjects.Rectangle;
            const text = tab.getByName('text') as Phaser.GameObjects.Text;
            if (i === index) {
                bg.setFillStyle(UI_COLORS.PANEL_BORDER);
                text.setColor(UI_COLORS.TEXT_WHITE);
            } else {
                bg.setFillStyle(UI_COLORS.PANEL_DARK);
                text.setColor(UI_COLORS.TEXT_GRAY);
            }
        });

        this.renderSkillTree();
    }

    private renderSkillTree(): void {
        // 기존 노드 제거
        this.treeContainer.removeAll(true);
        this.skillNodes.clear();

        const trees = getSkillTreesFor(this.currentClass);
        if (trees.length === 0 || !trees[this.currentTreeIndex]) return;

        const tree = trees[this.currentTreeIndex];

        // 연결선 그리기
        const graphics = this.scene.add.graphics();
        this.treeContainer.add(graphics);

        // 스킬 노드 그리기
        const nodeSize = 50;
        const tierHeight = 80;
        const positionWidth = 100;

        tree.nodes.forEach(node => {
            const x = (node.position - 1) * positionWidth;
            const y = (node.tier - 1) * tierHeight - 150;

            // 선행 스킬과 연결선
            node.prerequisites.forEach(prereq => {
                const prereqNode = tree.nodes.find(n => n.skillId === prereq);
                if (prereqNode) {
                    const prereqX = (prereqNode.position - 1) * positionWidth;
                    const prereqY = (prereqNode.tier - 1) * tierHeight - 150;

                    const isUnlocked = this.isSkillLearned(prereq);
                    graphics.lineStyle(2, isUnlocked ? UI_COLORS.LINE_UNLOCKED : UI_COLORS.LINE_LOCKED, 0.8);
                    graphics.lineBetween(prereqX, prereqY + nodeSize / 2, x, y - nodeSize / 2);
                }
            });

            // 스킬 노드 생성
            const nodeContainer = this.createSkillNode(x, y, nodeSize, node);
            this.treeContainer.add(nodeContainer);
            this.skillNodes.set(node.skillId, nodeContainer);
        });
    }

    private createSkillNode(x: number, y: number, size: number, node: SkillTreeNode): Phaser.GameObjects.Container {
        const container = this.scene.add.container(x, y);

        const currentLevel = this.learnedSkills.get(node.skillId) || 0;
        const canLearn = this.canLearnSkill(node);

        // 배경색 결정
        let bgColor = UI_COLORS.SKILL_LOCKED;
        if (currentLevel >= node.maxLevel) {
            bgColor = UI_COLORS.SKILL_MAXED;
        } else if (currentLevel > 0) {
            bgColor = UI_COLORS.SKILL_LEARNED;
        } else if (canLearn) {
            bgColor = UI_COLORS.SKILL_AVAILABLE;
        }

        const bg = this.scene.add.rectangle(0, 0, size, size, bgColor);
        bg.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
        bg.setInteractive({ useHandCursor: canLearn && currentLevel < node.maxLevel });
        container.add(bg);

        // 스킬 아이콘 (플레이스홀더)
        const skill = getSkillById(node.skillId);
        const iconEmoji = this.getSkillEmoji(node.skillId);
        const icon = this.scene.add.text(0, -5, iconEmoji, {
            fontSize: '20px'
        }).setOrigin(0.5);
        container.add(icon);

        // 레벨 표시
        const levelText = this.scene.add.text(0, 18, `${currentLevel}/${node.maxLevel}`, {
            fontSize: '10px',
            color: currentLevel >= node.maxLevel ? UI_COLORS.TEXT_GOLD : UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);
        container.add(levelText);

        // 이벤트
        bg.on('pointerover', () => {
            bg.setStrokeStyle(3, 0xffffff);
            this.showTooltip(x, y - 60, node);
        });
        bg.on('pointerout', () => {
            bg.setStrokeStyle(2, UI_COLORS.PANEL_BORDER);
            this.hideTooltip();
        });
        bg.on('pointerdown', () => {
            if (canLearn && currentLevel < node.maxLevel) {
                this.learnSkill(node.skillId);
            }
        });

        return container;
    }

    private getSkillEmoji(skillId: string): string {
        // 스킬 ID에 따른 이모지 매핑
        const emojiMap: { [key: string]: string } = {
            'skill_slash': '⚔️',
            'skill_power_strike': '💥',
            'skill_whirlwind': '🌀',
            'skill_charge': '🏃',
            'skill_fury': '😤',
            'skill_earthquake': '🌍',
            'skill_block': '🛡️',
            'skill_iron_skin': '🦾',
            'skill_taunt': '😠',
            'skill_shield_wall': '🧱',
            'skill_last_stand': '⚡',
            'skill_fireball': '🔥',
            'skill_flame_wave': '🌊',
            'skill_fire_shield': '🔶',
            'skill_inferno': '☀️',
            'skill_meteor': '☄️',
            'skill_ice_bolt': '❄️',
            'skill_frost_nova': '💎',
            'skill_ice_armor': '🧊',
            'skill_blizzard': '🌨️',
            'skill_absolute_zero': '⬜',
        };
        return emojiMap[skillId] || '⭐';
    }

    private canLearnSkill(node: SkillTreeNode): boolean {
        if (this.skillPoints <= 0) return false;

        // 선행 스킬 체크
        for (const prereq of node.prerequisites) {
            if (!this.isSkillLearned(prereq)) return false;
        }

        // 필요 포인트 체크
        const totalPoints = Array.from(this.learnedSkills.values()).reduce((a, b) => a + b, 0);
        return totalPoints >= node.requiredPoints || node.tier === 1;
    }

    private isSkillLearned(skillId: string): boolean {
        return (this.learnedSkills.get(skillId) || 0) > 0;
    }

    private learnSkill(skillId: string): void {
        if (this.skillPoints <= 0) return;

        const current = this.learnedSkills.get(skillId) || 0;
        this.learnedSkills.set(skillId, current + 1);
        this.skillPoints--;

        // UI 업데이트
        this.updatePointsDisplay();
        this.renderSkillTree();

        // 이벤트 발생
        this.scene.events.emit('skillLearned', skillId, current + 1);
    }

    private showTooltip(x: number, y: number, node: SkillTreeNode): void {
        this.tooltipContainer.removeAll(true);
        this.tooltipContainer.setPosition(x, y);

        const skill = getSkillById(node.skillId);
        const currentLevel = this.learnedSkills.get(node.skillId) || 0;

        const bg = this.scene.add.rectangle(0, 0, 180, 100, 0x000000, 0.9);
        bg.setStrokeStyle(1, UI_COLORS.PANEL_BORDER);
        this.tooltipContainer.add(bg);

        const name = skill?.nameKo || node.skillId;
        const nameText = this.scene.add.text(0, -35, name, {
            fontSize: '13px',
            color: UI_COLORS.TEXT_GOLD,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tooltipContainer.add(nameText);

        const levelText = this.scene.add.text(0, -15, `레벨: ${currentLevel}/${node.maxLevel}`, {
            fontSize: '11px',
            color: UI_COLORS.TEXT_WHITE
        }).setOrigin(0.5);
        this.tooltipContainer.add(levelText);

        if (skill?.description) {
            const descText = this.scene.add.text(0, 10, skill.description, {
                fontSize: '10px',
                color: UI_COLORS.TEXT_GRAY,
                wordWrap: { width: 160 }
            }).setOrigin(0.5);
            this.tooltipContainer.add(descText);
        }

        const prereqText = node.prerequisites.length > 0
            ? `선행: ${node.prerequisites.join(', ')}`
            : '선행 스킬 없음';
        const prereq = this.scene.add.text(0, 35, prereqText, {
            fontSize: '9px',
            color: UI_COLORS.TEXT_GRAY
        }).setOrigin(0.5);
        this.tooltipContainer.add(prereq);

        this.tooltipContainer.setVisible(true);
    }

    private hideTooltip(): void {
        this.tooltipContainer.setVisible(false);
    }

    private updatePointsDisplay(): void {
        const pointsText = this.getByName('skillPoints') as Phaser.GameObjects.Text;
        if (pointsText) {
            pointsText.setText(`스킬 포인트: ${this.skillPoints}`);
        }
    }

    // ============================================================
    // 공개 메서드
    // ============================================================

    setClass(classType: ClassType): void {
        this.currentClass = classType;
        this.currentTreeIndex = 0;

        // 탭 재생성 필요
        this.tabButtons.forEach(tab => tab.destroy());
        this.tabButtons = [];
        this.createTreeTabs(-250 + 20, -275 + 60);

        this.renderSkillTree();
    }

    setSkillPoints(points: number): void {
        this.skillPoints = points;
        this.updatePointsDisplay();
    }

    setLearnedSkills(skills: Map<string, number>): void {
        this.learnedSkills = skills;
        this.renderSkillTree();
    }

    toggle(): void {
        this.isOpen = !this.isOpen;
        this.setVisible(this.isOpen);
        if (this.isOpen) {
            this.renderSkillTree();
        }
    }

    getIsOpen(): boolean {
        return this.isOpen;
    }
}
