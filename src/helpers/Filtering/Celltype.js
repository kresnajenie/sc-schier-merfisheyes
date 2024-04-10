import { ApiState } from "../../states/ApiState";
import { SelectedState, updateSelectedCelltype } from "../../states/SelectedState";

// temporary groupings
const groups = [
    "Adaxial",
    "Cephalic",
    "Endoderm",
    "Floor Plate",
    "Hindbrain",
]

const divs = new Set();

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

        let checkboxGroup = document.createElement('checkboxGroup');

        // Append checkbox and label to container
        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(label);
        checkboxGroup.appendChild(document.createElement('br'));

        // if in a group, add to group instead
        let group;
        let list;

        let c = groups.find(s => celltype.startsWith(s));
        if (c) {

            // if checkboxGroup is null, we make a new group
            if (divs.has(c)) {
                console.log("already exists");
                group = document.getElementById(`${c}-group`);

            } else {
                group = document.createElement("input");
                group.type = "checkbox";
                group.className = 'box';
                group.id = `${c}-group`;
                divs.add(c);

                list = document.createElement("ul");
                list.id = `${c}-list`;

                console.log("create!");
            }

            // group.appendChild(list);
            // list.appendChild(checkboxGroup);
            // checkboxGroup = group;
        }

        checkboxes.appendChild(checkboxGroup);

        // Attach event listener
        checkbox.addEventListener('change', (e) => {
            updateCheckedItems(celltype, e.target.checked);
        });
    });
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
    console.log(SelectedState.value.selectedCelltypes);
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
            f.style.fontStyle = 'normal'
            f.innerHTML = type;
            cellFilters.appendChild(f);
        })

        // no celltype filters
    } else {
        cellFilters.innerHTML = "No celltype filters selected";
    }
}