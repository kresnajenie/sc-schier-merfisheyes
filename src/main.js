import { SceneInitializer } from './components/SceneInitializer.js';
import { loadGenes, loadItems, loadPallete } from './helpers/LoadFunctions.js';
import { ApiState, UIState, updateLoadingState } from './states/GlobalState.js';
import { createLoadingIndicator } from './ui/Loading/Loading.js';
import { createNavbar } from './ui/Navbar/Navbar.js';
import { createOverlay } from './ui/Overlay/Overlay.js';

// Add an event listener for the hashchange event
window.addEventListener('hashchange', () => { window.location.reload() });

document.addEventListener('DOMContentLoaded', async () => {
    const navbar = createNavbar();
    const overlay = createOverlay();
    const loading = createLoadingIndicator();

    document.body.insertBefore(navbar, document.body.firstChild);
    document.body.appendChild(overlay);

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

        // // Fetch additional data items
        // const data = await firstValueFrom(fetchDataFromAPI(pal_col, prefix));
        // updateDataItems(data);

        const sceneContainer = document.body;
        new SceneInitializer(sceneContainer);
    } catch (err) {
        console.error('Failed to load data:', err);
    } finally {
        updateLoadingState(false); // Loading ends after all async operations
        loading.style.display = 'none';
        console.log("Loading", UIState.value.isLoading, loading.style);
    }
});
