# 🎮 어둠의전설 클래식 (Dark Legend Classic)

> **방치형 RPG** - 넥슨 어둠의전설 (1998/2005) 팬 트리뷰트
> Phaser 3 + TypeScript + Vite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-0.4.0-blue.svg)](https://github.com/agnusdei1207/dark-legend-classic)

---

## ✨ 특징

### 🎯 어둠의전설 재현
- **원작 사냥터 복원**: 노비스~호러케슬까지 전 서클 구현
- **오리지널 몬스터**: 팜팻, 니에, 완두콩, 맨티스, 말벌, 늑대인간 등
- **직업 시스템**: 전사, 마법사, 도적, 성직자, 무도가
- **스킬 시스템**: 플라메라, 테라미에라, 프라보, 하이드 등 원작 스킬

### 🗺️ 어둠의전설 사냥터 (원작 기준)

| 써클 | 레벨 | 마을 | 사냥터 | 좌표 |
|------|------|------|--------|------|
| **1서클** | 1~10 | 노비스 마을 | 우드랜드 1~20존, 노비스 던전 | 시작점 |
| **2서클** | 11~40 | 피에트 마을 | 포테의 숲 | (0, 50) |
| **3서클** | 41~70 | 아벨 마을 | 아벨 던전, 아벨 해안던전 | (56, 7) → (60, 116) |
| **4서클** | 71~98 | 뤼케시온 마을 | 솔던 뤼케시온, 뤼케시온 해안 | (78, 10) |
| **5서클** | 99+ | 마인 마을 | 호러케슬 (백원만 NPC) | (7, 6) |

### 👹 원작 몬스터 (1서클 예시)

| 몬스터 | 한글명 | 레벨 | 특징 |
|--------|--------|------|------|
| Pampat | 팜팻 | 1 | 풍차 돌리기, 풀 먹고 회복 |
| Nie | 니에 | 2 | 숲 기본 몬스터 |
| Pea (Wandu) | 완두콩 | 3 | 숲 기본 몬스터 |
| Mantis | 맨티스 | 4 | 공격적 |
| Wasp | 말벌 | 5 | 공격적 |
| Wolf | 늑대 | 6 | 공격적 |
| Spider | 거미 | 7 | 독 공격 |
| Centipede | 지네 | 8 | 독 공격 |
| Orange Rat | 주황쥐 | 9 | 노비스 던전 |
| Curupay | 큐르페이 | 10 | 우드랜드 보스 |

### ⚔️ 직업별 스킬

#### 전사 (Warrior) - STR 위주
- **1서클 (Lv 6~)**: 베기, 더블어택
- **2서클 (Lv 11~)**: 돌진 (Charge), 집중 (Focus)
- **3서클 (Lv 41~)**: 트리플어택, 레스큐 (Rescue)
- **4서클 (Lv 71~)**: 메가어택
- **5서클 (Lv 99~)**: 크래셔 (Crasher)

#### 마법사 (Mage) - INT 위주
- **1서클 (Lv 6~)**: 플라메라 (Flamera), 테라미에라 (Teramiera), 매직프로텍션
- **2서클 (Lv 11~)**: 프라보 (Pravo)
- **3서클 (Lv 41~)**: 플레어 (Flare), 아이스블러스트 (Ice Blast)
- **4서클 (Lv 71~)**: 프라베라 (Pravera)
- **5서클 (Lv 99~)**: 라그나로크 (Ragnarok)
- **특수**: 메테오 (Meteor) - Lv 110

#### 도적 (Rogue) - DEX 위주
- **1서클 (Lv 6~)**: 슬래쉬 (Stab)
- **2서클 (Lv 11~)**: 하이드 (Hide), 습격 (Assault)
- **3서클 (Lv 41~)**: 백스텝 (Backstep)
- **4서클 (Lv 71~)**: 아무네지아 (Amnesia)

#### 성직자 (Cleric) - WIS 위주
- **1서클 (Lv 6~)**: 쿠로 (Kuro), 디베노모 (Divenomo)
- **2서클 (Lv 11~)**: 디스펠라 (Dispella), 홀리볼트 (Holy Bolt)
- **3서클 (Lv 41~)**: 쿠라노 (Kurano)
- **4서클 (Lv 71~)**: 쿠러스 (Kurus), 이모탈 (Immortal)
- **5서클 (Lv 99~)**: 쿠라노소 (Kuranoso)

#### 무도가 (Monk) - STR+CON 위주 (전직 불가)
- **1서클 (Lv 6~)**: 정권 (Jeongkwon), 단각 (Dangak)
- **2서클 (Lv 11~)**: 양의신권 (Yangui), 쿠라노토 (Kuranoto)
- **3서클 (Lv 41~)**: 이형환위 (Ihyeong), 장풍 (Jangpung)
- **4서클 (Lv 71~)**: 금강불괴 (Geumgang)
- **5서클 (Lv 99~)**: 달마신공 (Dalma)

---

## 🚀 시작하기

### 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/agnusdei1207/dark-legend-classic.git
cd dark-legend-classic

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
| `WASD` 또는 방향키 | 이동 |
| `I` | 인벤토리 |
| `C` | 캐릭터 정보 |
| `K` | 스킬 트리 |
| `Q` | 퀘스트 로그 |
| `G` | 서클 (길드) |
| `H` | 사냥터 선택 |
| `Space` | NPC 대화 |
| `1-8` | 스킬바 |
| `ESC` | 창 닫기/메뉴 |

---

## 📊 개발 현황

| 기능 | 상태 |
|------|------|
| 코어 시스템 | ✅ 100% |
| Idle/방치 시스템 | ✅ 100% |
| 직업 시스템 (5종) | ✅ 100% |
| 스킬 시스템 (원작) | ✅ 100% |
| 몬스터 데이터 (원작) | ✅ 100% |
| 맵 데이터 (원작) | ✅ 100% |
| 소셜 시스템 | ✅ 100% |
| UI 시스템 | ✅ 100% |
| 에셋 통합 | ⏳ 0% (플레이스홀더 사용 중) |

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

### v0.3.0 - 원작 데이터 구현 (✅ 완료)
- [x] 어둠의전설 몬스터 데이터 (1~5서클)
- [x] 어둠의전설 맵 데이터 (노비스~호러케슬)
- [x] 어둠의전설 스킬 데이터

### v0.3.1 - 버그 수정 및 안정화 (✅ 완료)
- [x] GameScene 초기화 버그 수정 (map_village → map_novis_village)
- [x] NPC 데이터 누락 문제 해결 (14개 NPC 추가)
- [x] UIScene 오류 처리 개선
- [x] 게임 시작 플로우 안정화

### v0.4.0 - 스킬 시스템 완전 재구현 (✅ 완료)
- [x] 직업별 스킬 레벨 설정 (1~5서클)
- [x] 전직 시스템 정확화 (Lv 6/30/60/99)
- [x] 스킬 배우는 레벨 차별화
- [x] 직업 데이터 재설계
- [x] 무도가 전직 불가 구현

### v0.5.0 - 에셋 통합 (🔄 진행중)
- [ ] Ninja Adventure Pack 다운로드
- [ ] 캐릭터/몬스터 스프라이트
- [ ] BGM/SFX

### v0.5.0 - 콘텐츠 확장
- [ ] 보스 레이드
- [ ] PvP
- [ ] 거래 시스템

---

## 📚 문서

| 문서 | 설명 |
|------|------|
| [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) | 개발 계획 |
| [README.md](README.md) | 프로젝트 소개 |
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

---

## 🙏 크레딧

### 원작
- **어둠의전설 (Legend of Darkness)** - 넥슨 (1998/2005)
  - 본 게임은 넥슨 어둠의전설의 팬 트리뷰트 프로젝트입니다.
  - 상표권은 넥슨에 귀속됩니다.

### 참고 자료
- [어둠의전설 공식 게시판](https://lod.nexon.com)
- [나무위키: 어둠의 전설](https://namu.wiki/wiki/어둠의_전설)
- [사냥터 정보](https://lod.nexon.com/board/1493172227/1209)
- [2~5써클 사냥터 위치](https://lod.nexon.com/board/1493172227/6227)

### 기술
| 라이브러리 | 라이선스 |
|-----------|----------|
| Phaser 3 | MIT |
| TypeScript | Apache-2.0 |
| Vite | MIT |

---

*어둠의전설을 추억하며... ⚔️*
*Dark Legend Classic - A Fan Tribute*
*1998-2005 Nexon Co., Ltd. All Rights Reserved.*
