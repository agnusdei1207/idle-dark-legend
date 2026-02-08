# 🎮 Idle 어둠의전설 클래식

> **방치형 RPG** - 어둠의전설 향수 + 현대 Idle 게임
> Phaser 3 + TypeScript + Vite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## 🎨 에셋

### 사용 에셋

| 에셋 | 라이선스 | 출처 |
|------|----------|------|
| Ninja Adventure Pack | CC0 | [itch.io](https://pixel-boy.itch.io/ninja-adventure-asset-pack) |
| OpenGameArt RPG SFX | CC0 | [opengameart.org](https://opengameart.org) |

에셋 다운로드 및 설정 방법은 [ASSET_DOWNLOAD.md](docs/ASSET_DOWNLOAD.md) 참조

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
- [x] 오프라인 보상
- [x] 사냥터 선택 UI

### v0.3.0 - 에셋 통합 (🔄 진행중)
- [ ] 캐릭터 스프라이트
- [ ] 몬스터 스프라이트
- [ ] BGM/SFX

### v0.4.0 - 콘텐츠 확장
- [ ] 보스 레이드
- [ ] PvP
- [ ] 거래 시스템

---

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🙏 크레딧

- **원작**: 어둠의전설 (넥슨)
- **엔진**: [Phaser 3](https://phaser.io/)
- **에셋**: [Ninja Adventure](https://pixel-boy.itch.io/ninja-adventure-asset-pack), [OpenGameArt](https://opengameart.org/)

---

*어둠의전설을 추억하며... ⚔️*
