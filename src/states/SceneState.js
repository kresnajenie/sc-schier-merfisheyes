import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';

const sceneData = {
    scene: new THREE.Scene(),
    selectedGenes: [],
}

export const SceneState = new BehaviorSubject(sceneData);
