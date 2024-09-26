import { BehaviorSubject } from 'rxjs';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

const selectedData = {
    selectedCelltypes: [],
    mode: params.has("mode") ? Number(params.get("mode")) : 1,
    selectedSingleGene: "",
    selectedSingleAtac: "",
    selectedGenes: [],
    selectedAtacs: [],
    intervalsData: [],
    geneGenomeHover: false,
    showing: "celltype",
    selectedGenesPrev: []
}

export function updateGeneGenomeHover(isHovering) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the geneGenomeHover in the current state
    const updatedState = {
        ...currentState,
        geneGenomeHover: isHovering
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

export const SelectedState = new BehaviorSubject(selectedData);

/**
 * Updates the selected celltypes within the application's constant data state.
 * @param {Array} newCelltypes - The new selected celltypes array to set in the state.
 * Example Usage:
 * updateGenes(["cell1", "cell2", "cell3"]);
 */
export function updateSelectedCelltype(newCelltypes) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        selectedCelltypes: [...new Set(newCelltypes)]
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

/**
 * Toggles a celltype within the selectedCelltypes list.
 * @param {string} celltype - The celltype to add or remove from the selectedCelltypes list.
 * Example Usage:
 * toggleSelectedCelltype("cell1");
 */
export function toggleSelectedCelltype(celltype) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Copy the existing selectedCelltypes array
    const selectedCelltypes = [...currentState.selectedCelltypes];

    // Check if the celltype is already in the list
    const celltypeIndex = selectedCelltypes.indexOf(celltype);

    if (celltypeIndex > -1) {
        // If it exists, remove it from the list
        selectedCelltypes.splice(celltypeIndex, 1);
    } else {
        // If it does not exist, add it to the list
        selectedCelltypes.push(celltype);
    }

    // Create the updated state
    const updatedState = {
        ...currentState,
        selectedCelltypes: selectedCelltypes
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}


/**
 * Updates the selected celltypes within the application's constant data state.
 * @param {Array} newCelltypes - The new selected celltypes array to set in the state.
 * Example Usage:
 * updateGenes(["cell1", "cell2", "cell3"]);
 */
export function updateSelectedInterval(newIntervals) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        intervalsData: [...new Set(newIntervals)]
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

export function updateMode(newMode) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        mode: newMode
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

export function updateSelectedSingleGene(newSingleGene) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        selectedSingleGene: newSingleGene
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

/**
 * Updates the selected celltypes within the application's constant data state.
 * @param {Array} newGenes - The new selected celltypes array to set in the state.
 * Example Usage:
 * updateGenes("gene1");
 */
export function updateSelectedGene(newGenes) {
    // Handle undefined in newGenes
    if (newGenes.includes(undefined)) {
        newGenes = []; // Convert to an empty list
    }

    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();
    const oldGenes = currentState.selectedGenes;

    // Uncheck the radio button of the previously selected gene
    if (oldGenes.length > 0) {
        let radioButton = document.getElementById(oldGenes[0]);
        if (radioButton) {
            radioButton.checked = false; // Uncheck the radio button
        }
        radioButton = document.getElementById(oldGenes[1]);
        if (radioButton) {
            radioButton.checked = false; // Uncheck the radio button
        }
    }

    // Update the state with new genes and store the old genes in selectedGenesPrev
    const updatedState = {
        ...currentState,
        selectedGenes: newGenes,
        selectedGenesPrev: oldGenes
    };

    // Check the radio button of the newly selected gene
    if (newGenes.length > 0) {
        const radioButtonNew = document.getElementById(newGenes[0]);
        if (radioButtonNew) {
            radioButtonNew.checked = true; // Check the radio button
        }
    }

    // Emit the updated state
    SelectedState.next(updatedState);
}


export function updateSelectedSingleAtac(newSingleAtac) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        selectedSingleAtac: newSingleAtac
    };

    // Emit the updated state
    SelectedState.next(updatedState);
}

/**
 * Updates the selected celltypes within the application's constant data state.
 * @param {Array} newAtacs - The new selected celltypes array to set in the state.
 * Example Usage:
 * updateGenes("gene1");
 */
export function updateSelectedAtac(newAtacs) {
    // Get the current state from the BehaviorSubject
    if (newAtacs.includes(undefined)) {
        newAtacs = []; // Convert to an empty list
    }

    // Get the current state from the BehaviorSubject
    console.log(newAtacs);
    const currentState = SelectedState.getValue();
    const oldAtacs = currentState.selectedAtacs
    if (oldAtacs.length > 0) {
        const radioButton = document.getElementById(oldAtacs[0]);
        console.log(radioButton)
        if (radioButton) {
            radioButton.checked = false; // Uncheck the radio button
        }
    }


    // Update the items in the current state
    const updatedState = {
        ...currentState,
        selectedAtacs: newAtacs
    };

    const radioButtonNew = document.getElementById(newAtacs[0]);
    if (radioButtonNew) {
        radioButtonNew.checked = true; // Uncheck the radio button
    }


    // Emit the updated state
    SelectedState.next(updatedState);
}