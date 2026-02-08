# 어둠의전설 클래식 - 개발 계획

> **네كس: 어둠의전설 (1998/2005) 팬 트리뷰트 프로젝트**
> 원작 게임의 데이터를 최대한 재현하여 방치형 RPG로 구현

---

## 📊 현재 상태 (v0.3.0)

### ✅ 완료된 기능
- 기본 게임 구조 (Phaser 3)
- 씬 플로우 (Boot → Menu → Game)
- 아이소메트릭 맵 렌더링
- 플레이어 이동 (WASD)
- NPC 시스템
- 사냥 시스템 (자동 사냥)
- HUD (HP/MP/EXP 바)
- 인벤토리 UI
- 퀘스트 UI
- 스킬 트리 UI
- 서클 (길드) UI
- 오프라인 보상 시스템
- ESC 키 우선순위 처리

### ✅ 원작 데이터 구현 (v0.3.0)
- **어둠의전설 몬스터 데이터**: 1~5서클 전체 몬스터 구현
- **어둠의전설 맵 데이터**: 노비스~호러케슬까지 전 사냥터 구현
- **어둠의전설 스킬 데이터**: 5대 직업별 원작 스킬 구현

### 🚧 남은 작업
1. 에셋 시스템 연동
2. 스킬 이펙트 시스템
3. 보스 레이드
4. PvP 시스템

---

## 🎮 어둠의전설 원작 데이터

### 몬스터 데이터 (1~5서클)

#### 1서클 (Lv 1~10) - 노비스 마을, 우드랜드
| ID | 영문명 | 한글명 | 레벨 | 특징 |
|----|--------|--------|------|------|
| mon_pampat | Pampat | 팜팻 | 1 | 풍차 돌리기, 풀 먹고 회복 |
| mon_nie | Nie | 니에 | 2 | 숲 기본 몬스터 |
| mon_wandu | Pea | 완두콩 | 3 | 숲 기본 몬스터 |
| mon_mantis | Mantis | 맨티스 | 4 | 공격적 |
| mon_wasp | Wasp | 말벌 | 5 | 공격적 |
| mon_wolf | Wolf | 늑대 | 6 | 공격적 |
| mon_spider | Spider | 거미 | 7 | 독 공격 |
| mon_centipede | Centipede | 지네 | 8 | 독 공격 |
| mon_orange_rat | Orange Rat | 주황쥐 | 9 | 노비스 던전 |
| mon_curupay | Curupay | 큐르페이 | 10 | 우드랜드 보스 |

#### 2서클 (Lv 11~40) - 피에트 마을, 포테의 숲
| ID | 영문명 | 한글명 | 레벨 | 특징 |
|----|--------|--------|------|------|
| mon_goblin_soldier | Goblin Soldier | 고블린병사 | 12 | 기본 병사 |
| mon_goblin_warrior | Goblin Warrior | 고블린전사 | 18 | 상위 병사 |
| mon_hobgoblin | Hobgoblin | 홉고블린 | 25 | 강력한 고블린 |
| mon_werewolf | Werewolf | 늑대인간 | 30 | 은월의 힘 |
| mon_shrieker | Shrieker | 슈리커 | 35 | 소리 공격 |
| mon_wisp | Wisp | 위스프 | 38 | 유령 등불 |
| mon_ent | Ent | 에인트 | 40 | 고대 나무 |

#### 3서클 (Lv 41~70) - 아벨 마을, 아벨 던전/해안
| ID | 영문명 | 한글명 | 레벨 | 특징 |
|----|--------|--------|------|------|
| mon_abel_crab | Giant Crab | 대게 | 45 | 아벨 해안 |
| mon_sea_witch | Sea Witch | 바다마녀 | 50 | 물 마법 |
| mon_skeleton_warrior | Skeleton Warrior | 스켈레톤워리어 | 55 | 언데드 |
| mon_ghoul | Ghoul | 구울 | 60 | 언데드 |
| mon_zombie_knight | Zombie Knight | 좀비나이트 | 65 | 언데드 |
| mon_vampire | Vampire | 뱀파이어 | 70 | 흡혈 |

#### 4서클 (Lv 71~98) - 뤼케시온 마을, 뤼케시온 해안
| ID | 영문명 | 한글명 | 레벨 | 특징 |
|----|--------|--------|------|------|
| mon_kraken | Kraken Tentacle | 크라켄촉수 | 75 | 바다 몬스터 |
| mon_sea_serpent | Sea Serpent | 씨서펀트 | 82 | 바다 용 |
| mon_gargoyle | Gargoyle | 가고일 | 88 | 석상 |
| mon_lich | Lich | 리치 | 95 | 언데드 마법사 |
| mon_dullahan | Dullahan | 듈라한 | 98 | 머리 없는 기사 |

#### 5서클 (Lv 99+) - 마인 마을, 호러케슬
| ID | 영문명 | 한글명 | 레벨 | 특징 |
|----|--------|--------|------|------|
| mon_horror_knight | Horror Knight | 호랑나이트 | 102 | 호러케슬 |
| mon_blood_countess | Blood Countess | 블러드카운테스 | 110 | 흡혈귀 |
| mon_dark_archmage | Dark Archmage | 대마법사 | 120 | 최강 마법사 |
| mon_dracula | Dracula | 드라큘라 | 130 | 흡혈귀 왕 |

### 맵 데이터 (원작 좌표 기준)

#### 마을 좌표
| 마을 | 좌표 | 접근 사냥터 |
|------|------|-------------|
| 노비스 마을 | 시작점 | 우드랜드, 노비스 던전 |
| 피에트 마을 | (0, 50) | 포테의 숲 |
| 아벨 마을 | (56, 7) | 아벨 던전 |
| 아벨 해안던전 | (60, 116) | 서리케리콜 필요 |
| 뤼케시온 마을 | (78, 10) | 뤼케시온 해안 |
| 마인 마을 | (7, 6) | 호러케슬 (백원만 NPC) |

---

## 🎮 직업 시스템 (5대 직업)

### 1. 전사 (Warrior)
- **특성**: 근접, 고체력, 탱커
- **주요 스탯**: STR (힘)
- **주요 스킬**:
  - 베기 (Slash) - 기본 공격
  - 더블어택 (Double Attack) - 2회 공격
  - 트리플어택 (Triple Attack) - 3회 공격
  - 메가어택 (Mega Attack) - 4배 데미지
  - 돌진 (Charge) - 전방 5칸 돌격
  - 집중 (Focus) - 크래셔 위력 2배
  - 크래셔 (Crasher) - 필살기
  - 레스큐 (Rescue) - 어그로 끌기

### 2. 마법사 (Mage)
- **특성**: 원거리, 속성 마법
- **주요 스탯**: INT (지능)
- **주요 스킬**:
  - 플라메라 (Flamera) → 플레어 (Flare) - 화염
  - 테라미에라 (Teramiera) → 아이스블러스트 (Ice Blast) - 빙결
  - 프라보 (Pravo) - 저주
  - 프라베라 (Pravera) - 전체 저주
  - 라그나로크 (Ragnarok) - 전체 공격
  - 메테오 (Meteor) - 최강 마법
  - 매직프로텍션 (Magic Protection) - 방어 증가

### 3. 도적 (Rogue)
- **특성**: 은신, 크리티컬
- **주요 스탯**: DEX (민첩)
- **주요 스킬**:
  - 하이드 (Hide) - 은신
  - 백스텝 (Backstep) - 찌르기
  - 습격 (Assault) - 암살 공격
  - 아무네지아 (Amnesia) - 인식 초기화
  - 슬래쉬 (Stab) - 기본 공격

### 4. 성직자 (Cleric)
- **특성**: 힐러, 버퍼, 디버프 해제
- **주요 스탯**: WIS (지혜)
- **주요 스킬**:
  - 쿠로 (Kuro) - 기본 힐
  - 쿠라노 (Kurano) - 중급 힐
  - 쿠라노소 (Kuranoso) - 고급 힐
  - 쿠러스 (Kurus) - 그룹 힐
  - 이모탈 (Immortal) - 무적 18초
  - 디스펠라 (Dispella) - 저주 해제
  - 디베노모 (Divenomo) - 중독 해제
  - 홀리볼트 (Holy Bolt) - 신성 공격

### 5. 무도가 (Monk)
- **특성**: 하이브리드 (전직 불가)
- **주요 스탯**: STR + CON
- **주요 스킬**:
  - 정권 (Jeongkwon) - 기본 공격
  - 단각 (Dangak) - 발차기
  - 양의신권 (Yangui) - 2회 공격
  - 이형환위 (Ihyeong) - 뒤로 이동
  - 금강불괴 (Geumgang) - 무적 9초
  - 장풍 (Jangpung) - 원거리 공격
  - 달마신공 (Dalma) - 필살기
  - 쿠라노토 (Kuranoto) - 자가 힐

---

## 🎯 전직 시스템

- **전직 레벨**: 6 (기본 직업 획득)
- **2차 전직**: 30
- **3차 전직**: 60
- **무도가**: 전직 불가 (처음부터 무도가)

---

## 🎨 에셋 전략

### 에셋 폴더 구조
```
public/assets/
├── sprites/
│   ├── player/
│   │   ├── warrior.png (스프라이트시트)
│   │   ├── mage.png
│   │   ├── rogue.png
│   │   ├── cleric.png
│   │   └── monk.png
│   ├── monsters/
│   │   ├── pampat.png
│   │   ├── nie.png
│   │   ├── pea.png
│   │   ├── mantis.png
│   │   ├── wasp.png
│   │   ├── wolf.png
│   │   ├── spider.png
│   │   ├── centipede.png
│   │   └── ...
│   └── npcs/
│       ├── elder.png
│       ├── blacksmith.png
│       └── merchant.png
├── effects/
│   ├── fire/
│   ├── ice/
│   ├── lightning/
│   ├── heal/
│   └── physical/
├── tilesets/
│   └── isometric-tiles.png
├── ui/
│   ├── icons/
│   │   ├── skills.png
│   │   └── items.png
│   └── frames/
│       ├── button.png
│       └── panel.png
└── audio/
    ├── bgm/
    │   ├── village.mp3
    │   ├── field.mp3
    │   ├── forest.mp3
    │   ├── dungeon.mp3
    │   └── battle.mp3
    └── sfx/
        ├── attack.wav
        ├── hit.wav
        ├── skill.wav
        └── levelup.wav
```

---

## 📋 우선순위 작업 목록

### Phase 1: 에셋 통합 (즉시)
1. [ ] Ninja Adventure Pack 다운로드
2. [ ] 캐릭터 스프라이트 적용
3. [ ] 몬스터 스프라이트 적용
4. [ ] 스킬 아이콘 적용
5. [ ] 타일셋 적용

### Phase 2: 스킬 이펙트 (1일)
1. [ ] 스킬 이펙트 데이터 정의
2. [ ] 파티클 시스템 구현
3. [ ] 스킬별 이펙트 연동

### Phase 3: 사운드 (1일)
1. [ ] BGM 로딩 시스템
2. [ ] 맵별 BGM 연동
3. [ ] SFX 시스템

### Phase 4: 콘텐츠 확장
1. [ ] 보스 레이드 시스템
2. [ ] PvP 시스템
3. [ ] 거래 시스템

---

## 🔧 기술 스택

- **엔진**: Phaser 3.60+
- **언어**: TypeScript
- **빌드**: Vite
- **스타일**: CSS Variables

## 📁 핵심 파일

| 파일 | 역할 |
|------|------|
| `src/data/monsters.data.ts` | 몬스터 정의 (1~5서클) |
| `src/data/maps.data.ts` | 맵 정의 (노비스~호러케슬) |
| `src/data/skills.data.ts` | 스킬 정의 |
| `src/data/classes.data.ts` | 직업 정의 |
| `src/scenes/GameScene.ts` | 메인 게임 로직 |
| `src/scenes/BootScene.ts` | 에셋 로딩 |
