# 어둠의전설 클래식 - 개발 계획

## 📊 현재 상태 분석

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

### 🐛 발견된 버그
1. **골드 음수 버그** - 인벤토리에 `-180 Gold` 표시
2. **UI 중첩** - 여러 UI 동시 열림 시 겹침
3. **캐릭터 스탯 0** - 공격력/방어력 모두 0 표시
4. **NPC 대화창** - ESC로 닫히지 않음

### 🚧 미구현 기능
1. 성직자, 무도가 직업
2. 레벨 6 전직 시스템
3. 어둠의전설 스킬들
4. 스킬 이펙트
5. 에셋 시스템

---

## 🎮 직업 시스템 (5대 직업)

### 1. 전사 (Warrior)
- **특성**: 근접, 고체력, 탱커
- **주요 스탯**: STR (힘)
- **주요 스킬**:
  - 베기 (Slash) - 기본 공격
  - 메가어택 (Mega Attack) - 4배 데미지
  - 돌진 (Charge) - 전방 5칸 돌격
  - 크래셔 (Crasher) - 필살기
  - 레스큐 (Rescue) - 어그로 끌기
  - 집중 (Focus) - 크래셔 위력 2배

### 2. 마법사 (Mage)
- **특성**: 원거리, 속성 마법
- **주요 스탯**: INT (지능)
- **주요 스킬**:
  - 플라메라 (Flamera) → 플레어 (Flare) - 화염
  - 테라미에라 (Teramiera) → 아이스블러스트 (Ice Blast) - 빙결
  - 프라보 (Pravo) - 저주
  - 프라베라 (Pravera) - 전체 저주
  - 라그나로크 (Ragnarok) - 전체 공격
  - 매직프로텍션 (Magic Protection) - 방어 증가

### 3. 도적 (Rogue)
- **특성**: 은신, 크리티컬
- **주요 스탯**: DEX (민첩)
- **주요 스킬**:
  - 하이드 (Hide) - 은신
  - 백스텝 (Backstep) - 찌르기
  - 습격 (Assault) - 암살 공격
  - 아무네지아 (Amnesia) - 인식 초기화
  - 더블어택 (Double Attack) - 2회 공격
  - 트리플어택 (Triple Attack) - 3회 공격

### 4. 성직자 (Cleric) ⚠️ 신규 추가 필요
- **특성**: 힐러, 버퍼, 디버프 해제
- **주요 스탯**: WIS (지혜)
- **주요 스킬**:
  - 쿠로 (Kuro) - 기본 힐
  - 쿠라노 (Kurano) - 중급 힐
  - 쿠라노소 (Kuranoso) - 고급 힐
  - 쿠러스 (Kurus) - 그룹 힐
  - 이모탈 (Immortal) - 무적
  - 디스펠라 (Dispella) - 저주 해제
  - 홀리볼트 (Holy Bolt) - 공격

### 5. 무도가 (Monk) ⚠️ 신규 추가 필요
- **특성**: 하이브리드 (전직 불가)
- **주요 스탯**: STR + CON
- **주요 스킬**:
  - 정권 (Jeongkwon) - 기본 공격
  - 단각 (Dangak) - 발차기
  - 양의신권 (Yangui) - 2회 공격
  - 이형환위 (Ihyeong) - 뒤로 이동
  - 금강불괴 (Geumgang) - 무적
  - 장풍 (Jangpung) - 원거리 공격
  - 달마신공 (Dalma) - 필살기

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
│   │   ├── rat.png
│   │   ├── spider.png
│   │   ├── slime.png
│   │   └── wolf.png
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
│   └── isometric-tiles.png (이미 있음)
├── ui/
│   ├── icons/
│   │   ├── skills.png (스킬 아이콘 아틀라스)
│   │   └── items.png (아이템 아이콘 아틀라스)
│   └── frames/
│       ├── button.png
│       └── panel.png
└── audio/
    ├── bgm/
    └── sfx/
```

### 에셋 추가 방법

1. **스프라이트시트 준비** (32x48 기준)
   ```
   - 프레임 순서: 하, 좌, 우, 상
   - 각 방향 4프레임 (걷기 애니메이션)
   ```

2. **BootScene.ts에 로드 추가**
   ```typescript
   // 플레이어 스프라이트
   this.load.spritesheet('class_warrior', 'assets/sprites/player/warrior.png', {
       frameWidth: 32,
       frameHeight: 48
   });
   
   // 몬스터 스프라이트
   this.load.spritesheet('monster_rat', 'assets/sprites/monsters/rat.png', {
       frameWidth: 32,
       frameHeight: 32
   });
   
   // 스킬 이펙트
   this.load.spritesheet('effect_fire', 'assets/effects/fire/fireball.png', {
       frameWidth: 64,
       frameHeight: 64
   });
   ```

3. **애니메이션 정의** (GameScene.ts)
   ```typescript
   this.anims.create({
       key: 'warrior_walk_down',
       frames: this.anims.generateFrameNumbers('class_warrior', { start: 0, end: 3 }),
       frameRate: 8,
       repeat: -1
   });
   ```

### 스킬 이펙트 구현

```typescript
// 스킬 이펙트 예시
showSkillEffect(x: number, y: number, skillId: string): void {
    const effects: Record<string, { frames: number; color: number }> = {
        'flamera': { frames: 8, color: 0xff4400 },
        'ice_blast': { frames: 8, color: 0x44aaff },
        'heal': { frames: 6, color: 0x44ff44 },
        'crasher': { frames: 10, color: 0xffaa00 },
    };
    
    const config = effects[skillId];
    if (!config) return;
    
    // 파티클 또는 스프라이트 애니메이션
    const effect = this.add.sprite(x, y, `effect_${skillId}`);
    effect.play(`effect_${skillId}_anim`);
    effect.once('animationcomplete', () => effect.destroy());
}
```

---

## 📋 우선순위 작업 목록

### Phase 1: 버그 수정 (즉시)
1. [ ] 골드 음수 버그 수정
2. [ ] 캐릭터 스탯 초기화 수정
3. [ ] NPC 대화창 ESC 처리

### Phase 2: 직업 시스템 (1일)
1. [ ] 성직자 직업 추가 (classes.data.ts)
2. [ ] 무도가 직업 추가 (classes.data.ts)
3. [ ] 레벨 6 전직 UI 구현
4. [ ] 직업 선택 NPC 추가

### Phase 3: 스킬 시스템 (2일)
1. [ ] 어둠의전설 스킬 데이터 추가 (skills.data.ts)
2. [ ] 스킬 트리 업데이트
3. [ ] 스킬 사용 로직 구현
4. [ ] 스킬 이펙트 시스템

### Phase 4: 에셋 통합 (에셋 준비 후)
1. [ ] 스프라이트 로딩 시스템
2. [ ] 애니메이션 시스템
3. [ ] 이펙트 시스템
4. [ ] 사운드 시스템

---

## 🔧 기술 스택

- **엔진**: Phaser 3.60+
- **언어**: TypeScript
- **빌드**: Vite
- **스타일**: CSS Variables

## 📁 핵심 파일

| 파일 | 역할 |
|------|------|
| `src/data/classes.data.ts` | 직업 정의 |
| `src/data/skills.data.ts` | 스킬 정의 |
| `src/scenes/GameScene.ts` | 메인 게임 로직 |
| `src/ui/SkillTreeUI.ts` | 스킬 트리 UI |
| `src/systems/CombatSystem.ts` | 전투 시스템 |
