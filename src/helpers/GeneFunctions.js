import { ApiState } from "../states/ApiState";
import { fetchDataFromAPI } from "./APIClient";

export function getGene(gene) {
    return fetchDataFromAPI(gene, ApiState.value.prefix);
}

/**
 * Generates a color value in the coolwarm colormap based on the input value.
 * @param {number} value - The value for which to generate the color (between 0 and 1).
 * @returns {string} - The color string in RGB format.
 */
export function coolwarm(value) {
    // Define start and end colors (cool: blue, warm: red)
    const startColor = { r: 0, g: 0, b: 255 }; // Blue
    const middleColor = { r: 255, g: 255, b: 255 }; // White
    const endColor = { r: 255, g: 0, b: 0 }; // Red

    if (value < 0.5) { // blue to white
        return `rgb(${Math.floor(middleColor.r * value * 2)}, ${Math.floor(middleColor.g * value * 2)}, ${startColor.b})`;
    } else if (value === 0.5) { // white
        return `rgb(${middleColor.r}, ${middleColor.g}, ${middleColor.b})`;
    } else { // white to red
        return `rgb(${endColor.r}, ${Math.floor(middleColor.g - (middleColor.g * (value - 0.5) * 2))}, ${Math.floor(middleColor.b - (middleColor.b * (value - 0.5) * 2))})`;
    }
}

/**
 * Calculates the value at the 99th percentile of the given array.
 * @param {Array<number>} arr - The array of numerical values.
 * @returns {number} - The value at the 99th percentile.
 */
export function calculate99thPercentile(arr) {
    // Create a copy of the array and sort the copy
    const sortedArr = arr.slice().sort((a, b) => a - b);

    // Calculate the index for the 99th percentile
    const index = Math.floor(sortedArr.length * 0.99) - 1;

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
    return arr.map(value => Math.min(value / nmax, 1));
}
