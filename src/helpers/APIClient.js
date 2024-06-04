// /src/helpers/APIClient.js
// Function to fetch data from the API and return an Observable using async/await
export async function fetchDataFromAPI(columnName, prefix) {
    // const response = await fetch(`http://localhost:8000/getdata?data=${prefix}&gene=${columnName}`);
    // const response = await fetch(`https://fisheyes.techkyra.com/getdata?data=${prefix}&gene=${columnName}`);
    const response = await fetch(`https://fisheyes.techkyra.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
    https://fisheyes.techkyra.com/get-gene-values?gene=tbxta&dbname=genedb&dbcollection=6s&username=zebra&csv_filename=6somite_matrix.csv
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Wait for the JSON conversion
    let _d = data.gene_values.split(',').filter(item => item !== "");


    // no data available
    if (data === null) {
        return '[]';
    }

    const list = ['clusters', 'clusters_pal', 'genes', 'hierarchical_clusters'];

    const exists = list.includes(columnName);
    console.log(columnName)
    console.log(typeof columnName)
    console.log(exists)

    // console.log(columnName, prefix)
    if (exists == true) {
        // console.log(data["values"])
        console.log(_d)
        return _d
    } else {
        _d.shift();
        console.log("float")

        let floatList = _d.map(item => parseFloat(item));
        // console.log(floatList)
        console.log(floatList)
        return floatList
    }
}
