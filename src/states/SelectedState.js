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
    showing: "celltype"
}

export function updateSelectedShowing(newShowing) {
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        showing: newShowing
    };

    // console.log(newShowing)

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
    // Get the current state from the BehaviorSubject
    const currentState = SelectedState.getValue();
    const oldGenes = currentState.selectedGenes
    if (oldGenes.length > 0) {
        const radioButton = document.getElementById(oldGenes[0]);
        console.log(radioButton)
        if (radioButton) {
            radioButton.checked = false; // Uncheck the radio button
        }
    }

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        selectedGenes: newGenes
    };

    const radioButtonNew = document.getElementById(newGenes[0]);
    console.log(radioButtonNew)
    if (radioButtonNew) {
        radioButtonNew.checked = true; // Uncheck the radio button
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
    console.log(radioButtonNew)
    if (radioButtonNew) {
        radioButtonNew.checked = true; // Uncheck the radio button
    }


    // Emit the updated state
    SelectedState.next(updatedState);
}