/**
 * ============================================================
 * 오디오 매니저
 * ============================================================
 * 
 * BGM, 효과음 관리
 * [에셋 교체]
 * 1. public/assets/audio/bgm/ - 배경음악
 * 2. public/assets/audio/sfx/ - 효과음
 * ============================================================
 */

import { Howl, Howler } from 'howler';
import { SaveSystem } from './SaveSystem';

interface AudioTrack {
    key: string;
    howl: Howl;
}

export class AudioManager {
    private static instance: AudioManager;
    private bgmTracks: Map<string, AudioTrack> = new Map();
    private sfxTracks: Map<string, AudioTrack> = new Map();
    private currentBgm: string | null = null;
    private bgmVolume: number = 0.7;
    private sfxVolume: number = 0.8;
    private masterVolume: number = 0.8;

    private constructor() {
        const settings = SaveSystem.loadSettings();
        this.masterVolume = settings.masterVolume / 100;
        this.bgmVolume = settings.bgmVolume / 100;
        this.sfxVolume = settings.sfxVolume / 100;
        Howler.volume(this.masterVolume);
    }

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /** BGM 로드 */
    loadBgm(key: string, src: string): void {
        if (this.bgmTracks.has(key)) return;

        const howl = new Howl({
            src: [src],
            loop: true,
            volume: this.bgmVolume * this.masterVolume,
            preload: true
        });

        this.bgmTracks.set(key, { key, howl });
    }

    /** SFX 로드 */
    loadSfx(key: string, src: string): void {
        if (this.sfxTracks.has(key)) return;

        const howl = new Howl({
            src: [src],
            volume: this.sfxVolume * this.masterVolume,
            preload: true
        });

        this.sfxTracks.set(key, { key, howl });
    }

    /** BGM 재생 */
    playBgm(key: string, fade: number = 1000): void {
        // 같은 BGM이면 무시
        if (this.currentBgm === key) return;

        // 기존 BGM 페이드아웃
        if (this.currentBgm) {
            const current = this.bgmTracks.get(this.currentBgm);
            if (current) {
                current.howl.fade(current.howl.volume(), 0, fade);
                setTimeout(() => current.howl.stop(), fade);
            }
        }

        // 새 BGM 페이드인
        const track = this.bgmTracks.get(key);
        if (track) {
            track.howl.volume(0);
            track.howl.play();
            track.howl.fade(0, this.bgmVolume * this.masterVolume, fade);
            this.currentBgm = key;
        }
    }

    /** BGM 정지 */
    stopBgm(fade: number = 1000): void {
        if (this.currentBgm) {
            const track = this.bgmTracks.get(this.currentBgm);
            if (track) {
                track.howl.fade(track.howl.volume(), 0, fade);
                setTimeout(() => track.howl.stop(), fade);
            }
            this.currentBgm = null;
        }
    }

    /** SFX 재생 */
    playSfx(key: string): void {
        const track = this.sfxTracks.get(key);
        if (track) {
            track.howl.play();
        }
    }

    /** 볼륨 설정 */
    setMasterVolume(value: number): void {
        this.masterVolume = value;
        Howler.volume(value);
    }

    setBgmVolume(value: number): void {
        this.bgmVolume = value;
        if (this.currentBgm) {
            const track = this.bgmTracks.get(this.currentBgm);
            if (track) {
                track.howl.volume(value * this.masterVolume);
            }
        }
    }

    setSfxVolume(value: number): void {
        this.sfxVolume = value;
    }

    /** 음소거 */
    mute(muted: boolean): void {
        Howler.mute(muted);
    }
}
