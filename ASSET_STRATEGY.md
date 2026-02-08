# 어둠의전설 클래식 - 에셋 전략 가이드

> **일관성 있는 다크 판타지 아이소메트릭 에셋 확보 전략**
> 작성일: 2026-02-08
> 버전: v1.0

---

## 📊 요약

어둠의전설 클래식의 다크 판타지 분위기를 재현하기 위해, 아래 세 가지 전략 중 하나를 선택하여 에셋을 확보할 수 있습니다.

| 전략 | 비용 | 일관성 | 추천 대상 |
|------|------|--------|-----------|
| **A. Unity Asset Store** | $30-50 | ⭐⭐⭐⭐⭐ | 빠른 개발, 높은 품질 |
| **B. itch.io 무료 팩** | $0 | ⭐⭐⭐ | 예산 제한, 오픈소스 |
| **C. 혼합 전략** | $10-20 | ⭐⭐⭐⭐ | 균형 접근 |

---

## 🎯 추천 전략 A: Unity Asset Store (최우선)

### 장점
- ✅ 완성도 높은 아이소메트릭 스타일
- ✅ 애니메이션 포함 (이동, 공격, 사망 등)
- ✅ 일관적인 아트 스타일
- ✅ 상용 프로젝트 사용 가능

### 추천 에셋 팩

#### 1. 2D Isometric Fantasy Heroes Sprites x 9 Animations ($10)
- **링크**: [Unity Asset Store](https://assetstore.unity.com/packages/2d/characters/2d-isometric-fantasy-heroes-sprites-x-9-animations-256051)
- **내용**: 전사, 마법사, 도적 등 판타지 캐릭터 스프라이트
- **애니메이션**: 9가지 (Idle, Walk, Attack, Hurt, Death 등)
- **해상도**: 64x64 픽셀

#### 2. Isometric Dark Fantasy 2D Environments ($20+)
- **링크**: [Unity Asset Store](https://assetstore.unity.com/packages/2d/environments/isometric-dark-fantasy-227487)
- **내용**: 다크 판타지 배경, 타일셋
- **특징**: 던전, 숲, 마을 타일
- **출시**: 2022년 8월

#### 3. Dark Fantasy Item Pack 2D ($15)
- **링크**: [Unity Asset Store](https://assetstore.unity.com/packages/2d/dark-fantasy-item-pack-275739)
- **내용**: 아이템, 무기, 장비 아이콘
- **스타일**: 다크 판타지

**총 예상 비용**: $45-50 USD

---

## 🆓 무료 전략 B: itch.io + OpenGameArt

### 장점
- ✅ 무료 (CC0 라이선스)
- ✅ 상업적 이용 가능
- ✅ 오픈소스 친화적

### 추천 무료 에셋

#### 1. [8x8] Isometric TRPG Asset Pack by Gustavo Vituri
- **링크**: https://gvituri.itch.io/isometric-trpg
- **라이선스**: CC0 (완전 무료)
- **내용**: 타일, 캐릭터, 적, UI 포함
- **특징**: 가장 완성도 높은 무료 아이소메트릭 팩

#### 2. Kenney.nl Roguelike Characters
- **링크**: https://kenney.nl/assets/roguelike-characters
- **라이선스**: CC0
- **내용**: 450+ 캐릭터 스프라이트
- **단점**: 탑다운 뷰 (아이소메트릭 아님)

#### 3. Liberated Pixel Cup (LPC) Assets
- **링크**: https://opengameart.org/content/lpc-base-assets
- **라이선스**: CC-BY-SA 3.0
- **내용**: 캐릭터, 타일, 아이템
- **특징**: 널리 사용되는 오픈소스 스타일

#### 4. Ansimuz Free Assets
- **링크**: https://ansimuz.itch.io/
- **무료 팩**:
  - Warped Caves Pixel Art Pack (CC0)
  - Sunny Land 2D Pixel Art Pack (CC0)
  - Tiny RPG Monsters Pack (부분 무료)

**총 비용**: $0

---

## ⚖️ 혼합 전략 C: 유료 + 무료 조합

### 추천 조합

#### 캐릭터: Unity Asset Store ($10)
- **2D Isometric Fantasy Heroes Sprites**로 5대 직업 커버
- 고품질 애니메이션 보장

#### 몬스터: 무료 에셋
- Ansimuz **Tiny RPG Monsters Pack** (itch.io)
- OpenGameArt.org 몬스터 컬렉션

#### 배경/타일: 무료 에셋
- Gustavo Vituri **Isometric TRPG Asset Pack** (itch.io)
- Kenney.nl **Isometric Prototypes Tiles**

#### 아이템/UI: 직접 제작
- 아이템 아이콘은 16x16으로 직접 제작 가능
- UI는 CSS로 대부분 구현됨

**총 예상 비용**: $10-20 USD

---

## 🎨 어둠의전설 스타일 가이드

### 색상 팔레트
어둠의전설의 특징적인 어두운 분위기를 위해:

```css
/* 다크 판타지 기본 색상 */
--color-dark-bg: #1a1a2e;
--color-dark-ground: #16213e;
--color-dungeon-wall: #0f0f23;
--color-highlight: #e94560;
--color-text: #e0e0e0;

/* 직업별 강조색 */
--color-warrior: #c0392b;    /* 붉은색 */
--color-mage: #2980b9;       /* 파란색 */
--color-rogue: #27ae60;      /* 초록색 */
--color-cleric: #f39c12;     /* 금색 */
--color-monk: #8e44ad;       /* 보라색 */
```

### 스타일 요구사항
- **뷰**: 아이소메트릭 (2:1 비율)
- **크기**: 캐릭터 32x32 ~ 64x64 픽셀
- **애니메이션**:
  - Idle (대기)
  - Walk (이동 - 4방향)
  - Attack (공격)
  - Hurt (피격)
  - Death (사망)

---

## 📋 에셋 체크리스트

### 필수 에셋 (최우선)
- [ ] **캐릭터 스프라이트** (5개 직업)
  - [ ] 전사 (Warrior)
  - [ ] 마법사 (Mage)
  - [ ] 도적 (Rogue)
  - [ ] 성직자 (Cleric)
  - [ ] 무도가 (Monk)

- [ ] **몬스터 스프라이트** (1서클 우선)
  - [ ] 팜팻, 니에, 완두콩, 맨티스, 말벌
  - [ ] 늑대, 거미, 지네, 주황쥐
  - [ ] 큐르페이 (보스)

- [ ] **타일셋**
  - [ ] 잔디, 흙, 돌 바닥
  - [ ] 벽, 벽돌
  - [ ] 나무, 바위
  - [ ] 물 타일

### 중요 에셋 (2단계)
- [ ] **NPC 스프라이트** (14개)
- [ ] **아이템 아이콘**
  - [ ] 무기, 방어구
  - [ ] 포션, 스크롤
- [ ] **스킬 아이콘** (30+)

### 추가 에셋 (3단계)
- [ ] **사운드 이펙트**
  - [ ] 공격, 피격, 사망
  - [ ] 스킬 시전
- [ ] **배경 음악**
  - [ ] 마을, 필드, 던전

---

## 🔗 추천 에셋 소스 정리

### 유료 에셋 스토어
| 소스 | 링크 | 특징 |
|------|------|------|
| Unity Asset Store | https://assetstore.unity.com | 최고 품질, 유료 |
| CraftPix.net | https://craftpix.net | 중간 가격, 고품질 |
| GameArt2D.com | https://www.gameart2d.com | 다양한 스타일 |

### 무료 에셋 스토어
| 소스 | 링크 | 라이선스 |
|------|------|----------|
| itch.io (무료) | https://itch.io/game-assets/free | 다양함 |
| OpenGameArt.org | https://opengameart.org | CC0/CC-BY |
| Kenney.nl | https://kenney.nl/assets | CC0 |
| Ansimuz itch.io | https://ansimuz.itch.io | 일부 CC0 |

---

## 📝 최종 권장사항

### 빠른 개발을 원할 경우
**Unity Asset Store + 무료 배경**
- 캐릭터: "2D Isometric Fantasy Heroes" ($10)
- 배경: itch.io 무료 팩
- **총비용**: $10

### 완전한 무료 옵션
**itch.io [8x8] Isometric TRPG Asset Pack**
- Gustavo Vituri 팩 사용
- 필요시 추가 무료 에셋 보완
- **총비용**: $0

---

## 🚀 다음 단계

1. **에셋 결정**: 위 전략 중 하나 선택
2. **다운로드**: 에셋 파일 획득
3. **변환**: 필요시 PNG → 최적화
4. **통합**: `public/assets/` 폴더에 구조화
5. **코드 연동**: `BootScene.ts`에서 로딩

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

**작성자**: Claude (AI Assistant)
**프로젝트**: 어둠의전설 클래식 (Dark Legend Classic)
**마지막 업데이트**: 2026-02-08
