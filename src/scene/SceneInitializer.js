// ThreeJS
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { LinearFilter, LinearMipMapLinearFilter } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

// Global states
import { MatrixState } from '../states/MatrixState.js';
import { ApiState } from '../states/ApiState.js';
import { SceneState } from '../states/SceneState.js';
import { UIState, updateLoadingState } from '../states/UIState.js';
import { SelectedState } from '../states/SelectedState.js';
import { ButtonState } from '../states/ButtonState.js';
// Additional libraries
import { isEqual } from 'lodash';
import { map, distinctUntilChanged, tap, skip } from 'rxjs/operators';
// UI imports
import { loading } from '../helpers/Loading.js';
import { showCellFilters, updateCelltypeCheckboxes } from '../helpers/Filtering/Celltype.js';
import { calculateGenePercentile, coolwarm, getGene, getAtac, normalizeArray } from '../helpers/GeneFunctions.js';
import { showGeneFilters, showSelectedGeneFilters, clearGenes } from '../helpers/Filtering/Gene.js';
import { showAtacFilters, showSelectedAtacFilters, clearAtacs } from '../helpers/Filtering/Atac.js';
import { violinImageSearch } from '../helpers/Filtering/Violin.js';
import { changeURL } from '../helpers/URL.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { updateBadge, updateCelltypeBadge, updateCelltypeBadgeApperance } from '../ui/Showing/Showing.js';
import { hideColorbar, hideColorbarGreen, hideColorbarMagenta, setLabels, setLabelsGreen, setLabelsMagenta, showColorbar, showColorbarGreen, showColorbarMagenta } from '../ui/ColorBar/ColorBar.js';
import { getInterval } from '../helpers/ATACPlot/Peaks.js';
import { plotInitialData, updateCircleColors } from '../ui/Overlay/Overlay.js';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

// const mouse = new THREE.Vector2();
let initialStart = 0

export class SceneInitializer {
    constructor(container) {
        // Raycaster for detecting mouse hover
        this.container = container;
        this.instancedMesh;
        this.instancedMeshUmap;

        this.initScene();

        this.subscribeToStateChanges();
    }

    /**
     * Adds text description to scene. 
     */
    addText() {
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Anterior', {
                font: font,
                size: 10,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const dorsal = new THREE.Mesh(textGeometry, textMaterial);
            dorsal.position.set(-30, 190, 0); // Set the position as needed
            this.scene.add(dorsal);

            const textGeometryVentral = new TextGeometry('Posterior', {
                font: font,
                size: 10,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const ventral = new THREE.Mesh(textGeometryVentral, textMaterial);
            ventral.position.set(-30, -190, 0); // Set the position as needed
            this.scene.add(ventral);


        });
    };

    /**
     * Initializes the 3D scene, including setting up the camera, renderer, and controls. 
     * This function also handles the initial positioning of the camera based on the API prefix.
     */
    initScene() {
        this.scene = SceneState.value.scene;

        // Set the background color to a solid color (e.g., black)
        this.scene.background = new THREE.Color(0x000000); // Hexadecimal color value
        
        // Initialize camera and renderer conditionally
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        if (ApiState.value.prefix == "6s") {
            this.camera.position.y = ButtonState.value.cameraPositionY;
            this.camera.position.x = ButtonState.value.cameraPositionX;
            // Add this line to include the text
            this.addText(); 
        } else {
            // Hide the button and descBox when the page loads
            document.getElementById("toggleATACRadio").style.display = "none";
            document.getElementById("atac-desc").style.display = "none";
            this.camera.position.y = 0;
            this.camera.position.x = 0;
        }
        this.camera.position.z = ButtonState.value.cameraPositionZ;

        // Example usage inside SceneInitializer
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.25;
        // this.controls.update();
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);

        // Configure TrackballControls
        this.controls.rotateSpeed = 2.0; // Speed of rotation
        this.controls.zoomSpeed = 1.2; // Speed of zooming
        this.controls.panSpeed = 0.8; // Speed of panning
        this.controls.noZoom = false; // Allow zooming
        this.controls.noPan = false; // Allow panning
        this.controls.staticMoving = false; // Smooth movement
        this.controls.dynamicDampingFactor = 0.2; // Damping factor for smoothness


        this.updateInstancedMesh("initScene");

        this.animate();

        // Fit scene to window size when window size changes
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

    }

    /**
     * Subscribes to various state changes and updates the scene accordingly.
     * 
     * This function listens for changes in API prefix, UI loading state, 
     * selected cell types, genes, ATACs, button state, and mode. When a change 
     * is detected, it updates the corresponding elements in the scene, such as 
     * the dropdown menu, loading indicator, cell filters, gene filters, ATAC 
     * filters, and URL parameters.
     */
    subscribeToStateChanges() {
        // Listen to prefix for dropdown prefix text
        ApiState.pipe(
            map(state => state.prefix),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
        ).subscribe(items => {
            const prefix = document.getElementById("dropdownMenuButton");
            prefix.innerText = ApiState.value.prefix;
        });
        
        // Listen to loading state
        UIState.pipe(
            map(state => state.isLoading),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            skip(1)
        ).subscribe(items => {
            loading(UIState.value.isLoading);
        });
        
        // Listen to selected celltypes
        SelectedState.pipe(
            map(state => state.selectedCelltypes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            updateLoadingState(true);
            await this.updateInstancedMesh("selectedCelltype");
            updateLoadingState(false);
            showCellFilters();
            updateCelltypeBadge();
            updateCelltypeCheckboxes();
            
            // Update URL params
            if (SelectedState.value.selectedCelltypes.length > 0) {
                const newCelltype = encodeURIComponent(JSON.stringify(SelectedState.value.selectedCelltypes));
                params.set("celltype", newCelltype);
            } else {
                params.delete("celltype");
            }
            changeURL(params);
        });
        
        // Listen to selected genes
        SelectedState.pipe(
            map(state => state.selectedGenes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            if (SelectedState.value.mode === 2) {
                showSelectedGeneFilters();
            } else {
                violinImageSearch(items[0]);
            }
            updateLoadingState(true);
            clearAtacs();
            showGeneFilters();

            // Update URL params
            if (SelectedState.value.selectedGenes.length > 0) {
                let selectedGene = SelectedState.value.selectedGenes[0];
                let firstElement = selectedGene.split('_')[0];
                if (ApiState.value.prefix == "6s" && SelectedState.value.geneGenomeHover == false) {
                    getInterval(firstElement);
                }
                const newGenes = encodeURIComponent(JSON.stringify(SelectedState.value.selectedGenes));
                params.set("gene", newGenes);
            } else {
                params.delete("gene");
            }
            await this.updateInstancedMesh("selectedGene");
            changeURL(params);
            updateLoadingState(false);

            updateCelltypeBadgeApperance();
        });
    
        // Change selected ATAC
        SelectedState.pipe(
            map(state => state.selectedAtacs),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            clearGenes();
            if (SelectedState.value.mode === 2) {
                showSelectedAtacFilters();
            }
            updateLoadingState(true);
            showAtacFilters();
            if (SelectedState.value.selectedAtacs.length > 0) {
                const newAtacs = encodeURIComponent(JSON.stringify(SelectedState.value.selectedAtacs));
                params.set("atac", newAtacs);
            } else {
                params.delete("atac");
            }
            await this.updateInstancedMesh("selectedAtac");
            changeURL(params);
            updateLoadingState(false);

            updateCelltypeBadgeApperance()
        });
        
        // Listen to dot size
        ButtonState.pipe(
            map(state => state.dotSize),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(async items => {
            updateLoadingState(true);
            await this.updateInstancedMesh("dotSize");
            updateLoadingState(false);
        });
        
        // Listent to gene percentile
        ButtonState.pipe(
            map(state => state.genePercentile),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(async items => {
            updateLoadingState(true);
            await this.updateInstancedMesh("genePercentile");
            updateLoadingState(false);
        });
        
        // Listen to gene mode
        SelectedState.pipe(
            map(state => state.mode),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(items => {
            // console.log("Selected genes changed 2:", items);
            params.set("mode", items);
            changeURL(params);
        });
    }

    /**
     * Updates the instanced mesh based on the provided data and visualization settings.
     *
     * This function clears the existing mesh, generates a new mesh based on the JSON data,
     * and updates the mesh's geometry, material, and colors according to the selected
     * cell types, genes, and ATACs. It also updates the badge and colorbar visibility.
     *
     * @param {string} where - The location where the mesh is being updated.
     * @return {Promise<void>} A promise that resolves when the mesh update is complete.
     */
    async updateInstancedMesh(where) {
        let colors = [];

        // Clear existing mesh
        if (this.instancedMesh) {
            this.instancedMesh.geometry.dispose();
            this.instancedMesh.material.dispose();
            this.scene.remove(this.instancedMesh);
        }

        // Clear existing UMAP mesh
        if (this.instancedMeshUmap) {
            this.instancedMeshUmap.geometry.dispose();
            this.instancedMeshUmap.material.dispose();
            this.scene.remove(this.instancedMeshUmap);
        }

        let pallete = ApiState.value.pallete;
        let jsonData = MatrixState.value.items;

        const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const circleGeometry = new THREE.CircleGeometry(0.1, 32, 32);

        const material = new THREE.MeshBasicMaterial();
        const count = jsonData.length;

        this.instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count);
        this.instancedMeshUmap = new THREE.InstancedMesh(circleGeometry, material, count);

        const proj = new THREE.Object3D();
        const umap = new THREE.Object3D();

        let color;

        // when plotting gene
        let ctsClipped1;
        let ctsClipped2;

        let mod = 200;
        let umapmod = 2;

        let celltypes = SelectedState.value.selectedCelltypes;
        let genes = SelectedState.value.selectedGenes;
        let atacs = SelectedState.value.selectedAtacs;

        let dotSize = ButtonState.value.dotSize;
        let smallDotSize = Math.floor(dotSize / 2);

        let genePercentile = ButtonState.value.genePercentile;
        let atacPercentile = ButtonState.value.genePercentile;
        
        let nmax1 = 1;

        if (atacs.length > 0) {
            try {
                let count1 = await getAtac(atacs[0]);
                if (atacs.length == 2) {
                    let count2 = await getAtac(atacs[1]);
                    let nmax2 = calculateGenePercentile(count2, atacPercentile);
                    ctsClipped2 = normalizeArray(count2, nmax2);
                }
                // You can use cts here
                nmax1 = calculateGenePercentile(count1, atacPercentile);
                ctsClipped1 = normalizeArray(count1, nmax1);
            } catch (error) {
                // Handle errors if the promise is rejected
                console.error('Error fetching data:', error);
            }
        } else if (genes.length > 0) {
            try {
                let count1 = await getGene(genes[0]);
                if (genes.length == 2) {
                    let count2 = await getGene(genes[1]);
                    let nmax2 = calculateGenePercentile(count2, genePercentile);
                    ctsClipped2 = normalizeArray(count2, nmax2);
                    setLabelsMagenta(0, nmax2);

                }
                // You can use cts here
                nmax1 = calculateGenePercentile(count1, genePercentile);
                ctsClipped1 = normalizeArray(count1, nmax1);
            } catch (error) {
                // Handle errors if the promise is rejected
                console.error('Error fetching data:', error);
            }
        }

        setLabels(0, nmax1);
        setLabelsGreen(0, nmax1);

        // Create a mesh for each key in the JSON object        
        for (let i = 0; i < count; i++) {
            
            if (atacs.length > 0) {
                // no celltypes or matches celltype
                if (celltypes.length === 0 || celltypes.includes(jsonData[i]["clusters"])) {

                    let colorrgb;
                    let scale;

                    // if there's a second gene
                    if (ctsClipped2) {
                        colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
                        scale = (ctsClipped1[i] + ctsClipped2[i]) / 2 * dotSize + dotSize / 1.5;
                    } else {
                        colorrgb = coolwarm(ctsClipped1[i]);
                        scale = ctsClipped1[i] * dotSize + dotSize / 1.5;
                    }

                    color = new THREE.Color(colorrgb);

                    proj.scale.set(scale, scale, scale);
                    umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
                } else { // don't color if not
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(1, 1, 1);
                    umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                }
                // has celltype filters
            } else if (genes.length > 0) {
                // no celltypes or matches celltype
                if (celltypes.length === 0 || celltypes.includes(jsonData[i]["clusters"])) {

                    let colorrgb;
                    let scale;

                    // if there's a second gene
                    if (ctsClipped2) {
                        colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
                        scale = (ctsClipped1[i] + ctsClipped2[i]) / 2 * dotSize + dotSize / 1.5;
                    } else {
                        colorrgb = coolwarm(ctsClipped1[i]);
                        scale = ctsClipped1[i] * dotSize + dotSize / 1.5;
                    }

                    color = new THREE.Color(colorrgb);

                    proj.scale.set(scale, scale, scale);
                    umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
                } else { // don't color if not
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(1, 1, 1);
                    umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                }
                // has celltype filters
            }  else {
                if (celltypes.includes(jsonData[i]["clusters"]) || celltypes.length == 0) {
                    // color = new THREE.Color(jsonData[i]["clusters_colors"]);
                    color = new THREE.Color(pallete[jsonData[i]["clusters"]]);
                    proj.scale.set(dotSize, dotSize, dotSize);
                    umap.scale.set(dotSize * umapmod, dotSize * umapmod, dotSize * umapmod);
                } else {
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(smallDotSize, smallDotSize, smallDotSize);
                    umap.scale.set(smallDotSize * umapmod, smallDotSize * umapmod, smallDotSize * umapmod);
                }
            }

            //plot projection
            let ymod = 1;
            if (ApiState.value.prefix == "6s") {
                ymod = -1;
            }

            proj.position.set(jsonData[i]["X_spatial0_norm"] * mod, jsonData[i]["X_spatial1_norm"] *ymod*mod, jsonData[i]["X_spatial2_norm"] * mod);
            proj.updateMatrix();
            this.instancedMesh.setMatrixAt(i, proj.matrix);
            this.instancedMesh.setColorAt(i, color);
            colors.push(color);
        }
        
        // plot initial UMAP data
        if (initialStart == 0) {
            initialStart+= 1;
            plotInitialData(jsonData, colors)
        } else {
            updateCircleColors(colors);
        }

        // Update badge legend
        if (atacs.length > 0) { // atac badges
            updateBadge("atac", atacs)
            if (atacs.length > 1) {
                hideColorbarGreen();
                hideColorbarMagenta();
                hideColorbar();
            } else {
                showColorbar();
                hideColorbarGreen();
                hideColorbarMagenta();
            }
        } else if (genes.length > 0) { // gene badges
            updateBadge("gene", genes)
            if (genes.length > 1) {
                showColorbarGreen();
                showColorbarMagenta();
                hideColorbar();
            } else {
                showColorbar();
                hideColorbarGreen();
                hideColorbarMagenta();
            }
        }  else { // celltype badges
            updateBadge("celltype")
            hideColorbar();
            hideColorbarGreen();
            hideColorbarMagenta();
        }

        updateCelltypeBadge();
        updateCelltypeCheckboxes();
        updateCelltypeBadgeApperance();

        this.scene.add(this.instancedMesh);
        this.scene.add(this.instancedMeshUmap);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.controls.update(); // Only needed if controls.enableDamping is true
        // Assume your instanced mesh is global or accessible within this scope
        // const cameraQuaternion = this.camera.quaternion;
        // let jsonData = MatrixState.value.items;

        // for (let i = 0; i < jsonData.length * 2; i++) {
        //     const matrix = new THREE.Matrix4();
        //     const position = new THREE.Vector3();
        //     const scale = new THREE.Vector3();

        //     // Extract position and scale from the current instance matrix
        //     this.instancedMesh.getMatrixAt(i, matrix);
        //     matrix.decompose(position, new THREE.Quaternion(), scale);

        //     // Rebuild the matrix using the camera's quaternion for rotation
        //     matrix.compose(position, cameraQuaternion, scale);
        //     this.instancedMesh.setMatrixAt(i, matrix);
        // }
        // console.log(this.camera.position)

        // this.instancedMesh.instanceMatrix.needsUpdate = true; // Important!
        this.renderer.render(this.scene, this.camera);
    }
}
