// /src/helpers/APIClient.js
// Function to fetch data from the API and return an Observable using async/await
export async function fetchDataFromAPI(columnName, prefix, atac=false) {
    // const response = await fetch(`http://localhost:8000/getdata?data=${prefix}&gene=${columnName}`);
    // const response = await fetch(`https://fisheyes.techkyra.com/getdata?data=${prefix}&gene=${columnName}`);
    // const response = await fetch(`https://fisheyes.techkyra.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
    let response = ""
    if (atac == true) {
        // console.log("ATACATACATACATACATACATACATAC")
        // response = await fetch(`http://localhost:8000/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_atac.csv`);
        // response = await fetch(`https://fisheyes.techkyra.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_atac.csv`);
        // response = await fetch(`https://backendbasel.techkyra.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_atac_new.csv`);
        response = await fetch(`https://sc-schier-backend.merfisheyes.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_atac_new.csv`);

    }   else {
        // console.log("MATRIXMATRIXMATRIXMATRIXMATRIXMATRIX")
        // response = await fetch(`http://localhost:8000/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
        // response = await fetch(`https://fisheyes.techkyra.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
        response = await fetch(`https://sc-schier-backend.merfisheyes.com/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
    }
    // https://fisheyes.techkyra.com/get-gene-values?gene=tbxta&dbname=genedb&dbcollection=6s&username=zebra&csv_filename=6somite_matrix.csv
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Wait for the JSON conversion

    // no data available
    if (data === undefined || data.gene_values == undefined) {
        return '[]';
    }

    let _d = data.gene_values.split(',').filter(item => item !== "");

    const list = ['clusters', 'clusters_pal', 'genes', 'hierarchical_clusters'];

    const exists = list.includes(columnName);
    // console.log(columnName)
    // console.log(typeof columnName)
    // console.log(exists)

    // console.log(columnName, prefix)
    if (exists == true) {
        // console.log(data["values"])
        _d.shift()
        // console.log(_d)
        return _d
    } else {
        if (columnName == "clusters") {
            // console.log("sini bang")
        }
        _d.shift();
        // console.log("float")

        let floatList = _d.map(item => parseFloat(item));
        // console.log(floatList)
        return floatList
    }
}



export async function fetchIntervalGene(gene, range=100000) {
    let response = ""
    // response = await fetch(`https://backendbasel.techkyra.com/get-intervals?gene=${gene}&range=${range}`);
    response = await fetch(`https://sc-schier-backend.merfisheyes.com/get-intervals?gene=${gene}&range=${range}`);


    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Wait for the JSON conversion

    // no data available
    if (data === undefined) {
        return '[]';
    }

    return data
}
