

const cellCheckbox = document.getElementById("cellCheckbox");
const geneRadioContainer = document.getElementById('geneRadioContainer');

const toggleCellCheckbox = document.getElementById('toggleCellCheckbox');
const toggleGeneRadio = document.getElementById('toggleGeneRadio');

// toggles the cell filter popup
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