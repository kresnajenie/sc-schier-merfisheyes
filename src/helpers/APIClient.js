// /src/helpers/APIClient.js
import { from } from 'rxjs';

// Function to fetch data from the API and return an Observable using async/await
export async function fetchDataFromAPI(columnName, prefix) {
    const response = await fetch(`https://fisheyes.techkyra.com/getdata?col=${prefix}-${columnName}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Wait for the JSON conversion
    // console.log(data.data); // Log the actual data
    return JSON.parse(data.data); // Return the parsed data
}
