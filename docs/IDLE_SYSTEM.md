# 🎮 Idle 어둠의전설 - 시스템 설계

> 최종 업데이트: 2026-02-08 11:15

## 📊 게임 개요

### 컨셉
- **Idle/방치형 RPG**: 자동 사냥이 기본
- **오프라인 진행**: 최대 8시간 오프라인 보상
- **어둠의전설 향수**: 원작의 사냥터/몬스터 재현

---

## 🗺️ 사냥터 (어둠의전설 기반)

### 1써클 (Lv 1~10)
| 사냥터 | 레벨 | 몬스터 |
|--------|------|--------|
| 노비스 마을 던전 | 1-5 | 쥐, 박쥐, 거미 |
| 우드랜드 1존 | 5-8 | 고블린, 슬라임, 늑대 |
| 우드랜드 2존 | 8-10 | 오크, 트롤, 야생곰 |

### 2써클 (Lv 11~40)
| 사냥터 | 레벨 | 몬스터 |
|--------|------|--------|
| 포테의 숲 | 11-20 | 버섯요정, 트렌트, 드라이어드 |
| 피에트 던전 1층 | 20-30 | 스켈레톤, 좀비, 구울 |
| 피에트 던전 2층 | 30-40 | 좀비나이트, 레이스, 뱀파이어배트 |

### 3써클 (Lv 41~70)
| 사냥터 | 레벨 | 몬스터 |
|--------|------|--------|
| 아벨 해안던전 | 41-50 | 크랩, 해적도적, 머맨 |
| 아벨 던전 1층 | 50-60 | 가고일, 미믹, 데스아이 |
| 아벨 던전 2층 | 60-70 | 리치, 듈라한, 데몬아처 |

### 4써클 (Lv 71~98)
| 사냥터 | 레벨 | 몬스터 |
|--------|------|--------|
| 뤼케시온 해안던전 | 71-80 | 크라켄촉수, 시파이라테, 딥원 |
| 해저 던전 | 80-90 | 머메이드, 씨드래곤, 포세이돈 |
| 난파선 | 90-98 | 고스트캡틴, 커스드세일러, 레비아탄 |

### 5써클 (Lv 99+)
| 사냥터 | 레벨 | 몬스터 |
|--------|------|--------|
| 호러캐슬 | 99+ | 드라큘라, 웨어울프, 프랑켄 |
| 백작부인의 별장 | 99+ | 메이드고스트, 아이언메이든, 카운테스 |
| 베크나 탑 | 99+ | 다크위차스, 베크나졸, 대마법사 |

---

## ⚔️ Idle 시스템

### 자동 사냥 메커니즘
```typescript
interface IdleConfig {
  autoHuntEnabled: boolean;      // 자동 사냥 활성화
  autoPickupEnabled: boolean;    // 자동 아이템 습득
  autoSkillEnabled: boolean;     // 자동 스킬 사용
  autoPotionEnabled: boolean;    // 자동 포션 사용
  potionThreshold: number;       // HP% 이하시 포션 사용 (예: 30)
}
```

### 오프라인 진행 시스템
```typescript
interface OfflineProgress {
  lastLogoutTime: number;        // 마지막 로그아웃 시간
  maxOfflineHours: number;       // 최대 오프라인 시간 (8시간)
  
  // 오프라인 동안 축적된 보상
  earnedExp: number;
  earnedGold: number;
  earnedItems: ItemDrop[];
  monstersKilled: number;
}
```

### 오프라인 보상 계산
```typescript
function calculateOfflineRewards(player: Player, zone: HuntingZone, hours: number): OfflineProgress {
  const effectiveHours = Math.min(hours, 8); // 최대 8시간
  const killsPerHour = zone.avgKillsPerHour * player.huntingEfficiency;
  const totalKills = Math.floor(killsPerHour * effectiveHours);
  
  return {
    monstersKilled: totalKills,
    earnedExp: totalKills * zone.avgExpPerKill,
    earnedGold: totalKills * zone.avgGoldPerKill,
    earnedItems: calculateDrops(zone, totalKills)
  };
}
```

---

## 🎨 에셋 전략

### 📦 선정 에셋 팩

#### 1. Ninja Adventure Asset Pack (CC0) - 메인
- **출처**: https://pixel-boy.itch.io/ninja-adventure-asset-pack
- **라이선스**: CC0 (완전 무료, 상업용 가능)
- **포함 내용**:
  - 캐릭터 50종+ (애니메이션 포함)
  - 몬스터 30종+ (애니메이션 포함)
  - 보스 9종
  - 타일셋 (외부/내부)
  - 효과음 100개+
  - BGM 37곡
  - UI 요소
  - 이펙트 30종+
- **상태**: ✅ 무료 다운로드 가능

#### 2. OpenGameArt CC0 RPG SFX (보조)
- **출처**: https://opengameart.org
- **라이선스**: CC0
- **포함 내용**:
  - 스킬 효과음 80종+
  - 환경 사운드
- **상태**: ✅ 무료 다운로드 가능

### 🖼️ 스프라이트 규격

| 종류 | 크기 | 프레임 | 형식 |
|------|------|--------|------|
| 캐릭터 | 16x16 | 4방향 × 4프레임 | PNG |
| 몬스터 | 16x16 ~ 32x32 | idle 4, attack 4, death 4 | PNG |
| 보스 | 32x32 ~ 64x64 | idle 6, attack 6, death 6 | PNG |
| 타일 | 16x16 | - | PNG |
| 이펙트 | 16x16 ~ 32x32 | 6~12프레임 | PNG |
| UI 아이콘 | 16x16 | - | PNG |

### 🎵 오디오 규격

| 종류 | 형식 | 비트레이트 | 샘플레이트 |
|------|------|------------|------------|
| BGM | OGG/MP3 | 128~192 kbps | 44.1 kHz |
| SFX | OGG/WAV | - | 44.1 kHz |

---

## 💰 에셋 비용 분석

| 옵션 | 비용 | 장점 | 단점 |
|------|------|------|------|
| **무료 에셋 (CC0)** | $0 | 비용 없음, 법적 안전 | 스타일 일관성 주의 |
| **유료 에셋팩** | $10~50 | 고품질, 통일된 스타일 | 비용 발생 |
| **AI 생성** | $0~20 | 맞춤 제작 | 품질 편차, 일관성 어려움 |
| **외주 제작** | $200~1000+ | 완전 커스텀 | 높은 비용, 시간 소요 |

### 🎯 권장 전략
1. **Ninja Adventure Pack (CC0)** 를 메인으로 사용
2. 부족한 몬스터는 **OpenGameArt CC0** 에서 보충
3. 어둠의전설 특화 요소는 **AI 이미지 생성**으로 커버
4. 모든 에셋은 **16x16 기준**으로 통일

---

## 📁 에셋 폴더 구조

```
public/
├── assets/
│   ├── sprites/
│   │   ├── characters/     # 플레이어 캐릭터
│   │   │   ├── warrior/
│   │   │   ├── mage/
│   │   │   ├── archer/
│   │   │   └── thief/
│   │   ├── monsters/       # 몬스터 (사냥터별)
│   │   │   ├── novice/     # 1써클
│   │   │   ├── forest/     # 2써클
│   │   │   ├── coast/      # 3써클
│   │   │   ├── deep/       # 4써클
│   │   │   └── horror/     # 5써클
│   │   └── bosses/         # 보스 몬스터
│   ├── tilesets/
│   │   ├── dungeon.png
│   │   ├── forest.png
│   │   ├── coast.png
│   │   └── castle.png
│   ├── effects/
│   │   ├── skills/         # 스킬 이펙트
│   │   ├── hits/           # 타격 이펙트
│   │   └── buffs/          # 버프 이펙트
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── town.ogg
│   │   │   ├── dungeon.ogg
│   │   │   ├── boss.ogg
│   │   │   └── victory.ogg
│   │   └── sfx/
│   │       ├── attack/
│   │       ├── skills/
│   │       ├── ui/
│   │       └── ambient/
│   └── ui/
│       ├── icons/
│       ├── buttons/
│       ├── panels/
│       └── portraits/
```

---

## 🔄 다음 단계

1. [x] 에셋 전략 수립
2. [ ] Ninja Adventure Pack 다운로드 및 정리
3. [ ] IdleSystem 구현
4. [ ] OfflineProgressSystem 구현
5. [ ] 어둠의전설 사냥터/몬스터 데이터 업데이트
6. [ ] 자동 사냥 UI 구현
7. [ ] 오프라인 보상 UI 구현

---

*이 문서는 Idle 시스템 개발 진행에 따라 업데이트됩니다.*
