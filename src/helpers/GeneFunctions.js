import { ApiState } from "../states/ApiState";
import { fetchDataFromAPI } from "./APIClient";
import chroma from "chroma-js"

export function getGene(gene) {
    return fetchDataFromAPI(gene, ApiState.value.prefix);
}

// for two genes
function interpolatePercentages(percent1, percent2) {

    // Define colors
    const white = { r: 255, g: 255, b: 255 };
    const red = { r: 255, g: 0, b: 0 };
    const cyan = { r: 0, g: 255, b: 255 };

    // Interpolate between red and white based on the first percentage
    const interpolatedRed = {
        r: Math.round(red.r + (white.r - red.r) * percent2),
        g: Math.round(red.g + (white.g - red.g) * percent2),
        b: Math.round(red.b + (white.b - red.b) * percent2)
    };

    // Interpolate between cyan and white based on the second percentage
    const interpolatedCyan = {
        r: Math.round(cyan.r + (white.r - cyan.r) * percent1),
        g: Math.round(cyan.g + (white.g - cyan.g) * percent1),
        b: Math.round(cyan.b + (white.b - cyan.b) * percent1)
    };

    // Calculate the average of the interpolated colors
    const averageColor = {
        r: (interpolatedRed.r + interpolatedCyan.r) / 2,
        g: (interpolatedRed.g + interpolatedCyan.g) / 2,
        b: (interpolatedRed.b + interpolatedCyan.b) / 2
    };

    // Return CSS color string
    return `rgb(${Math.round(averageColor.r)}, ${Math.round(averageColor.g)}, ${Math.round(averageColor.b)})`;
}

/**
 * Generates a color value in the coolwarm colormap based on the input value.
 * @param {number} value - The value for which to generate the color (between 0 and 1).
 * @returns {string} - The color string in RGB format.
 */
export function coolwarm(value1, value2) {
    // Define start and end colors (cool: blue, warm: red)
    const startColor = { r: 0, g: 0, b: 255 }; // Blue
    const middleColor = { r: 255, g: 255, b: 255 }; // White
    const endColor = { r: 255, g: 0, b: 0 }; // Red

    // no second gene
    if (value2 == null) {
        if (value1 < 0.5) { // blue to white
            return `rgb(${Math.floor(middleColor.r * value1 * 2)}, ${Math.floor(middleColor.g * value1 * 2)}, ${startColor.b})`;
        } else if (value1 === 0.5) { // white
            return `rgb(${middleColor.r}, ${middleColor.g}, ${middleColor.b})`;
        } else { // white to red
            return `rgb(${endColor.r}, ${Math.floor(middleColor.g - (middleColor.g * (value1 - 0.5) * 2))}, ${Math.floor(middleColor.b - (middleColor.b * (value1 - 0.5) * 2))})`;
        }
    } else {
        return interpolatePercentages(value1, value2);
    }
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
    return arr.map(value => Math.min(value / nmax, 1));
}
