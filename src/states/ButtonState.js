import { BehaviorSubject } from 'rxjs';

const buttonData = {
    dotSize: 5,
    genePercentile: 100,
}

export const ButtonState = new BehaviorSubject(buttonData);

/**
 * Updates the dot size of the umap within the application's constant data state
 * @param {Integer} newDotSize - new dot size
 */
export function updateDotSize(newDotSize) {
    // Get the current state from the BehaviorSubject
    const currentState = ButtonState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        dotSize: newDotSize
    };

    // Emit the updated state
    ButtonState.next(updatedState);
}

/**
 * Updates the dot size of the umap within the application's constant data state
 * @param {Integer} newGenePercentile - new dot size
 */
export function updateGenePercentile(newGenePercentile) {
    // Get the current state from the BehaviorSubject
    const currentState = Buttonstate.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        genePercentile: newGenePercentile
    };

    // Emit the updated state
    ButtonState.next(updatedState);
}