export function setLabels(min,max) {
    const topLabel = document.getElementById('top-label');
    const bottomLabel = document.getElementById('bottom-label');
    console.log(min,max)
    console.log("KONTOTLOBNTONTONTOTONTONTONTONLLLLLLLLL")
    console.log(topLabel)
    console.log(bottomLabel)

    let actual_max = max;
    if (max < 1) {
        actual_max = max.toExponential(1); // 1 specifies the number of digits after the decimal point
    } else {
        actual_max = Math.round(max);
    }
    
    // Check if the elements exist before setting the text content
    if (topLabel && bottomLabel) {
        topLabel.textContent = actual_max;
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

export function hideColorbar() {
    const colorbarWrapper = document.getElementById('colorbar-wrapper');
    if (colorbarWrapper) {
        colorbarWrapper.style.display = 'none';
    } else {
        console.error("Colorbar wrapper not found in the DOM.");
    }
}