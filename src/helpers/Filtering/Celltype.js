import { ApiState } from "../../states/ApiState";
import { SelectedState, updateSelectedCelltype } from "../../states/SelectedState";
import { updateLoadingState } from "../../states/UIState";

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
 * Filter palette by which celltype matches the input  search query
 * @param {Array} searchQuery 
 * Example Usage:
 * filterCellSearchQuery("anteri")';
 */
export function filterCellSearchQuery(searchQuery) {

    const cellAlert = document.getElementById('cellNotFound');

    // if has query string
    if (searchQuery) {

        const filteredCellType = ApiState.value.listPalette.filter(([celltype, color]) => {
            return celltype.toLowerCase().startsWith(searchQuery); // checks if has substring
        })

        console.log(filteredCellType);

        createCellCheckboxes(filteredCellType);

        // show the alert if no filtered cell type
        if (filteredCellType.length === 0) {
            console.log("here");
            cellAlert.style.display = "block"
        } else {
            cellAlert.style.display = "none"
        }
    } else {
        createCellCheckboxes(ApiState.value.listPalette); // reset to show all
    }
}

/**
 * Creates the cell checkboxes from toggling celtype filters based on filter
 * @param {Array} cellTypesWithColors Shown checkboxes based on filter
 * Example Usage:
 * filterCellSearchQuery(["cell1", "cell2", "cell3"]);;
 */
export function createCellCheckboxes(cellTypesWithColors) {
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
        label.textContent = celltype;
        label.style.color = color;

        const checkboxGroup = document.createElement('checkboxGroup');

        // Append checkbox and label to container
        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(label);
        checkboxGroup.appendChild(document.createElement('br'));

        checkboxes.appendChild(checkboxGroup);

        // Attach event listener
        checkbox.addEventListener('change', (e) => {
            updateCheckedItems(celltype, e.target.checked);
        });
    });
}

export const clearCells = () => {
    const cellClearButton = document.getElementById('cellClearButton');

    cellClearButton.addEventListener('click', () => {
        updateSelectedCelltype([]);
        // cellFilters.innerHTML = "No celltype filters selected";
        // updateInstancedMesh(checkedCellTypes);
        createCellCheckboxes(ApiState.value.listPalette);

        cellTextbox.value = '';
    })
}



// Function to update instanced mesh based on checked items
export async function updateCheckedItems(celltype, isChecked) {
    if (isChecked) {
        // Add celltype to the list if checked
        SelectedState.value.selectedCelltypes.push(celltype);
    } else {
        // Remove celltype from the list if unchecked
        updateSelectedCelltype(SelectedState.value.selectedCelltypes.filter(item => item !== celltype));
    }
    console.log(SelectedState.value.selectedCelltypes);
    // cellFilters.innerHTML = "";
    // showCellFilters(checkedCellTypes, pallete);

    updateLoadingState(true);

    updateLoadingState(false);
}