
import { ApiState } from "../../states/ApiState";
import { SelectedState, updateMode, updateSelectedGene } from "../../states/SelectedState";
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
        createGeneRadio(ApiState.value.genes.slice(0,10)); // reset to show all
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
        radio.type = 'checkbox';
        radio.className = 'box';
        radio.id = gene;
        radio.value = gene;
        radio.name = "radio";

        if (SelectedState.value.selectedGenes.includes(gene)) {
            radio.checked = true;
        }

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
            // limits it to only 2 genes selected at a time

            if (SelectedState.value.selectedGenes.length >= SelectedState.value.mode) {
                // alert("Only 2 genes selected at a time") // temporary for now
                e.target.checked = false;
            }

            // single gene mode
            if (SelectedState.value.mode === 1 && SelectedState.value.selectedGenes.length === 1) {

                // deselect the first gene selected
                const prevGene = document.querySelector(`[value=${CSS.escape(SelectedState.value.selectedGenes[0])}]`);

                prevGene.checked = false;

                // not the same gene
                if (prevGene.value !== e.target.value) {
                    updateSelectedGene([]); // remove prev gene
                    e.target.checked = true;
                }
            }

            updateRadioItem(gene, e.target.checked);
        });
    });
}

export function toggleMode() {
    modeButton.onclick = () => {

        const modeButton = document.getElementById("modeButton");

        let mode = modeButton.value === "true"

        if (mode) {
            modeButton.innerText = "Two Gene Mode";
            modeButton.classList.replace("btn-info", "btn-success");
        } else {
            modeButton.innerText = "Single Gene Mode";
            modeButton.classList.replace("btn-success", "btn-info");
        }

        modeButton.value = mode ? "false" : "true";
        updateMode(Number(mode ? 2 : 1));
    }
}

function updateRadioItem(gene, isChecked) {

    // deep copies the selected genes array
    let copy = SelectedState.value.selectedGenes.map(i => i);

    if (isChecked) {
        copy.push(gene);
        updateSelectedGene(copy);
    } else {
        copy = copy.filter(item => item !== gene);
        updateSelectedGene(copy);
    }
}

/**
 * Clear selected cells and search query
 */
export const clearGenes = () => {

    const geneClearButton = document.getElementById('geneClearButton');

    geneClearButton.addEventListener('click', () => {
        updateSelectedGene([]);
        createGeneRadio(ApiState.value.genes.slice(0, 10))

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
        SelectedState.value.selectedGenes.forEach((type, index) => {

            const f = document.createElement("p");
            f.style.color = index === 0 ? 'magenta' : 'green';
            f.style.fontStyle = 'italic'
            f.style.fontWeight = 'bold'
            f.innerHTML = type;
            geneFilters.appendChild(f);
        })

        // no gene filters
    } else {
        geneFilters.innerHTML = "No gene filters selected";
    }
}