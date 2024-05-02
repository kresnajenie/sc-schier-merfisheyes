import { BehaviorSubject } from 'rxjs';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

const apiData = {
    columns: [
        'X_umap0_norm',
        'X_umap1_norm',
        'global_sphere0_norm',
        'global_sphere1_norm',
        'global_sphere2_norm',
        'clusters',
    ],

    prefix: params.has("prefix") ? params.get("prefix") : "6s",
    pallete: {},
    listPalette: [], // list version of palette
    palleteColumn: "clusters_pal",
    genes: [],
    items: [],

    // capitalization doesn't matter
    groups: [
        "adaxial cells",
        "cephalic",
        "endoderm",
        "floor Plate",
        "hindbrain",
        "ectoderm",
        "spinal cord"
    ]
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

    const newList = Object.keys(newPalette).map((celltype) => [celltype, newPalette[celltype]])

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        pallete: newPalette,
        listPalette: newList
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

/**
 * Updates the cell groups within the application's constant data state.
 * @param {Array} groups - The new groups to set in the state.
 * Example Usage:
 * updatePrefix(["ectoderm", "endoderm"]);
 */
export function updateGroups(groups) {

    const currentState = ApiState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        groups: groups
    };

    // Emit the updated state
    ApiState.next(updatedState);
}