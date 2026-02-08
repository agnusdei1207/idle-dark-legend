# 🎨 에셋 전략 가이드

> 최종 업데이트: 2026-02-08 12:00  
> **목표**: 무료 에셋으로 어둠의전설 스타일 구현

---

## 📋 요약

| 항목 | 결정 |
|------|------|
| **메인 에셋** | Ninja Adventure Pack (CC0) |
| **보조 에셋** | OpenGameArt CC0 SFX |
| **총 비용** | **$0 (무료)** |
| **스타일** | 16x16 픽셀아트 |
| **일관성** | ⭐ 높음 (단일 에셋 팩 사용) |

---

## 🚀 실행 계획

### Step 1: Ninja Adventure Pack 다운로드 (5분)

1. **접속**: https://pixel-boy.itch.io/ninja-adventure-asset-pack
2. **다운로드**: "Download Now" 클릭 → 가격에 `$0` 입력 (무료)
3. **압축 해제**: 다운로드된 ZIP 파일 압축 해제

```
다운로드 위치: ~/Downloads/NinjaAdventure.zip
압축 해제 위치: ~/Downloads/NinjaAdventure/
```

---

### Step 2: 에셋 정리 및 배치 (30분)

프로젝트 `public/assets/` 폴더에 에셋 복사:

```bash
# 1. 에셋 폴더 구조 생성
cd /Users/pf/workspace/dark-legend-classic
mkdir -p public/assets/{sprites/{characters,monsters/{circle1,circle2,circle3,circle4,circle5},effects},tilesets,audio/{bgm,sfx},ui/{icons,buttons,panels}}

# 2. Ninja Adventure Pack에서 에셋 복사 (수동)
```

#### 캐릭터 매핑

| 게임 직업 | Ninja Adventure 폴더 | 복사 경로 |
|----------|----------------------|-----------|
| 전사 | `Actors/Characters/Knight/` | `sprites/characters/warrior/` |
| 마법사 | `Actors/Characters/Mage/` | `sprites/characters/mage/` |
| 궁수 | `Actors/Characters/Archer/` | `sprites/characters/archer/` |
| 도적 | `Actors/Characters/Ninja/` | `sprites/characters/thief/` |

#### 몬스터 매핑 (1써클)

| 게임 몬스터 | Ninja Adventure 폴더 | 복사 경로 |
|------------|----------------------|-----------|
| 쥐 | `Actors/Monsters/Rat/` | `sprites/monsters/circle1/rat/` |
| 박쥐 | `Actors/Monsters/Bat/` | `sprites/monsters/circle1/bat/` |
| 거미 | `Actors/Monsters/Spider/` | `sprites/monsters/circle1/spider/` |
| 슬라임 | `Actors/Monsters/Slime/` | `sprites/monsters/circle1/slime/` |
| 고블린 | `Actors/Monsters/Goblin/` | `sprites/monsters/circle1/goblin/` |
| 늑대 | `Actors/Monsters/Wolf/` | `sprites/monsters/circle1/wolf/` |
| 오크 | `Actors/Monsters/Orc/` | `sprites/monsters/circle1/orc/` |

#### 타일셋 매핑

| 게임 맵 | Ninja Adventure 폴더 | 복사 경로 |
|---------|----------------------|-----------|
| 던전 | `Backgrounds/Tilesets/Dungeon/` | `tilesets/dungeon.png` |
| 숲 | `Backgrounds/Tilesets/Forest/` | `tilesets/forest.png` |
| 마을 | `Backgrounds/Tilesets/Town/` | `tilesets/town.png` |

#### 오디오 매핑

| 게임 상황 | Ninja Adventure 폴더 | 복사 경로 |
|----------|----------------------|-----------|
| 마을 BGM | `Musics/Town/` | `audio/bgm/town.ogg` |
| 던전 BGM | `Musics/Dungeon/` | `audio/bgm/dungeon.ogg` |
| 보스 BGM | `Musics/Boss/` | `audio/bgm/boss.ogg` |
| 공격 SFX | `Sounds/Hit/` | `audio/sfx/attack/` |
| UI SFX | `Sounds/Menu/` | `audio/sfx/ui/` |

---

### Step 3: PreloadScene 업데이트 (20분)

`src/scenes/BootScene.ts` 수정하여 에셋 로딩:

```typescript
// 캐릭터 스프라이트시트
this.load.spritesheet('char_warrior', 'assets/sprites/characters/warrior/spritesheet.png', {
    frameWidth: 16, frameHeight: 16
});

// 몬스터 스프라이트시트
this.load.spritesheet('monster_slime', 'assets/sprites/monsters/circle1/slime/spritesheet.png', {
    frameWidth: 16, frameHeight: 16
});

// 타일셋
this.load.image('tileset_dungeon', 'assets/tilesets/dungeon.png');

// BGM
this.load.audio('bgm_town', 'assets/audio/bgm/town.ogg');

// SFX
this.load.audio('sfx_attack', 'assets/audio/sfx/attack/sword.ogg');
```

---

### Step 4: 애니메이션 정의 (15분)

`src/config/animations.config.ts` 생성:

```typescript
// 캐릭터 애니메이션
scene.anims.create({
    key: 'warrior_walk_down',
    frames: scene.anims.generateFrameNumbers('char_warrior', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
});

// 몬스터 애니메이션
scene.anims.create({
    key: 'slime_idle',
    frames: scene.anims.generateFrameNumbers('monster_slime', { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1
});
```

---

## 📦 에셋 우선순위

### 🔴 Phase 1: 필수 (게임 작동 최소 요건)

| 카테고리 | 에셋 | 수량 |
|----------|------|------|
| **캐릭터** | 전사 스프라이트 | 1 |
| **몬스터** | 슬라임, 스켈레톤 | 2 |
| **타일셋** | 던전 타일셋 | 1 |
| **BGM** | 던전 BGM | 1 |
| **SFX** | 공격, 피격 | 2 |

**예상 소요 시간**: 1시간

### 🟡 Phase 2: 권장 (기본 플레이 가능)

| 카테고리 | 에셋 | 수량 |
|----------|------|------|
| **캐릭터** | 마법사, 궁수, 도적 | 3 |
| **몬스터** | 1써클 전체 (9종) | 9 |
| **타일셋** | 숲, 마을 | 2 |
| **BGM** | 마을, 보스 | 2 |
| **SFX** | 스킬, UI | 10+ |

**예상 소요 시간**: 2시간

### 🟢 Phase 3: 확장 (전체 컨텐츠)

| 카테고리 | 에셋 | 수량 |
|----------|------|------|
| **몬스터** | 2~5써클 (34종) | 34 |
| **타일셋** | 해안, 성, 탑 | 3 |
| **BGM** | 추가 BGM | 5+ |
| **이펙트** | 스킬 이펙트 | 20+ |

**예상 소요 시간**: 4시간

---

## 🔧 문제 해결

### 문제 1: 에셋 스타일 불일치

**원인**: 다른 에셋 팩 혼용  
**해결**: Ninja Adventure Pack만 사용

### 문제 2: 특정 몬스터 없음

**원인**: 어둠의전설 몬스터가 Ninja Pack에 없음  
**해결 방안**:

| 해결책 | 비용 | 난이도 | 일관성 |
|--------|------|--------|--------|
| 비슷한 몬스터 사용 | $0 | ⭐ | ⭐⭐⭐⭐⭐ |
| OpenGameArt 추가 | $0 | ⭐⭐ | ⭐⭐⭐ |
| AI 생성 (Stable Diffusion) | $0~20 | ⭐⭐⭐ | ⭐⭐ |
| 유료 에셋 구매 | $10~50 | ⭐ | ⭐⭐⭐ |

**권장**: 비슷한 몬스터로 대체 (일관성 최우선)

### 문제 3: 스프라이트시트 형식

**원인**: 개별 프레임 vs 스프라이트시트  
**해결**: TexturePacker 또는 수동 병합

---

## 💡 대체 몬스터 매핑

Ninja Adventure Pack에 없는 몬스터 → 대체 몬스터:

| 원본 몬스터 | 대체 몬스터 | 비고 |
|------------|------------|------|
| 트롤 | Orc (크게) | 색상 변경 |
| 곰 | Wolf (크게) | 색상 변경 |
| 버섯요정 | Wizard Mushroom | 색상 변경 |
| 트렌트 | Large Slime | 녹색 색상 |
| 머맨 | Ninja (물색) | 색상 변경 |
| 가고일 | Demon | 회색 색상 |
| 드라큘라 | Vampire | 그대로 |
| 웨어울프 | Wolf (큰 버전) | 색상 변경 |

---

## 📊 비용 비교

| 옵션 | 비용 | 스타일 일관성 | 소요 시간 |
|------|------|--------------|-----------|
| **Ninja Adventure (무료)** | **$0** | ⭐⭐⭐⭐⭐ | 3~5시간 |
| 유료 통합 팩 | $20~50 | ⭐⭐⭐⭐ | 2~3시간 |
| 여러 무료 팩 혼합 | $0 | ⭐⭐ | 5~8시간 |
| AI 생성 | $0~20 | ⭐⭐ | 10시간+ |
| 아웃소싱 | $500+ | ⭐⭐⭐⭐⭐ | 2주+ |

**결론**: Ninja Adventure Pack 사용이 **최적**

---

## ✅ 체크리스트

### 다운로드
- [ ] Ninja Adventure Pack 다운로드
- [ ] OpenGameArt RPG SFX 다운로드 (선택)

### Phase 1 (필수)
- [ ] 전사 캐릭터 배치
- [ ] 슬라임 몬스터 배치
- [ ] 던전 타일셋 배치
- [ ] 던전 BGM 배치
- [ ] 기본 SFX 배치
- [ ] PreloadScene 업데이트
- [ ] 테스트

### Phase 2 (권장)
- [ ] 나머지 직업 캐릭터 (3개)
- [ ] 1써클 몬스터 전체 (9개)
- [ ] 추가 타일셋 (2개)
- [ ] 추가 BGM (2개)
- [ ] 추가 SFX

### Phase 3 (확장)
- [ ] 2~5써클 몬스터
- [ ] 나머지 타일셋
- [ ] 스킬 이펙트
- [ ] 나머지 BGM/SFX

---

## 🔗 에셋 다운로드 링크

| 에셋 | URL |
|------|-----|
| **Ninja Adventure Pack** | https://pixel-boy.itch.io/ninja-adventure-asset-pack |
| **OpenGameArt RPG SFX** | https://opengameart.org/content/80-cc0-rpg-sfx |
| **OpenGameArt Music** | https://opengameart.org/content/fantasy-music-collection |

---

*에셋 작업 시 이 문서를 참고하세요.*
