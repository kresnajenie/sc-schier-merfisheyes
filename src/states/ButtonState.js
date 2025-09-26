import { BehaviorSubject } from "rxjs";

const buttonData = {
  dotSize: 6.0,
  genePercentile: 0.99,
  cameraPositionZ: 300,
  cameraPositionY: 50,
  cameraPositionX: 40,
  umapOffset: 20000,
  cameraUmapPositionY: 0,
  cameraUmapPositionZ: 400,
  violinOffset: -10000,
  cameraViolinPositionY: 0,
  cameraViolinPositionZ: 400,
};

export const ButtonState = new BehaviorSubject(buttonData);

/**
 * Updates the actual min and max gene expression values
 * @param {Number} minValue - The actual value at 80th percentile
 * @param {Number} maxValue - The actual value at 100th percentile
 */
export function updateGeneExpressionRange(minValue, currVal, maxValue) {
  // Get the current state from the BehaviorSubject
  const currentState = ButtonState.getValue();

  console.log("Current gene value", currVal);

  // Update the items in the current state
  const updatedState = {
    ...currentState,
    minGeneValue: minValue,
    maxGeneValue: maxValue,
    // Also set the current values to match the calculated ones initially
    currentMinGeneValue: minValue,
    currentGeneValue: currVal,
    currentMaxGeneValue: maxValue,
  };

  // Emit the updated state
  ButtonState.next(updatedState);
}

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
    dotSize: newDotSize,
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
    genePercentile: percent,
  };

  // Emit the updated state
  ButtonState.next(updatedState);
}

export function updateCameraPositionZ(newCameraPositionZ) {
  const currentState = ButtonState.getValue();

  const updatedState = {
    ...currentState,
    cameraPositionZ: newCameraPositionZ,
  };

  ButtonState.next(updatedState);
}
