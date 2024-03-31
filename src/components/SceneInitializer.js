// /src/components/SceneInitializer.js
import * as THREE from 'three';
import { MatrixState } from '../states/MatrixState.js';
import { ApiState } from '../states/ApiState.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { isEqual } from 'lodash';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UIState, updateLoadingState } from '../states/UIState.js';
import { loading } from '../helpers/Loading.js';
import { SelectedState, updateSelectedCelltype, updateSelectedGene } from '../states/SelectedState.js';
import { showCellFilters } from '../helpers/Filtering/Celltype.js';


export class SceneInitializer {
    constructor(container) {
        this.container = container;
        this.instancedMesh;
        this.instancedMeshUmap;
        this.initScene();
        this.subscribeToStateChanges();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 200;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // controls.target.copy(sharedTarget); // Initially set target for cameraOne
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.update();
        this.updateInstancedMesh();

        this.animate();
    }

    subscribeToStateChanges() {
        MatrixState.pipe(
            map(state => state.items),
            // If you want to deep compare array objects, you might replace the next line with a custom comparison function
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log('Items have updated:', items);
            console.log(MatrixState.value.items);
            // Here you can handle the update, e.g., update UI components to reflect the new items array
        });

        ApiState.pipe(
            map(state => state.prefix),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log("Prefix changed:", items);
            console.log(ApiState.value.prefix);
        });

        UIState.pipe(
            map(state => state.isLoading),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        ).subscribe(items => {
            console.log("Loading changed:", items);
            console.log(UIState.value.isLoading);

            loading(UIState.value.isLoading);
        });

        // listens for changing celltype
        SelectedState.pipe(
            map(state => state.selectedCelltypes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join())
        ).subscribe(items => {
            console.log("Selected celltypes changed:", items);
            console.log(SelectedState.value.selectedCelltypes);

            updateLoadingState(true);

            if (SelectedState.value.selectedCelltypes) {
                this.updateInstancedMesh(SelectedState.value.selectedCelltypes);
            } else {
                this.updateInstancedMesh([]);
            }

            showCellFilters();

            updateLoadingState(false);
        });

        SelectedState.pipe(
            map(state => state.selectedGenes),
            distinctUntilChanged((prev, curr) => prev.join() === curr.join())
        ).subscribe(items => {
            console.log("Selected genes changed:", items);
            console.log(SelectedState.value.selectedGenes);

            updateLoadingState(true);

            if (SelectedState.value.selectedGenes) {
                this.updateInstancedMesh(SelectedState.value.selectedGenes);
            } else {
                this.updateInstancedMesh([]);
            }

            updateLoadingState(false);
        });
    }

    async updateInstancedMesh(filterType = []) {

        // print("reached!")

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

        console.log(pallete);
        console.log(jsonData);

        const sphereGeometry = new THREE.CircleGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial();
        const count = jsonData.length;
        console.log(count)

        this.instancedMesh = new THREE.InstancedMesh(sphereGeometry, material, count);
        this.instancedMeshUmap = new THREE.InstancedMesh(sphereGeometry, material, count);

        const proj = new THREE.Object3D();
        const umap = new THREE.Object3D();

        let color;

        // when plotting gene
        let cts;
        let ctsClipped;
        let nmax;

        let filter = '';

        // if (typeof filterType === 'string') { // gene filter inputted
        //     filter = filterType;
        // } else if (selectedGene.length !== 0) { // pre inputed gene filter
        //     filter = selectedGene;
        // }

        // won't hit if is a list
        // if (filter.length !== 0) {
        //     // cts = jsonData.map(item => item[filterType]);
        //     try {
        //         let data = await fetchDataFromAPI(filter, prefix);
        //         cts = JSON.parse(data["data"])
        //         // You can use cts here
        //         nmax = calculate99thPercentile(cts);
        //         console.log(nmax);
        //         console.log(cts);
        //         ctsClipped = normalizeArray(cts, nmax);
        //         console.log(ctsClipped);
        //     } catch (error) {
        //         // Handle errors if the promise is rejected
        //         console.error('Error fetching data:', error);
        //     }
        // }

        let mod = 100;
        let umapmod = 0.5;

        let checkedCellTypes = [];
        let selectedGene = [];


        for (let i = 0; i < count; i++) {
            // if have cell type and gene filter
            if (checkedCellTypes.length !== 0 && selectedGene.length !== 0) {
                // // current i is of celltype
                // if (checkedCellTypes.includes(jsonData[i]["clusters"])) {
                //     let colorrgb = coolwarm(ctsClipped[i]);
                //     // console.log(colorrgb);
                //     color = new THREE.Color(colorrgb);

                //     let scale = ctsClipped[i] * 5 + 1;

                //     proj.scale.set(scale, scale, scale);
                //     umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);

                // } else { // don't color if not
                //     color = new THREE.Color('#5e5e5e');
                //     proj.scale.set(1, 1, 1);
                //     umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                // }
                console.log("here")
                // } else if (filter.length !== 0) {
                // let colorrgb = coolwarm(ctsClipped[i]);
                // // console.log(colorrgb);
                // color = new THREE.Color(colorrgb);

                // let scale = ctsClipped[i] * 5 + 1;

                // proj.scale.set(scale, scale, scale);
                // umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
                console.log("here")
            } else {
                if (filterType.includes(jsonData[i]["clusters"]) || filterType.length == 0) {
                    // color = new THREE.Color(jsonData[i]["clusters_colors"]);
                    color = new THREE.Color(pallete[jsonData[i]["clusters"]]);
                    proj.scale.set(5, 5, 5);
                    umap.scale.set(5 * umapmod, 5 * umapmod, 5 * umapmod);
                } else {
                    color = new THREE.Color('#5e5e5e');
                    proj.scale.set(1, 1, 1);
                    umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
                }
            }

            //plot projection
            // proj.position.set(jsonData[i]["global_sphere0_norm"], jsonData[i]["global_sphere1_norm"], jsonData[i]["global_sphere2_norm"]);
            proj.position.set(jsonData[i]["global_sphere0_norm"] * mod, jsonData[i]["global_sphere1_norm"] * mod, jsonData[i]["global_sphere2_norm"] * mod);
            proj.updateMatrix();
            this.instancedMesh.setMatrixAt(i, proj.matrix);
            this.instancedMesh.setColorAt(i, color);

            //plot umap

            let offset = 10000;

            if (ApiState.value.prefix == "75pe") {
                umap.position.set(jsonData[i]["X_umap0_norm"] * 80 + offset, jsonData[i]["X_umap1_norm"] * 80, 10);
            } else {
                umap.position.set(jsonData[i]["X_umap0_norm"] * 60 + offset - 25, jsonData[i]["X_umap1_norm"] * 60, 10);
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
        const cameraQuaternion = this.camera.quaternion;
        let jsonData = MatrixState.value.items;

        for (let i = 0; i < jsonData.length * 2; i++) {
            const matrix = new THREE.Matrix4();
            const position = new THREE.Vector3();
            const scale = new THREE.Vector3();

            // Extract position and scale from the current instance matrix
            this.instancedMesh.getMatrixAt(i, matrix);
            matrix.decompose(position, new THREE.Quaternion(), scale);

            // Rebuild the matrix using the camera's quaternion for rotation
            matrix.compose(position, cameraQuaternion, scale);
            this.instancedMesh.setMatrixAt(i, matrix);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true; // Important!
        this.renderer.render(this.scene, this.camera);
    }
}