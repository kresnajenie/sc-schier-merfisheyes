import { ApiState } from "../states/ApiState";
import { fetchDataFromAPI } from "./APIClient";
import { convertToNumberFormat } from "./Filtering/Atac";
export function getGene(gene) {
  return fetchDataFromAPI(gene, ApiState.value.prefix);
}
export function getAtac(atac) {
  return fetchDataFromAPI(
    convertToNumberFormat(atac),
    ApiState.value.prefix,
    true
  );
}
// for two genes
function interpolatePercentages(percent1, percent2) {
  // Define colors
  const white = { r: 255, g: 255, b: 255 };
  const green = { r: 0, g: 255, b: 0 };
  const magenta = { r: 255, g: 0, b: 255 };

  // Interpolate between green and white based on the second percentage
  const interpolatedRed = {
    r: Math.round(green.r + (white.r - green.r) * percent2),
    g: Math.round(green.g + (white.g - green.g) * percent2),
    b: Math.round(green.b + (white.b - green.b) * percent2),
  };

  // Interpolate between magenta and white based on the first percentage
  const interpolatedCyan = {
    r: Math.round(magenta.r + (white.r - magenta.r) * percent1),
    g: Math.round(magenta.g + (white.g - magenta.g) * percent1),
    b: Math.round(magenta.b + (white.b - magenta.b) * percent1),
  };

  // Calculate the average of the interpolated colors
  const averageColor = {
    r: (interpolatedRed.r + interpolatedCyan.r) / 2,
    g: (interpolatedRed.g + interpolatedCyan.g) / 2,
    b: (interpolatedRed.b + interpolatedCyan.b) / 2,
  };

  // Return RGB tuple
  return [
    Math.round(averageColor.r),
    Math.round(averageColor.g),
    Math.round(averageColor.b),
  ];
}

export function coolwarm(value1, value2) {
  // Convert to number if it's a string
  const numValue = Number(value1);

  // Define start and end colors (cool: blue, warm: red)
  const startColor = { r: 60, g: 78, b: 194 }; // Blue
  const middleColor = { r: 235, g: 235, b: 235 }; // White
  const endColor = { r: 220, g: 50, b: 47 }; // Red

  // no second gene
  if (value2 == null) {
    if (numValue < 0.5) {
      // blue to white
      const r = Math.floor(middleColor.r * numValue * 2);
      const g = Math.floor(middleColor.g * numValue * 2);
      const b = startColor.b;
      return [r / 255, g / 255, b / 255];
    } else if (numValue === 0.5) {
      // white
      return [middleColor.r / 255, middleColor.g / 255, middleColor.b / 255];
    } else {
      // white to red
      const r = endColor.r;
      const g = Math.floor(
        middleColor.g - middleColor.g * (numValue - 0.5) * 2
      );
      const b = Math.floor(
        middleColor.b - middleColor.b * (numValue - 0.5) * 2
      );
      return [r / 255, g / 255, b / 255];
    }
  } else {
    return interpolatePercentages(value1, value2);
  }
}

// Test function to verify the output
export function testCoolwarmTuple() {
  console.log("Test 0:", coolwarm(0)); // Should be [0, 0, 255] (blue)
  console.log("Test 0.25:", coolwarm(0.25)); // Should be [127, 127, 255] (light blue)
  console.log("Test 0.5:", coolwarm(0.5)); // Should be [255, 255, 255] (white)
  console.log("Test 0.75:", coolwarm(0.75)); // Should be [255, 127, 127] (light red)
  console.log("Test 1:", coolwarm(1)); // Should be [255, 0, 0] (red)
}

/**
 * Calculates the value at the 99th percentile of the given array.
 * @param {Array<number>} arr - The array of numerical values.
 * @returns {number} - The value at the 99th percentile.
 */
export function calculateGenePercentile(arr, percentile) {
  // Create a copy of the array and sort the copy
  const sortedArr = arr.slice().sort((a, b) => a - b);

  // Calculate the index for the xth percentile
  const index = Math.floor(sortedArr.length * percentile) - 1;

  // Return the value at the 99th percentile
  return sortedArr[index];
}

/**
 * Normalizes the values in the array to a range between 0 and 1.
 * @param {Array<number>} arr - The array of numerical values.
 * @param {number} nmax - The maximum value in the array.
 * @returns {Array<number>} - The array with normalized values.
 */
export function normalizeArray(arr, nmax) {
  return arr.map((value) => Math.min(value / nmax, 1));
}
