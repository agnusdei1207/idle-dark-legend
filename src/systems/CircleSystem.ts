/**
 * ============================================================
 * 서클(길드) 시스템
 * ============================================================
 * 
 * 어둠의전설 스타일 서클:
 * - 서클 생성/가입/탈퇴
 * - 서클 등급 (마스터, 임원, 일반)
 * - 서클 레벨 및 버프
 * - 서클 창고
 * - 서클 채팅
 * ============================================================
 */

import Phaser from 'phaser';

/** 서클 등급 */
export type CircleRank = 'master' | 'officer' | 'member';

/** 서클 멤버 정보 */
export interface CircleMember {
    id: string;
    name: string;
    class: string;
    level: number;
    rank: CircleRank;
    lastOnline: number;
    contributionPoints: number;
}

/** 서클 버프 */
export interface CircleBuff {
    id: string;
    name: string;
    nameKo: string;
    description: string;
    effect: {
        stat: string;
        value: number;
        isPercent: boolean;
    };
    requiredLevel: number;
}

/** 서클 정보 */
export interface CircleInfo {
    id: string;
    name: string;
    tag: string;  // [TAG] 형식
    level: number;
    exp: number;
    maxExp: number;
    masterId: string;
    masterName: string;
    notice: string;
    members: CircleMember[];
    maxMembers: number;
    createdAt: number;
    activeBuffs: string[];
}

/** 서클 시스템 이벤트 */
export type CircleEventType =
    | 'joined'
    | 'left'
    | 'promoted'
    | 'demoted'
    | 'kicked'
    | 'levelUp'
    | 'buffActivated';

export class CircleSystem extends Phaser.Events.EventEmitter {
    private currentCircle: CircleInfo | null = null;
    private myMemberId: string = '';

    // 서클 레벨별 최대 인원
    private static readonly LEVEL_CAPS: number[] = [
        20, 25, 30, 35, 40, 50, 60, 70, 80, 100
    ];

    // 서클 레벨업에 필요한 경험치
    private static readonly LEVEL_EXP: number[] = [
        1000, 3000, 6000, 10000, 15000, 25000, 40000, 60000, 90000, 999999
    ];

    // 사용 가능한 서클 버프
    private static readonly AVAILABLE_BUFFS: CircleBuff[] = [
        {
            id: 'buff_exp_boost',
            name: 'EXP Boost',
            nameKo: '경험치 증가',
            description: '획득 경험치 10% 증가',
            effect: { stat: 'expBonus', value: 10, isPercent: true },
            requiredLevel: 1
        },
        {
            id: 'buff_gold_boost',
            name: 'Gold Boost',
            nameKo: '골드 증가',
            description: '획득 골드 10% 증가',
            effect: { stat: 'goldBonus', value: 10, isPercent: true },
            requiredLevel: 2
        },
        {
            id: 'buff_hp_boost',
            name: 'HP Boost',
            nameKo: '체력 증가',
            description: '최대 HP 5% 증가',
            effect: { stat: 'maxHp', value: 5, isPercent: true },
            requiredLevel: 3
        },
        {
            id: 'buff_attack_boost',
            name: 'Attack Boost',
            nameKo: '공격력 증가',
            description: '공격력 3% 증가',
            effect: { stat: 'attack', value: 3, isPercent: true },
            requiredLevel: 5
        },
        {
            id: 'buff_defense_boost',
            name: 'Defense Boost',
            nameKo: '방어력 증가',
            description: '방어력 3% 증가',
            effect: { stat: 'defense', value: 3, isPercent: true },
            requiredLevel: 5
        },
        {
            id: 'buff_drop_boost',
            name: 'Drop Boost',
            nameKo: '드롭률 증가',
            description: '아이템 드롭률 5% 증가',
            effect: { stat: 'dropRate', value: 5, isPercent: true },
            requiredLevel: 7
        }
    ];

    constructor() {
        super();
    }

    // ============================================================
    // 서클 관리
    // ============================================================

    /**
     * 서클 생성
     */
    createCircle(name: string, tag: string, founderId: string, founderName: string): CircleInfo | null {
        if (this.currentCircle) {
            console.warn('이미 서클에 가입되어 있습니다.');
            return null;
        }

        if (name.length < 2 || name.length > 16) {
            console.warn('서클 이름은 2-16자 사이여야 합니다.');
            return null;
        }

        if (tag.length < 1 || tag.length > 4) {
            console.warn('서클 태그는 1-4자 사이여야 합니다.');
            return null;
        }

        const circle: CircleInfo = {
            id: `circle_${Date.now()}`,
            name,
            tag: `[${tag}]`,
            level: 1,
            exp: 0,
            maxExp: CircleSystem.LEVEL_EXP[0],
            masterId: founderId,
            masterName: founderName,
            notice: '서클에 오신 것을 환영합니다!',
            members: [{
                id: founderId,
                name: founderName,
                class: '전사',
                level: 1,
                rank: 'master',
                lastOnline: Date.now(),
                contributionPoints: 0
            }],
            maxMembers: CircleSystem.LEVEL_CAPS[0],
            createdAt: Date.now(),
            activeBuffs: []
        };

        this.currentCircle = circle;
        this.myMemberId = founderId;
        this.emit('circleCreated', circle);
        return circle;
    }

    /**
     * 서클 가입
     */
    joinCircle(circle: CircleInfo, memberId: string, memberName: string, memberClass: string, memberLevel: number): boolean {
        if (this.currentCircle) {
            console.warn('이미 서클에 가입되어 있습니다.');
            return false;
        }

        if (circle.members.length >= circle.maxMembers) {
            console.warn('서클 인원이 가득 찼습니다.');
            return false;
        }

        const newMember: CircleMember = {
            id: memberId,
            name: memberName,
            class: memberClass,
            level: memberLevel,
            rank: 'member',
            lastOnline: Date.now(),
            contributionPoints: 0
        };

        circle.members.push(newMember);
        this.currentCircle = circle;
        this.myMemberId = memberId;

        this.emit('joined', circle, newMember);
        return true;
    }

    /**
     * 서클 탈퇴
     */
    leaveCircle(): boolean {
        if (!this.currentCircle) {
            console.warn('가입한 서클이 없습니다.');
            return false;
        }

        const myInfo = this.getMyMemberInfo();
        if (myInfo?.rank === 'master') {
            console.warn('마스터는 서클을 해체하거나 마스터를 위임해야 합니다.');
            return false;
        }

        const index = this.currentCircle.members.findIndex(m => m.id === this.myMemberId);
        if (index !== -1) {
            this.currentCircle.members.splice(index, 1);
        }

        const leftCircle = this.currentCircle;
        this.currentCircle = null;
        this.myMemberId = '';

        this.emit('left', leftCircle);
        return true;
    }

    // ============================================================
    // 멤버 관리
    // ============================================================

    /**
     * 멤버 승진
     */
    promoteMember(memberId: string): boolean {
        if (!this.canManageMembers()) return false;

        const member = this.getMemberById(memberId);
        if (!member) return false;

        if (member.rank === 'member') {
            member.rank = 'officer';
            this.emit('promoted', member);
            return true;
        }

        return false;
    }

    /**
     * 멤버 강등
     */
    demoteMember(memberId: string): boolean {
        if (!this.canManageMembers()) return false;

        const member = this.getMemberById(memberId);
        if (!member) return false;

        if (member.rank === 'officer') {
            member.rank = 'member';
            this.emit('demoted', member);
            return true;
        }

        return false;
    }

    /**
     * 멤버 추방
     */
    kickMember(memberId: string): boolean {
        if (!this.canManageMembers()) return false;
        if (!this.currentCircle) return false;

        const member = this.getMemberById(memberId);
        if (!member) return false;

        // 마스터는 추방 불가
        if (member.rank === 'master') return false;

        // 임원은 마스터만 추방 가능
        const myInfo = this.getMyMemberInfo();
        if (member.rank === 'officer' && myInfo?.rank !== 'master') return false;

        const index = this.currentCircle.members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            this.currentCircle.members.splice(index, 1);
            this.emit('kicked', member);
            return true;
        }

        return false;
    }

    /**
     * 마스터 위임
     */
    transferMaster(newMasterId: string): boolean {
        if (!this.currentCircle) return false;

        const myInfo = this.getMyMemberInfo();
        if (myInfo?.rank !== 'master') return false;

        const newMaster = this.getMemberById(newMasterId);
        if (!newMaster) return false;

        // 기존 마스터를 임원으로
        myInfo.rank = 'officer';

        // 새 마스터 설정
        newMaster.rank = 'master';
        this.currentCircle.masterId = newMaster.id;
        this.currentCircle.masterName = newMaster.name;

        this.emit('masterTransferred', myInfo, newMaster);
        return true;
    }

    // ============================================================
    // 서클 성장
    // ============================================================

    /**
     * 기여도 추가 (경험치도 함께 증가)
     */
    addContribution(amount: number): void {
        if (!this.currentCircle) return;

        const myInfo = this.getMyMemberInfo();
        if (myInfo) {
            myInfo.contributionPoints += amount;
        }

        // 서클 경험치 증가
        this.addCircleExp(Math.floor(amount / 10));
    }

    /**
     * 서클 경험치 추가
     */
    private addCircleExp(amount: number): void {
        if (!this.currentCircle) return;

        this.currentCircle.exp += amount;

        // 레벨업 체크
        while (
            this.currentCircle.level < 10 &&
            this.currentCircle.exp >= this.currentCircle.maxExp
        ) {
            this.currentCircle.exp -= this.currentCircle.maxExp;
            this.currentCircle.level++;
            this.currentCircle.maxExp = CircleSystem.LEVEL_EXP[this.currentCircle.level - 1];
            this.currentCircle.maxMembers = CircleSystem.LEVEL_CAPS[this.currentCircle.level - 1];

            this.emit('levelUp', this.currentCircle.level);
        }
    }

    // ============================================================
    // 버프 관리
    // ============================================================

    /**
     * 버프 활성화
     */
    activateBuff(buffId: string): boolean {
        if (!this.currentCircle) return false;
        if (!this.canManageMembers()) return false;

        const buff = CircleSystem.AVAILABLE_BUFFS.find(b => b.id === buffId);
        if (!buff) return false;

        if (this.currentCircle.level < buff.requiredLevel) {
            console.warn(`서클 레벨 ${buff.requiredLevel} 이상이 필요합니다.`);
            return false;
        }

        if (!this.currentCircle.activeBuffs.includes(buffId)) {
            this.currentCircle.activeBuffs.push(buffId);
            this.emit('buffActivated', buff);
            return true;
        }

        return false;
    }

    /**
     * 활성화된 버프 효과 가져오기
     */
    getActiveBuffEffects(): { stat: string, value: number, isPercent: boolean }[] {
        if (!this.currentCircle) return [];

        return this.currentCircle.activeBuffs.map(buffId => {
            const buff = CircleSystem.AVAILABLE_BUFFS.find(b => b.id === buffId);
            return buff?.effect;
        }).filter(Boolean) as { stat: string, value: number, isPercent: boolean }[];
    }

    // ============================================================
    // 유틸리티
    // ============================================================

    getCircleInfo(): CircleInfo | null {
        return this.currentCircle;
    }

    getMyMemberInfo(): CircleMember | null {
        if (!this.currentCircle) return null;
        return this.currentCircle.members.find(m => m.id === this.myMemberId) || null;
    }

    getMemberById(memberId: string): CircleMember | null {
        if (!this.currentCircle) return null;
        return this.currentCircle.members.find(m => m.id === memberId) || null;
    }

    getMembersByRank(rank: CircleRank): CircleMember[] {
        if (!this.currentCircle) return [];
        return this.currentCircle.members.filter(m => m.rank === rank);
    }

    getAvailableBuffs(): CircleBuff[] {
        if (!this.currentCircle) return [];
        return CircleSystem.AVAILABLE_BUFFS.filter(
            b => b.requiredLevel <= this.currentCircle!.level
        );
    }

    canManageMembers(): boolean {
        const myInfo = this.getMyMemberInfo();
        return myInfo?.rank === 'master' || myInfo?.rank === 'officer';
    }

    isInCircle(): boolean {
        return this.currentCircle !== null;
    }

    /**
     * 서클 랭킹 계산 (기여도 합계)
     */
    getTotalContribution(): number {
        if (!this.currentCircle) return 0;
        return this.currentCircle.members.reduce((sum, m) => sum + m.contributionPoints, 0);
    }

    /**
     * 공지사항 설정
     */
    setNotice(notice: string): boolean {
        if (!this.currentCircle) return false;
        if (!this.canManageMembers()) return false;

        this.currentCircle.notice = notice.substring(0, 200);
        this.emit('noticeChanged', notice);
        return true;
    }
}
