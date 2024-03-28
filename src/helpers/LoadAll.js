import { SceneInitializer } from "../components/SceneInitializer.js";
import { ApiState, updateLoadingState } from "../states/GlobalState";
import { loadGenes, loadItems, loadPallete } from "./LoadFunctions";

export const loadAll = async () => {

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
}