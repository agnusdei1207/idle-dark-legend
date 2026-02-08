/**
 * ============================================================
 * 인벤토리 UI (Three.js)
 * ============================================================
 * Three.js 버전 인벤토리 UI
 * ============================================================
 */

export class InventoryUI {
    private isOpen: boolean = false;

    constructor() {
        console.log('InventoryUI: Initialized (Three.js version)');
    }

    public open(): void {
        this.isOpen = true;
        console.log('InventoryUI: Open');
        // TODO: Three.js UI 구현
    }

    public close(): void {
        this.isOpen = false;
        console.log('InventoryUI: Close');
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
        console.log('InventoryUI: Destroy');
    }
}
