import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';

const sceneData = {
    scene: new THREE.Scene(),
}

export const SceneState = new BehaviorSubject(sceneData);
