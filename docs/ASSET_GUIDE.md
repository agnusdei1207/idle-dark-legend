# 🎨 에셋 리소스 가이드

> 최종 업데이트: 2026-02-08 11:50
> **중요**: 이 문서에 명시된 에셋 출처를 반드시 사용하여 일관성을 유지하세요.

---

## 📦 메인 에셋 팩

### Ninja Adventure Asset Pack ⭐ (필수)

| 항목 | 정보 |
|------|------|
| **이름** | Ninja Adventure - Asset Pack |
| **제작자** | pixel-boy (Antoine Duroisin) |
| **라이선스** | CC0 (퍼블릭 도메인) |
| **가격** | 무료 (기부 가능) |
| **다운로드** | https://pixel-boy.itch.io/ninja-adventure-asset-pack |

#### 포함 내용

| 카테고리 | 수량 | 설명 |
|----------|------|------|
| 캐릭터 | 50+ | 다양한 직업/종족 캐릭터 (애니메이션 포함) |
| 몬스터 | 30+ | 슬라임, 스켈레톤, 보스 등 (애니메이션 포함) |
| 보스 | 9 | 대형 보스 몬스터 |
| 타일셋 | 다수 | 던전, 숲, 마을, 성 등 |
| UI | 다수 | 버튼, 아이콘, 패널, 다이얼로그 |
| 효과음 | 100+ | 공격, 피격, UI, 환경음 |
| BGM | 37 | 마을, 던전, 보스, 전투 등 |
| 이펙트 | 30+ | 스킬, 타격, 마법 이펙트 |
| 폰트 | 2 | 픽셀아트 폰트 |

#### 사용할 에셋 매핑

```
Ninja Adventure Pack/
├── Actors/
│   ├── Characters/     → public/assets/sprites/characters/
│   └── Monsters/       → public/assets/sprites/monsters/
├── Backgrounds/
│   └── Tilesets/       → public/assets/tilesets/
├── Items/              → public/assets/ui/icons/
├── FX/                 → public/assets/effects/
├── HUD/                → public/assets/ui/
├── Musics/             → public/assets/audio/bgm/
└── Sounds/             → public/assets/audio/sfx/
```

---

## 🔊 보조 오디오 에셋

### OpenGameArt CC0 RPG SFX

| 항목 | 정보 |
|------|------|
| **이름** | 80 CC0 RPG SFX |
| **제작자** | Various (OpenGameArt community) |
| **라이선스** | CC0 |
| **다운로드** | https://opengameart.org/content/80-cc0-rpg-sfx |

#### 포함 내용
- 검격 사운드 (blade)
- 책 넘기는 소리 (book/page)
- 사슬 소리 (chains)
- 몬스터 효과음 (creature, roar, slime)
- 아이템 소리 (coins, gems, wood)
- 마법 효과음 (spells, fire)

### OpenGameArt CC0 Music Collection

| 항목 | 정보 |
|------|------|
| **이름** | Fantasy Music Collection |
| **라이선스** | CC0 / CC-BY |
| **다운로드** | https://opengameart.org/content/fantasy-music-collection |

---

## 🖼️ 대안 에셋 소스 (일관성 주의)

> ⚠️ **주의**: 메인 에셋 팩과 스타일이 맞지 않을 수 있습니다.
> 반드시 16x16 픽셀아트 스타일로 통일하세요.

### Kenney Assets (CC0)
- **URL**: https://kenney.nl/assets
- **특징**: 깔끔한 픽셀아트, 다양한 테마
- **사용처**: UI 보조, 추가 타일셋

### LibGDX RPG Assets (CC0)
- **URL**: https://opengameart.org/content/dungeon-tileset-for-rpg
- **특징**: 던전 타일셋
- **사용처**: 추가 던전 타일셋

---

## 🎮 어둠의전설 스타일 매핑

### 직업별 캐릭터 매핑

| 게임 직업 | Ninja Adventure 캐릭터 |
|----------|------------------------|
| 전사 (Warrior) | Knight, Warrior |
| 마법사 (Mage) | Mage, Wizard |
| 궁수 (Archer) | Archer, Ranger |
| 도적 (Thief) | Rogue, Ninja |

### 몬스터 매핑

| 게임 몬스터 | Ninja Adventure 몬스터 | 사용 사냥터 |
|------------|------------------------|-------------|
| 쥐 (Rat) | Rat / Mouse | 노비스 던전 |
| 박쥐 (Bat) | Bat | 노비스 던전 |
| 거미 (Spider) | Spider | 노비스 던전 |
| 고블린 (Goblin) | Goblin | 우드랜드 |
| 슬라임 (Slime) | Slime (Blue/Green) | 우드랜드 |
| 늑대 (Wolf) | Wolf | 우드랜드 |
| 오크 (Orc) | Orc | 우드랜드 |
| 스켈레톤 (Skeleton) | Skeleton | 피에트 던전 |
| 좀비 (Zombie) | Zombie | 피에트 던전 |
| 구울 (Ghoul) | Ghoul / Wraith | 피에트 던전 |
| 가고일 (Gargoyle) | Gargoyle | 아벨 던전 |
| 리치 (Lich) | Lich | 아벨 던전 |
| 드라큘라 (Dracula) | Vampire | 호러캐슬 |
| 웨어울프 (Werewolf) | Werewolf | 호러캐슬 |

### 타일셋 매핑

| 게임 맵 | Ninja Adventure 타일셋 |
|---------|------------------------|
| 노비스 던전 | Dungeon |
| 우드랜드 | Forest, Grass |
| 피에트 던전 | Dungeon Dark |
| 아벨 해안 | Beach, Water |
| 호러캐슬 | Castle, Gothic |
| 베크나 탑 | Tower, Magic |

### BGM 매핑

| 게임 상황 | Ninja Adventure 트랙 |
|----------|---------------------|
| 마을 | Town Theme |
| 필드 | Adventure, Exploration |
| 던전 | Dungeon, Cave |
| 보스전 | Boss Battle |
| 전투 | Combat, Action |
| 승리 | Victory |
| 메뉴 | Menu Theme |

---

## 📐 스프라이트 규격

### 캐릭터 스프라이트시트

```
크기: 16x16 픽셀 (프레임당)
시트: 64x64 (4방향 × 4프레임)

┌────┬────┬────┬────┐
│ D1 │ D2 │ D3 │ D4 │  Down (아래)
├────┼────┼────┼────┤
│ L1 │ L2 │ L3 │ L4 │  Left (왼쪽)
├────┼────┼────┼────┤
│ R1 │ R2 │ R3 │ R4 │  Right (오른쪽)
├────┼────┼────┼────┤
│ U1 │ U2 │ U3 │ U4 │  Up (위)
└────┴────┴────┴────┘
```

### 몬스터 스프라이트시트

```
소형: 16x16 (슬라임, 쥐, 박쥐)
중형: 24x24 (고블린, 오크, 스켈레톤)
대형: 32x32 (보스)

애니메이션:
- idle: 4프레임, 6fps
- attack: 4프레임, 10fps
- death: 4-6프레임, 8fps
```

### 타일셋

```
타일 크기: 16x16 픽셀
시트 크기: 256x256 이상
```

---

## 🔊 오디오 규격

### BGM

| 속성 | 값 |
|------|-----|
| 형식 | OGG (권장), MP3 |
| 비트레이트 | 128-192 kbps |
| 샘플레이트 | 44.1 kHz |
| 채널 | 스테레오 |
| 루프 | 심리스 루프 권장 |

### SFX

| 속성 | 값 |
|------|-----|
| 형식 | OGG (권장), WAV |
| 샘플레이트 | 44.1 kHz |
| 채널 | 모노/스테레오 |
| 길이 | 0.1초 ~ 3초 |

---

## 📁 에셋 폴더 구조

```
public/
└── assets/
    ├── sprites/
    │   ├── characters/
    │   │   ├── warrior.png
    │   │   ├── mage.png
    │   │   ├── archer.png
    │   │   └── thief.png
    │   ├── monsters/
    │   │   ├── circle1/      # 1써클 몬스터
    │   │   │   ├── rat.png
    │   │   │   ├── bat.png
    │   │   │   ├── spider.png
    │   │   │   ├── goblin.png
    │   │   │   ├── slime.png
    │   │   │   └── ...
    │   │   ├── circle2/      # 2써클 몬스터
    │   │   ├── circle3/      # 3써클 몬스터
    │   │   ├── circle4/      # 4써클 몬스터
    │   │   └── circle5/      # 5써클 몬스터
    │   └── effects/
    │       ├── skills/
    │       ├── hits/
    │       └── buffs/
    ├── tilesets/
    │   ├── dungeon.png
    │   ├── forest.png
    │   ├── coast.png
    │   ├── castle.png
    │   └── tower.png
    ├── audio/
    │   ├── bgm/
    │   │   ├── town.ogg
    │   │   ├── dungeon.ogg
    │   │   ├── forest.ogg
    │   │   ├── boss.ogg
    │   │   └── victory.ogg
    │   └── sfx/
    │       ├── attack/
    │       │   ├── sword_slash.ogg
    │       │   ├── bow_shoot.ogg
    │       │   └── magic_cast.ogg
    │       ├── hit/
    │       │   ├── hit_flesh.ogg
    │       │   └── hit_metal.ogg
    │       ├── ui/
    │       │   ├── click.ogg
    │       │   ├── open.ogg
    │       │   └── close.ogg
    │       └── monster/
    │           ├── hurt.ogg
    │           └── death.ogg
    └── ui/
        ├── icons/
        │   ├── items/
        │   ├── skills/
        │   └── buffs/
        ├── buttons/
        ├── panels/
        └── portraits/
```

---

## ✅ 에셋 체크리스트

### 필수 에셋 (Phase 1)

- [ ] **캐릭터**
  - [ ] 전사 스프라이트 (4방향, 4프레임)
  - [ ] 마법사 스프라이트
  - [ ] 궁수 스프라이트
  - [ ] 도적 스프라이트

- [ ] **1써클 몬스터**
  - [ ] 쥐, 박쥐, 거미
  - [ ] 고블린, 슬라임, 늑대
  - [ ] 오크, 트롤, 곰

- [ ] **타일셋**
  - [ ] 던전 타일셋
  - [ ] 숲 타일셋

- [ ] **오디오**
  - [ ] 마을 BGM
  - [ ] 던전 BGM
  - [ ] 기본 SFX (공격, 피격, UI)

### 확장 에셋 (Phase 2)

- [ ] 2~5써클 몬스터
- [ ] 추가 타일셋 (해안, 성, 탑)
- [ ] 스킬 이펙트
- [ ] 추가 BGM/SFX

---

## 📜 라이선스 정보

### CC0 (Creative Commons Zero)
- **의무사항**: 없음
- **허용사항**: 상업용, 수정, 2차 창작, 재배포 모두 가능
- **저작권 표시**: 불필요 (권장은 함)

### CC-BY (Attribution)
- **의무사항**: 원작자 표시 필요
- **허용사항**: 상업용, 수정, 2차 창작, 재배포 가능

### 크레딧 (CREDITS.md에 포함 권장)

```markdown
## 에셋 크레딧

### Ninja Adventure Asset Pack
- **제작자**: pixel-boy (Antoine Duroisin)
- **라이선스**: CC0
- **URL**: https://pixel-boy.itch.io/ninja-adventure-asset-pack

### OpenGameArt CC0 RPG SFX
- **라이선스**: CC0
- **URL**: https://opengameart.org/content/80-cc0-rpg-sfx
```

---

## ⚠️ 주의사항

1. **일관성 유지**: 모든 에셋은 16x16 픽셀아트 스타일로 통일
2. **출처 기록**: 새 에셋 추가 시 이 문서에 출처 기록
3. **라이선스 확인**: 사용 전 라이선스 재확인
4. **파일명 규칙**: 소문자, 언더스코어 사용 (예: `monster_slime.png`)
5. **원본 보관**: 다운로드한 원본 에셋 팩은 별도 보관

---

*이 문서는 에셋 추가 시 반드시 업데이트하세요.*
