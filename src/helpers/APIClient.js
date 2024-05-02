// /src/helpers/APIClient.js
// Function to fetch data from the API and return an Observable using async/await
export async function fetchDataFromAPI(columnName, prefix) {
    // const response = await fetch(`http://localhost:8000/getdata?data=${prefix}&gene=${columnName}`);
    const response = await fetch(`https://fisheyes.techkyra.com/getdata?data=${prefix}&gene=${columnName}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Wait for the JSON conversion

    const list = ['clusters', 'clusters_pal', 'genes', 'hierarchical_clusters'];
    const searchTerm = data._id;

    const exists = list.includes(searchTerm);

    console.log(columnName, prefix)
    if (exists) {
        console.log(data["values"])
        return data["values"]
    } else {
        const floatList = data.values.map(item => parseFloat(item));
        console.log(floatList)
        return floatList
    }
    
    // try {
    //     const floatList = JSON.parse(data.values).map(item => parseFloat(item));
    //     console.log("float")
    //     console.log(floatList); // Log the actual data
    //     return floatList; // Return the parsed data
    // } catch{
    //     console.log(data.values); // Log the actual data
    //     return JSON.parse(data.values); // Return the parsed data
    // }
}
