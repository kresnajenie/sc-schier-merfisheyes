import { updateDotSize, updateGenePercentile } from '../states/ButtonState.js';

export const toggleCellFilter = () => {

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');
    const atacRadioContainer = document.getElementById('atacRadioContainer');
    
    const violinContainer = document.getElementById('violinContainer');
    const noViolinContainer = document.getElementById('noViolinContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');
    const toggleATACRadio = document.getElementById('toggleATACRadio');

    const toggleViolinRadio = document.getElementById('toggleViolinRadio');

    toggleCellCheckbox.addEventListener('click', () => {

        console.log(cellCheckbox.style.display);

        cellCheckbox.style.display = cellCheckbox.style.display === 'none' ? 'block' : 'none';

        console.log(cellCheckbox.style.display);

        // set to highlight mode
        toggleCellCheckbox.style.backgroundColor = 'white';
        toggleCellCheckbox.style.color = 'black';

        // clear other toggle's style
        toggleGeneRadio.style.backgroundColor = '#282828';
        toggleGeneRadio.style.color = 'white';
        toggleATACRadio.style.backgroundColor = '#282828';
        toggleATACRadio.style.color = 'white';
        toggleViolinRadio.style.backgroundColor = '#282828';
        toggleViolinRadio.style.color='white';
        toggleViolinRadio.style.backgroundColor = '#282828';
        toggleViolinRadio.style.color = 'white';

        // check if gene checkbox is visible, if yes disable it
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
        }

        if (atacRadioContainer.style.display === 'block') {
            atacRadioContainer.style.display = 'none';
        }

        if (violinContainer.style.display === 'block' || noViolinContainer.style.display === 'block') {
            violinContainer.style.display = 'none';
            noViolinContainer.style.display = 'none';
        }


        // reset it if clicked again
        if (cellCheckbox.style.display === 'none') {
            // toggleCellCheckbox.style.backgroundColor = 'rgb(97, 97, 97)';
            toggleCellCheckbox.style.backgroundColor = '#282828';
            toggleCellCheckbox.style.color = 'white';
        }
    });
}

// toggles the gene filter popup
export const toggleGeneFilter = () => {

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');
    const atacRadioContainer = document.getElementById('atacRadioContainer');

    const violinContainer = document.getElementById('violinContainer');
    const noViolinContainer = document.getElementById('noViolinContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');
    const toggleATACRadio = document.getElementById('toggleATACRadio');
    const toggleViolinRadio = document.getElementById('toggleViolinRadio');


    toggleGeneRadio.addEventListener('click', () => {
        
        geneRadioContainer.style.display = geneRadioContainer.style.display === 'none' ? 'block' : 'none';

        // set to highlight mode
        toggleGeneRadio.style.backgroundColor = 'white';
        toggleGeneRadio.style.color = 'black';

        // clear other toggle's style
        toggleCellCheckbox.style.backgroundColor = '#282828';
        toggleCellCheckbox.style.color = 'white';
        toggleATACRadio.style.backgroundColor = '#282828';
        toggleATACRadio.style.color = 'white';
        toggleViolinRadio.style.backgroundColor = '#282828';
        toggleViolinRadio.style.color = 'white';

        // check if cell checkbox is visible, if yes disable it
        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
        }

        if (atacRadioContainer.style.display === 'block') {
            atacRadioContainer.style.display = 'none';
        }

        if (violinContainer.style.display === 'block' || noViolinContainer.style.display === 'block') {
            violinContainer.style.display = 'none';
            noViolinContainer.style.display = 'none';
        }

        // reset it if clicked again
        if (geneRadioContainer.style.display === 'none') {
            toggleGeneRadio.style.backgroundColor = '#282828';
            toggleGeneRadio.style.color = 'white';
        }
    })
}

// toggles the gene filter popup
export const toggleAtacFilter = () => {

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');
    const atacRadioContainer = document.getElementById('atacRadioContainer');

    const violinContainer = document.getElementById('violinContainer');
    const noViolinContainer = document.getElementById('noViolinContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');
    const toggleATACRadio = document.getElementById('toggleATACRadio');
    const toggleViolinRadio = document.getElementById('toggleViolinRadio');

    toggleATACRadio.addEventListener('click', () => {
        // alert("clicked")
        console.log("halo atac clicked")
        atacRadioContainer.style.display = atacRadioContainer.style.display === 'none' ? 'block' : 'none';

        // set to highlight mode
        toggleATACRadio.style.backgroundColor = 'white';
        toggleATACRadio.style.color = 'black';

        // clear other toggle's style
        toggleCellCheckbox.style.backgroundColor = '#282828';
        toggleCellCheckbox.style.color = 'white';
        toggleGeneRadio.style.backgroundColor = '#282828';
        toggleGeneRadio.style.color = 'white';
        toggleViolinRadio.style.backgroundColor = '#282828';
        toggleViolinRadio.style.color = 'white';

        // check if cell checkbox is visible, if yes disable it
        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
        }

        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
        }

        if (violinContainer.style.display === 'block' || noViolinContainer.style.display === 'block') {
            violinContainer.style.display = 'none';
            noViolinContainer.style.display = 'none';
        }

        // reset it if clicked again
        if (atacRadioContainer.style.display === 'none') {
            toggleATACRadio.style.backgroundColor = '#282828';
            toggleATACRadio.style.color = 'white';
        }
    })
}

// toggle violin
export const toggleViolin = () => {

    const toggleViolinRadio = document.getElementById('toggleViolinRadio');
    const violinContainer = document.getElementById('violinContainer');
    const noViolinContainer = document.getElementById('noViolinContainer');

    const cellCheckbox = document.getElementById("cellCheckbox");
    const geneRadioContainer = document.getElementById('geneRadioContainer');
    const atacRadioContainer = document.getElementById('atacRadioContainer');

    const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
    const toggleGeneRadio = document.getElementById('toggleGeneRadio');
    const toggleATACRadio = document.getElementById('toggleATACRadio');

    
    const violinImage = document.getElementById("violin-image");

    toggleViolinRadio.addEventListener('click', () => {

        console.log("violin clicked");

        // set to highlight mode

        toggleViolinRadio.style.backgroundColor = toggleViolinRadio.style.backgroundColor === 'white' ? '#282828' : 'white';
        toggleViolinRadio.style.color = toggleViolinRadio.style.color === 'black' ? 'white' : 'black';

        // toggleViolinRadio.style.backgroundColor = 'white';
        // toggleViolinRadio.style.color = 'black';

        // violinContainer.style.display = violinContainer.style.display === 'none' ? 'block' : 'none';
        // noViolinContainer.style.display = violinContainer.style.display === 'block' ? 'none' : 'block';


        if (toggleViolinRadio.style.backgroundColor === 'white') {
            if (violinImage.src === "" || violinImage.getAttribute('src') === "") {
                console.log("opt 1");
                noViolinContainer.style.display = 'block';
            } else {
                console.log("opt 2");
                violinContainer.style.display = 'block';
            }
        } else {
            console.log("opt 3");
            violinContainer.style.display = 'none';
            noViolinContainer.style.display = 'none';
        }

        // clear other toggle's style
        toggleCellCheckbox.style.backgroundColor = '#282828';
        toggleCellCheckbox.style.color = 'white';
        toggleGeneRadio.style.backgroundColor = '#282828';
        toggleGeneRadio.style.color = 'white';
        toggleATACRadio.style.backgroundColor = '#282828';
        toggleATACRadio.style.color = 'white';

        // check if cell checkbox is visible, if yes disable it
        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
        }

        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
        }

        if (atacRadioContainer.style.display === 'block') {
            atacRadioContainer.style.display = 'none';
        }


    })
}

export const toggleButton = () => {

    const buttons = document.querySelectorAll('.iconBtn,.toggles');
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

        const show = () => {
            const targetId = button.dataset.target;
            const targetBox = document.getElementById(targetId);
            targetBox.style.display = 'block';
        }

        const hide = () => {
            const targetId = button.dataset.target;
            const targetBox = document.getElementById(targetId);
            targetBox.style.display = 'none';
        }

        ['mouseenter'].forEach((event) => {
            button.addEventListener(event, function() {
                show();
            });
        });

        ['mouseleave'].forEach((event) => {
            button.addEventListener(event, function() {
                hide();
            });
        });
    });

    // point size slider function
    
    togglePointSize.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = '#282828';
            toggleCellCheckbox.style.color = 'white';
        }
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = '#282828';
            toggleGeneRadio.style.color = 'white';
        }
        if (geneSliderBox.style.display === 'block') {
            geneSliderBox.style.display = 'none';
        }

        pointSizeSliderBox.style.display = pointSizeSliderBox.style.display === 'none' ? 'block' : 'none';
    })
    
    pointSizeSlider.onchange = function() {
        pointSizeSliderValue.value = parseFloat(this.value).toFixed(2);
        updateDotSize(parseFloat(this.value).toFixed(2));
    }

    pointSizeSlider.addEventListener('mouseup', function() {
        pointSizeSliderValue.value = parseFloat(this.value).toFixed(2);
        updateDotSize(parseFloat(this.value).toFixed(2));
    });

    pointSizeSliderValue.onchange = function() {
        if (this.value < 0.1) {
            this.value = 0.1;
        } else if (this.value > 15) {
            this.value = 15;
        }
        pointSizeSlider.value = parseFloat(this.value).toFixed(2);
        updateDotSize(parseFloat(this.value).toFixed(2));
    }

    // unfocus on enter
    pointSizeSliderValue.onkeydown = function(e) {
        if (e.key === "Enter") {
            document.activeElement.blur();
        }
    }

    // gene percentile slider function

    toggleGenePercentile.addEventListener('click', () => {

        // check if anything else is open -> close

        if (cellCheckbox.style.display === 'block') {
            cellCheckbox.style.display = 'none';
            toggleCellCheckbox.style.backgroundColor = '#282828';
            toggleCellCheckbox.style.color = 'white';
        }
        ALLOWED_ORIGINS="https://roymaimonel.merfisheyes.com,https://fishies.techkyra.com,https://lji.techkyra.com,http://localhost:5173,https://roy.techkyra.com"
        if (geneRadioContainer.style.display === 'block') {
            geneRadioContainer.style.display = 'none';
            toggleGeneRadio.style.backgroundColor = '#282828';
            toggleGeneRadio.style.color = 'white';
        }
        if (pointSizeSliderBox.style.display === 'block') {
            pointSizeSliderBox.style.display = 'none';
        }

        geneSliderBox.style.display = geneSliderBox.style.display === 'none' ? 'block' : 'none';
    })


    geneSlider.addEventListener('mouseup', function() {
        geneSliderValue.value = parseFloat(this.value).toFixed(2);
        updateGenePercentile(parseFloat(this.value).toFixed(2));
    });

    geneSliderValue.onchange = function() {
        if (this.value < 80) {
            this.value = 80;
        } else if (this.value > 99.99) {
            this.value = 99.99;
        }
        geneSlider.value = parseFloat(this.value).toFixed(2);
        updateGenePercentile(parseFloat(this.value).toFixed(2));
    }

    // unfocus on enter
    geneSliderValue.onkeydown = function(e) {
        if (e.key === "Enter") {
            document.activeElement.blur();
        }
    }
}