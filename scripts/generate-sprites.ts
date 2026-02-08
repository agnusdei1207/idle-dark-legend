/**
 * AI 스프라이트 생성기
 *
 * 사용법:
 * 1. .env 파일에 API_KEY 입력
 * 2. npm run generate:sprites
 *
 * 지원 API:
 * - OpenAI DALL-E 3 (유료, 고품질)
 * - HuggingFace Stable Diffusion (무료)
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { config } from 'dotenv';

// 환경변수 로드
config();

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'assets', 'sprites', 'generated');

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============================================================
// 프롬프트 템플릿 (어둠의전설 스타일)
// ============================================================

const DARK_FANTASY_STYLE = `
Pixel art isometric character, dark fantasy style,
color palette: dark blue (#1a1a2e), dark purple (#16213e), crimson (#e94560),
transparent background, 64x64 pixels, sharp edges, RPG game sprite
`.trim().replace(/\s+/g, ' ');

const CHARACTER_TEMPLATES = {
    warrior: {
        base: 'warrior in heavy armor, sword and shield, strong build, red accent color',
        idle: 'standing still, ready stance',
        walk: 'walking forward, determined expression',
        attack: 'swinging sword downward, powerful motion',
        hurt: 'recoiling from damage, clutching chest',
        death: 'falling to knees, sword dropped'
    },
    mage: {
        base: 'mage in flowing robes, holding staff with glowing crystal, blue accent color',
        idle: 'standing still, staff glowing',
        walk: 'walking forward, robes flowing',
        attack: 'casting spell, staff raised, magical energy',
        hurt: 'recoiling, shielding with arms',
        death: 'collapsing, magical energy dissipating'
    },
    rogue: {
        base: 'rogue in leather armor, dual daggers, hooded, green accent color',
        idle: 'crouching, ready to strike',
        walk: 'creeping forward, stealthy movement',
        attack: 'lunging with daggers, swift motion',
        hurt: 'flinching, quick recovery',
        death: 'falling backward, daggers dropped'
    },
    cleric: {
        base: 'cleric in white and gold robes, holding holy symbol, golden accent color',
        idle: 'standing peacefully, praying',
        walk: 'walking forward, holy light aura',
        attack: 'casting holy spell, hands raised',
        hurt: 'recoiling, blessing self',
        death: 'kneeling, holy light ascending'
    },
    monk: {
        base: 'monk in simple robes, martial arts stance, bare fists, purple accent color',
        idle: 'meditative stance, calm',
        walk: 'walking forward, balanced posture',
        attack: 'punching forward, energy aura',
        hurt: 'blocking with arms, tough',
        death: 'meditating pose, fading away'
    }
};

function generatePrompt(character: string, action: string): string {
    const template = CHARACTER_TEMPLATES[character as keyof typeof CHARACTER_TEMPLATES];
    if (!template) {
        throw new Error(`Unknown character: ${character}`);
    }

    const basePrompt = template.base as string;
    const actionPrompt = template[action as keyof typeof template] as string;

    return `${DARK_FANTASY_STYLE}, ${basePrompt}, ${actionPrompt}`;
}

// ============================================================
// OpenAI DALL-E 3 (유료, 고품질)
// ============================================================

async function generateWithDALLE(prompt: string): Promise<Buffer> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not found in .env file');
    }

    // OpenAI SDK 대신 직접 API 호출 (간단한 이미지 생성)
    const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json' // Base64로 직접 받기
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    const b64Json = response.data.data[0].b64_json;
    return Buffer.from(b64Json, 'base64');
}

// ============================================================
// HuggingFace Stable Diffusion (무료)
// ============================================================

async function generateWithHuggingFace(prompt: string): Promise<Buffer> {
    const apiKey = process.env.HUGGINGFACE_API_KEY; // 선택사항

    // 무료 모델: stabilityai/stable-diffusion-2-1
    const model = 'stabilityai/stable-diffusion-2-1';

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        {
            inputs: prompt,
            parameters: {
                num_inference_steps: 30,
                guidance_scale: 7.5
            }
        },
        {
            headers,
            responseType: 'arraybuffer'
        }
    );

    return Buffer.from(response.data);
}

// ============================================================
// 이미지 저장
// ============================================================

async function saveSprite(buffer: Buffer, filename: string): Promise<string> {
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Saved: ${filepath}`);
    return filepath;
}

// ============================================================
// 메인 함수
// ============================================================

async function generateSprite(
    character: string,
    action: string,
    api: 'dalle' | 'huggingface' = 'huggingface'
): Promise<void> {
    const prompt = generatePrompt(character, action);
    const filename = `${character}_${action}.png`;

    console.log(`\n🎨 Generating: ${character} - ${action}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);

    try {
        let buffer: Buffer;

        if (api === 'dalle') {
            buffer = await generateWithDALLE(prompt);
        } else {
            buffer = await generateWithHuggingFace(prompt);
        }

        await saveSprite(buffer, filename);
        console.log(`✅ Success: ${filename}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`❌ Error: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        } else {
            console.error(`❌ Error: ${error}`);
        }
    }
}

// ============================================================
// CLI 실행
// ============================================================

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log(`
🎮 AI Sprite Generator for Dark Legend Classic

Usage:
  # 단일 스프라이트 생성
  npm run generate:sprites warrior idle

  # 전체 캐릭터 생성
  npm run generate:sprites all

Environment Variables (.env):
  OPENAI_API_KEY=sk-xxx          # OpenAI API (유료, 고품질)
  HUGGINGFACE_API_KEY=hf_xxx    # HuggingFace API (선택사항, 무료)
        `);
        return;
    }

    const [character, action] = args;

    if (character === 'all') {
        // 모든 캐릭터 + 애니메이션 생성
        const characters = ['warrior', 'mage', 'rogue', 'cleric', 'monk'];
        const actions = ['idle', 'walk', 'attack', 'hurt', 'death'];

        console.log(`🚀 Generating ${characters.length * actions.length} sprites...`);

        for (const char of characters) {
            for (const act of actions) {
                await generateSprite(char, act, 'huggingface');
                // API 속도 제한 고려하여 딜레이
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('\n✅ All sprites generated!');
        console.log(`📁 Location: ${OUTPUT_DIR}`);
    } else {
        // 단일 스프라이트 생성
        await generateSprite(character, action, 'huggingface');
    }
}

main().catch(console.error);
