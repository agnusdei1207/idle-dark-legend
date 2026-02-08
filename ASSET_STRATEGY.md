# 어둠의전설 클래식 - 에셋 전략 가이드

> **아이소메트릭 다크 판타지 에셋 확보를 위한 완전한 분석**
> 작성일: 2026-02-08
> 버전: v2.0 (완전한 시장 분석 및 체크리스트)

---

## 📊 핵심 결론

### ⚠️ 시장 현실

**"완전한 올인원 아이소메트릭 다크 판타지 RPG 에셋 팩"은 존재하지 않습니다.**

```
필요한 에셋:
├── 5대 직업 캐릭터 (전사, 마법사, 도적, 성직자, 무도가)
├── 장비 착용 시스템 (착용 시 스프라이트 변경)
├── 스킬 애니메이션 (플라메라, 하이드, 큐로 등 30+ 스킬)
├── 몬스터 (1~5서클, 50+ 종류)
├── 맵/타일 (노비스~호러케슬)
├── 아이템 아이콘
└── BGM/SFX

시장 현실:
├── 캐릭터: 일부만 존재 (전사/궁수 위주)
├── 장비 시스템: 없음 (직접 구현 필요)
├── 스킬 애니메이션: 없음 (직접 제작 필요)
├── 몬스터: 일반 몬스터만 존재 (원작 아님)
└── 맵/타일: 일부 존재
```

### 🎯 해결책

| 옵션 | 설명 | 비용 | 난이도 | 추천 |
|------|------|------|--------|------|
| **A. 여러 에셋 조합** | 2-3개 에셋 섞어서 사용 | $20-50 | 중간 | ⭐⭐⭐ |
| **B. 무료 에셋 + 수정** | 무료 에셋 기반으로 커스터마이징 | $0 | 높음 | ⭐⭐⭐⭐ |
| **C. 커미션** | 아티스트에게 맞춤 의뢰 | $100-300 | 낮음 | ⭐⭐⭐⭐⭐ |
| **D. AI 생성 + 후보정** | AI로 생성 후 수동 수정 | $20-50 | 중간 | ⭐⭐⭐ |
| **E. 직접 제작** | Aseprite 등으로 직접 | 시간 | 매우 높음 | ⭐⭐ |

---

## 📋 상세 체크리스트: 무엇이 있고 무엇이 없는가

### 1. 캐릭터 스프라이트 (5대 직업)

#### ✅ 있는 것

| 에셋 | 직업 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **2D Isometric Fantasy Heroes** | Archer × 2, Warrior × 3 | [Unity](https://assetstore.unity.com/packages/2d/characters/2d-isometric-fantasy-heroes-sprites-x-9-animations-84772) | ~$10 | 마법사/도적/성직자/무도가 없음 |
| **GG Complete Isometric** | 12개 캐릭터 (미상세) | [itch.io](https://gamegland.itch.io/gg-complete-isometric-character-set) | $0-10 | 5대 직업 확인 필요 |
| **Character Creator 2D** | 커스터마이징 가능 | [itch.io](https://smallscaleint.itch.io/character-creator-2d-fantasy) | $15-25 | 직접 조합해야 함 |

#### ❌ 없는 것

- [ ] **전사 (Warrior)** - 일부 에셋에 존재하나 스타일 맞춤 필요
- [ ] **마법사 (Mage)** - 대부분의 에셋 팩에 없음
- [ ] **도적 (Rogue)** - 대부분의 에셋 팩에 없음
- [ ] **성직자 (Cleric)** - 대부분의 에셋 팩에 없음
- [ ] **무도가 (Monk)** - 전혀 없음 (동양 스타일이라서)
- [ ] **일관된 스타일** - 서로 다른 에셋을 섞어야 함

#### 🎨 필요한 사양

```
각 캐릭터별 필요:
├── 애니메이션: Idle, Walk, Attack, Hurt, Death (최소 5종)
├── 방향: 4방향 또는 8방향
├── 해상도: 32x32 ~ 64x64 픽셀
├── 뷰: 아이소메트릭 (2:1 비율)
└── 스타일: 다크 판타지 (어두운 색상 팔레트)
```

---

### 2. 장비 착용 시스템

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **Character Creator 2D** | 장비 커스터마이징 가능 | [itch.io](https://smallscaleint.itch.io/character-creator-2d-fantasy) | $15-25 | 직접 조합 필요 |
| **7Soul's RPG Graphics** | 헤드/바디 분리 | [itch.io](https://7soul.itch.io/7souls-rpg-graphics-sprites) | $6 | 탑다운 뷰, 아이소메트릭 아님 |

#### ❌ 없는 것

```
장비 착용 시스템 (장비에 따른 모션/스프라이트 변경):
├── [ ] 무기 착용 시 스프라이트 변경
│   ├── [ ] 검, 도끼, 창, 지팡이, 단검, 메이스, 권법
│   └── [ ] 착용 애니메이션 변경
├── [ ] 방어구 착용 시 스프라이트 변경
│   ├── [ ] 투구, 갑옷, 장갑, 신발
│   └── [ ] 착용 시 외관 변경
└── [ ] 장비별 고유 모션
    ├── [ ] 검: 베기 모션
    ├── [ ] 지팡이: 마법 시전 모션
    └── [ ] 맨손: 권법 모션
```

**결론**: 장비 착용 시스템을 제공하는 에셋은 **없음**. 직접 구현하거나 커미션 필요.

---

### 3. 스킬 애니메이션 (30+ 스킬)

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **일론 이펙트 팩** | 일반적인 이펙트 | Unity/itch.io | $10-30 | 원작 스킬이 아님 |
| **Particle packs** | 파티클 이펙트 | Unity Asset Store | $10-50 | 직접 조합 필요 |

#### ❌ 없는 것

```
원작 스킬 애니메이션:

전사 (Warrior):
├── [ ] 베기 (Slash)
├── [ ] 더블어택 (Double Attack)
├── [ ] 트리플어택 (Triple Attack)
├── [ ] 메가어택 (Mega Attack)
├── [ ] 돌진 (Charge)
├── [ ] 집중 (Focus)
├── [ ] 크래셔 (Crasher)
└── [ ] 레스큐 (Rescue)

마법사 (Mage):
├── [ ] 플라메라 (Flamera) - 화염
├── [ ] 테라미에라 (Teramiera) - 빙결
├── [ ] 프라보 (Pravo) - 저주
├── [ ] 플레어 (Flare) - 상위 화염
├── [ ] 아이스블러스트 (Ice Blast) - 상위 빙결
├── [ ] 프라베라 (Pravera) - 전체 저주
├── [ ] 라그나로크 (Ragnarok) - 전체 공격
├── [ ] 메테오 (Meteor) - 최강 마법
└── [ ] 매직프로텍션 (Magic Protection)

도적 (Rogue):
├── [ ] 슬래쉬 (Stab)
├── [ ] 하이드 (Hide) - 은신 이펙트
├── [ ] 습격 (Assault)
├── [ ] 백스텝 (Backstep)
└── [ ] 아무네지아 (Amnesia)

성직자 (Cleric):
├── [ ] 쿠로 (Kuro) - 힐링
├── [ ] 쿠라노 (Kurano) - 중급 힐링
├── [ ] 쿠라노소 (Kuranoso) - 고급 힐링
├── [ ] 쿠러스 (Kurus) - 그룹 힐
├── [ ] 이모탈 (Immortal) - 무적 이펙트
├── [ ] 디스펠라 (Dispella) - 디버프
├── [ ] 디베노모 (Divenomo) - 해독
└── [ ] 홀리볼트 (Holy Bolt)

무도가 (Monk):
├── [ ] 정권 (Jeongkwon)
├── [ ] 단각 (Dangak)
├── [ ] 양의신권 (Yangui)
├── [ ] 이형환위 (Ihyeong)
├── [ ] 금강불괴 (Geumgang) - 무적 이펙트
├── [ ] 장풍 (Jangpung) - 기탄 이펙트
├── [ ] 달마신공 (Dalma)
└── [ ] 쿠라노토 (Kuranoto) - 자가 힐
```

**결론**: 원작 스킬 애니메이션은 **전혀 없음**. 직접 제작하거나 일반 이펙트로 대체 필요.

---

### 4. 몬스터 스프라이트 (1~5서클)

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **8x8 Isometric TRPG** | 기본 몬스터 | [itch.io](https://gvituri.itch.io/isometric-trpg) | $0 | 원작 몬스터 아님 |
| **Tiny RPG Monsters** | 일반 몬스터 | [itch.io](https://ansimuz.itch.io/) | $0-10 | 원작 몬스터 아님 |
| **7Soul's RPG Graphics** | 34개 몬스터 | [itch.io](https://7soul.itch.io/7souls-rpg-graphics-sprites) | $6 | 탑다운 뷰 |
| **Dark Fantasy Monster Pack** | 다크 판타지 | [ArtStation](https://www.artstation.com/marketplace/p/OyyA1/dark-fantasy-monster-pack-a) | $20+ | 아이소메트릭 아닐 수 있음 |

#### ❌ 없는 것

```
원작 몬스터 (1~5서클):

1서클 (Lv 1~10) - 노비스 마을, 우드랜드:
├── [ ] 팜팻 (Pampat) - 풍차 돌리는 몬스터
├── [ ] 니에 (Nie) - 숲 기본 몬스터
├── [ ] 완두콩 (Pea/Wandu) - 숲 기본 몬스터
├── [ ] 맨티스 (Mantis) - 사마귀
├── [ ] 말벌 (Wasp)
├── [ ] 늑대 (Wolf)
├── [ ] 거미 (Spider)
├── [ ] 지네 (Centipede)
├── [ ] 주황쥐 (Orange Rat)
└── [ ] 큐르페이 (Curupay) - 우드랜드 보스

2서클 (Lv 11~40) - 피에트 마을, 포테의 숲:
├── [ ] 고블린병사 (Goblin Soldier)
├── [ ] 고블린전사 (Goblin Warrior)
├── [ ] 홉고블린 (Hobgoblin)
├── [ ] 늑대인간 (Werewolf)
├── [ ] 슈리커 (Shrieker)
├── [ ] 위스프 (Wisp)
└── [ ] 에인트 (Ent)

3서클 (Lv 41~70) - 아벨 마을, 아벨 던전:
├── [ ] 대게 (Giant Crab)
├── [ ] 바다마녀 (Sea Witch)
├── [ ] 스켈레톤워리어 (Skeleton Warrior)
├── [ ] 구울 (Ghoul)
├── [ ] 좀비나이트 (Zombie Knight)
└── [ ] 뱀파이어 (Vampire)

4서클 (Lv 71~98) - 뤼케시온:
├── [ ] 크라켄촉수 (Kraken Tentacle)
├── [ ] 씨서펀트 (Sea Serpent)
├── [ ] 가고일 (Gargoyle)
├── [ ] 리치 (Lich)
└── [ ] 듈라한 (Dullahan)

5서클 (Lv 99+) - 호러케슬:
├── [ ] 호랑나이트 (Horror Knight)
├── [ ] 블러드카운테스 (Blood Countess)
├── [ ] 대마법사 (Dark Archmage)
└── [ ] 드라큘라 (Dracula)
```

**결론**: 원작 몬스터는 **전혀 없음**. 대체용 일반 몬스터로 사용하거나 직접 제작 필요.

---

### 5. 맵/타일셋

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **Isometric Dark Fantasy 2D** | 던전, 숲, 마을 타일 700+ | [Unity](https://assetstore.unity.com/packages/2d/environments/isometric-dark-fantasy-227487) | $20+ | 캐릭터 없음 |
| **8x8 Isometric TRPG** | 기본 타일 | [itch.io](https://gvituri.itch.io/isometric-trpg) | $0 | 한정적 |
| **Fantasy Town 2D Isometric** | 마을 타일 | [Unity](https://assetstore.unity.com/packages/2d/environments/fantasy-town-2d-isometric-assets-126482) | $15+ | 마을만 |

#### ❌ 없는 것

```
원작 맵 (노비스~호러케슬):
├── [ ] 노비스 마을 + 우드랜드
├── [ ] 피에트 마을 + 포테의 숲
├── [ ] 아벨 마을 + 아벨 던전 + 아벨 해안
├── [ ] 뤼케시온 마을 + 뤼케시온 해안
└── [ ] 마인 마을 + 호러케슬

특정 타일:
├── [ ] 풍차 (팜팻 관련)
├── [ ] 던전 입구
├── [ ] 해안 타일
└── [ ] 성/성벽 타일
```

**결론**: 일반적인 다크 판타지 타일은 있지만 원작 맵은 **없음**. 조합해서 사용 가능.

---

### 6. 아이템 아이콘

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **RPG Icon Pack** | 112개 다크 판타지 아이템 | [itch.io](https://clockworkraven.itch.io/rpg-icon-pack-100-dark-fantasy-equipment) | $5-10 | 일반 아이템 |
| **Dark Fantasy Item Pack 2D** | 아이템, 무기, 장비 | [Unity](https://assetstore.unity.com/packages/2d/dark-fantasy-item-pack-275739) | $15 | 일반 아이템 |

#### ❌ 없는 것

```
원작 아이템:
├── [ ] 원작 무기 (각종 검, 지팡이 등)
├── [ ] 원작 방어구 (각종 갑옷, 투구 등)
├── [ ] 포션 (HP/MP 회복)
├── [ ] 스크롤 (스킬 스크롤)
└── [ ] 기타 소모품
```

**결론**: 일반 아이템 아이콘은 있지만 원작 아이템은 **없음**. 대체 가능.

---

### 7. UI/시스템

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **8x8 Isometric TRPG** | UI 프레임, 버튼 | [itch.io](https://gvituri.itch.io/isometric-trpg) | $0 | 기본적 |
| **Dark Fantasy UI Set** | UI 세트 | [ArtStation](https://www.artstation.com/marketplace/p/YMbpy/dark-fantasy-ui-set) | $10-20 | 일반적 |

#### ❌ 없는 것

```
전용 UI:
├── [ ] 어둠의전설 스타일 UI
├── [ ] 스킬 아이콘 (30+)
├── [ ] 상태 아이콘 (저주, 중독 등)
└── [ ] 서클 아이콘
```

**결론**: 일반 UI는 있지만 전용 UI는 **없음**. CSS로 대부분 구현 가능.

---

### 8. BGM/SFX

#### ✅ 있는 것

| 에셋 | 내용 | 링크 | 비용 | 한계 |
|------|------|------|------|------|
| **다양한 무료 팩** | BGM, SFX | itch.io, Freesound | $0-20 | 원작 아님 |

#### ❌ 없는 것

```
원작 사운드:
├── [ ] 원작 BGM (마을, 필드, 던전)
├── [ ] 원작 SFX (공격, 피격, 사망)
└── [ ] 스킬 시전 효과음
```

**결론**: 원작 사운드는 **없음**. 대체 가능.

---

## 📊 최종 요약: 무엇이 가능한가

### ✅ 구매 가능한 것

| 카테고리 | 가능 여부 | 추천 에셋 | 예상 비용 |
|----------|-----------|-----------|----------|
| 배경/타일 | ⭐⭐⭐⭐⭐ | Isometric Dark Fantasy 2D | $20 |
| 일반 캐릭터 (일부) | ⭐⭐⭐ | 2D Isometric Fantasy Heroes | $10 |
| 일반 몬스터 | ⭐⭐⭐ | 8x8 Isometric TRPG | $0 |
| 아이템 아이콘 | ⭐⭐⭐⭐ | RPG Icon Pack | $5-10 |
| UI | ⭐⭐⭐ | Dark Fantasy UI Set | $10 |

### ❌ 구매 불가능한 것 (직접 제작 필요)

| 카테고리 | 가능 여부 | 대안 |
|----------|-----------|------|
| 5대 직업 전체 | ⭐ | 에셋 조합 or 커미션 |
| 장비 착용 시스템 | ⭐ | 직접 구현 |
| 원작 스킬 애니메이션 | ⭐ | 일반 이펙트로 대체 |
| 원작 몬스터 | ⭐ | 일반 몬스터로 대체 |
| 원작 맵 | ⭐⭐ | 타일 조합 |
| 원작 사운드 | ⭐⭐ | 일반 사운드로 대체 |

---

## 🎯 추천 전략

### 전략 A: 에셋 조합 ($30-50)

```
1. Isometric Dark Fantasy 2D ($20)
   └── 배경, 타일

2. 2D Isometric Fantasy Heroes ($10)
   └── 전사/궁수 캐릭터

3. 8x8 Isometric TRPG ($0)
   └── 추가 몬스터, UI

4. Character Creator 2D ($15-25, 선택사항)
   └── 마법사/도적/성직자/무도가 생성
```

**장점**: 빠르게 시작 가능
**단점**: 스타일 불일치, 장비 시스템 직접 구현

### 전략 B: 무료 + 수정 ($0)

```
1. 8x8 Isometric TRPG (무료)
2. Kenney.nl 에셋 (무료)
3. CraftPix 무료 에셋 (무료)
4. 직접 색상 수정/조합
```

**장점**: 무료
**단점**: 시간 많이 소요, 품질 낮을 수 있음

### 전략 C: 커미션 ($100-300)

```
Fiverr/ArtStation/크몽에서 아티스트 의뢰:
├── 5대 직업 캐릭터 + 애니메이션
├── 장비 착용 시스템
├── 주요 스킬 이펙트
└── 기본 몬스터
```

**장점**: 완벽한 일관성, 원하는 스타일
**단점**: 비용, 시간 소요

### 전략 D: AI 생성 + 후보정 ($20-50)

```
1. DALL-E 3 / Midjourney로 스프라이트 생성
2. Aseprite로 후보정
3. 스프라이트 시트로 합치기
```

**장점**: 원하는 스타일, 무제한 생성
**단점**: 프레임 일관성 어려움, 후보정 시간 소요

---

## 🔗 전체 에셋 소스 목록

### Unity Asset Store

| 에셋 | 링크 | 비용 | 평가 |
|------|------|------|------|
| Isometric Dark Fantasy 2D | [링크](https://assetstore.unity.com/packages/2d/environments/isometric-dark-fantasy-227487) | $20+ | ⭐⭐⭐⭐ |
| 2D Isometric Fantasy Heroes | [링크](https://assetstore.unity.com/packages/2d/characters/2d-isometric-fantasy-heroes-sprites-x-9-animations-84772) | ~$10 | ⭐⭐⭐ |
| Fantasy Town 2D Isometric | [링크](https://assetstore.unity.com/packages/2d/environments/fantasy-town-2d-isometric-assets-126482) | $15+ | ⭐⭐⭐ |
| Dark Fantasy Item Pack 2D | [링크](https://assetstore.unity.com/packages/2d/dark-fantasy-item-pack-275739) | $15 | ⭐⭐⭐ |

### itch.io

| 에셋 | 링크 | 비용 | 평가 |
|------|------|------|------|
| 8x8 Isometric TRPG | [링크](https://gvituri.itch.io/isometric-trpg) | $0 | ⭐⭐⭐⭐⭐ |
| GG Complete Isometric | [링크](https://gamegland.itch.io/gg-complete-isometric-character-set) | $0-10 | ⭐⭐⭐⭐ |
| Character Creator 2D Fantasy | [링크](https://smallscaleint.itch.io/character-creator-2d-fantasy) | $15-25 | ⭐⭐⭐⭐ |
| 7Soul's RPG Graphics | [링크](https://7soul.itch.io/7souls-rpg-graphics-sprites) | $6 | ⭐⭐⭐ |
| RPG Icon Pack (Dark Fantasy) | [링크](https://clockworkraven.itch.io/rpg-icon-pack-100-dark-fantasy-equipment) | $5-10 | ⭐⭐⭐⭐ |

### 기타 소스

| 소스 | 링크 | 특징 |
|------|------|------|
| Kenney.nl | [링크](https://kenney.nl/assets) | CC0 무료 |
| OpenGameArt.org | [링크](https://opengameart.org) | CC0/CC-BY |
| CraftPix.net | [링크](https://craftpix.net/freebies/) | 일부 무료 |
| Ansimuz itch.io | [링크](https://ansimuz.itch.io/) | 일부 무료 |

---

## 📄 라이선스 참고사항

### CC0 (Public Domain)
- 상업적 이용 가능
- 저작권 표시 불필요
- 수정 가능
- **추천**: 가장 자유로운 라이선스

### CC-BY-SA 3.0
- 상업적 이용 가능
- 저작권 표시 필수
- 동일 조건으로 공유 의무
- **주의**: 프로젝트 전체에 영향

### Unity Asset Store
- 구매한 에셋은 상업적 이용 가능
- 재판매 불가
- **추천**: 안전한 상용 라이선스

---

## 🚀 다음 단계

### 즉시 실행 가능:

1. **전략 선택**:
   - [ ] 전략 A: 에셋 조합 ($30-50)
   - [ ] 전략 B: 무료 + 수정 ($0)
   - [ ] 전략 C: 커미션 ($100-300)
   - [ ] 전략 D: AI 생성 + 후보정 ($20-50)

2. **에셋 다운로드**:
   - [ ] 선택한 에셋 다운로드
   - [ ] `public/assets/` 폴더에 구조화

3. **통합**:
   - [ ] BootScene.ts에서 로딩
   - [ ] 스프라이트 시트 설정
   - [ ] 애니메이션 정의

4. **테스트**:
   - [ ] 캐릭터 애니메이션 테스트
   - [ ] 맵 렌더링 테스트
   - [ ] 스킬 시전 테스트

---

**작성자**: Claude (AI Assistant)
**프로젝트**: 어둠의전설 클래식 (Dark Legend Classic)
**마지막 업데이트**: 2026-02-08 (v2.0 - 완전한 시장 분석)
