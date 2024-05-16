// /src/helpers/APIClient.js
// Function to fetch data from the API and return an Observable using async/await
export async function fetchDataFromAPI(columnName, prefix) {
    // const response = await fetch(`http://localhost:8000/getdata?data=${prefix}&gene=${columnName}`);
    const response = await fetch(`https://fisheyes.techkyra.com/getdata?data=${prefix}&gene=${columnName}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Wait for the JSON conversion

    // no data available
    if (data === null) {
        return '[]';
    }

    const list = ['clusters', 'clusters_pal', 'genes', 'hierarchical_clusters'];
    const searchTerm = data._id;

    const exists = list.includes(searchTerm);

    // console.log(columnName, prefix)
    if (exists) {
        // console.log(data["values"])
        return data["values"]
    } else {
        const floatList = data.values.map(item => parseFloat(item));
        // console.log(floatList)
        return floatList
    }
}
