import { SelectedState } from "../../states/SelectedState";

const FACTOR = 36.75
export function setLabels(min,max) {
    const topLabel = document.getElementById('top-label');
    const bottomLabel = document.getElementById('bottom-label');
    // console.log(min,max)
    // console.log("KONTOTLOBNTONTONTOTONTONTONTONLLLLLLLLL")
    // console.log(topLabel)
    // console.log(bottomLabel)
    let selectedGene = SelectedState.value.selectedGenes;
    let isImputed = false;


    if (selectedGene != []) {
        try {
            isImputed = selectedGene[0].split("_")[1] == "imputed";
        } catch {
            isImputed = false;
        }
    }

    // console.log(max)
    // console.log("IMPUTED KAHH:", isImputed)

    
    let actualMax = isImputed ? max * FACTOR : max;
    let actualMax2;

    if (actualMax < 1) {
        actualMax2 = actualMax.toExponential(1); // 1 specifies the number of digits after the decimal point
    } else {
        actualMax2 = Math.round(actualMax);
    }
    
    // Check if the elements exist before setting the text content
    if (topLabel && bottomLabel) {
        topLabel.textContent = actualMax2;
        bottomLabel.textContent = min;
    } else {
        console.error("Labels not found in the DOM.");
    }
}

export function setLabelsGreen(min,max) {
    const topLabel = document.getElementById('top-label-green');
    const bottomLabel = document.getElementById('bottom-label-green');
    // console.log(min,max)
    // console.log("KONTOTLOBNTONTONTOTONTONTONTONLLLLLLLLL")
    // console.log(topLabel)
    // console.log(bottomLabel)
    let selectedGene = SelectedState.value.selectedGenes;
    let isImputed = false;


    if (selectedGene != []) {
        try {
            isImputed = selectedGene[1].split("_")[1] == "imputed";
        } catch {
            isImputed = false;
        }
    }
    const FACTOR = 36.75

    // console.log(max)
    // console.log("IMPUTED KAHH:", isImputed)

    
    let actualMax = isImputed ? max * FACTOR : max;
    let actualMax2;

    if (actualMax < 1) {
        actualMax2 = actualMax.toExponential(1); // 1 specifies the number of digits after the decimal point
    } else {
        actualMax2 = Math.round(actualMax);
    }
    
    // Check if the elements exist before setting the text content
    if (topLabel && bottomLabel) {
        topLabel.textContent = actualMax2;
        bottomLabel.textContent = min;
    } else {
        console.error("Labels not found in the DOM.");
    }
}

export function setLabelsMagenta(min,max) {
    const topLabel = document.getElementById('top-label-magenta');
    const bottomLabel = document.getElementById('bottom-label-magenta');
    // console.log(min,max)
    // console.log("KONTOTLOBNTONTONTOTONTONTONTONLLLLLLLLL")
    // console.log(topLabel)
    // console.log(bottomLabel)
    let selectedGene = SelectedState.value.selectedGenes;
    let isImputed = false;


    if (selectedGene != []) {
        try {
            isImputed = selectedGene[0].split("_")[1] == "imputed";
        } catch {
            isImputed = false;
        }
    }
    const FACTOR = 36.75

    // console.log(max)
    // console.log("IMPUTED KAHH:", isImputed)

    
    let actualMax = isImputed ? max * FACTOR : max;
    let actualMax2;

    if (actualMax < 1) {
        actualMax2 = actualMax.toExponential(1); // 1 specifies the number of digits after the decimal point
    } else {
        actualMax2 = Math.round(actualMax);
    }
    
    // Check if the elements exist before setting the text content
    if (topLabel && bottomLabel) {
        topLabel.textContent = actualMax2;
        bottomLabel.textContent = min;
    } else {
        console.error("Labels not found in the DOM.");
    }
}

export function showColorbar() {
    const colorbarWrapper = document.getElementById('colorbar-wrapper');
    if (colorbarWrapper) {
        colorbarWrapper.style.display = 'grid';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}

export function showColorbarGreen() {
    const colorbarWrapper2 = document.getElementById('colorbar-wrapper2');
    if (colorbarWrapper2) {
        colorbarWrapper2.style.display = 'grid';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}

export function showColorbarMagenta() {
    const colorbarWrapper2 = document.getElementById('colorbar-wrapper3');
    if (colorbarWrapper2) {
        colorbarWrapper2.style.display = 'grid';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}

export function hideColorbar() {
    const colorbarWrapper = document.getElementById('colorbar-wrapper');
    if (colorbarWrapper) {
        colorbarWrapper.style.display = 'none';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}

export function hideColorbarGreen() {
    const colorbarWrapper2 = document.getElementById('colorbar-wrapper2');
    if (colorbarWrapper2 ) {
        colorbarWrapper2.style.display = 'none';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}

export function hideColorbarMagenta() {
    const colorbarWrapper2 = document.getElementById('colorbar-wrapper3');
    if (colorbarWrapper2 ) {
        colorbarWrapper2.style.display = 'none';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}