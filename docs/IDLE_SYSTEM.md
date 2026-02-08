# 🎮 Idle 어둠의전설 - 시스템 설계

> 최종 업데이트: 2026-02-08 11:50

## 📊 게임 개요

### 컨셉
- **Idle/방치형 RPG**: 자동 사냥이 기본
- **오프라인 진행**: 최대 8시간 오프라인 보상
- **어둠의전설 향수**: 원작의 사냥터/몬스터 재현

---

## 🗺️ 사냥터 (어둠의전설 기반)

### 1써클 (Lv 1~10)
| 사냥터 | 레벨 | 몬스터 | 효율(EXP/분) |
|--------|------|--------|-------------|
| 노비스 마을 던전 | 1-5 | 쥐, 박쥐, 거미 | 20 |
| 우드랜드 1존 | 5-8 | 고블린, 슬라임, 늑대 | 36 |
| 우드랜드 2존 | 8-10 | 오크, 트롤, 야생곰 | 50 |

### 2써클 (Lv 11~40)
| 사냥터 | 레벨 | 몬스터 | 효율(EXP/분) |
|--------|------|--------|-------------|
| 포테의 숲 | 11-20 | 버섯요정, 트렌트, 드라이어드 | 88 |
| 피에트 던전 1층 | 20-30 | 스켈레톤, 좀비, 구울 | 120 |
| 피에트 던전 2층 | 30-40 | 좀비나이트, 레이스, 뱀파이어배트 | 180 |

### 3써클 (Lv 41~70)
| 사냥터 | 레벨 | 몬스터 | 효율(EXP/분) |
|--------|------|--------|-------------|
| 아벨 해안던전 | 41-50 | 크랩, 해적도적, 머맨 | 270 |
| 아벨 던전 1층 | 50-60 | 가고일, 미믹, 데스아이 | 330 |
| 아벨 던전 2층 | 60-70 | 리치, 듈라한, 데몬아처 | 455 |

### 4써클 (Lv 71~98)
| 사냥터 | 레벨 | 몬스터 | 효율(EXP/분) |
|--------|------|--------|-------------|
| 뤼케시온 해안던전 | 71-80 | 크라켄촉수, 시파이라테, 딥원 | 600 |
| 해저 던전 | 80-90 | 머메이드, 씨드래곤, 포세이돈 | 750 |
| 난파선 | 90-98 | 고스트캡틴, 커스드세일러, 레비아탄 | 880 |

### 5써클 (Lv 99+)
| 사냥터 | 레벨 | 몬스터 | 효율(EXP/분) |
|--------|------|--------|-------------|
| 호러캐슬 | 99+ | 드라큘라, 웨어울프, 프랑켄 | 1260 |
| 백작부인의 별장 | 99+ | 메이드고스트, 아이언메이든, 카운테스 | 1500 |
| 베크나 탑 | 99+ | 다크위차스, 베크나졸, 대마법사 | 1750 |

---

## ⚔️ Idle 시스템

### 자동 사냥 메커니즘
```typescript
interface IdleConfig {
  autoHuntEnabled: boolean;      // 자동 사냥 활성화 (기본: true)
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
  offlineEfficiency: number;     // 오프라인 사냥 효율 (50%)
  
  // 오프라인 동안 축적된 보상
  earnedExp: number;
  earnedGold: number;
  earnedItems: ItemDrop[];
  monstersKilled: number;
}
```

### 오프라인 보상 계산 공식
```
killedMonsters = zone.avgKillsPerMinute × offlineMinutes × 0.5 (효율)
earnedExp = killedMonsters × zone.avgExpPerKill
earnedGold = killedMonsters × zone.avgGoldPerKill
itemDropCount = killedMonsters × 0.05 (5% 드롭률)
```

---

## 🎨 에셋 전략

### 📦 선정 에셋 팩 (필수)

#### Ninja Adventure Asset Pack (CC0)
| 항목 | 정보 |
|------|------|
| **제작자** | pixel-boy (Antoine Duroisin) |
| **라이선스** | CC0 (완전 무료, 상업용 가능) |
| **다운로드 URL** | https://pixel-boy.itch.io/ninja-adventure-asset-pack |

**포함 내용:**
- 캐릭터 50종+ (애니메이션)
- 몬스터 30종+ (애니메이션)
- 보스 9종
- 타일셋 (외부/내부)
- 효과음 100개+
- BGM 37곡
- UI 요소
- 이펙트 30종+

#### OpenGameArt CC0 RPG SFX (보조)
| 항목 | 정보 |
|------|------|
| **라이선스** | CC0 |
| **다운로드 URL** | https://opengameart.org/content/80-cc0-rpg-sfx |

**포함 내용:**
- 스킬 효과음 80종+
- 환경 사운드

### 🖼️ 스프라이트 규격

| 종류 | 크기 | 프레임 | 형식 |
|------|------|--------|------|
| 캐릭터 | 16x16 | 4방향 × 4프레임 | PNG |
| 몬스터 (소형) | 16x16 | idle 4, attack 4, death 4 | PNG |
| 몬스터 (중형) | 24x24 | idle 4, attack 4, death 4 | PNG |
| 보스 | 32x32 | idle 6, attack 6, death 6 | PNG |
| 타일 | 16x16 | - | PNG |
| 이펙트 | 16x16 ~ 32x32 | 6~12프레임 | PNG |

### 🎵 오디오 규격

| 종류 | 형식 | 품질 |
|------|------|------|
| BGM | OGG/MP3 | 128~192 kbps, 44.1 kHz |
| SFX | OGG/WAV | 44.1 kHz |

---

## 💰 에셋 비용 분석

| 옵션 | 비용 | 평가 |
|------|------|------|
| **Ninja Adventure (CC0)** | **$0** | ⭐⭐⭐⭐⭐ 최적 |
| 유료 에셋팩 | $10~50 | 필요시 |
| AI 생성 | $0~20 | 보조용 |
| 외주 제작 | $200+ | 불필요 |

**결론**: Ninja Adventure Pack으로 **100% 무료로** 구현 가능

---

## 📁 에셋 폴더 구조

```
public/assets/
├── sprites/
│   ├── characters/     # 플레이어 캐릭터
│   │   ├── warrior/    # 전사
│   │   ├── mage/       # 마법사
│   │   ├── archer/     # 궁수
│   │   └── thief/      # 도적
│   ├── monsters/       # 몬스터 (써클별)
│   │   ├── circle1/    # 1써클
│   │   ├── circle2/    # 2써클
│   │   ├── circle3/    # 3써클
│   │   ├── circle4/    # 4써클
│   │   └── circle5/    # 5써클
│   └── effects/        # 이펙트
├── tilesets/           # 타일셋
├── audio/
│   ├── bgm/            # 배경음악
│   └── sfx/            # 효과음
└── ui/                 # UI 요소
```

---

## 🔄 구현 상태

### ✅ 완료

| 항목 | 파일 |
|------|------|
| Idle 시스템 | `src/systems/IdleSystem.ts` |
| 사냥터 데이터 (17개) | `src/systems/IdleSystem.ts` |
| 몬스터 데이터 (43종) | `src/data/monsters.data.ts` |
| 오프라인 보상 UI | `src/ui/OfflineRewardUI.ts` |
| 사냥터 선택 UI | `src/ui/HuntingZoneUI.ts` |

### ⏳ 대기

| 항목 | 설명 |
|------|------|
| 에셋 다운로드 | Ninja Adventure Pack |
| PreloadScene | 에셋 로딩 |
| GameScene 연동 | IdleSystem 통합 |
| 실제 테스트 | 자동 사냥, 오프라인 보상 |

---

## 🔗 관련 문서

- [에셋 가이드](./ASSET_GUIDE.md) - 에셋 규격 및 출처
- [진행 상황](./PROGRESS.md) - 개발 진행도
- [크레딧](../CREDITS.md) - 에셋 라이선스

---

*이 문서는 Idle 시스템 개발 진행에 따라 업데이트됩니다.*
