/**
 * ============================================================
 * ModelLoader - 3D 모델 로더
 * ============================================================
 * GLTF/GLB 3D 모델을 로드하고 처리
 * ============================================================
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 모델 데이터 인터페이스
 */
export interface ModelData {
    scene: THREE.Scene | THREE.Group;
    animations?: THREE.AnimationClip[];
    cameras?: THREE.Camera[];
    asset?: any;
}

/**
 * 모델 로드 옵션
 */
export interface ModelLoadOptions {
    scale?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    castShadow?: boolean;
    receiveShadow?: boolean;
    onLoad?: (model: ModelData) => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
}

/**
 * ModelLoader 싱글톤 클래스
 */
export class ModelLoader {
    private static instance: ModelLoader | null = null;
    private gltfLoader: GLTFLoader;
    private loadedModels: Map<string, ModelData> = new Map();
    private loadingPromises: Map<string, Promise<ModelData>> = new Map();

    private constructor() {
        this.gltfLoader = new GLTFLoader();
    }

    /**
     * 싱글톤 인스턴스 가져오기
     */
    public static getInstance(): ModelLoader {
        if (!ModelLoader.instance) {
            ModelLoader.instance = new ModelLoader();
        }
        return ModelLoader.instance;
    }

    /**
     * GLTF 모델 로드
     */
    public async loadGLTF(url: string, options?: ModelLoadOptions): Promise<ModelData> {
        // 캐시 확인
        const cached = this.loadedModels.get(url);
        if (cached) {
            // 캐시된 모델 복제
            return this.cloneModel(cached);
        }

        // 로드 중인 프로미스 확인
        const existingPromise = this.loadingPromises.get(url);
        if (existingPromise) {
            return existingPromise;
        }

        // 새로 로드
        const promise = new Promise<ModelData>((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    const modelData: ModelData = {
                        scene: gltf.scene,
                        animations: gltf.animations,
                        cameras: gltf.cameras,
                        asset: gltf.asset
                    };

                    // 캐시에 저장
                    this.loadedModels.set(url, modelData);
                    this.loadingPromises.delete(url);

                    options?.onLoad?.(modelData);
                    resolve(modelData);
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total) * 100;
                        options?.onProgress?.(percent);
                    }
                },
                (error) => {
                    this.loadingPromises.delete(url);
                    const errorObj = error instanceof Error ? error : new Error(String(error));
                    options?.onError?.(errorObj);
                    reject(errorObj);
                }
            );
        });

        this.loadingPromises.set(url, promise);
        return promise;
    }

    /**
     * 모델 복제 (인스턴싱)
     */
    private cloneModel(modelData: ModelData): ModelData {
        const clonedScene = modelData.scene.clone(true);

        // 텍스처도 복제
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(mat => mat.clone());
                    } else {
                        child.material = child.material.clone();
                    }
                }
            }
        });

        return {
            scene: clonedScene,
            animations: modelData.animations,
            cameras: modelData.cameras
        };
    }

    /**
     * 모델을 Scene에 추가
     */
    public addModelToScene(
        scene: THREE.Scene,
        modelData: ModelData,
        options?: ModelLoadOptions
    ): THREE.Group {
        const group = new THREE.Group();

        modelData.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // 그림자 설정
                if (options?.castShadow !== false) {
                    child.castShadow = true;
                }
                if (options?.receiveShadow !== false) {
                    child.receiveShadow = true;
                }
            }
        });

        group.add(modelData.scene);

        // 변환 적용
        if (options?.scale) {
            group.scale.setScalar(options.scale);
        }
        if (options?.position) {
            group.position.copy(options.position);
        }
        if (options?.rotation) {
            group.rotation.copy(options.rotation);
        }

        scene.add(group);
        return group;
    }

    /**
     * 플레이스홀더 모델 생성 (박스 기반)
     */
    public createPlaceholderPlayer(classType: string = 'warrior'): THREE.Group {
        const group = new THREE.Group();

        // 클래스별 색상
        const colors: Record<string, { body: number; head: number }> = {
            warrior: { body: 0x3498db, head: 0xf5cba7 },
            mage: { body: 0x9b59b6, head: 0xf5cba7 },
            rogue: { body: 0x2ecc71, head: 0xf5cba7 },
            cleric: { body: 0xf1c40f, head: 0xf5cba7 },
            monk: { body: 0xe67e22, head: 0xf5cba7 }
        };

        const color = colors[classType] || colors.warrior;

        // 바디
        const bodyGeometry = new THREE.BoxGeometry(32, 48, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: color.body });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 24;
        body.castShadow = true;
        group.add(body);

        // 머리
        const headGeometry = new THREE.BoxGeometry(24, 24, 24);
        const headMaterial = new THREE.MeshLambertMaterial({ color: color.head });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 60;
        head.castShadow = true;
        group.add(head);

        // 팔
        const armGeometry = new THREE.BoxGeometry(8, 32, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: color.body });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-20, 50, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(20, 50, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // 다리
        const legGeometry = new THREE.BoxGeometry(10, 32, 10);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-8, 0, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(8, 0, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(20, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -5;
        group.add(shadow);

        return group;
    }

    /**
     * 플레이스홀더 몬스터 생성
     */
    public createPlaceholderMonster(
        type: string,
        level: number = 1
    ): THREE.Group {
        const group = new THREE.Group();

        // 몬스터 타입별 설정
        const monsterConfigs: Record<string, { color: number; scale: number; height: number }> = {
            slime: { color: 0x27ae60, scale: 0.8, height: 20 },
            goblin: { color: 0x8e44ad, scale: 0.9, height: 32 },
            orc: { color: 0x16a085, scale: 1.2, height: 48 },
            skeleton: { color: 0xecf0f1, scale: 1.0, height: 44 },
            demon: { color: 0xc0392b, scale: 1.3, height: 52 },
            dragon: { color: 0xe74c3c, scale: 1.5, height: 64 },
            ghost: { color: 0x9b59b6, scale: 1.0, height: 40 },
            wolf: { color: 0x7f8c8d, scale: 0.9, height: 28 }
        };

        const config = monsterConfigs[type] || { color: 0x95a5a6, scale: 1.0, height: 36 };

        // 레벨에 따른 크기 증가
        const levelScale = 1 + (level - 1) * 0.1;
        const finalScale = config.scale * levelScale;

        // 바디
        const bodyGeometry = new THREE.BoxGeometry(28 * finalScale, config.height * finalScale, 14 * finalScale);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: config.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = (config.height * finalScale) / 2;
        body.castShadow = true;
        group.add(body);

        // 눈 (일부 몬스터)
        if (['goblin', 'orc', 'demon', 'dragon'].includes(type)) {
            const eyeGeometry = new THREE.BoxGeometry(4 * finalScale, 4 * finalScale, 2 * finalScale);
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(-5 * finalScale, config.height * finalScale - 5, 8 * finalScale);
            group.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(5 * finalScale, config.height * finalScale - 5, 8 * finalScale);
            group.add(rightEye);
        }

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(16 * finalScale, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -4;
        group.add(shadow);

        return group;
    }

    /**
     * 플레이스홀더 NPC 생성
     */
    public createPlaceholderNPC(type: string = 'citizen'): THREE.Group {
        const group = new THREE.Group();

        // NPC 타입별 색상
        const colors: Record<string, number> = {
            merchant: 0xf39c12,
            quest: 0x9b59b6,
            trainer: 0x2ecc71,
            guard: 0xe74c3c,
            banker: 0x34495e,
            citizen: 0x95a5a6
        };

        const color = colors[type] || colors.citizen;

        // 바디
        const bodyGeometry = new THREE.BoxGeometry(28, 40, 14);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 20;
        body.castShadow = true;
        group.add(body);

        // 머리
        const headGeometry = new THREE.BoxGeometry(20, 20, 20);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf5cba7 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 50;
        head.castShadow = true;
        group.add(head);

        // 그림자
        const shadowGeometry = new THREE.CircleGeometry(16, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3
        });
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -4;
        group.add(shadow);

        // 상인/퀘스트 NPC의 경우 모자 추가
        if (type === 'merchant' || type === 'quest') {
            const hatGeometry = new THREE.BoxGeometry(22, 8, 22);
            const hatMaterial = new THREE.MeshLambertMaterial({ color: type === 'merchant' ? 0xe67e22 : 0x8e44ad });
            const hat = new THREE.Mesh(hatGeometry, hatMaterial);
            hat.position.y = 64;
            group.add(hat);
        }

        return group;
    }

    /**
     * 모든 로드된 모델 해제
     */
    public dispose(): void {
        this.loadedModels.forEach((modelData) => {
            modelData.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });

        this.loadedModels.clear();
        this.loadingPromises.clear();
    }

    /**
     * 싱글톤 인스턴스 해제
     */
    public static destroy(): void {
        if (ModelLoader.instance) {
            ModelLoader.instance.dispose();
            ModelLoader.instance = null;
        }
    }
}
