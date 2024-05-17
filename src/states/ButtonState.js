import { BehaviorSubject } from 'rxjs';

const buttonData = {
    dotSize: 5.00,
    genePercentile: 0.9900,
    cameraPositionZ: 400,
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
    const currentState = ButtonState.getValue();

    const percent = newGenePercentile * 0.01;
    // Update the items in the current state
    const updatedState = {
        ...currentState,
        genePercentile: percent
    };

    // Emit the updated state
    ButtonState.next(updatedState);
}

export function updateCameraPositionZ(newCameraPositionZ) {

    const currentState = ButtonState.getValue();

    const updatedState = {
        ...currentState,
        cameraPositionZ: newCameraPositionZ
    };

    ButtonState.next(updatedState);
}