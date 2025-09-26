# MERFISHEYES Single-Cell Visualizer

An interactive web-based tool for exploring **single-cell data across modalities** — integrating **scRNA-seq** and **scATAC-seq** with **MERFISH spatial transcriptomics** — covering **zebrafish development from gastrulation to organogenesis**.

This tool lets you:

- Visualize cells in spatial or latent space (UMAP/t-SNE)
- Toggle between RNA expression and chromatin accessibility
- Explore developmental trajectories interactively

## 📄 Related Paper

This visualization accompanies the study:  
**Whole-embryo Spatial Transcriptomics at Subcellular Resolution from Gastrulation to Organogenesis**  
[https://doi.org/10.1101/2024.08.27.609868](https://doi.org/10.1101/2024.08.27.609868)

## 🚀 Quick Start

```bash
# Clone and enter the repo
git clone https://github.com/kresnajenie/sc-schier-merfisheyes.git
cd sc-schier-merfisheyes

# Install dependencies
npm install

# Run locally
npx vite
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Citation

If you use this tool, please cite:

```bibtex
@software{sc-schier-merfisheyes,
  author = {Ignatius Kresnathan Sjahnir Jenie},
  title = {MERFISHEYES Single-Cell Visualizer},
  year = {2025},
  url = {https://github.com/kresnajenie/single-cell-visualizer},
  doi = {10.1101/2024.08.27.609868}
}
```

## 📄 License

Distributed under the [MIT License](./LICENSE).
