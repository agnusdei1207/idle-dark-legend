# 🏰 어둠의전설 클래식 - 웹 기반 리메이크 프로젝트 계획서

> **프로젝트명**: Dark Legend Classic Web  
> **목표**: 1997년 어둠의전설 최초 버전의 핵심 게임플레이를 현대 웹 기술로 재현  
> **성격**: 비공식 개인 팬 프로젝트 (헌정/오마주 작품)

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [원작 게임 분석](#2-원작-게임-분석)
3. [기술 스택 선정](#3-기술-스택-선정)
4. [에셋 확보 전략](#4-에셋-확보-전략)
5. [법적 고려사항](#5-법적-고려사항)
6. [개발 로드맵](#6-개발-로드맵)
7. [프로젝트 구조](#7-프로젝트-구조)
8. [참고 자료](#8-참고-자료)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목표

| 항목 | 설명 |
|------|------|
| **핵심 목표** | 1997~1998년 어둠의전설 초기 버전의 게임 경험을 웹에서 재현 |
| **타겟 플랫폼** | 웹 브라우저 (Desktop + Mobile 반응형) |
| **게임 타입** | 싱글플레이 / 로컬 멀티플레이 기반 (서버 없이 동작 가능) |
| **법적 성격** | **비공식** 팬 헌정작 - 원작 에셋 미사용, 자체 제작 에셋 사용 |

### 1.2 왜 웹 기반인가?

```
✅ 설치 불필요 - 브라우저만 있으면 즉시 플레이
✅ 크로스 플랫폼 - Windows, Mac, Linux, 모바일 모두 지원
✅ 배포 용이 - GitHub Pages 등으로 무료 호스팅 가능
✅ 오픈소스 친화적 - 코드 공개 및 커뮤니티 참여 용이
✅ 클래식 게임에 적합 - 2D 쿼터뷰 RPG는 웹에서 충분히 구현 가능
```

---

## 2. 원작 게임 분석

### 2.1 어둠의전설 기본 정보

| 항목 | 내용 |
|------|------|
| **개발사** | 넥슨 |
| **출시일** | 1997년 10월 오픈베타, 1998년 1월 정식 서비스 |
| **장르** | MMORPG (쿼터뷰/아이소메트릭) |
| **해외명** | Dark Ages (북미) |
| **특징** | 한국 최초의 쿼터뷰 온라인 RPG |

### 2.2 재현할 핵심 게임 메카닉

```
┌─────────────────────────────────────────────────────────────┐
│  🎮 핵심 게임플레이 요소 (클래식 버전 기준)                    │
├─────────────────────────────────────────────────────────────┤
│  1. 쿼터뷰(Isometric) 시점 렌더링                            │
│  2. 4방향/8방향 캐릭터 이동                                   │
│  3. 실시간 전투 시스템                                        │
│  4. 속성 시스템 (물/땅/바람/불/빛/어둠)                       │
│  5. 스킬 & 마법 시스템                                        │
│  6. 장비 시스템 (무기, 방어구, 악세서리)                      │
│  7. 레벨업 & 스탯 성장                                        │
│  8. NPC 상호작용 & 퀘스트                                     │
│  9. 인벤토리 관리                                             │
│ 10. 타일맵 기반 맵 구성                                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 비재현 요소 (MVP 범위 외)

- ❌ 서버 기반 멀티플레이어
- ❌ 길드/클랜 시스템
- ❌ 유료 아이템 시스템
- ❌ PvP 시스템 (초기 버전)
- ❌ 반혼의 결서 (싱글플레이 튜토리얼)

---

## 3. 기술 스택 선정

### 3.1 게임 엔진/프레임워크 비교

| 엔진/프레임워크 | 아이소메트릭 지원 | 학습 곡선 | 브라우저 성능 | 커뮤니티 | 평가 |
|----------------|------------------|----------|--------------|---------|------|
| **Phaser 3** | ✅ 네이티브 지원 (v3.50+) | 낮음 | 우수 | 매우 활발 | ⭐ **1순위** |
| PixiJS | ⚠️ 직접 구현 필요 | 중간 | 최고 | 활발 | 2순위 |
| Godot (WebGL) | ✅ 지원 | 중간 | 양호 | 활발 | 3순위 |
| Unity WebGL | ✅ 지원 | 높음 | 무거움 | 매우 활발 | 비추천 |
| Construct 3 | ⚠️ 플러그인 필요 | 매우 낮음 | 양호 | 보통 | 간단한 프로토타입용 |

### 3.2 ⭐ 추천 기술 스택: Phaser 3

```
┌────────────────────────────────────────────────────────────────┐
│                    🏆 최종 추천 스택                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🎮 게임 엔진    : Phaser 3.60+                                │
│  📝 언어         : TypeScript                                  │
│  📦 빌드 도구    : Vite                                        │
│  🎨 그래픽       : WebGL (Canvas fallback)                     │
│  📊 맵 에디터    : Tiled Map Editor (무료)                     │
│  🔊 오디오       : Phaser Sound Manager + Howler.js           │
│  💾 저장         : LocalStorage / IndexedDB                    │
│  🌐 배포         : GitHub Pages / Vercel / Netlify            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3.3 왜 Phaser 3인가?

```javascript
// Phaser 3.50+부터 아이소메트릭 타일맵 네이티브 지원
const map = this.make.tilemap({ key: 'dungeon' });
const tileset = map.addTilesetImage('dungeon-tiles');

// 아이소메트릭 레이어 생성 - 내장 기능!
const layer = map.createLayer('ground', tileset, 0, 0);
layer.setDepth(0); // 깊이 정렬 자동 지원
```

**Phaser 3 선택 이유:**
1. ✅ 아이소메트릭 타일맵 **네이티브 지원** (v3.50+)
2. ✅ 깊이 정렬(Depth Sorting) 내장
3. ✅ 풍부한 [공식 문서](https://phaser.io/learn)와 예제
4. ✅ Tiled 맵 에디터와 완벽 호환
5. ✅ 모바일 터치 입력 지원
6. ✅ MIT 라이선스 (상업적 사용 가능)

### 3.4 프로젝트 초기화 명령어

```bash
# Vite + Phaser 템플릿으로 프로젝트 생성
npm create vite@latest dark-legend-classic -- --template vanilla-ts

cd dark-legend-classic

# Phaser 설치
npm install phaser

# 추가 유틸리티
npm install howler       # 고급 오디오 관리
npm install @types/howler # TypeScript 타입

# 개발 서버 시작
npm run dev
```

### 3.5 반응형 설계

```typescript
// 반응형 게임 캔버스 설정
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,      // 화면에 맞춤
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1920,
      height: 1080
    }
  },
  // 모바일 가상 패드 지원
  input: {
    activePointers: 3,
    touch: true
  }
};
```

---

## 4. 에셋 확보 전략

### 4.1 ⚠️ 핵심 원칙: 원작 에셋 사용 금지

```
🚫 사용 금지 (저작권 침해 위험)
├── 원작 게임 스프라이트 추출
├── 원작 게임 음악/효과음 사용
├── 원작 게임 맵 데이터 복사
└── 리버스 엔지니어링으로 얻은 자산

✅ 안전한 방법
├── 상업용 무료 에셋 사용 (CC0, CC-BY, CC-BY-SA)
├── 직접 제작
├── 커미션 의뢰
└── 오픈소스 게임 에셋 활용
```

### 4.2 무료 에셋 소스 (상업적 사용 가능)

#### 🎨 그래픽 에셋

| 사이트 | 특징 | 라이선스 | 추천도 |
|--------|------|----------|--------|
| **[itch.io/game-assets](https://itch.io/game-assets/free/tag-isometric)** | 아이소메트릭 에셋 풍부 | 다양함 (확인 필수) | ⭐⭐⭐⭐⭐ |
| **[OpenGameArt.org](https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=9&field_art_type_tid%5B%5D=10&keys=isometric)** | 클래식 RPG 스타일 다수 | CC0, CC-BY, OGA-BY | ⭐⭐⭐⭐⭐ |
| **[Kenney.nl](https://kenney.nl/assets)** | 고품질 무료 에셋 | CC0 (Public Domain) | ⭐⭐⭐⭐ |
| [CraftPix](https://craftpix.net/freebies/) | 2D 게임 에셋 | 무료/유료 혼합 | ⭐⭐⭐ |
| [Game-Icons.net](https://game-icons.net/) | 아이콘/UI 요소 | CC-BY 3.0 | ⭐⭐⭐⭐ |

#### 🎵 오디오 에셋

| 사이트 | 특징 | 라이선스 | 추천도 |
|--------|------|----------|--------|
| **[OpenGameArt.org (Audio)](https://opengameart.org/art-search-advanced?field_art_type_tid%5B%5D=12&field_art_type_tid%5B%5D=13)** | BGM + 효과음 | CC0, CC-BY | ⭐⭐⭐⭐⭐ |
| **[Freesound.org](https://freesound.org/)** | 효과음 특화 | CC0, CC-BY (확인 필수) | ⭐⭐⭐⭐ |
| [ZapSplat](https://www.zapsplat.com/) | 효과음 다양 | 무료 (회원가입) | ⭐⭐⭐ |
| [Incompetech](https://incompetech.com/music/) | BGM 전문 (Kevin MacLeod) | CC-BY 3.0 | ⭐⭐⭐⭐ |

### 4.3 추천 에셋 팩 (어둠의전설 스타일 재현)

```
📦 추천 아이소메트릭 RPG 에셋 조합

1. 캐릭터 스프라이트
   └── "2D Pixel Art - Isometric Blocks" by DevilsWork.shop (itch.io)
       └── CC-BY 4.0 라이선스, 700+ 무료 에셋

2. 타일셋 (맵)
   └── OpenGameArt "Isometric 64x64 Outside Tileset" 
   └── Kenney "Isometric Tiles"

3. UI 요소
   └── Game-Icons.net (아이콘)
   └── OpenGameArt "Fantasy GUI" 팩

4. 효과음/BGM
   └── OpenGameArt "RPG Sound Pack"
   └── Incompetech (Kevin MacLeod BGM)
```

### 4.4 직접 제작 가이드

도구 추천:
- **픽셀아트**: [Aseprite](https://www.aseprite.org/) (유료, $19.99) 또는 [Piskel](https://www.piskelapp.com/) (무료 웹)
- **맵 제작**: [Tiled Map Editor](https://www.mapeditor.org/) (무료)
- **음악**: [LMMS](https://lmms.io/) 또는 [BeepBox](https://www.beepbox.co/) (무료)

---

## 5. 법적 고려사항

### 5.1 ⚠️ 저작권 위험 요소

```
┌─────────────────────────────────────────────────────────────┐
│  🚨 법적 위험 등급별 행위                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 고위험 (절대 금지)                                        │
│  ├── 원작 그래픽/음악 파일 직접 사용                          │
│  ├── 원작 클라이언트 리버스 엔지니어링                        │
│  ├── "어둠의전설" 상표 사용 (게임명, 도메인 등)               │
│  └── 사설 서버 운영                                          │
│                                                             │
│  🟡 중위험 (주의 필요)                                        │
│  ├── 원작과 동일한 캐릭터/NPC 이름 사용                       │
│  ├── 원작 스토리/세계관 그대로 복제                           │
│  └── "넥슨" 언급하여 공식인 것처럼 오해 유발                  │
│                                                             │
│  🟢 저위험 (안전한 영역)                                      │
│  ├── 게임 메카닉/규칙 참고 (저작권 보호 대상 아님)            │
│  ├── "클래식 MMORPG에서 영감받은" 표현 사용                   │
│  ├── 완전히 새로운 에셋으로 유사 장르 게임 개발               │
│  └── 오픈소스 라이선스 에셋 사용                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 안전한 프로젝트 명명

```
❌ 피해야 할 이름
├── "어둠의전설 클래식"
├── "Dark Ages Revival"
├── "Nexon Classic RPG"
└── 원작 연상시키는 직접적 명칭

✅ 권장하는 이름
├── "Shadow Realm Tribute"
├── "Legends of Twilight"
├── "Classic Isometric RPG"
└── 독창적인 신규 타이틀
```

### 5.3 면책 조항 템플릿

프로젝트에 반드시 포함할 내용:

```markdown
## ⚖️ Legal Disclaimer / 법적 고지

This is an **unofficial fan project** created for educational and 
nostalgic purposes. This project is NOT affiliated with, endorsed by, 
or connected to Nexon Corporation or any of its subsidiaries.

본 프로젝트는 **비공식 개인 팬 프로젝트**로, 교육 및 향수 목적으로 제작되었습니다.
넥슨 또는 관련 자회사와 어떠한 연관도 없으며, 공식 승인을 받지 않았습니다.

All assets used are either:
- Original creations
- Licensed under open-source licenses (CC0, CC-BY, CC-BY-SA, etc.)
- Properly attributed to their creators

사용된 모든 에셋은 자체 제작되었거나, 오픈소스 라이선스 하에 사용되었습니다.

This project generates NO revenue and is distributed free of charge.
본 프로젝트는 수익을 창출하지 않으며, 무료로 배포됩니다.
```

### 5.4 참고: 성공적인 팬 프로젝트 사례

| 프로젝트 | 원작 | 상태 | 접근 방식 |
|---------|------|------|----------|
| [Kaetram](https://github.com/Kaetram/Kaetram-Open) | BrowserQuest | ✅ 운영 중 | MIT 라이선스 포크 |
| [Open RSC](https://rsc.vet/) | RuneScape Classic | ✅ 운영 중 | 완전 새 코드베이스 |
| [Argentum Online](https://www.comunidadargentum.com/) | - | ✅ 운영 중 | 처음부터 독자 개발 |

---

## 6. 개발 로드맵

### 6.1 전체 일정 (예상 6~12개월)

```
Phase 1: Foundation (기반 구축)           [1-2개월]
├── 프로젝트 세팅 & 아키텍처 설계
├── 기본 렌더링 시스템 구현
├── 아이소메트릭 타일맵 로딩
└── 카메라 시스템

Phase 2: Core Mechanics (핵심 메카닉)     [2-3개월]
├── 캐릭터 이동 & 애니메이션
├── NPC 시스템
├── 기본 전투 시스템
├── 인벤토리 UI
└── 대화 시스템

Phase 3: Content & Systems (콘텐츠)       [2-3개월]
├── 스킬 & 마법 시스템
├── 장비 시스템
├── 레벨업 & 스탯
├── 퀘스트 시스템
└── 저장/불러오기

Phase 4: Polish (마무리)                   [1-2개월]
├── 반응형 UI 최적화
├── 모바일 터치 컨트롤
├── 성능 최적화
├── 버그 수정
└── 배포 & 문서화
```

### 6.2 Phase 1 상세: 기반 구축

```
Week 1-2: 프로젝트 설정
├── [ ] Vite + TypeScript + Phaser 3 환경 구축
├── [ ] 폴더 구조 설계
├── [ ] ESLint, Prettier 설정
└── [ ] GitHub 저장소 생성

Week 3-4: 렌더링 기반
├── [ ] Game Scene 기본 구조
├── [ ] 아이소메트릭 타일맵 로딩 (Tiled 연동)
├── [ ] 깊이 정렬(Depth Sorting) 구현
└── [ ] 카메라 팔로우 시스템

Week 5-6: 에셋 통합
├── [ ] 타일셋 통합
├── [ ] 캐릭터 스프라이트 시트 로딩
├── [ ] 기본 애니메이션 테스트
└── [ ] 맵 프로토타입 1개 완성
```

---

## 7. 프로젝트 구조

### 7.1 권장 폴더 구조

```
dark-legend-classic/
├── public/
│   └── assets/
│       ├── sprites/           # 캐릭터, NPC, 몬스터
│       ├── tilesets/          # 타일맵 이미지
│       ├── maps/              # Tiled JSON 파일
│       ├── ui/                # UI 요소
│       ├── audio/
│       │   ├── bgm/          # 배경 음악
│       │   └── sfx/          # 효과음
│       └── fonts/
├── src/
│   ├── main.ts               # 엔트리 포인트
│   ├── config/
│   │   └── game.config.ts    # Phaser 설정
│   ├── scenes/
│   │   ├── BootScene.ts      # 에셋 로딩
│   │   ├── MenuScene.ts      # 메인 메뉴
│   │   ├── GameScene.ts      # 메인 게임
│   │   └── UIScene.ts        # HUD 오버레이
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   └── Monster.ts
│   ├── systems/
│   │   ├── InputManager.ts
│   │   ├── CombatSystem.ts
│   │   ├── InventorySystem.ts
│   │   └── QuestSystem.ts
│   ├── ui/
│   │   ├── InventoryUI.ts
│   │   ├── DialogUI.ts
│   │   └── StatusBar.ts
│   └── utils/
│       ├── isometric.ts      # 좌표 변환 유틸
│       └── constants.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE                   # MIT 권장
└── README.md
```

### 7.2 핵심 코드 예시

```typescript
// src/utils/isometric.ts
// 아이소메트릭 좌표 변환 유틸리티

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

/**
 * 월드 좌표를 아이소메트릭 화면 좌표로 변환
 */
export function worldToScreen(x: number, y: number): { screenX: number; screenY: number } {
  return {
    screenX: (x - y) * (TILE_WIDTH / 2),
    screenY: (x + y) * (TILE_HEIGHT / 2)
  };
}

/**
 * 화면 좌표를 월드 좌표로 변환
 */
export function screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
  return {
    x: (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2,
    y: (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2
  };
}
```

---

## 8. 참고 자료

### 8.1 학습 자료

| 주제 | 링크 |
|------|------|
| Phaser 3 공식 문서 | https://phaser.io/learn |
| Phaser 3 아이소메트릭 예제 | https://phaser.io/examples/v3/view/isometric |
| Tiled Map Editor 튜토리얼 | https://doc.mapeditor.org/en/stable/manual/introduction/ |
| 아이소메트릭 게임 개발 가이드 | https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-a-primer-for-game-developers--gamedev-6511 |

### 8.2 오픈소스 참고 프로젝트

| 프로젝트 | 설명 | 링크 |
|---------|------|------|
| **Kaetram** | BrowserQuest 포크, 활발한 개발 | https://github.com/Kaetram/Kaetram-Open |
| **BrowserQuest** | Mozilla의 HTML5 MMORPG 데모 | https://github.com/mozilla/BrowserQuest |
| **Phaser RPG Tutorial** | Phaser 3 RPG 튜토리얼 | https://github.com/phaserjs/examples |

### 8.3 에셋 출처 문서화

**중요**: 사용하는 모든 에셋의 출처와 라이선스를 반드시 기록하세요.

```markdown
# CREDITS.md 예시

## Graphics

### Character Sprites
- Source: [Asset Name] by [Creator]
- License: CC-BY 4.0
- URL: https://example.com/asset

### Tileset
- Source: [Asset Name] by [Creator]
- License: CC0 (Public Domain)
- URL: https://opengameart.org/...

## Audio

### BGM
- "Track Name" by Kevin MacLeod
- License: CC-BY 3.0
- URL: https://incompetech.com/...
```

---

## 📝 체크리스트

### 시작 전 확인사항

- [ ] 게임명 결정 (원작 연상 피하기)
- [ ] GitHub 저장소 생성
- [ ] 라이선스 선택 (MIT 권장)
- [ ] 면책 조항 작성

### 에셋 확보

- [ ] 캐릭터 스프라이트 확보 (라이선스 확인)
- [ ] 타일셋 확보 (라이선스 확인)
- [ ] UI 에셋 확보
- [ ] BGM/효과음 확보
- [ ] CREDITS.md 작성

### 개발 환경

- [ ] Node.js 설치
- [ ] Vite + Phaser 프로젝트 생성
- [ ] Tiled Map Editor 설치
- [ ] 에셋 제작 도구 설치 (Aseprite/Piskel)

---

## 🎯 결론

**"어둠의전설 클래식" 웹 재현 프로젝트는 기술적으로 충분히 가능합니다.**

핵심 성공 요소:
1. **Phaser 3** - 아이소메트릭 네이티브 지원, 학습 곡선 낮음
2. **오리지널 에셋 사용** - 법적 리스크 최소화
3. **싱글플레이 MVP** - 복잡한 서버 인프라 불필요
4. **오픈소스 접근** - 커뮤니티 협력 가능

**주의사항**: 원작의 정체성을 존중하되, 모든 에셋과 이름은 새롭게 만들어 법적 문제를 피하세요. 이 프로젝트는 "어둠의전설에서 영감받은 새로운 게임"이어야 합니다.

---

*마지막 업데이트: 2026-02-08*  
*문서 버전: 1.0*
