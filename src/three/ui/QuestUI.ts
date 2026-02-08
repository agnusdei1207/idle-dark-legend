/**
 * ============================================================
 * 퀘스트 UI (Three.js)
 * ============================================================
 * Three.js 버전 퀘스트 UI
 * ============================================================
 */

export class QuestUI {
    private isOpen: boolean = false;

    constructor() {
        console.log('QuestUI: Initialized (Three.js version)');
    }

    public open(): void {
        this.isOpen = true;
        console.log('QuestUI: Open');
        // TODO: Three.js UI 구현
    }

    public close(): void {
        this.isOpen = false;
        console.log('QuestUI: Close');
        // TODO: Three.js UI 구현
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    public destroy(): void {
        console.log('QuestUI: Destroy');
    }
}
