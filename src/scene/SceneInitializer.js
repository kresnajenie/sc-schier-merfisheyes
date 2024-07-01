// /src/components/SceneInitializer.js
import * as THREE from 'three';
import { MatrixState } from '../states/MatrixState.js';
import { ApiState } from '../states/ApiState.js';
import { SceneState } from '../states/SceneState.js';
import { UIState, updateLoadingState } from '../states/UIState.js';
import { SelectedState } from '../states/SelectedState.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { isEqual } from 'lodash';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ButtonState } from '../states/ButtonState.js';
import { loading } from '../helpers/Loading.js';
import { showCellFilters } from '../helpers/Filtering/Celltype.js';
import { calculateGenePercentile, coolwarm, getGene, getAtac, normalizeArray } from '../helpers/GeneFunctions.js';
import { showGeneFilters, showSelectedGeneFilters } from '../helpers/Filtering/Gene.js';
import { showAtacFilters, showSelectedAtacFilters } from '../helpers/Filtering/Atac.js';
import { changeURL } from '../helpers/URL.js';

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

export class SceneInitializer {
    constructor(container) {
        this.container = container;
        this.instancedMesh;
        this.instancedMeshUmap;
        this.initScene();
        this.subscribeToStateChanges();
    }

    initScene() {
        // this.scene = new THREE.Scene();
        this.scene = SceneState.value.scene;

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = ButtonState.value.cameraPositionZ;
        this.camera.position.y = ButtonState.value.cameraPositionY;
        this.camera.position.x = ButtonState.value.cameraPositionX;
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // controls.target.copy(sharedTarget); // Initially set target for cameraOne
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.update();
        this.updateInstancedMesh();

        this.animate();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }

    subscribeToStateChanges() {
        MatrixState.pipe(
            map(state => state.items),
            // If you want to deep compare array objects, you might replace the next line with a custom comparison function
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log('Items have updated:');
            // console.log(MatrixState.value.items);
            // Here you can handle the update, e.g., update UI components to reflect the new items array
        });

        ApiState.pipe(
            map(state => state.prefix),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log("Prefix changed:", items);
            // console.log(ApiState.value.prefix);

            const prefix = document.getElementById("dropdownMenuButton");
            prefix.innerText = ApiState.value.prefix;
        });

        UIState.pipe(
            map(state => state.isLoading),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log("Loading changed:", items);
            // console.log(UIState.value.isLoading);

            loading(UIState.value.isLoading);
        });

        // listens for changing celltype
        SelectedState.pipe(
            map(state => state.selectedCelltypes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join())
        ).subscribe(async items => {
            console.log("Selected celltypes changed:", items);
            // console.log(SelectedState.value.selectedCelltypes);

            updateLoadingState(true);

            await this.updateInstancedMesh();

            updateLoadingState(false);

            showCellFilters();

            if (SelectedState.value.selectedCelltypes.length > 0) {
                const newCelltype = encodeURIComponent(JSON.stringify(SelectedState.value.selectedCelltypes));
                
                // params not in celltype
                if (params.has("celltype")) {
                    params.set("celltype", newCelltype)
                } else {
                    params.append("celltype", newCelltype)
                }
            
            // there's no celltypes selected
            } else {
                params.delete("celltype");
            }

            changeURL(params);
        });

        SelectedState.pipe(
            map(state => state.selectedGenes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join())
        ).subscribe(async items => {
            console.log("Selected genes changed:", items);
            // console.log(SelectedState.value.selectedGenes);

            if (SelectedState.value.mode === 2) {
                showSelectedGeneFilters();
            }

            updateLoadingState(true);
            console.log("ANJINGNGINGIGNGING")

            await this.updateInstancedMesh();


            showGeneFilters();

            if (SelectedState.value.selectedGenes.length > 0) {
                // hype boy
                const newGenes = encodeURIComponent(JSON.stringify(SelectedState.value.selectedGenes));
                params.append("gene", newGenes)

                // params not in celltype
                if (params.has("gene")) {
                    params.set("gene", newGenes)
                } else {
                    params.append("gene", newGenes)
                }
            
            // there's no genes selected
            } else {
                params.delete("gene");
            }

            changeURL(params);
            updateLoadingState(false);

        });

        SelectedState.pipe(
            map(state => state.selectedAtacs),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join())
        ).subscribe(async items => {
            console.log("Selected atacs changed:", items);
            // console.log(SelectedState.value.selectedGenes);

            if (SelectedState.value.mode === 2) {
                showSelectedAtacFilters();
            }

            updateLoadingState(true);

            await this.updateInstancedMesh();

            updateLoadingState(false);

            showAtacFilters();

            if (SelectedState.value.selectedAtacs.length > 0) {
                // hype boy
                const newAtacs = encodeURIComponent(JSON.stringify(SelectedState.value.selectedAtacs));
                params.append("atac", newAtacs)

                // params not in celltype
                if (params.has("atac")) {
                    params.set("atac", newAtacs)
                } else {
                    params.append("atac", newAtacs)
                }
            
            // there's no genes selected
            } else {
                params.delete("atac");
            }

            changeURL(params);
        });

        SelectedState.pipe(
            map(state => state.mode),
            distinctUntilChanged()
        ).subscribe(items => {
            console.log("Selected genes changed:", items);

            if (params.has("mode")) {
                params.set("mode", items)
            } else {
                params.append("mode", items);
            }

            changeURL(params);
        });

        // listen for changing dotsize

        ButtonState.pipe(
            map(state => state.dotSize),
            distinctUntilChanged()
        ).subscribe(async items => {
            console.log("Dot Size Changed:", items);
            // console.log(ButtonState.value.dotSize);

            updateLoadingState(true);

            await this.updateInstancedMesh();

            updateLoadingState(false);
        });

        ButtonState.pipe(
            map(state => state.genePercentile),
            distinctUntilChanged()
        ).subscribe(async items => {
            console.log("Gene Percentile", items);
            // console.log(ButtonState.value.genePercentile);

            updateLoadingState(true);

            await this.updateInstancedMesh();

            updateLoadingState(false);
        })
    }

    async updateInstancedMesh() {

        // Clear existing mesh
        if (this.instancedMesh) {
            this.instancedMesh.geometry.dispose();
            this.instancedMesh.material.dispose();
            this.scene.remove(this.instancedMesh);
        }

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
        console.log("Count", count)

        this.instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count);
        this.instancedMeshUmap = new THREE.InstancedMesh(circleGeometry, material, count);

        const proj = new THREE.Object3D();
        const umap = new THREE.Object3D();

        let color;

        // when plotting gene
        let ctsClipped1;
        let ctsClipped2;

        let mod = 200;
        let umapmod = 0.5;

        let celltypes = SelectedState.value.selectedCelltypes;
        let genes = SelectedState.value.selectedGenes;
        let atacs = SelectedState.value.selectedAtacs;

        let dotSize = ButtonState.value.dotSize;
        let smallDotSize = Math.floor(dotSize / 5);

        // this.camera.position.z = ButtonState.value.cameraPositionZ;
        let genePercentile = ButtonState.value.genePercentile;
        let atacPercentile = ButtonState.value.genePercentile;

        if (genes.length > 0) {
            try {
                let count1 = await getGene(genes[0]);
                if (genes.length == 2) {
                    let count2 = await getGene(genes[1]);
                    let nmax2 = calculateGenePercentile(count2, genePercentile);
                    ctsClipped2 = normalizeArray(count2, nmax2);
                }
                // You can use cts here
                let nmax1 = calculateGenePercentile(count1, genePercentile);
                // console.log(cts);
                ctsClipped1 = normalizeArray(count1, nmax1);
            } catch (error) {
                // Handle errors if the promise is rejected
                console.error('Error fetching data:', error);
            }
        }

        if (atacs.length > 0) {
            try {
                let count1 = await getAtac(atacs[0]);
                if (atacs.length == 2) {
                    let count2 = await getAtac(atacs[1]);
                    let nmax2 = calculateGenePercentile(count2, atacPercentile);
                    ctsClipped2 = normalizeArray(count2, nmax2);
                }
                // You can use cts here
                let nmax1 = calculateGenePercentile(count1, atacPercentile);
                // console.log(cts);
                ctsClipped1 = normalizeArray(count1, nmax1);
            } catch (error) {
                // Handle errors if the promise is rejected
                console.error('Error fetching data:', error);
            }
        }


        for (let i = 0; i < count; i++) {
            // if have gene filter
            if (genes.length > 0) {
                // no celltypes or matches celltype
                if (celltypes.length === 0 || celltypes.includes(jsonData[i]["clusters"])) {

                    let colorrgb;
                    let scale;

                    // if there's a second gene
                    if (ctsClipped2) {
                        colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
                        scale = (ctsClipped1[i] + ctsClipped2[i]) / 2 * dotSize + dotSize / 5;
                    } else {
                        colorrgb = coolwarm(ctsClipped1[i]);
                        scale = ctsClipped1[i] * dotSize + dotSize / 5;
                    }

                    // console.log(colorrgb);
                    color = new THREE.Color(colorrgb);

                    proj.scale.set(scale, scale, scale);
                    umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
                } else { // don't color if not
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(1, 1, 1);
                    umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                }
                // has celltype filters
            } else if (atacs.length > 0) {
                // no celltypes or matches celltype
                if (celltypes.length === 0 || celltypes.includes(jsonData[i]["clusters"])) {

                    let colorrgb;
                    let scale;

                    // if there's a second gene
                    if (ctsClipped2) {
                        colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
                        scale = (ctsClipped1[i] + ctsClipped2[i]) / 2 * dotSize + dotSize / 5;
                    } else {
                        colorrgb = coolwarm(ctsClipped1[i]);
                        scale = ctsClipped1[i] * dotSize + dotSize / 5;
                    }

                    // console.log(colorrgb);
                    color = new THREE.Color(colorrgb);

                    proj.scale.set(scale, scale, scale);
                    umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
                } else { // don't color if not
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(1, 1, 1);
                    umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                }
                // has celltype filters
            }else {
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
            proj.position.set(jsonData[i]["X_spatial0_norm"] * mod, jsonData[i]["X_spatial1_norm"] * -1*mod, jsonData[i]["X_spatial2_norm"] * mod);
            proj.updateMatrix();
            this.instancedMesh.setMatrixAt(i, proj.matrix);
            this.instancedMesh.setColorAt(i, color);

            //plot umap

            let offset = 10000;

            if (ApiState.value.prefix == "75pe") {
                umap.position.set(jsonData[i]["X_umap0_norm"] * 80 + offset, jsonData[i]["X_umap1_norm"] * 80, 10);
            } else {
                umap.position.set(jsonData[i]["X_umap0_norm"] * 200 + offset - 25, jsonData[i]["X_umap1_norm"] * 200, 10);
            }
            umap.updateMatrix();
            this.instancedMeshUmap.setMatrixAt(i, umap.matrix);
            this.instancedMeshUmap.setColorAt(i, color);
        }

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

        this.instancedMesh.instanceMatrix.needsUpdate = true; // Important!
        this.renderer.render(this.scene, this.camera);
    }
}
