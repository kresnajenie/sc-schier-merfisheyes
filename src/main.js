import { SceneInitializer } from './components/SceneInitializer.js'; // Adjust the path as needed
import { updateDataItems, updateLoadingState } from './states/GlobalState.js'; // Adjust the path as needed
import { ApiState } from './states/GlobalState.js'; // Adjust the path as needed
import { loadGenes, loadItems, loadPallete } from './helpers/LoadFunctions.js'; // Adjust the path as needed
import { firstValueFrom } from 'rxjs';
import { createNavbar } from './ui/Navbar'; 
import { createOverlay } from './ui/Overlay'; // Adjust the path as needed


document.addEventListener('DOMContentLoaded', async () => {
    const navbar = createNavbar();
    // const overlay = createOverlay();
    
    document.body.insertBefore(navbar, document.body.firstChild);
    // document.body.appendChild(overlay);

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
    }
});
