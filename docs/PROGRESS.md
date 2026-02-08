# 🎮 어둠의전설 클래식 리메이크 - 진행 상황

> 최종 업데이트: 2026-02-08 11:00

## 📊 전체 진행률

| 카테고리 | 상태 | 진행률 |
|---------|------|--------|
| 코어 시스템 | ✅ 완료 | 100% |
| 데이터 정의 | ✅ 완료 | 100% |
| 게임 시스템 | ✅ 완료 | 100% |
| 엔티티 | ✅ 완료 | 100% |
| UI 시스템 | ✅ 완료 | 100% |
| 직업 시스템 | ✅ 완료 | 100% |
| 서클(길드) 시스템 | ✅ 완료 | 100% |
| 파티 시스템 | ✅ 완료 | 100% |
| 에셋 통합 | ⏳ 대기 | 0% |

---

## ✅ 완료된 작업

### Phase 1: 코어 엔진
- [x] Phaser 3 + Vite + TypeScript 프로젝트 설정
- [x] 아이소메트릭 타일맵 렌더링
- [x] 아이소메트릭 이동 시스템 (8방향)
- [x] 월드/스크린 좌표 변환
- [x] 깊이(depth) 정렬

### Phase 2: 게임 시스템
- [x] `InventorySystem.ts` - 아이템 보관/장착/사용
- [x] `CombatSystem.ts` - 데미지/속성/크리티컬 계산
- [x] `QuestSystem.ts` - 퀘스트 수락/진행/완료
- [x] `DialogueSystem.ts` - NPC 대화 흐름
- [x] `SaveSystem.ts` - LocalStorage 저장/로드
- [x] `AudioManager.ts` - BGM/SFX 관리
- [x] `CircleSystem.ts` - 서클(길드) 시스템

### Phase 3: 데이터 정의
- [x] `items.data.ts` - 무기, 방어구, 소모품, 재료
- [x] `skills.data.ts` - 전사, 마법사 스킬
- [x] `monsters.data.ts` - 몬스터 스탯, 드롭, AI
- [x] `npcs.data.ts` - NPC 및 대화 데이터
- [x] `quests.data.ts` - 퀘스트 정의
- [x] `maps.data.ts` - 맵/포탈/스폰 정의
- [x] `constants.data.ts` - 레벨 테이블
- [x] `classes.data.ts` - 직업/전직/스킬트리

### Phase 4: 엔티티
- [x] `Entity.ts` - 기본 클래스 (HP바, 데미지, 이동)
- [x] `Player.ts` - 레벨업, 스킬, 인벤토리 통합
- [x] `Monster.ts` - AI, 드롭, 리스폰
- [x] `NPC.ts` - 상호작용, 대화/상점/퀘스트

### Phase 5: 어둠의전설 스타일 UI
- [x] `ClassicHUD.ts` - 클래식 HUD (초상화, HP/MP/EXP, 미니맵, 스킬바, 채팅)
- [x] `CharacterUI.ts` - 캐릭터 정보 (C 키)
- [x] `SkillTreeUI.ts` - 스킬 트리 (K 키)
- [x] `CircleUI.ts` - 서클 (G 키)
- [x] `PartyUI.ts` - 파티 UI
- [x] `InventoryUI.ts` - 인벤토리 (I 키)
- [x] `DialogueUI.ts` - 대화창
- [x] `QuestUI.ts` - 퀘스트 로그 (Q 키)
- [x] `ShopUI.ts` - 상점

### Phase 6: 직업 시스템
- [x] 4대 기본 직업 정의 (전사, 마법사, 궁수, 도적)
- [x] 직업별 기본 스탯 및 성장치
- [x] 8개 전직 클래스 (각 직업당 2개)
- [x] 스킬 트리 시스템 (티어별, 선행 스킬)
- [x] 스킬 포인트 투자

### Phase 7: 소셜 시스템
- [x] 서클 생성/가입/탈퇴
- [x] 서클 등급 (마스터, 임원, 일반)
- [x] 서클 레벨 및 버프
- [x] 서클 기여도
- [x] 파티 UI (최대 6인)

---

## ⏳ 예정된 작업

### Phase 8: 에셋 통합
- [ ] 캐릭터 스프라이트 (8방향 애니메이션)
- [ ] 몬스터 스프라이트
- [ ] 타일셋 및 Tiled 맵
- [ ] 아이템/스킬 아이콘
- [ ] BGM/SFX

### Phase 9: 고급 기능
- [ ] PvP 시스템
- [ ] 파티 던전
- [ ] 보스 레이드
- [ ] 거래 시스템
- [ ] 우편 시스템

### Phase 10: 폴리싱
- [ ] 튜토리얼
- [ ] 업적 시스템
- [ ] 랭킹
- [ ] 다국어 지원

---

## 📁 파일 구조

```
src/
├── config/
│   └── game.config.ts          ✅
├── data/
│   ├── items.data.ts           ✅
│   ├── skills.data.ts          ✅
│   ├── monsters.data.ts        ✅
│   ├── npcs.data.ts            ✅
│   ├── quests.data.ts          ✅
│   ├── maps.data.ts            ✅
│   ├── constants.data.ts       ✅
│   └── classes.data.ts         ✅ NEW
├── entities/
│   ├── index.ts                ✅
│   ├── Entity.ts               ✅
│   ├── Player.ts               ✅
│   ├── Monster.ts              ✅
│   └── NPC.ts                  ✅
├── systems/
│   ├── index.ts                ✅
│   ├── InventorySystem.ts      ✅
│   ├── CombatSystem.ts         ✅
│   ├── QuestSystem.ts          ✅
│   ├── DialogueSystem.ts       ✅
│   ├── SaveSystem.ts           ✅
│   ├── AudioManager.ts         ✅
│   └── CircleSystem.ts         ✅ NEW
├── ui/
│   ├── index.ts                ✅
│   ├── InventoryUI.ts          ✅
│   ├── DialogueUI.ts           ✅
│   ├── QuestUI.ts              ✅
│   ├── ShopUI.ts               ✅
│   ├── ClassicHUD.ts           ✅ NEW
│   ├── CharacterUI.ts          ✅ NEW
│   ├── SkillTreeUI.ts          ✅ NEW
│   ├── CircleUI.ts             ✅ NEW
│   └── PartyUI.ts              ✅ NEW
├── scenes/
│   ├── BootScene.ts            ✅
│   ├── MenuScene.ts            ✅
│   ├── GameScene.ts            ✅
│   └── UIScene.ts              ✅
├── types/
│   └── game.types.ts           ✅
└── utils/
    └── helpers.ts              ✅

docs/
├── ASSET_GUIDE.md              ✅ 업데이트
├── PROGRESS.md                 ✅ 이 문서
└── README.md (root)            ✅ 업데이트
```

---

## 📝 변경 이력

| 날짜 | 버전 | 작업 내용 |
|------|------|----------|
| 2026-02-08 | v0.1.0 | 초기 프로젝트 설정, 코어 시스템 구현 |
| 2026-02-08 | v0.2.0 | 데이터 정의 완료, 기본 UI 구현 |
| 2026-02-08 | v0.3.0 | 직업 시스템, 스킬 트리 추가 |
| 2026-02-08 | v0.4.0 | 어둠의전설 스타일 UI 완성 |
| 2026-02-08 | v0.5.0 | 서클/파티 시스템 추가, 문서 정비 |

---

## 🔗 관련 문서

- [README](../README.md) - 프로젝트 개요
- [에셋 가이드](./ASSET_GUIDE.md) - 에셋 교체 방법

---

## 🎯 다음 작업

**✅ 완료:**
1. ~~ClassicHUD를 UIScene에 통합~~
2. ~~새로운 UI들을 GameScene에 연결 (C, K, G 단축키)~~

**⏳ 대기:**
1. 에셋 통합을 위한 PreloadScene 업데이트
2. 실제 스프라이트/타일셋 교체 테스트
3. 사운드 에셋 통합

---

*이 문서는 작업 진행에 따라 자동으로 업데이트됩니다.*
