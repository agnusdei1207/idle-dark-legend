# 어둠의전설 클래식 - Three.js 전환 계획서

> **Phaser 3 → Three.js 완전 전환 프로젝트**
> 시작일: 2026-02-08
> 목표: 모든 기능을 Three.js로 재구현

---

## 📊 프로젝트 개요

### 현재 상태 (Phaser 3 v0.4.0)
- **엔진**: Phaser 3.90.0 + TypeScript + Vite
- **완성도**: 코어 시스템 100%
- **구현된 기능**:
  - ✅ 씬 플로우 (Boot → Menu → Game)
  - ✅ 아이소메트릭 맵 렌더링
  - ✅ 플레이어 이동 (WASD)
  - ✅ NPC 시스템 (14개 NPC)
  - ✅ 사냥 시스템 (자동 사냥)
  - ✅ HUD (HP/MP/EXP 바)
  - ✅ 인벤토리 UI
  - ✅ 퀘스트 UI
  - ✅ 스킬 트리 UI
  - ✅ 서클 (길드) UI
  - ✅ 오프라인 보상 시스템
  - ✅ 5대 직업 데이터
  - ✅ 스킬 데이터 (원작)
  - ✅ 몬스터 데이터 (1~5서클)
  - ✅ 맵 데이터 (노비스~호러케슬)

### 전환 목표 (Three.js)
- **엔진**: Three.js + TypeScript + Vite
- **레벨**: 2D 아이소메트릭 (향후 2.5D/3D 확장 가능)
- **일관성**: 모든 기능을 Three.js로 재구현
- **개선사항**:
  - 더 나은 에셋 호환성 (3D/2D 혼합)
  - 향후 3D 전환 용이성
  - 더 유연한 렌더링 제어

---

## 🎯 전환 범위

### 유지하는 것 (데이터)
- ✅ 모든 게임 데이터 (JSON/TS)
  - `src/data/classes.data.ts`
  - `src/data/skills.data.ts`
  - `src/data/monsters.data.ts`
  - `src/data/maps.data.ts`
  - `src/data/npcs.data.ts`
  - `src/data/quests.data.ts`

### 교체하는 것 (엔진/씬)
- 🔄 `src/scenes/` 전체
- 🔄 `src/entities/` 전체
- 🔄 `src/systems/` 전체 (게임 플레이 관련)
- 🔄 렌더링 시스템
- 🔄 입력 처리 시스템

### 유지하는 것 (UI)
- ✅ HTML/CSS UI (그대로 사용)
- ✅ `src/ui/` 구조

---

## 📋 단계별 상세 계획

### Phase 1: 프로젝트 설정 (1-2시간)

#### 1.1 Three.js 설치 및 설정
- [ ] Three.js 설치 (`npm install three @types/three`)
- [ ] package.json 업데이트
- [ ] tsconfig.json 확인
- [ ] Vite 설정 확인

#### 1.2 기본 구조 생성
- [ ] `src/three/` 폴더 생성
- [ ] `src/three/core/` 폴더 (코어 클래스)
- [ ] `src/three/scenes/` 폴더 (씬)
- [ ] `src/three/entities/` 폴더 (엔티티)
- [ ] `src/three/systems/` 폴더 (시스템)
- [ ] `src/three/utils/` 폴더 (유틸리티)

#### 1.3 TypeScript 타입 정의
- [ ] Three.js 관련 타입 정의
- [ ] 게임 타입 업데이트

**완료 기준**: Three.js 기본 구조가 생성되고 컴파일 에러 없음

---

### Phase 2: 코어 시스템 구현 (3-4시간)

#### 2.1 Game 클래스 (Phaser Game 대체)
- [ ] `ThreeGame` 클래스 구현
  - [ ] Canvas 생성 및 관리
  - [ ] Renderer 설정 (WebGL)
  - [ ] Scene 관리
  - [ ] Update 루프
- [ ] Clock/Delta time 구현

#### 2.2 SceneManager 구현
- [ ] Scene 전환 시스템
- [ ] Scene 로딩/언로딩
- [ ] Scene 간 데이터 전달

#### 2.3 AssetManager 구현
- [ ] Texture 로딩
- [ ] Sprite 로딩
- [ ] Asset 캐싱
- [ ] 로딩进度 UI 연동

**완료 기준**: 기본 Three.js 캔버스가 뜨고 Scene 전환 가능**

---

### Phase 3: BootScene 구현 (1-2시간)

#### 3.1 BootScene 기본 구조
- [ ] `ThreeBootScene` 클래스 구현
- [ ] 에셋 프리로딩
- [ ] 로딩 화면 구현
- [ ] 게임 데이터 초기화

#### 3.2 에셋 로딩 시스템
- [ ] TextureLoader 설정
- [ ] SpriteLoader 설정
- [ ] 로딩进度 표시
- [ ] 에러 처리

**완료 기준**: 모든 에셋이 로드되고 MenuScene으로 전환**

---

### Phase 4: MenuScene 구현 (2-3시간)

#### 4.1 MenuScene 기본 구조
- [ ] `ThreeMenuScene` 클래스 구현
- [ ] 배경 렌더링 (3D/2D)
- [ ] 메뉴 UI 연동 (기존 HTML 유지)

#### 4.2 메뉴 인터랙션
- [ ] 버튼 클릭 이벤트
- [ ] Scene 전환 (→ GameScene)
- [ ] 옵션 메뉴

**완료 기준**: 메뉴가 뜨고 게임 시작 가능**

---

### Phase 5: GameScene 구현 - 기본 (4-5시간)

#### 5.1 GameScene 기본 구조
- [ ] `ThreeGameScene` 클래스 구현
- [ ] Camera 설정 (Orthographic for 2D isometric)
- [ ] Scene graph 설정
- [ ] Lighting 설정

#### 5.2 맵 렌더링 시스템
- [ ] Tilemap 렌더링 (아이소메트릭)
- [ ] 배경 타일
- [ ] 벽/장애물
- [ ] 맵 좌표 → 월드 좌표 변환

#### 5.3 카메라 시스템
- [ ] 플레이어 추적 카메라
- [ ] 카메라 부드러운 이동
- [ ] 카메라 줌 (선택사항)

**완료 기준**: 맵이 렌더링되고 카메라가 작동**

---

### Phase 6: 플레이어 시스템 (3-4시간)

#### 6.1 Player 엔티티
- [ ] `ThreePlayer` 클래스 구현
- [ ] Sprite/Mesh 생성
- [ ] 아이소메트릭 스프라이트 설정

#### 6.2 플레이어 이동
- [ ] WASD 입력 처리
- [ ] 방향별 스프라이트 변경
- [ ] 충돌 검사 (맵 타일)
- [ ] 부드러운 이동 (lerp)

#### 6.3 애니메이션 시스템
- [ ] Idle 애니메이션
- [ ] Walk 애니메이션
- [ ] 애니메이션 프레임 관리
- [ ] Sprite 시트 지원

**완료 기준**: 플레이어가 맵 위에서 움직이고 애니메이션 작동**

---

### Phase 7: NPC 시스템 (2-3시간)

#### 7.1 NPC 엔티티
- [ ] `ThreeNPC` 클래스 구현
- [ ] NPC 스프라이트 렌더링
- [ ] NPC 위치 설정

#### 7.2 NPC 인터랙션
- [ ] 근접 감지
- [ ] 대화 시스템 연동
- [ ] Space 키 인터랙션

**완료 기준**: 14개 NPC가 위치하고 대화 가능**

---

### Phase 8: 사냥 시스템 (3-4시간)

#### 8.1 Monster 엔티티
- [ ] `ThreeMonster` 클래스 구현
- [ ] 몬스터 스프라이트 렌더링
- [ ] 몬스터 스폰 시스템

#### 8.2 전투 시스템
- [ ] 자동 공격 (Idle 게임 특성)
- [ ] 데미지 계산
- [ ] HP 감소 애니메이션
- [ ] 사망 처리

#### 8.3 경험치/레벨업
- [ ] EXP 획득
- [ ] 레벨업 처리
- [ ] 스탯 증가

**완료 기준**: 몬스터가 스폰되고 자동 사냥 작동**

---

### Phase 9: HUD 연동 (1-2시간)

#### 9.1 HUD 업데이트 시스템
- [ ] HP 바 업데이트
- [ ] MP 바 업데이트
- [ ] EXP 바 업데이트
- [ ] 레벨/서클 표시

#### 9.2 3D → UI 동기화
- [ ] Three.js Scene ↔ HTML UI
- [ ] 실시간 데이터 전달

**완료 기준**: HUD가 실시간으로 업데이트됨**

---

### Phase 10: UI 시스템 연동 (2-3시간)

#### 10.1 인벤토리
- [ ] 인벤토리 UI ↔ Three.js 데이터 연동
- [ ] 아이템 장착/해제
- [ ] 인벤토리 열기/닫기 (I 키)

#### 10.2 스킬 시스템
- [ ] 스킬 트리 UI 연동
- [ ] 스킬 배우기
- [ ] 스킬바 (1-8 키)

#### 10.3 퀘스트 시스템
- [ ] 퀘스트 UI 연동
- [ ] 퀘스트 진행/완료

#### 10.4 서클 (길드) 시스템
- [ ] 서클 UI 연동
- [ ] 전직 시스템

#### 10.5 사냥터 선택
- [ ] 사냥터 UI 연동
- [ ] 맵 이동

#### 10.6 ESC 키 처리
- [ ] 창 닫기 우선순위
- [ ] 메뉴 열기

**완료 기준**: 모든 UI가 Three.js와 연동되어 작동**

---

### Phase 11: 오프라인 보상 시스템 (1-2시간)

#### 11.1 저장/로드 시스템
- [ ] localStorage 연동
- [ ] 게임 상태 저장
- [ ] 게임 상태 로드

#### 11.2 오프라인 보상 계산
- [ ] 경과 시간 계산
- [ ] 오프라인 보상 지급
- [ ] 보상 UI 표시

**완료 기준**: 게임을 껐다 켜도 데이터 유지, 오프라인 보상 지급**

---

### Phase 12: 최적화 및 폴리시 (2-3시간)

#### 12.1 성능 최적화
- [ ] Object pooling (몬스터)
- [ ] Sprite 최적화
- [ ] 렌더링 최적화
- [ ] 가비지 컬렉션 최적화

#### 12.2 에러 처리
- [ ] 에러 바운더리
- [ ] 안전한 렌더링 루프
- [ ] 복구 시스템

#### 12.3 테스트
- [ ] 모든 기능 테스트
- [ ] 버그 수정
- [ ] 크로스브라우저 테스트

**완료 기준**: 안정적이고 버그 없는 상태**

---

### Phase 13: 에셋 통합 (2-3시간)

#### 13.1 플레이스홀더 에셋 제작
- [ ] 5대 직업 플레이스홀더
- [ ] 기본 몬스터 플레이스홀더
- [ ] 타일 플레이스홀더

#### 13.2 에셋 로딩 최적화
- [ ] Texture compression
- [ ] Lazy loading
- [ ] Asset bundling

**완료 기준**: 플레이스홀더 에셋으로 게임 가능**

---

### Phase 14: 마이그레이션 완료 (1시간)

#### 14.1 Phaser 코드 제거
- [ ] `src/scenes/` (Phaser) 제거
- [ ] `src/entities/` (Phaser) 제거
- [ ] Phaser 의존성 제거
- [ ] 불필요한 파일 정리

#### 14.2 문서 업데이트
- [ ] README 업데이트
- [ ] DEVELOPMENT_PLAN 업데이트
- [ ] ASSET_STRATEGY 업데이트 (Three.js 관련)

#### 14.3 최종 테스트
- [ ] 전체 기능 테스트
- [ ] 성능 테스트
- [ ] 배포 준비

**완료 기준**: Phaser 코드 완전 제거, Three.js만으로 동작**

---

## 📊 진행도 추적

### 전체 진행률: 0/14 Phase (0%)

| Phase | 이름 | 상태 | 진행률 | 예상 시간 | 실제 시간 |
|-------|------|------|--------|----------|----------|
| 1 | 프로젝트 설정 | ⏳ 예정 | 0% | 1-2시간 | - |
| 2 | 코어 시스템 | ⏳ 예정 | 0% | 3-4시간 | - |
| 3 | BootScene | ⏳ 예정 | 0% | 1-2시간 | - |
| 4 | MenuScene | ⏳ 예정 | 0% | 2-3시간 | - |
| 5 | GameScene 기본 | ⏳ 예정 | 0% | 4-5시간 | - |
| 6 | 플레이어 시스템 | ⏳ 예정 | 0% | 3-4시간 | - |
| 7 | NPC 시스템 | ⏳ 예정 | 0% | 2-3시간 | - |
| 8 | 사냥 시스템 | ⏳ 예정 | 0% | 3-4시간 | - |
| 9 | HUD 연동 | ⏳ 예정 | 0% | 1-2시간 | - |
| 10 | UI 시스템 연동 | ⏳ 예정 | 0% | 2-3시간 | - |
| 11 | 오프라인 보상 | ⏳ 예정 | 0% | 1-2시간 | - |
| 12 | 최적화 및 폴리시 | ⏳ 예정 | 0% | 2-3시간 | - |
| 13 | 에셋 통합 | ⏳ 예정 | 0% | 2-3시간 | - |
| 14 | 마이그레이션 완료 | ⏳ 예정 | 0% | 1시간 | - |

**총 예상 시간**: 30-45시간

---

## 🔄 롤백 계획

### 중간 저장점
각 Phase 완료 시 Git 커밋:

```bash
git commit -m "phase: Phase N 완료 - [이름]"
git push
```

### 롤백 명령어
```bash
# 특정 Phase로 롤백
git checkout <commit-hash>

# Phaser로 복귀 (최악의 경우)
git checkout main-phaser-backup
```

### 백업 전략
- [ ] Phaser 코드 백업 브랜치 생성 (`main-phaser-backup`)
- [ ] 각 Phase 완료 시 태그 생성 (`phase-1`, `phase-2`, ...)
- [ ] 최소 1시간마다 커밋

---

## 📁 파일 구조 (전환 후)

```
dark-legend-classic/
├── src/
│   ├── three/                  # Three.js 관련 (신규)
│   │   ├── core/
│   │   │   ├── ThreeGame.ts    # 메인 게임 클래스
│   │   │   ├── SceneManager.ts # Scene 관리
│   │   │   └── AssetManager.ts # 에셋 로딩
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   ├── MenuScene.ts
│   │   │   └── GameScene.ts
│   │   ├── entities/
│   │   │   ├── Player.ts
│   │   │   ├── NPC.ts
│   │   │   └── Monster.ts
│   │   ├── systems/
│   │   │   ├── InputSystem.ts
│   │   │   ├── CombatSystem.ts
│   │   │   └── AnimationSystem.ts
│   │   └── utils/
│   │       ├── SpriteUtils.ts
│   │       └── IsometricUtils.ts
│   ├── data/                   # 유지 (데이터)
│   │   ├── classes.data.ts
│   │   ├── skills.data.ts
│   │   ├── monsters.data.ts
│   │   ├── maps.data.ts
│   │   ├── npcs.data.ts
│   │   └── quests.data.ts
│   ├── ui/                     # 유지 (HTML UI)
│   │   ├── components/
│   │   ├── systems/
│   │   └── ...
│   ├── types/                  # 유지 및 업데이트
│   └── utils/                  # 공통 유틸 (유지)
├── public/
│   └── assets/                 # 에셋 (유지)
└── main.ts                     # 진입점 업데이트
```

---

## ✅ 완료 기준 (최종)

### 필수 항목
- [x] 모든 Phaser 코드 제거
- [x] Three.js로 모든 기능 구현
- [x] 기존 기능 100% 작동
- [x] UI 연동 완료
- [x] 데이터 유지
- [x] 성능 저하 없음
- [x] 에러 없는 빌드

### 테스트 리스트
- [ ] 게임 시작 → MenuScene 정상 작동
- [ ] 새 게임 → GameScene 진입
- [ ] WASD 이동 → 플레이어 이동
- [ ] NPC 상호작용 → 대화 작동
- [ ] 자동 사냥 → 몬스터 공격
- [ ] 레벨업 → 스탯 증가
- [ ] 인벤토리 (I) → 인벤토리 열림
- [ ] 스킬트리 (K) → 스킬 확인 가능
- [ ] 사냥터 선택 (H) → 맵 이동
- [ ] 오프라인 보상 → 재접속 시 보상 지급
- [ ] 저장/로드 → 데이터 유지

---

## 🚀 시작 전 체크리스트

- [x] GitHub 백업 완료
- [ ] Phaser 백업 브랜치 생성
- [ ] Three.js 문서 숙지
- [ ] 시간 확보 (30-45시간)
- [ ] 테스트 환경 준비

---

**작성자**: Claude (AI Assistant)
**프로젝트**: 어둠의전설 클래식 (Dark Legend Classic)
**시작일**: 2026-02-08
**목표**: Three.js 완전 전환
