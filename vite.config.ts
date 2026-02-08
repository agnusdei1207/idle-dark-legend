import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        strictPort: true,
        hmr: false  // HMR 완전 비활성화 - Phaser 호환성 문제 해결
    },
    build: {
        target: 'esnext',
        minify: 'esbuild'
    },
    // 에셋 실패 시에도 빌드 계속
    logLevel: 'warn'
});
