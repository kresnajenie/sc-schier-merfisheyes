import { ButtonState, updateDotSize, updateGenePercentile, updateCameraPositionZ } from '../states/ButtonState.js';

export const toggleCellFilter = () => {

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');

    toggleCellCheckbox.addEventListener('click', () => {

        cellCheckbox.style.display = cellCheckbox.style.display === 'none' ? 'block' : 'none';

        // set to highlight mode
        toggleCellCheckbox.style.backgroundColor = 'white';
        toggleCellCheckbox.style.color = 'black';

        // clear other toggle's style
        toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
        toggleGeneRadio.style.color = 'white';

        // check if gene checkbox is visible, if yes disable it
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
        }

        // reset it if clicked again
        if (cellCheckbox.style.display === 'none') {
            toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.color = 'white';
        }
    });
}

// toggles the gene filter popup
export const toggleGeneFilter = () => {

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');

    toggleGeneRadio.addEventListener('click', () => {

        geneRadioContainer.style.display = geneRadioContainer.style.display === 'none' ? 'block' : 'none';

        // set to highlight mode
        toggleGeneRadio.style.backgroundColor = 'white';
        toggleGeneRadio.style.color = 'black';

        // clear other toggle's style
        toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
        toggleCellCheckbox.style.color = 'white';

        // check if cell checkbox is visible, if yes disable it
        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
        }

        // reset it if clicked again
        if (geneRadioContainer.style.display === 'none') {
            toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleGeneRadio.style.color = 'white';
        }
    })
}

export const toggleButton = () => {

    const buttons = document.querySelectorAll('.iconBtn');
    const toggleZoomIn = document.getElementById("toggleZoomIn");
    const toggleZoomOut = document.getElementById("toggleZoomOut");
    const togglePointSize = document.getElementById("togglePointSize");
    const pointSizeSliderBox = document.getElementById("pointSizeSliderBox");
    const pointSizeSlider = document.getElementById("pointSizeSlider");
    const pointSizeSliderValue = document.getElementById("pointSizeSliderValue");
    const toggleGenePercentile = document.getElementById("toggleGenePercentile");
    const geneSliderBox = document.getElementById("geneSliderBox");
    const geneSlider = document.getElementById("geneSlider");
    const geneSliderValue = document.getElementById("geneSliderValue");

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');

    // hover functions for each button 

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const targetId = this.dataset.target;
            const targetBox = document.getElementById(targetId);
            targetBox.style.display = 'block';
        });

        button.addEventListener('mouseleave', function() {
            const targetId = this.dataset.target;
            const targetBox = document.getElementById(targetId);
            targetBox.style.display = 'none';
        });
    });

    // zoom in function

    toggleZoomIn.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.color = 'white';
        }
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleGeneRadio.style.color = 'white';
        }
        if (pointSizeSliderBox.style.display === 'block') {
            pointSizeSliderBox.style.display = 'none';
        }
        if (geneSliderBox.style.display === 'block') {
            geneSliderBox.style.display = 'none';
        }

        const newZoom = ButtonState.value.cameraPositionZ - 25;
        updateCameraPositionZ(newZoom);
    })

    // zoom out function
    
    toggleZoomOut.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.color = 'white';
        }
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleGeneRadio.style.color = 'white';
        }
        if (pointSizeSliderBox.style.display === 'block') {
            pointSizeSliderBox.style.display = 'none';
        }
        if (geneSliderBox.style.display === 'block') {
            geneSliderBox.style.display = 'none';
        }

        const newZoom = ButtonState.value.cameraPositionZ + 25;
        updateCameraPositionZ(newZoom);
    })

    // point size slider function
    
    togglePointSize.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.color = 'white';
        }
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleGeneRadio.style.color = 'white';
        }
        if (geneSliderBox.style.display === 'block') {
            geneSliderBox.style.display = 'none';
        }

        pointSizeSliderBox.style.display = pointSizeSliderBox.style.display === 'none' ? 'block' : 'none';
    })
    
    pointSizeSlider.oninput = function() {
        pointSizeSliderValue.value = parseFloat(this.value).toFixed(2);
        updateDotSize(parseFloat(this.value).toFixed(2));
    }

    pointSizeSliderValue.oninput = function() {
        if (this.value < 0) {
            this.value = 0;
        } else if (this.value > 50) {
            this.value = 50;
        }
        pointSizeSlider.value = parseFloat(this.value).toFixed(2);
        updateDotSize(parseFloat(this.value).toFixed(2));
    }

    // gene percentile slider function

    toggleGenePercentile.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.color = 'white';
        }
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleGeneRadio.style.color = 'white';
        }
        if (pointSizeSliderBox.style.display === 'block') {
            pointSizeSliderBox.style.display = 'none';
        }

        geneSliderBox.style.display = geneSliderBox.style.display === 'none' ? 'block' : 'none';
    })
    
    // geneSlider.oninput = function() {
    //     geneSliderValue.value = parseFloat(this.value).toFixed(2);
    //     updateGenePercentile(parseFloat(this.value).toFixed(2));
    // }

    geneSlider.addEventListener('mouseup', function() {
        geneSliderValue.value = parseFloat(this.value).toFixed(2);
        updateGenePercentile(parseFloat(this.value).toFixed(2));
    });

    geneSliderValue.oninput = function() {
        if (this.value < 0) {
            this.value = 0;
        } else if (this.value > 99.99) {
            this.value = 99.99;
        }
        geneSlider.value = parseFloat(this.value).toFixed(2);
        updateGenePercentile(parseFloat(this.value).toFixed(2));
    }
}