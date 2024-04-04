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

    const toggleZoomIn = document.getElementById("toggleZoomIn");

    toggleZoomIn.addEventListener('click', () => {
        const newZoom = ButtonState.value.cameraPositionZ - 25;
        updateCameraPositionZ(newZoom);
    })

    const toggleZoomOut = document.getElementById("toggleZoomOut");

    toggleZoomOut.addEventListener('click', () => {
        const newZoom = ButtonState.value.cameraPositionZ + 25;
        updateCameraPositionZ(newZoom);
    })

    const togglePointSize = document.getElementById("togglePointSize");
    const pointSizeSliderBox = document.getElementById("pointSizeSliderBox");

    togglePointSize.addEventListener('click', () => {
        pointSizeSliderBox.style.display = pointSizeSliderBox.style.display === 'none' ? 'block' : 'none';
    })

    const pointSizeSlider = document.getElementById("pointSizeSlider");
    const pointSizeSliderValue = document.getElementById("pointSizeSliderValue");
    
    pointSizeSlider.oninput = function() {
        pointSizeSliderValue.innerHTML = this.value;
        updateDotSize(this.value);
    }

    const toggleGenePercentile = document.getElementById("toggleGenePercentile");
    const geneSliderBox = document.getElementById("geneSliderBox");

    toggleGenePercentile.addEventListener('click', () => {
        geneSliderBox.style.display = geneSliderBox.style.display === 'none' ? 'block' : 'none';
    })

    const geneSlider = document.getElementById("geneSlider");
    const geneSliderValue = document.getElementById("geneSliderValue");
    
    geneSlider.oninput = function() {
        geneSliderValue.innerHTML = this.value;
        updateGenePercentile(this.value);
    }
}