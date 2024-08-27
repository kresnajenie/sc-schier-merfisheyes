import * as THREE from 'three';
import { MatrixState } from '../states/MatrixState.js';
import { ApiState } from '../states/ApiState.js';
import { SceneState } from '../states/SceneState.js';
import { UIState, updateLoadingState } from '../states/UIState.js';
import { SelectedState, updateSelectedInterval, updateSelectedShowing } from '../states/SelectedState.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { isEqual, padEnd } from 'lodash';
import { map, distinctUntilChanged, tap, skip } from 'rxjs/operators';
import { ButtonState } from '../states/ButtonState.js';
import { loading } from '../helpers/Loading.js';
import { showCellFilters } from '../helpers/Filtering/Celltype.js';
import { calculateGenePercentile, coolwarm, getGene, getAtac, normalizeArray } from '../helpers/GeneFunctions.js';
import { showGeneFilters, showSelectedGeneFilters, clearGenes } from '../helpers/Filtering/Gene.js';
import { showAtacFilters, showSelectedAtacFilters, clearAtacs } from '../helpers/Filtering/Atac.js';
import { changeURL } from '../helpers/URL.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { fetchIntervalGene } from '../helpers/APIClient.js';
// import { addBoxes } from '../helpers/ATACPlot/Peaks.js';
import { updateBadge } from '../ui/Showing/Showing.js';
import { hideColorbar, setLabels, showColorbar } from '../ui/ColorBar/ColorBar.js';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

// Raycaster for detecting mouse hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export class SceneInitializer {
    constructor(container) {
        this.container = container;
        this.meshDataArray = []; // To store mesh data for hover interaction
        this.isCommandOrCtrlPressed = false;
        this.isFilteringActive = false; // To track if filtering is active
        this.initScene();
        // this.addGreyMesh();
        this.subscribeToStateChanges();
    }


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

    initScene() {
        this.scene = SceneState.value.scene;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        if (ApiState.value.prefix == "6s") {
            this.camera.position.y = ButtonState.value.cameraPositionY;
            this.camera.position.x = ButtonState.value.cameraPositionX;
            this.addText(); // Add this line to include the text
        } else {
            // Hide the button and descBox when the page loads
            document.getElementById("toggleATACRadio").style.display = "none";
            document.getElementById("atac-desc").style.display = "none";
            this.camera.position.y = 0;
            this.camera.position.x = 0;
        }
        this.camera.position.z = ButtonState.value.cameraPositionZ;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.update();

        this.updateInstancedMesh("initScene");


        // Event listener for keydown to detect Command (metaKey) on macOS or Ctrl (ctrlKey) on Windows
        window.addEventListener('keydown', (event) => {
            if (event.metaKey || event.ctrlKey) {
                this.isCommandOrCtrlPressed = true;
                // Make all meshes visible when the key is pressed
                this.meshDataArray.forEach(({ group }) => {
                    group.visible = true;
                    group.children.forEach(child => {
                        child.scale.set(1, 1, 1); // Reset scale to original size
                    });
                });
            }
        });

        // Event listener for keyup to detect when Command or Ctrl key is released
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Meta' || event.key === 'Control') {
                this.isCommandOrCtrlPressed = false;
                this.onMouseMove()
            }
        });


        // Event listener for mouse click (toggle visibility)
        window.addEventListener('click', this.onMouseMove.bind(this), false);

        // window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
        this.animate();
    }


    subscribeToStateChanges() {
        MatrixState.pipe(
            map(state => state.items),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            skip(1)
        ).subscribe(items => {
            console.log('Items have updated:');
            // Handle the update
        });
    
        ApiState.pipe(
            map(state => state.prefix),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            skip(1)
        ).subscribe(items => {
            console.log("Prefix changed:", items);
            const prefix = document.getElementById("dropdownMenuButton");
            prefix.innerText = ApiState.value.prefix;
        });
    
        UIState.pipe(
            map(state => state.isLoading),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            skip(1)
        ).subscribe(items => {
            console.log("Loading changed:", items);
            loading(UIState.value.isLoading);
        });
    
        SelectedState.pipe(
            map(state => state.selectedCelltypes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            console.log("Selected celltypes changed:", items);
            updateLoadingState(true);

            if (items.length > 0) {
                this.isFilteringActive = true;
                this.filterCellTypes(items); // Call the filtering function
            } else {
                this.isFilteringActive = false;
                this.resetMeshVisibility(); // Reset visibility when no cell types are selected
            }

            updateLoadingState(false);
            if (items.length > 0) {
                const newCelltype = encodeURIComponent(JSON.stringify(items));
                params.set("celltype", newCelltype);
            } else {
                params.delete("celltype");
            }
            changeURL(params);
        });
        SelectedState.pipe(
            map(state => state.selectedGenes),
            tap((curr, index) => {
                if (index > 0) {
                    console.log("Previous selected genes:", prev);
                    console.log("Current selected genes:", curr);
                }
            }),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            console.log("Selected genes changed:", items);
            if (SelectedState.value.mode === 2) {
                showSelectedGeneFilters();
            } 
            updateLoadingState(true);
            clearAtacs();
            showGeneFilters();
            if (SelectedState.value.selectedGenes.length > 0) {
                let selectedGene = SelectedState.value.selectedGenes[0];
                let firstElement = selectedGene.split('_')[0];
                if (ApiState.value.prefix == "6s") {
                    try {
                        const interval = await fetchIntervalGene(firstElement);
                        updateSelectedInterval(interval["intervals"]);
                    } catch (error) {
                        console.error('Error fetching interval gene:', error);
                    }
                }
                const newGenes = encodeURIComponent(JSON.stringify(SelectedState.value.selectedGenes));
                params.set("gene", newGenes);
            } else {
                params.delete("gene");
            }
            await this.updateInstancedMesh("selectedGene");
            changeURL(params);
            updateLoadingState(false);
        });
    
        SelectedState.pipe(
            map(state => state.selectedAtacs),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
            skip(1)
        ).subscribe(async items => {
            console.log("Selected atacs changed:", items);
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
        });
    
        ButtonState.pipe(
            map(state => state.dotSize),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(async items => {
            console.log("Dot Size Changed:", items);
            updateLoadingState(true);
            await this.updateInstancedMesh("dotSize");
            updateLoadingState(false);
        });
    
        ButtonState.pipe(
            map(state => state.genePercentile),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(async items => {
            console.log("Gene Percentile", items);
            updateLoadingState(true);
            await this.updateInstancedMesh("genePercentile");
            updateLoadingState(false);
        });
    
        SelectedState.pipe(
            map(state => state.mode),
            distinctUntilChanged(),
            skip(1)
        ).subscribe(items => {
            console.log("Selected genes changed:", items);
            params.set("mode", items);
            changeURL(params);
        });
    }

    async updateInstancedMesh(where) {
        console.log("^^^^^^^^^");
        console.log(where);
        console.log("^^^^^^^^^");

        console.log("PALETTTE");

        // Remove each group from the scene and dispose of associated resources
        this.meshDataArray.forEach(({ group }) => {
            // Remove the group from the scene
            this.scene.remove(group);

            // Dispose of each mesh's geometry and material within the group
            group.children.forEach(mesh => {
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            });
        });

        this.meshDataArray = []; // To store mesh data for hover interaction


        let pallete = ApiState.value.pallete;
        let jsonData = MatrixState.value.items;

        const keys = Object.keys(pallete);
        const material = new THREE.MeshBasicMaterial();
        const proj = new THREE.Object3D();
        let dotSize = ButtonState.value.dotSize;
        const sphereGeometry = new THREE.SphereGeometry(0.1*dotSize, 16, 16);


        // Clear previous mesh data
        this.meshDataArray = [];

        keys.forEach((key) => {
            const colorHex = pallete[key]; // Get the color associated with the key
            let filteredItems = jsonData.filter(item => item.clusters === key);
            const count = filteredItems.length;
        
            if (count > 0) {
                const keyMaterial = new THREE.MeshBasicMaterial();
                const keyMesh = new THREE.InstancedMesh(sphereGeometry, keyMaterial, count*2);
                const meshGroup = new THREE.Group();
        
                filteredItems.forEach((item, i) => {
                    const xSpatial = item.X_spatial0_norm;
                    const ySpatial = item.X_spatial1_norm * -1;
                    const zSpatial = item.X_spatial2_norm;
        
                    // Set position for the original sphere based on X_spatial0, X_spatial1, X_spatial2
                    proj.position.set(xSpatial * 200, ySpatial * 200, zSpatial * 200);
                    proj.updateMatrix();
                    keyMesh.setMatrixAt(i, proj.matrix);

                    // Now, plot an additional sphere based on X_umap0 and X_umap1 with an x-axis offset of 10000
                    const xUmap = item.X_umap0_norm;
                    const yUmap = item.X_umap1_norm;
                    const zUmap = 0; // You can adjust this as needed

                    proj.position.set(xUmap * 200 + 10000, yUmap * 200, zUmap * 200);
                    proj.updateMatrix();
                    keyMesh.setMatrixAt(i+count, proj.matrix);
        
                    // Set the original color for this instance
                    const color = new THREE.Color(colorHex);
                    keyMesh.setColorAt(i, color);
                    keyMesh.setColorAt(i+count, color);
                });
        
                keyMesh.instanceMatrix.needsUpdate = true;
                keyMesh.instanceColor.needsUpdate = true; // Ensure the colors are updated
        
                meshGroup.add(keyMesh);
                this.scene.add(meshGroup);
        
                this.meshDataArray.push({ group: meshGroup, keyMesh, name: key });
            }
        });
        

        // this.scene.add(this.instancedMesh);
        // this.scene.add(this.instancedMeshUmap);
    }

    filterCellTypes(cellTypesToShow) {
        this.meshDataArray.forEach(({ group, name }) => {
            group.visible = cellTypesToShow.includes(name);
        });
    }

    resetMeshVisibility() {
        this.meshDataArray.forEach(({ group }) => {
            group.visible = true;
        });
    }

    addGreyMesh() {
        let jsonData = MatrixState.value.items;
        const greyColor = new THREE.Color(0x808080); // Grey color
    
        const smallDotSize = ButtonState.value.dotSize * 0.5; // Smaller dot size
        const sphereGeometry = new THREE.SphereGeometry(0.1 * smallDotSize, 16, 16);
        const greyMaterial = new THREE.MeshBasicMaterial({ color: greyColor });
        let count = jsonData.length
        const greyMesh = new THREE.InstancedMesh(sphereGeometry, greyMaterial, count*2);
    
        const proj = new THREE.Object3D();
    
        jsonData.forEach((item, i) => {
            const x = item.X_spatial0_norm;
            const y = item.X_spatial1_norm * -1;
            const z = item.X_spatial2_norm;
    
            proj.position.set(x * 200, y * 200, z * 200);
            proj.updateMatrix();
    
            greyMesh.setMatrixAt(i, proj.matrix);

            const xUmap = item.X_umap0_norm;
            const yUmap = item.X_umap1_norm;
    
            proj.position.set(xUmap * 200 + 10000, yUmap * 200, 0);
            proj.updateMatrix();
    
            greyMesh.setMatrixAt(i+count, proj.matrix);
        });
    
        greyMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(greyMesh);
    }

    onMouseMove(event) {
        if (this.isFilteringActive) {
            this.renderer.domElement.style.cursor = 'default';
            return;
        }

        // Update mouse position
        const rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Use raycaster to detect intersected objects
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children, true); // Set recursive to true to detect child meshes

        const tooltip = document.getElementById('tooltip-hover');

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            const meshData = this.meshDataArray.find(m => m.group.children.includes(intersectedObject));

            if (meshData) {
                if (!this.isCommandOrCtrlPressed) {
                    // Show only the hovered mesh, hide others and scale the hovered one
                    this.meshDataArray.forEach(({ group }) => {
                        if (group === meshData.group) {
                            group.visible = true;
                        } else {
                            group.visible = false;
                        }
                    });
                }

                // Show tooltip with mesh name
                tooltip.style.display = 'block';
                tooltip.style.left = event.clientX + 5 + 'px';
                tooltip.style.top = event.clientY + 'px';
                tooltip.textContent = meshData.name;

                // Change cursor to pointer
                this.renderer.domElement.style.cursor = 'pointer';
            }
        } else {
            this.resetMeshVisibility();
            tooltip.style.display = 'none';
        }
    }
    
    
    
    // onMouseClick(event) {
    //     // Update mouse position
    //     const rect = this.renderer.domElement.getBoundingClientRect();
    //     mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    //     mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    //     // Use raycaster to detect intersected objects
    //     raycaster.setFromCamera(mouse, this.camera);
    //     const intersects = raycaster.intersectObjects(this.scene.children, true); // Set recursive to true to detect child meshes
    
    //     if (intersects.length > 0) {
    //         const intersectedObject = intersects[0].object;
    
    //         // Get the index of the clicked instance within the InstancedMesh
    //         const instanceId = intersects[0].instanceId;
    
    //         if (instanceId !== undefined) {  // Ensure this is an InstancedMesh
    //             const greyColor = new THREE.Color(0x808080); // Grey color
    
    //             // Set the specific instance's color to grey
    //             intersectedObject.setColorAt(instanceId, greyColor);
    //             intersectedObject.instanceColor.needsUpdate = true; // Ensure the color is updated
    //         }
    //     }
    // }
    
    
    
    

    animate = () => {
        requestAnimationFrame(this.animate);
        this.controls.update(); // Only needed if controls.enableDamping is true
        this.renderer.render(this.scene, this.camera);
    }
}