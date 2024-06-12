
import { ApiState } from "../../states/ApiState";
import { SelectedState, updateMode, updateSelectedAtac } from "../../states/SelectedState";

// Toggle gene checkbox container
export const atacSearch = () => {
    // const atacTextbox = document.getElementById('atacTextbox');

    // atacTextbox.addEventListener('input', (e) => {
    //     const searchQuery = e.target.value.toLowerCase();

    //     console.log(searchQuery);

    //     filterAtacSearchQuery(searchQuery);
    // });
}

/**
 * Filter palette by which gene matches the input search query
 * @param {String} searchQuery 
 * Example Usage:
 * filterGeneSearchQuery("av");
 */
export function filterAtacSearchQuery(searchQuery) {

    const atacAlert = document.getElementById('atacNotFound');

    // if has query string
    if (searchQuery) {

        const filteredAtac = ApiState.value.atacs.filter((atac) => {
            return atac.toLowerCase().startsWith(searchQuery); // checks if has substring
        })

        console.log(filteredAtac);

        createAtacRadio(filteredAtac);

        // show the alert if no filtered cell type
        if (filteredAtac.length === 0) {
            console.log("here");
            atacAlert.style.display = "block"
        } else {
            atacAlert.style.display = "none"
        }
    } else {
        createAtacRadio(ApiState.value.atacs.slice(0,1000)); // reset to show all
    }
}

export function createAtacRadio(atacList) {
    const radios = document.getElementById('atacContainer');

    radios.innerHTML = ''; // clear checkbox container

    // Sort geneList alphabetically by gene
    atacList.sort((a, b) => {
        if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
        if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
        return 0;
    });

    atacList.forEach((atac) => {
        // Create checkbox
        const radio = document.createElement('input');
        radio.type = 'checkbox';
        radio.className = 'box';
        radio.id = atac;
        radio.value = atac;
        radio.name = "radio";

        if (SelectedState.value.selectedAtacs.includes(atac)) {
            radio.checked = true;
        }

        // Create label
        const label = document.createElement('label');
        label.htmlFor = atac;
        label.textContent = atac;
        label.style.color = "white";

        const radioGroup = document.createElement('div');

        // Append checkbox and label to container
        radioGroup.appendChild(radio);
        radioGroup.appendChild(label);
        radioGroup.appendChild(document.createElement('br'));

        radios.appendChild(radioGroup);

        // Attach event listener
        radio.addEventListener('change', (e) => {
            // limits it to only 2 genes selected at a time

            if (SelectedState.value.selectedAtacs.length >= SelectedState.value.mode) {
                e.target.checked = false;
            }

            // single gene mode
            if (SelectedState.value.mode === 1 && SelectedState.value.selectedAtacs.length === 1) {

                // deselect the first gene selected
                const prevAtac = document.querySelector(`[value=${CSS.escape(SelectedState.value.selectedAtacs[0])}]`);

                if (prevAtac) {
                    prevAtac.checked = false;
                }

                // not in shown or not the same gene
                if (prevAtac === null || prevAtac.value !== e.target.value) {
                    updateSelectedAtac([]); // remove prev gene
                    e.target.checked = true;
                }
            }

            updateRadioItem(atac, e.target.checked);
        });
    });
}

// export function toggleMode() {

//     const modeButton = document.getElementById("modeButton");

//     modeButton.value = SelectedState.value.mode

//     // update based on param
//     if (modeButton.value === "1") {
//         modeButton.innerText = "Single Gene Mode";
//         modeButton.classList.replace("btn-success", "btn-info");
//     } else {
//         modeButton.innerText = "Two Gene Mode";
//         modeButton.classList.replace("btn-info", "btn-success");
//     }

//     modeButton.onclick = () => {

//         let mode = modeButton.value === "1"

//         if (mode) {
//             modeButton.innerText = "Two Gene Mode";
//             modeButton.classList.replace("btn-info", "btn-success");
//         } else {
//             modeButton.innerText = "Single Gene Mode";
//             modeButton.classList.replace("btn-success", "btn-info");
//         }

//         modeButton.value = mode ? 2 : 1;
//         updateMode(Number(mode ? 2 : 1));

//         // update to show any selected genes
//         if (mode) {
//             showSelectedGeneFilters()
//         } else {
//             document.getElementById("selectedContainer").innerHTML = '';
//         }
//     }
// }

function updateRadioItem(atac, isChecked) {

    // deep copies the selected atac array
    let copy = SelectedState.value.selectedAtacs.map(i => i);

    if (isChecked) {
        copy.push(atac);
        updateSelectedAtac(copy);
    } else {
        copy = copy.filter(item => item !== atac);
        updateSelectedAtac(copy);
    }
}

/**
 * Clear selected cells and search query
 */
export const clearAtacs = () => {

    const atacClearButton = document.getElementById('atacClearButton');

    atacClearButton.addEventListener('click', () => {
        updateSelectedAtac([]);
        createAtacRadio(ApiState.value.atacs.slice(0,1000))

        atacTextbox.value = ''; // clears search field
    });
}

/**
 * Clear selected cells and search query
 */
export const enterAtacs = () => {

    const atacEnterButton = document.getElementById('atacEnterButton');

    atacEnterButton.addEventListener('click', () => {
        console.log("entered clicked")
        // Access the input element
        const atacTextbox = document.getElementById('atacTextbox');
        const searchQuery = atacTextbox.value.toLowerCase();

        filterAtacSearchQuery(searchQuery);
        // updateSelectedAtac([]);
        // createAtacRadio(ApiState.value.atacs.slice(0,1000))

        // atacTextbox.value = ''; // clears search field
    });
}



/**
 * Records the celltype filters in use
 */
export const showAtacFilters = () => {

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
        geneFilters.innerHTML = "No atac filters selected";
    }
}

export const showSelectedAtacFilters = () => {

    // create the element to store selected gene filters
    const container = document.getElementById("selectedContainer");

    // clear all
    container.innerHTML = ''
    
    // reuse the checkbox code from above
    SelectedState.value.selectedAtacs.forEach(atac => {

        const radio = document.createElement('input');
        radio.type = 'checkbox';
        radio.className = 'box';
        radio.id = 'select-' + atac;
        radio.value = atac;
        radio.name = "radio";

        if (SelectedState.value.selectedAtacs.includes(atac)) {
            radio.checked = true;
        }

        // Create label
        const label = document.createElement('label');
        label.htmlFor = 'select-' + atac;
        label.textContent = atac;
        label.style.color = "white";

        const radioGroup = document.createElement('div');

        // Append checkbox and label to container
        radioGroup.appendChild(radio);
        radioGroup.appendChild(label);
        radioGroup.appendChild(document.createElement('br'));
    
        container.appendChild(radioGroup);

        // Attach event listener
        radio.addEventListener('change', (e) => {

            // if exists in our radio list, uncheck it and update

            // gets the checkbox inside the gene container
            const checkedAtac = document.querySelector(`#atacContainer [value=${CSS.escape(SelectedState.value.selectedAtacs[0])}]`);

            // if exists in our radio list
            if (checkedAtac !== null) {
                checkedAtac.checked = false;
            }

            updateRadioItem(radio.value, false);
        });
    })

    if (SelectedState.value.selectedAtacs.length > 0) {
        const title = document.createElement('p');
        title.innerText = "Selected atacs"
        title.style.color = 'white';
        title.style.margin = 0;
        container.prepend(title);

        const separator = document.createElement('hr')
        separator.style.borderColor = 'white';
        separator.style.margin = "2px";

        container.appendChild(separator);
    }
}