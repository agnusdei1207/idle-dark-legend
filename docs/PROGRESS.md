# 🎮 Idle 어둠의전설 - 진행 상황

> 최종 업데이트: 2026-02-08 11:50

## 📊 전체 진행률

| 카테고리 | 상태 | 진행률 |
|---------|------|--------|
| 코어 시스템 | ✅ 완료 | 100% |
| Idle 시스템 | ✅ 완료 | 100% |
| 데이터 정의 | ✅ 완료 | 100% |
| 게임 시스템 | ✅ 완료 | 100% |
| 엔티티 | ✅ 완료 | 100% |
| UI 시스템 | ✅ 완료 | 100% |
| 직업 시스템 | ✅ 완료 | 100% |
| 소셜 시스템 | ✅ 완료 | 100% |
| 문서화 | ✅ 완료 | 100% |
| 에셋 통합 | ⏳ 대기 | 0% |

---

## ✅ 완료된 작업

### Phase 1: 코어 엔진
- [x] Phaser 3 + Vite + TypeScript 프로젝트 설정
- [x] 아이소메트릭 타일맵 렌더링
- [x] 아이소메트릭 이동 시스템 (8방향)
- [x] 월드/스크린 좌표 변환
- [x] 깊이(depth) 정렬

### Phase 2: Idle 시스템
- [x] `IdleSystem.ts` - 자동 사냥 시스템
- [x] 오프라인 진행 시스템 (최대 8시간)
- [x] 오프라인 보상 계산
- [x] 사냥터 선택 시스템
- [x] 추천 사냥터 자동 계산
- [x] 사냥 효율 시스템

### Phase 3: 어둠의전설 사냥터 (17개)
- [x] 1써클: 노비스 던전, 우드랜드 1존, 우드랜드 2존
- [x] 2써클: 포테의 숲, 피에트 던전 1층, 피에트 던전 2층
- [x] 3써클: 아벨 해안던전, 아벨 던전 1층, 아벨 던전 2층
- [x] 4써클: 뤼케시온 해안던전, 해저 던전, 난파선
- [x] 5써클: 호러캐슬, 백작부인의 별장, 베크나 탑

### Phase 4: 몬스터 데이터 (43종)
- [x] 1써클 (9종): 쥐, 박쥐, 거미, 고블린, 슬라임, 늑대, 오크, 트롤, 곰
- [x] 2써클 (8종): 버섯요정, 트렌트, 스켈레톤, 좀비, 구울, 좀비나이트, 레이스, 뱀파이어배트
- [x] 3써클 (9종): 대게, 해적도적, 머맨, 가고일, 미믹, 데스아이, 리치, 듈라한, 데몬아처
- [x] 4써클 (8종): 크라켄촉수, 시파이라테, 딥원, 머메이드워리어, 씨드래곤, 고스트캡틴, 커스드세일러, 레비아탄스폰
- [x] 5써클 (9종): 드라큘라, 웨어울프, 프랑켄, 메이드고스트, 아이언메이든, 블러드카운테스, 다크위차스, 베크나졸, 대마법사

### Phase 5: UI 시스템
- [x] `ClassicHUD.ts` - 클래식 HUD
- [x] `CharacterUI.ts` - 캐릭터 정보 (C 키)
- [x] `SkillTreeUI.ts` - 스킬 트리 (K 키)
- [x] `CircleUI.ts` - 서클 (G 키)
- [x] `PartyUI.ts` - 파티 UI
- [x] `InventoryUI.ts` - 인벤토리 (I 키)
- [x] `QuestUI.ts` - 퀘스트 로그 (Q 키)
- [x] `ShopUI.ts` - 상점
- [x] `OfflineRewardUI.ts` - 오프라인 보상
- [x] `HuntingZoneUI.ts` - 사냥터 선택

### Phase 6: 게임 시스템
- [x] `InventorySystem.ts` - 아이템 관리
- [x] `CombatSystem.ts` - 전투 계산
- [x] `QuestSystem.ts` - 퀘스트 관리
- [x] `DialogueSystem.ts` - 대화 관리
- [x] `SaveSystem.ts` - 저장/로드
- [x] `AudioManager.ts` - 오디오 관리
- [x] `CircleSystem.ts` - 길드 관리
- [x] `IdleSystem.ts` - Idle 시스템

### Phase 7: 직업 시스템
- [x] 4대 기본 직업 (전사, 마법사, 궁수, 도적)
- [x] 8개 전직 클래스
- [x] 스킬 트리 시스템
- [x] 스킬 포인트 투자

### Phase 8: 문서화
- [x] README.md - 프로젝트 개요
- [x] CREDITS.md - 에셋 크레딧 및 라이선스
- [x] ASSET_GUIDE.md - 에셋 규격 및 출처
- [x] IDLE_SYSTEM.md - Idle 시스템 설계
- [x] PROGRESS.md - 진행 상황

---

## ⏳ 예정된 작업

### Phase 9: 에셋 통합
- [ ] Ninja Adventure Pack 다운로드
  - **URL**: https://pixel-boy.itch.io/ninja-adventure-asset-pack
  - **라이선스**: CC0
- [ ] 캐릭터 스프라이트 배치 (4직업)
- [ ] 몬스터 스프라이트 배치 (43종)
- [ ] 타일셋 배치 (던전, 숲, 해안)
- [ ] BGM 배치 (마을, 던전, 보스)
- [ ] SFX 배치 (공격, 피격, UI)
- [ ] UI 아이콘 배치

### Phase 10: GameScene 통합
- [ ] IdleSystem 연동
- [ ] HuntingZoneUI 연동
- [ ] OfflineRewardUI 연동
- [ ] PreloadScene 에셋 로딩

### Phase 11: 고급 기능
- [ ] 보스 레이드
- [ ] PvP 시스템
- [ ] 거래 시스템
- [ ] 장비 강화 시스템
- [ ] 룬 시스템

### Phase 12: 폴리싱
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
│   ├── monsters.data.ts        ✅ (43종)
│   ├── npcs.data.ts            ✅
│   ├── quests.data.ts          ✅
│   ├── maps.data.ts            ✅
│   ├── constants.data.ts       ✅
│   └── classes.data.ts         ✅
├── entities/
│   ├── Entity.ts               ✅
│   ├── Player.ts               ✅
│   ├── Monster.ts              ✅
│   └── NPC.ts                  ✅
├── systems/
│   ├── InventorySystem.ts      ✅
│   ├── CombatSystem.ts         ✅
│   ├── QuestSystem.ts          ✅
│   ├── DialogueSystem.ts       ✅
│   ├── SaveSystem.ts           ✅
│   ├── AudioManager.ts         ✅
│   ├── CircleSystem.ts         ✅
│   └── IdleSystem.ts           ✅
├── ui/
│   ├── InventoryUI.ts          ✅
│   ├── DialogueUI.ts           ✅
│   ├── QuestUI.ts              ✅
│   ├── ShopUI.ts               ✅
│   ├── ClassicHUD.ts           ✅
│   ├── CharacterUI.ts          ✅
│   ├── SkillTreeUI.ts          ✅
│   ├── CircleUI.ts             ✅
│   ├── PartyUI.ts              ✅
│   ├── OfflineRewardUI.ts      ✅
│   └── HuntingZoneUI.ts        ✅
├── scenes/
│   ├── BootScene.ts            ✅
│   ├── MenuScene.ts            ✅
│   ├── GameScene.ts            ✅
│   └── UIScene.ts              ✅
└── types/
    └── game.types.ts           ✅

docs/
├── ASSET_GUIDE.md              ✅ (에셋 출처 포함)
├── IDLE_SYSTEM.md              ✅
├── PROGRESS.md                 ✅ (이 문서)

CREDITS.md                      ✅ (에셋 라이선스)
README.md                       ✅
```

---

## 🎨 에셋 정보

### 선정 에셋 팩

| 에셋 | 제작자 | 라이선스 | URL |
|------|--------|----------|-----|
| Ninja Adventure Pack | pixel-boy | CC0 | https://pixel-boy.itch.io/ninja-adventure-asset-pack |
| RPG SFX | OpenGameArt | CC0 | https://opengameart.org/content/80-cc0-rpg-sfx |

### 비용

| 에셋 | 비용 |
|------|------|
| Ninja Adventure Pack | **무료** |
| OpenGameArt SFX | **무료** |
| **총 비용** | **$0** |

---

## 📝 변경 이력

| 날짜 | 버전 | 작업 내용 |
|------|------|------------|
| 2026-02-08 | v0.1.0 | 초기 프로젝트 설정, 코어 시스템 구현 |
| 2026-02-08 | v0.2.0 | 데이터 정의 완료, 기본 UI 구현 |
| 2026-02-08 | v0.3.0 | 직업 시스템, 스킬 트리 추가 |
| 2026-02-08 | v0.4.0 | 어둠의전설 스타일 UI 완성 |
| 2026-02-08 | v0.5.0 | 서클/파티 시스템 추가 |
| 2026-02-08 | v0.6.0 | Idle 시스템 추가 |
| 2026-02-08 | v0.6.1 | 문서 최신화, 에셋 출처 명시 |

---

## 🔗 관련 문서

- [README](../README.md) - 프로젝트 개요
- [에셋 가이드](./ASSET_GUIDE.md) - 에셋 규격 및 출처
- [Idle 시스템](./IDLE_SYSTEM.md) - 시스템 설계
- [크레딧](../CREDITS.md) - 라이선스 정보

---

*이 문서는 작업 진행에 따라 업데이트됩니다.*
