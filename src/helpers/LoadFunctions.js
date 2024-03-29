// /src/helpers/LoadFunctions.js
import { fetchDataFromAPI } from './APIClient';
import { updateDataPalette, updateGenes, ApiState } from '../states/ApiState';
import { updateDataItems } from '../states/MatrixState';
import { updateLoadingState } from '../states/UIState';

const prefix = ApiState.value.prefix;

export async function loadPallete() {
    const pal_col = ApiState.value.palleteColumn;
    try {
        const data = await fetchDataFromAPI(pal_col, prefix); 
        updateDataPalette(data);
    } catch (error) {
        console.error('Failed to load items:', error);
    }
}

export async function loadGenes() {
    try {
        const data = await fetchDataFromAPI("genes", prefix); 
        updateGenes(data);
    } catch (error) {
        console.error('Failed to load items:', error);
    }
}

export async function loadItems() {
    const columns = ApiState.value.columns;
    let transformedData = {};
    let jsonData = [];

    try {
        // Fetch data for all columns asynchronously
        const results = await Promise.all(columns.map(col => fetchDataFromAPI(col, prefix)));
        
        console.log(results);
        columns.forEach((col, index) => {
            console.log(col);
            transformedData[col] = results[index];
        });

        console.log("trfdata");
        console.log(transformedData);
    
        // Assuming 'clusters' is a valid key in your transformedData
        // Make sure this logic aligns with how your data is structured
        for (let i = 0; i < transformedData.clusters.length; i++) {
            let row = {};
            for (let key in transformedData) {
                row[key] = transformedData[key][i];
            }
            jsonData.push(row);
        }

        // Update the global state with the new items
        updateDataItems(jsonData);    
    } catch (error) {
        console.error('Error combining data:', error);
    }   
}