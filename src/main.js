import { SceneInitializer } from './components/SceneInitializer.js';
import { cellSearch, clearCells, createCellCheckboxes } from './helpers/Filtering/Celltype.js';
import { clearGenes, createGeneRadio, geneSearch } from './helpers/Filtering/Gene.js';
import { loadGenes, loadItems, loadPallete } from './helpers/LoadFunctions.js';
import { toggleCellFilter, toggleGeneFilter, toggleButton } from './helpers/toggleFilters.js';
import { ApiState } from './states/ApiState.js';
import { updateLoadingState } from './states/UIState.js';
import { createFilter } from './ui/Filters/Filters.js';
import { createLoadingIndicator } from './ui/Loading/Loading.js';
import { createNavbar } from './ui/Navbar/Navbar.js';
import {createOverlay} from './ui/Overlay/Overlay.js'

// Add an event listener for the hashchange event
window.addEventListener('hashchange', () => { window.location.reload() });

document.addEventListener('DOMContentLoaded', async () => {
    const navbar = createNavbar();
    createOverlay();
    const loading = createLoadingIndicator();
    const filter = createFilter();

    document.body.insertBefore(navbar, document.body.firstChild);
    // document.body.appendChild(overlay);
    document.body.appendChild(loading);
    document.body.appendChild(filter);

    // for clicking on the toggles
    toggleCellFilter();
    toggleGeneFilter();
    toggleButton();

    updateLoadingState(true); // Assume loading starts

    // const pal_col = GlobalState.value.constantData.palleteColumn;
    // const prefix = GlobalState.value.constantData.prefix;

    try {
        // Wait for the palette items to be loaded
        await loadPallete();

        console.log(ApiState.value.pallete);

        await loadItems();
        await loadGenes();
        console.log(ApiState.value.genes);

        createCellCheckboxes(ApiState.value.listPalette);
        clearCells();
        cellSearch()

        createGeneRadio(ApiState.value.genes);
        clearGenes();
        geneSearch();

        // // Fetch additional data items
        // const data = await firstValueFrom(fetchDataFromAPI(pal_col, prefix));
        // updateDataItems(data);

        const sceneContainer = document.body;
        new SceneInitializer(sceneContainer);
    } catch (err) {
        console.error('Failed to load data:', err);
    } finally {
        updateLoadingState(false); // Loading ends after all async operations
    }
});
