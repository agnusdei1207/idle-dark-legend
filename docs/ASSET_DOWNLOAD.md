# 🎨 에셋 다운로드 가이드

> 게임에 필요한 무료 에셋을 다운로드하고 적용하는 방법입니다.

## 📥 필수 다운로드 에셋

### 1. Ninja Adventure Asset Pack (메인 에셋)

**다운로드 링크**: https://pixel-boy.itch.io/ninja-adventure-asset-pack

**라이선스**: CC0 (완전 무료, 상업용 가능, 저작권 표시 불필요)

**포함 내용**:
- 캐릭터 50종+ (애니메이션)
- 몬스터 30종+ (애니메이션)  
- 보스 9종
- 타일셋 (외부/내부)
- 효과음 100개+
- BGM 37곡
- UI 요소
- 이펙트 30종+

**다운로드 방법**:
1. 위 링크 클릭
2. "Download Now" 클릭
3. 가격에 $0 입력 (또는 원하는 금액 기부)
4. 다운로드된 ZIP 압축 해제

---

### 2. OpenGameArt CC0 RPG SFX

**다운로드 링크**: https://opengameart.org/content/80-cc0-rpg-sfx

**라이선스**: CC0

**포함 내용**:
- 스킬 효과음 80종+
- 검격, 마법, 치료, UI 등

---

## 📁 에셋 배치 방법

다운로드한 에셋을 다음 구조로 배치하세요:

```
public/assets/
├── sprites/
│   ├── characters/
│   │   ├── warrior.png       # Ninja Adventure > Actors > Characters
│   │   ├── mage.png
│   │   ├── archer.png
│   │   └── thief.png
│   ├── monsters/
│   │   ├── slime.png         # Ninja Adventure > Actors > Monsters
│   │   ├── skeleton.png
│   │   ├── goblin.png
│   │   └── ...
│   └── effects/
│       ├── slash.png         # Ninja Adventure > FX
│       ├── fire.png
│       └── ...
├── tilesets/
│   ├── dungeon.png           # Ninja Adventure > Backgrounds > Tilesets
│   ├── forest.png
│   └── ...
├── audio/
│   ├── bgm/
│   │   ├── town.ogg          # Ninja Adventure > Musics
│   │   ├── dungeon.ogg
│   │   └── ...
│   └── sfx/
│       ├── attack.ogg        # Ninja Adventure > SFX
│       ├── hit.ogg
│       └── ...
└── ui/
    ├── icons/                # Ninja Adventure > HUD > Icon
    ├── buttons/              # Ninja Adventure > HUD > Dialog
    └── panels/
```

---

## 🎮 스프라이트 규격

### 캐릭터 스프라이트시트 규격

| 방향 | 프레임 수 | 시트 크기 |
|------|----------|-----------|
| 아래 | 4 | 64x16 |
| 왼쪽 | 4 | 64x16 |
| 오른쪽 | 4 | 64x16 |
| 위 | 4 | 64x16 |

**총 시트 크기**: 64×64 (16×16 프레임 × 4방향 × 4프레임)

### 몬스터 스프라이트시트 규격

| 애니메이션 | 프레임 수 | 프레임 레이트 |
|------------|----------|---------------|
| idle | 4 | 6fps |
| attack | 4 | 10fps |
| death | 4~6 | 8fps |

---

## 🔊 오디오 규격

### BGM
- **형식**: OGG (권장) 또는 MP3
- **비트레이트**: 128~192 kbps
- **루프**: 무한 루프 가능하도록 편집

### SFX
- **형식**: OGG (권장) 또는 WAV
- **샘플레이트**: 44.1 kHz
- **길이**: 0.1초 ~ 3초

---

## 💡 대안 에셋 소스

### 무료 에셋
| 사이트 | URL | 라이선스 |
|--------|-----|----------|
| OpenGameArt | https://opengameart.org | 다양 (CC0, CC-BY) |
| Kenney | https://kenney.nl | CC0 |
| itch.io (free) | https://itch.io/game-assets/free | 다양 |

### 유료 에셋 (필요시)
| 사이트 | URL | 가격대 |
|--------|-----|--------|
| itch.io | https://itch.io/game-assets | $5~$50 |
| GraphicRiver | https://graphicriver.net | $10~$30 |
| Unity Asset Store | https://assetstore.unity.com | $10~$100 |

### AI 생성 (실험적)
- **Stable Diffusion**: 픽셀아트 생성 가능
- **DALL-E 3**: UI 요소 생성 가능
- **주의**: 일관성 유지 어려움, 후처리 필요

---

## ✅ 체크리스트

### 필수 에셋
- [ ] Ninja Adventure Pack 다운로드
- [ ] 캐릭터 스프라이트 배치 (4직업)
- [ ] 기본 몬스터 스프라이트 배치 (10종)
- [ ] 타일셋 배치 (던전, 숲, 해안)
- [ ] BGM 배치 (마을, 던전, 보스)
- [ ] 기본 SFX 배치 (공격, 피격, UI)

### 선택 에셋
- [ ] 추가 몬스터 스프라이트
- [ ] 스킬 이펙트
- [ ] 환경음
- [ ] 보스 BGM

---

*에셋 관련 문의는 Discord 또는 GitHub Issues에서!*
