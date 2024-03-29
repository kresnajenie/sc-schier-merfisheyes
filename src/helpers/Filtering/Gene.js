
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

export async function updateRadioItem(gene, isChecked) {

    updateLoadingState(true);

    if (isChecked) {
        // Add gene to the list if checked
        // window.selectedGene = gene;
        // const f = document.createElement('p');
        // f.style.fontStyle = 'italic';
        // f.style.color = 'white';
        // f.innerHTML = gene;

        // geneFilters.innerHTML = '';
        // geneFilters.append(f);

        updateSelectedGene([gene])

        await this.updateInstancedMesh(gene.toLowerCase());
    }

    updateLoadingState(false);
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

