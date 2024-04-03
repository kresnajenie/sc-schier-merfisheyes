import { BehaviorSubject } from 'rxjs';

const hash = window.location.hash.replace("#", "");
import * as THREE from 'three';

const apiData = {
    columns: [
        'X_umap0_norm',
        'X_umap1_norm',
        'global_sphere0_norm',
        'global_sphere1_norm',
        'global_sphere2_norm',
        'clusters',
    ],

    prefix: hash ? hash : "50pe",
    pallete: {},
    palleteColumn: "clusters_pal",
    genes: [],
    items: []
};

const selectedData = {
    selectedCelltypes: [],
    selectedGenes: []
}

const uiData = {
    isLoading: false,
    theme: 'light',
}

const matrixData = {
    items: []
}

const sceneData = {
    scene: new THREE.Scene()
}



// Create a BehaviorSubject to manage and emit state updates
export const UIState = new BehaviorSubject(uiData);
export const ApiState = new BehaviorSubject(apiData);
export const SelectedState = new BehaviorSubject(selectedData);
export const MatrixState = new BehaviorSubject(matrixData);
export const SceneState = new BehaviorSubject(sceneData);

/**
 * Updates the items within the application's data state.
 * @param {Array} newItems - The new items to set in the state.
 * Example Usage:
 * updateDataItems([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
 */
export function updateDataItems(newItems) {
    // Get the current state from the BehaviorSubject
    const currentState = MatrixState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        items: newItems
    };

    // Emit the updated state
    MatrixState.next(updatedState);
}

/**
 * Updates the loading state within the UI state.
 * @param {boolean} isLoading - The new loading state to set.
 * Example Usage:
 * updateLoadingState(true); // To indicate loading has started
 * updateLoadingState(false); // To indicate loading has finished
 */
export function updateLoadingState(isLoading) {
    // Get the current state from the BehaviorSubject
    const currentState = UIState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        isLoading: isLoading
    };

    // Emit the updated state
    UIState.next(updatedState);
}

/**
 * Updates the palette within the application's data state.
 * @param {Object} newPalette - The new palette object to set in the state.
 * Example Usage:
 * updateDataPalette({ "0": "#ff0000", "1": "#00ff00", "2": "#0000ff" });
 */
export function updateDataPalette(newPalette) {
    // Get the current state from the BehaviorSubject
    const currentState = ApiState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        pallete: newPalette
    };

    // Emit the updated state
    ApiState.next(updatedState);
}

/**
 * Updates the genes within the application's constant data state.
 * @param {Array} newGenes - The new genes array to set in the state.
 * Example Usage:
 * updateGenes(["gene1", "gene2", "gene3"]);
 */
export function updateGenes(newGenes) {
    // Get the current state from the BehaviorSubject
    const currentState = ApiState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        genes: newGenes
    };

    // Emit the updated state
    ApiState.next(updatedState);
}

/**
 */
export function updateScene(newScene) {
    // Update the items in the current state
    const updatedState = {
        scene: newScene
    };

    // Emit the updated state
    SceneState.next(updatedState);
}

/**
 * Updates the prefix within the application's constant data state.
 * @param {string} prefix - The new prefix to set in the state.
 * Example Usage:
 * updatePrefix("50pe");
 */
export function updatePrefix(prefix) {

    const currentState = ApiState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        prefix: prefix
    };

    // Emit the updated state
    ApiState.next(updatedState);
}