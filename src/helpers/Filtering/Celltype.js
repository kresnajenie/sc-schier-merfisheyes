import { ApiState } from "../../states/ApiState";
import { SelectedState, updateSelectedCelltype } from "../../states/SelectedState";

/**
 * Detects celltype input changes and sends them to be filtered
 */
export const cellSearch = () => {
    // autocomplete checkboxes
    const cellTextbox = document.getElementById('cellTextbox');

    cellTextbox.addEventListener('input', (e) => {
        const searchQuery = e.target.value.toLowerCase(); // holds search query

        console.log(searchQuery);

        filterCellSearchQuery(searchQuery);
    })
}

/**
 * Filter palette by which celltype matches the input search query
 * @param {String} searchQuery 
 * Example Usage:
 * filterCellSearchQuery("anteri");
 */
export function filterCellSearchQuery(searchQuery) {

    const cellAlert = document.getElementById('cellNotFound');
    let filteredCellType = ApiState.value.listPalette;
    // if has query string
    if (searchQuery) {

        filteredCellType = ApiState.value.listPalette.filter(([celltype, color]) => {
            return celltype.toLowerCase().startsWith(searchQuery); // checks if has substring
        })

        console.log(filteredCellType);

        createCellCheckboxes(filteredCellType);
    } else {
        createCellCheckboxes(ApiState.value.listPalette); // reset to show all
    }

    // show the alert if no filtered cell type
    if (filteredCellType.length === 0) {
        console.log("here");
        cellAlert.style.display = "block"
    } else {
        cellAlert.style.display = "none"
    }
}

/**
 * Creates the cell checkboxes from toggling celtype filters based on filter
 * @param {Array} cellTypesWithColors Shown checkboxes based on filter
 * Example Usage:
 * filterCellSearchQuery(["cell1", "cell2", "cell3"]);
 */
export function createCellCheckboxes(cellTypesWithColors) {

    // holds the group : input element inside group
    let divs = {};

    const checkboxes = document.getElementById('cellCheckboxes');

    checkboxes.innerHTML = ''; // clear checkbox container

    // Sort cellTypesWithColors alphabetically by celltype
    cellTypesWithColors.sort((a, b) => {
        if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
        if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
        return 0;
    });

    cellTypesWithColors.forEach(([celltype, color]) => {

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'box';
        checkbox.id = celltype;
        checkbox.value = celltype;

        // so previously checkbox aren't cleared when recreating the checkbox
        if (SelectedState.value.selectedCelltypes.includes(celltype)) {
            checkbox.checked = true;
        }

        // Create label
        const label = document.createElement('label');
        label.htmlFor = celltype;
        label.style.color = color;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(celltype));

        // if in a group, add to group instead
        let groupDiv;
        let groupInput; // the checkbox for the GROUP
        let groupLabel;
        let groupList;

        const findKeyByValue = (dictionary, target) => {
            for (const key in dictionary) {
                const values = dictionary[key];
                if (values.includes(target)) {
                    return key;
                }
            }
            return false; // Return false if the target is not found in any list
        }

        let c = findKeyByValue(ApiState.value.groups, celltype);

        // if c is true meaning found
        if (c) {

            // id of group input element
            const id = `${c}-group`;

            // if checkboxGroup is null, we make a new group
            if (Object.keys(divs).includes(c)) {
                groupDiv = document.getElementById(`${c}-div`);
                groupInput = document.getElementById(id);
                groupLabel = document.getElementById(`${c}-label`);
                groupList = document.getElementById(`${c}-list`);
            } else { // new group
                divs[c] = []

                groupDiv = document.createElement("div");
                groupDiv.id = `${c}-div`;

                // parent element
                groupLabel = document.createElement("label");
                groupLabel.htmlFor = c;
                groupLabel.setAttribute("for", id);
                groupLabel.style.color = "white";
                groupLabel.id = `${c}-label`;

                // inside group label
                groupInput = document.createElement("input");
                groupInput.type = "checkbox";
                groupInput.classList.add('box'); groupInput.classList.add('group-input');
                groupInput.value = c;
                groupInput.id = id;

                groupLabel.appendChild(groupInput);
                groupLabel.appendChild(document.createTextNode(c.toUpperCase())); // group name

                // holds the inner checkboxes
                groupList = document.createElement("ul");
                groupList.id = `${c}-list`;
                groupList.style.marginBottom = 0;

                groupDiv.appendChild(groupLabel);
                groupDiv.appendChild(groupList);

                checkboxes.appendChild(groupDiv) // add to checkbox container
            }

            // the individual checkbox inside the group
            const listItem = document.createElement("li");
            listItem.id = `${c}-item`;

            groupList.appendChild(label)
            groupList.append(document.createElement("br")); // so on new line

            divs[c].push(checkbox); // adds checkbox to dictionary for updating later

            checkboxes.appendChild(groupDiv)

        } else { // add it by itself without groups

            checkboxes.appendChild(label);
            checkboxes.appendChild(document.createElement('br'));
        }

        // Attach event listener for individual checkboxes
        checkbox.addEventListener('change', (e) => {
            console.log(e);
            updateCheckedItems(celltype, e.target.checked);
        });
    });

    // gets all group checkboxes (applies at end to prevent duplicate event listeners)
    const groupInputs = document.getElementsByClassName("group-input");

    // convert groupInputs to Array
    Array.prototype.slice.call(groupInputs).forEach(groupInput => {

        // detect group checkbox change
        groupInput.addEventListener('change', (e) => {

            let copy = SelectedState.value.selectedCelltypes.map(i => i);
            console.log("CHECKING", copy);

            // change all  to checked
            divs[e.target.value].forEach(input => {
                input.checked = e.target.checked;
                // updateCheckedItems(input.value, e.target.checked);

                if (e.target.checked) {
                    copy.push(input.value)
                } else {
                    copy.splice(copy.indexOf(input.value), 1)
                }
            })

            updateSelectedCelltype(copy);
        });

        // detect children change and updates parent accordingly
        divs[groupInput.value].forEach(input => { // goes through each input that has a parent

            // it's a repeat but this is for checking from url
            let all = true;

            if (!input.checked) { all = false };
            groupInput.checked = all;

            input.addEventListener('change', () => {

                let all = true;

                divs[groupInput.value].forEach(input => { // if after going through each one and they're all checked, set parent to true
                    if (!input.checked) { all = false };
                })

                groupInput.checked = all;

            })
        });
    })
}

/**
 * Update instanced mesh based on checked items
 * @param {String} celltype
 * @param {boolean} isChecked
 * Example Usage:
 * updateCheckedItems("cell1", true);
 */
export async function updateCheckedItems(celltype, isChecked) {

    // deep copies the selected celltype array
    let copy = SelectedState.value.selectedCelltypes.map(i => i);

    // Add celltype to the list if checked
    if (isChecked) {
        // deep copies the array by making it a string then back to array again
        copy.push(celltype);
        updateSelectedCelltype(copy);
    } else {
        // Remove celltype from the list if unchecked
        copy = copy.filter(item => item !== celltype)
        updateSelectedCelltype(copy);
    }
}

/**
 * Clear selected cells and search query
 */
export const clearCells = () => {
    const cellClearButton = document.getElementById('cellClearButton');

    cellClearButton.addEventListener('click', () => {
        updateSelectedCelltype([]);
        createCellCheckboxes(ApiState.value.listPalette);

        cellTextbox.value = ''; // clears search field
    })
}

/**
 * Records the celltype filters in use
 */
export const showCellFilters = () => {

    const cellFilters = document.getElementById("cellFilters");
    cellFilters.innerHTML = "";

    // if there are celltype filters
    if (SelectedState.value.selectedCelltypes.length !== 0) {
        SelectedState.value.selectedCelltypes.forEach((type) => {

            const f = document.createElement("p");
            f.style.color = ApiState.value.pallete[type];
            f.style.fontStyle = 'italic'
            f.style.fontWeight = 'bold'
            f.innerHTML = type;
            cellFilters.appendChild(f);
        })

        // no celltype filters
    } else {
        cellFilters.innerHTML = "No celltype filters selected";
    }
}

export function updateCelltypeCheckboxes() {
    const celltypes = SelectedState.value.selectedCelltypes;
    const checkboxContainer = document.getElementById('cellCheckboxes');
    let checkboxes = [];
    for (const index in checkboxContainer.children) {
        const child = checkboxContainer.children[index]        
        
        if (child.nodeName === "LABEL") {
            checkboxes.push(child.children[0]);
        }
    }

    checkboxes.forEach(checkbox => {
         
        if (celltypes.includes(checkbox.value)) {            
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
        }
    })
}