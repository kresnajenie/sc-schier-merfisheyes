import { readFileSync } from "fs";
import { join } from "path";

let annotations = null;
let peaks = null;

function loadAnnotations() {
  if (annotations) return annotations;
  const filePath = join(process.cwd(), "beds", "ensembl100_annotation_genes.txt");
  const lines = readFileSync(filePath, "utf-8").split("\n");
  annotations = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].trim().split(/\s+/);
    if (cols.length < 9) continue;
    annotations.push({
      seqnames: cols[3],
      start: parseInt(cols[4]),
      end: parseInt(cols[5]),
      strand: cols[7],
      symbol: cols[10] || cols[9],
    });
  }
  return annotations;
}

function loadPeaks() {
  if (peaks) return peaks;
  const filePath = join(process.cwd(), "beds", "Enriched_peaks.bed");
  const lines = readFileSync(filePath, "utf-8").split("\n");
  peaks = [];
  for (const line of lines) {
    const cols = line.trim().split("\t");
    if (cols.length < 4) continue;
    peaks.push({
      chr: cols[0],
      start: parseInt(cols[1]),
      end: parseInt(cols[2]),
      enriched: parseFloat(cols[3]),
    });
  }
  return peaks;
}

function findGeneIntervals(geneName, range) {
  const annots = loadAnnotations();
  const allPeaks = loadPeaks();

  const targetGene = annots.find(
    (a) => a.symbol.toLowerCase() === geneName.toLowerCase()
  );
  if (!targetGene) {
    return { error: "Gene not found in annotation file." };
  }

  const intervalStart = Math.max(0, targetGene.start - range);
  const intervalEnd = targetGene.end + range;
  const chr = targetGene.seqnames;

  // Find ATAC peaks in interval
  const matchedPeaks = allPeaks.filter(
    (p) =>
      p.chr === chr &&
      p.start < intervalEnd &&
      p.start > intervalStart &&
      p.end > intervalStart &&
      p.end < intervalEnd
  );

  // Find neighboring genes in interval
  const matchedGenes = annots.filter(
    (a) =>
      a.seqnames === chr &&
      a.start < intervalEnd &&
      a.end > intervalStart &&
      a.symbol.toLowerCase() !== geneName.toLowerCase()
  );

  // Collect all coordinates for normalization
  const allStarts = [
    intervalStart,
    intervalEnd,
    ...matchedPeaks.map((p) => p.start),
    ...matchedPeaks.map((p) => p.end),
  ];
  const minStart = Math.min(...allStarts);
  const maxEnd = Math.max(...allStarts);
  const span = maxEnd - minStart || 1;

  const results = [];

  // Add ATAC peaks
  for (const p of matchedPeaks) {
    results.push({
      interval: `${p.chr}:${p.start}-${p.end}`,
      label: "atac",
      start: (p.start - minStart) / span,
      width: (p.end - p.start) / span,
      enriched: p.enriched,
    });
  }

  // Add neighboring genes
  for (const g of matchedGenes) {
    const gStart = Math.max(0, Math.min(1, (g.start - minStart) / span));
    const gEnd = Math.max(0, Math.min(1, (g.end - minStart) / span));
    results.push({
      interval: `${g.seqnames}:${g.start}-${g.end}`,
      label: `${g.strand}__gene__${g.symbol}`,
      start: gStart,
      width: gEnd - gStart,
      enriched: null,
    });
  }

  // Add target gene
  const tStart = Math.max(0, Math.min(1, (targetGene.start - minStart) / span));
  const tEnd = Math.max(0, Math.min(1, (targetGene.end - minStart) / span));
  results.push({
    interval: `${targetGene.seqnames}:${targetGene.start}-${targetGene.end}`,
    label: `${targetGene.strand}__mygene__${targetGene.symbol}`,
    start: tStart,
    width: tEnd - tStart,
    enriched: null,
  });

  // Sort by width descending
  results.sort((a, b) => b.width - a.width);

  return { intervals: results };
}

export default function handler(req, res) {
  const { gene, range } = req.query;

  if (!gene) {
    return res.status(400).json({ error: "Missing gene parameter" });
  }

  const rangeVal = parseInt(range) || 100000;
  const result = findGeneIntervals(gene, rangeVal);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=86400");
  return res.status(result.error ? 404 : 200).json(result);
}
