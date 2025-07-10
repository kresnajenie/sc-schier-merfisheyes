import { BehaviorSubject } from 'rxjs';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

const apiData = {
    columns: [
        'X_umap0_norm',
        'X_umap1_norm',
        'X_spatial0_norm',
        'X_spatial1_norm',
        'X_spatial2_norm',
        'clusters',
    ],

    prefixOptions: ["50pe", "75pe", "6s", "sm-50pe", "sm-75pe", "sm-6s"],
    prefixDescription: {"50pe": "Single Cell 50% Epiboly", "75pe": "Single Cell 75% Epiboly", "6s": "Single Cell 6 Somite", "sm-50pe": "Single Molecule 50% Epiboly", "sm-75pe": "Single Molecule 75% Epiboly", "sm-6s": "Single Molecule 6 Somite"},
    prefix: params.has("prefix") ? params.get("prefix") : "6s",
    pallete: {},
    listPalette: [], // list version of palette
    palleteColumn: "clusters_pal",
    genes: [],
    atacs: [],
    items: [],

    // capitalization doesn't matter
    groups: []
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
 * Updates the genes within the application's constant data state.
 * @param {Array} newAtacs - The new genes array to set in the state.
 * Example Usage:
 * updateGenes(["gene1", "gene2", "gene3"]);
 */
export function updateAtacs(newAtacs) {
    // Get the current state from the BehaviorSubject
    const currentState = ApiState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        atacs: newAtacs
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