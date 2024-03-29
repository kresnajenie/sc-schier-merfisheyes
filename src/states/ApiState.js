import { BehaviorSubject } from 'rxjs';

const hash = window.location.hash.replace("#", "");

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


// Create a BehaviorSubject to manage and emit state updates
export const ApiState = new BehaviorSubject(apiData);

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