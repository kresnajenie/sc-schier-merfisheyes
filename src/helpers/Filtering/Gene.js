
import { ApiState } from "../../states/ApiState";
import { SelectedState, updateSelectedGene } from "../../states/SelectedState";
import { updateLoadingState } from "../../states/UIState";

// Toggle gene checkbox container
export const geneSearch = () => {
    const geneTextbox = document.getElementById('geneTextbox');

    geneTextbox.addEventListener('input', (e) => {
        const searchQuery = e.target.value.toLowerCase();

        console.log(searchQuery);

        filterGeneSearchQuery(searchQuery);
    });
}

/**
 * Filter palette by which gene matches the input search query
 * @param {String} searchQuery 
 * Example Usage:
 * filterGeneSearchQuery("av");
 */
export function filterGeneSearchQuery(searchQuery) {

    const geneAlert = document.getElementById('geneNotFound');

    // if has query string
    if (searchQuery) {

        const filteredGene = ApiState.value.genes.filter((gene) => {
            return gene.toLowerCase().startsWith(searchQuery); // checks if has substring
        })

        console.log(filteredGene);

        createGeneRadio(filteredGene);

        // show the alert if no filtered cell type
        if (filteredGene.length === 0) {
            console.log("here");
            geneAlert.style.display = "block"
        } else {
            geneAlert.style.display = "none"
        }
    } else {
        createGeneRadio(ApiState.value.genes); // reset to show all
    }
}

export function createGeneRadio(geneList) {
    const radios = document.getElementById('geneRadio');

    radios.innerHTML = ''; // clear checkbox container

    // Sort geneList alphabetically by gene
    geneList.sort((a, b) => {
        if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
        if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
        return 0;
    });

    geneList.forEach((gene) => {
        // Create checkbox
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.className = 'box';
        radio.id = gene;
        radio.value = gene;
        radio.name = "radio";

        // Create label
        const label = document.createElement('label');
        label.htmlFor = gene;
        label.textContent = gene;
        label.style.color = "white";

        const radioGroup = document.createElement('geneRadioGroup');

        // Append checkbox and label to container
        radioGroup.appendChild(radio);
        radioGroup.appendChild(label);
        radioGroup.appendChild(document.createElement('br'));

        radios.appendChild(radioGroup);

        // Attach event listener
        radio.addEventListener('change', (e) => {
            updateRadioItem(gene, e.target.checked);
        });
    });
}

function updateRadioItem(gene, isChecked) {

    if (isChecked) {
        updateSelectedGene([gene]);
    }
    console.log(gene);
    console.log(SelectedState.value.selectedGenes);
}

/**
 * Clear selected cells and search query
 */
export const clearGenes = () => {

    const geneClearButton = document.getElementById('geneClearButton');

    geneClearButton.addEventListener('click', () => {
        updateSelectedGene([]);
        createGeneRadio(ApiState.value.genes)

        geneTextbox.value = ''; // clears search field
    });
}


/**
 * Records the celltype filters in use
 */
export const showGeneFilters = () => {

    const geneFilters = document.getElementById("geneFilters");
    geneFilters.innerHTML = "";

    // if there are celltype filters
    if (SelectedState.value.selectedGenes.length !== 0) {
        SelectedState.value.selectedGenes.forEach((type) => {

            const f = document.createElement("p");
            f.style.color = 'white';
            f.style.fontStyle = 'italic'
            f.innerHTML = type;
            geneFilters.appendChild(f);
        })

    // no gene filters
    } else {
        geneFilters.innerHTML = "No gene filters selected";
    }
}