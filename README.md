# 🎮 Idle 어둠의전설 클래식

> **방치형 RPG** - 어둠의전설 향수 + 현대 Idle 게임  
> Phaser 3 + TypeScript + Vite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Assets: CC0](https://img.shields.io/badge/Assets-CC0-green.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

---

## ✨ 특징

### 🎯 Idle/방치형 RPG
- **자동 사냥**: 클릭 없이 자동으로 몬스터 사냥
- **오프라인 보상**: 최대 8시간 오프라인 사냥 보상
- **효율적 성장**: 사냥터별 최적 레벨 추천

### 🗺️ 어둠의전설 원작 사냥터

| 써클 | 레벨 | 대표 사냥터 |
|------|------|------------|
| 1써클 | 1~10 | 노비스 던전, 우드랜드 |
| 2써클 | 11~40 | 포테의 숲, 피에트 던전 |
| 3써클 | 41~70 | 아벨 해안던전, 아벨 던전 |
| 4써클 | 71~98 | 뤼케시온 해안, 난파선 |
| 5써클 | 99+ | 호러캐슬, 베크나 탑 |

### ⚔️ 직업 시스템
- **4대 기본 직업**: 전사, 마법사, 궁수, 도적
- **8개 전직**: 버서커, 팔라딘, 아크메이지, 네크로맨서 등
- **스킬 트리**: 독자적 스킬 성장

### 👥 소셜 시스템
- **파티**: 최대 6인 파티
- **서클(길드)**: 생성, 가입, 등급, 버프

### 🎨 클래식 UI
- 어둠의전설 스타일 다크 테마
- 클래식 HUD (초상화, HP/MP바, 미니맵)
- 레트로 감성 + 현대적 UX

---

## 🚀 시작하기

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/agnusdei1207/idle-dark-legend.git
cd idle-dark-legend

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 🎮 조작법

| 키 | 기능 |
|----|------|
| `I` | 인벤토리 |
| `C` | 캐릭터 정보 |
| `K` | 스킬 트리 |
| `Q` | 퀘스트 로그 |
| `G` | 서클 (길드) |
| `H` | 사냥터 선택 |
| `Space` | NPC 대화 |
| `ESC` | 창 닫기/메뉴 |

---

## 🎨 에셋

### 사용 에셋 팩

#### Ninja Adventure Asset Pack ⭐ (메인)

| 항목 | 정보 |
|------|------|
| **제작자** | pixel-boy (Antoine Duroisin) |
| **라이선스** | CC0 (완전 무료, 상업용 가능) |
| **URL** | https://pixel-boy.itch.io/ninja-adventure-asset-pack |

**포함 내용:**
- 캐릭터 50종+ (애니메이션)
- 몬스터 30종+ (애니메이션)
- 보스 9종
- 타일셋, UI, BGM 37곡, SFX 100+, 이펙트 30+

#### OpenGameArt CC0 RPG SFX (보조)

| 항목 | 정보 |
|------|------|
| **라이선스** | CC0 |
| **URL** | https://opengameart.org/content/80-cc0-rpg-sfx |

**포함 내용:**
- 스킬 효과음 80종+

### 에셋 다운로드 및 설정

자세한 내용은 [ASSET_GUIDE.md](docs/ASSET_GUIDE.md) 참조

---

## 📁 프로젝트 구조

```
src/
├── config/         # 게임 설정
├── data/           # 게임 데이터 (아이템, 스킬, 몬스터)
├── entities/       # 게임 엔티티 (플레이어, 몬스터, NPC)
├── scenes/         # Phaser 씬
├── systems/        # 게임 시스템 (인벤토리, 전투, Idle)
├── ui/             # UI 컴포넌트
├── types/          # TypeScript 타입
└── utils/          # 유틸리티

public/assets/      # 게임 에셋 (이미지, 오디오)
docs/               # 문서
```

---

## 📊 개발 현황

| 기능 | 상태 |
|------|------|
| 코어 시스템 | ✅ 100% |
| Idle 시스템 | ✅ 100% |
| 직업 시스템 | ✅ 100% |
| 소셜 시스템 | ✅ 100% |
| UI 시스템 | ✅ 100% |
| 에셋 통합 | ⏳ 0% |

상세 진행 상황은 [PROGRESS.md](docs/PROGRESS.md) 참조

---

## 🗺️ 로드맵

### v0.1.0 - 코어 (✅ 완료)
- [x] 프로젝트 설정
- [x] 아이소메트릭 렌더링
- [x] 기본 게임 시스템

### v0.2.0 - Idle 시스템 (✅ 완료)
- [x] 자동 사냥 시스템
- [x] 오프라인 보상 (8시간)
- [x] 사냥터 선택 UI

### v0.3.0 - 에셋 통합 (🔄 진행중)
- [ ] Ninja Adventure Pack 다운로드
- [ ] 캐릭터/몬스터 스프라이트
- [ ] BGM/SFX

### v0.4.0 - 콘텐츠 확장
- [ ] 보스 레이드
- [ ] PvP
- [ ] 거래 시스템

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [PROGRESS.md](docs/PROGRESS.md) | 개발 진행 상황 |
| [ASSET_GUIDE.md](docs/ASSET_GUIDE.md) | 에셋 규격 및 출처 |
| [IDLE_SYSTEM.md](docs/IDLE_SYSTEM.md) | Idle 시스템 설계 |
| [CREDITS.md](CREDITS.md) | 에셋 크레딧 |

---

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 라이선스

- **코드**: MIT License
- **에셋**: CC0 (별도 명시된 경우 제외)

자세한 내용은 [LICENSE](LICENSE) 및 [CREDITS.md](CREDITS.md) 참조

---

## 🙏 크레딧

### 에셋

| 에셋 | 제작자 | 라이선스 |
|------|--------|----------|
| Ninja Adventure Pack | pixel-boy | CC0 |
| RPG SFX | OpenGameArt | CC0 |

### 영감

- **어둠의전설** (넥슨) - 게임 컨셉, 사냥터/몬스터 이름

### 기술

| 라이브러리 | 라이선스 |
|-----------|----------|
| Phaser 3 | MIT |
| TypeScript | Apache-2.0 |
| Vite | MIT |

---

*어둠의전설을 추억하며... ⚔️*
