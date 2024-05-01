import { SceneInitializer } from './components/SceneInitializer.js';
import { cellSearch, clearCells, createCellCheckboxes } from './helpers/Filtering/Celltype.js';
import { clearGenes, createGeneRadio, geneSearch } from './helpers/Filtering/Gene.js';
import { loadGenes, loadItems, loadPallete } from './helpers/LoadFunctions.js';
import { toggleCellFilter, toggleGeneFilter, toggleButton } from './helpers/ToggleFilters.js';
import { ApiState } from './states/ApiState.js';
import { SelectedState, updateSelectedCelltype, updateSelectedGene } from './states/SelectedState.js';
import { updateLoadingState } from './states/UIState.js';
import { createFilter } from './ui/Filters/Filters.js';
import { createLoadingIndicator } from './ui/Loading/Loading.js';
import { createNavbar } from './ui/Navbar/Navbar.js';
import { createOverlay } from './ui/Overlay/Overlay.js';
// import { createGenomeBrowser } from './ui/GenomeBrowser/GenomeBrowser.js';

document.addEventListener('DOMContentLoaded', async () => {
    const navbar = createNavbar();
    createOverlay();
    // createGenomeBrowser();
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

    try {
        // Wait for the palette items to be loaded
        await loadPallete();

        console.log(ApiState.value.pallete);

        await loadItems();
        await loadGenes();
        console.log(ApiState.value.genes);

        // // Fetch additional data items
        // const data = await firstValueFrom(fetchDataFromAPI(pal_col, prefix));
        // updateDataItems(data);

        const sceneContainer = document.body;
        new SceneInitializer(sceneContainer);

        // dictionary of all search paramaters in url
        const url = new URL(window.location);
        const params = new URLSearchParams(url.search);

        if (params.has("celltype")) {
            const cells = JSON.parse(decodeURIComponent(params.get("celltype")))

            // remove invalid celltypes
            const filteredCells = cells.filter((cell) => Object.keys(ApiState.value.pallete).includes(cell))
            console.log("new cells", filteredCells);

            updateSelectedCelltype(filteredCells);
        }

        if (params.has("gene")) {

            const genes = JSON.parse(decodeURIComponent(params.get("gene")))

            // remove invalid genes
            const filteredGenes = genes.filter((gene) => ApiState.value.genes.includes(gene))
            console.log("new genes", filteredGenes);

            updateSelectedGene(filteredGenes);
        }

        createCellCheckboxes(ApiState.value.listPalette);
        clearCells();
        cellSearch()

        createGeneRadio(ApiState.value.genes.slice(0, 10));
        clearGenes();
        geneSearch();

    } catch (err) {
        console.error('Failed to load data:', err);
    } finally {
        updateLoadingState(false); // Loading ends after all async operations
    }
});
