// /src/helpers/APIClient.js

const S3_BASE = "https://single-cell-data-yinan.s3.us-west-2.amazonaws.com";
const API_BASE = "https://sc-schier-backend.merfisheyes.com";

// Prefixes that have been migrated to S3
const S3_PREFIXES = ["50pe", "75pe", "6s"];

export async function fetchDataFromAPI(columnName, prefix, atac=false) {
    let response;
    const useS3 = S3_PREFIXES.includes(prefix);

    if (useS3) {
        const folder = atac ? "atac" : "matrix";
        response = await fetch(`${S3_BASE}/${prefix}/${folder}/${columnName}.csv`);
    } else {
        if (atac) {
            response = await fetch(`${API_BASE}/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_atac_new.csv`);
        } else {
            response = await fetch(`${API_BASE}/get-gene-values?gene=${columnName}&dbname=genedb&dbcollection=${prefix}&username=zebra&csv_filename=${prefix}_matrix.csv`);
        }
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // S3 returns raw CSV text, API returns JSON with gene_values field
    let geneValues;
    if (useS3) {
        geneValues = await response.text();
    } else {
        const data = await response.json();
        if (data === undefined || data.gene_values == undefined) {
            return '[]';
        }
        geneValues = data.gene_values;
    }

    let _d = geneValues.split(',').filter(item => item !== "");

    const list = ['clusters', 'clusters_pal', 'genes', 'hierarchical_clusters'];

    if (list.includes(columnName)) {
        _d.shift();
        return _d;
    } else {
        _d.shift();
        return _d.map(item => parseFloat(item));
    }
}



export async function fetchIntervalGene(gene, range=100000) {
    const response = await fetch(`/api/get-intervals?gene=${gene}&range=${range}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data === undefined) {
        return '[]';
    }

    return data;
}
