// ThreeJS
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

// Global states
import { MatrixState } from "../states/MatrixState.js";
import { ApiState } from "../states/ApiState.js";
import { SceneState } from "../states/SceneState.js";
import { UIState, updateLoadingState } from "../states/UIState.js";
import { SelectedState } from "../states/SelectedState.js";
import {
  ButtonState,
  updateGeneExpressionRange,
} from "../states/ButtonState.js";
// Additional libraries
import { isEqual } from "lodash";
import { map, distinctUntilChanged, tap, skip } from "rxjs/operators";
// UI imports
import { loading } from "../helpers/Loading.js";
import {
  showCellFilters,
  updateCelltypeCheckboxes,
} from "../helpers/Filtering/Celltype.js";
import {
  calculateGenePercentile,
  coolwarm,
  getGene,
  getAtac,
  normalizeArray,
} from "../helpers/GeneFunctions.js";
import {
  showGeneFilters,
  showSelectedGeneFilters,
  clearGenes,
} from "../helpers/Filtering/Gene.js";
import {
  showAtacFilters,
  showSelectedAtacFilters,
  clearAtacs,
} from "../helpers/Filtering/Atac.js";
import { violinImageSearch } from "../helpers/Filtering/Violin.js";
import { changeURL } from "../helpers/URL.js";
import {
  updateBadge,
  updateCelltypeBadge,
  updateCelltypeBadgeApperance,
} from "../ui/Showing/Showing.js";
import {
  hideColorbar,
  hideColorbarGreen,
  hideColorbarMagenta,
  setLabels,
  setLabelsGreen,
  setLabelsMagenta,
  showColorbar,
  showColorbarGreen,
  showColorbarMagenta,
} from "../ui/ColorBar/ColorBar.js";
import { getInterval } from "../helpers/ATACPlot/Peaks.js";

const url = new URL(window.location);
const params = new URLSearchParams(url.search);

// const mouse = new THREE.Vector2();
let initialStart = 0;

export class SceneInitializer {
  constructor(container) {
    this.container = container;
    this.instancedMesh;
    this.instancedMeshUmap;
    this.jsonData = MatrixState.value.items;
    this.pallete = ApiState.value.pallete;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredPoint = null;
    this.tooltip = this.createTooltip();
    this.lastCameraPosition = new THREE.Vector3();

    this.initScene();

    this.subscribeToStateChanges();
    this.setupEventListeners();
  }

  /**
   * Initializes the 3D scene, including setting up the camera, renderer, and controls.
   * This function also handles the initial positioning of the camera based on the API prefix.
   */
  initScene() {
    this.scene = SceneState.value.scene;

    // Set the background color to a solid color (e.g., black)
    // this.scene.background = new THREE.Color(0x000000); // Hexadecimal color value

    // Initialize camera and renderer conditionally
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      preserveDrawingBuffer: true,
    });

    // Set renderer properties for accurate color reproduction
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Use linear color space to avoid sRGB conversion
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    // this.renderer.physicallyCorrectLights = true;

    this.container.appendChild(this.renderer.domElement);
    if (ApiState.value.prefix == "6s") {
      this.camera.position.y = ButtonState.value.cameraPositionY;
      this.camera.position.x = ButtonState.value.cameraPositionX;
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

    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );

    // Configure TrackballControls
    this.controls.rotateSpeed = 1.0; // Speed of rotation
    this.controls.zoomSpeed = 1.0; // Speed of zooming
    this.controls.panSpeed = 1.0; // Speed of panning
    this.controls.noZoom = false; // Allow zooming
    this.controls.noPan = false; // Allow panning
    this.controls.staticMoving = false; // Smooth movement
    this.controls.dynamicDampingFactor = 0.2; // Damping factor for smoothness

    // this.updateInstancedMesh("initScene");
    showCellFilters();
    updateCelltypeBadge();
    updateCelltypeCheckboxes();
    this.createPointsGeometry();
    this.updateCelltype();
    if (ApiState.value.prefix == "6s") {
      this.addText("Anterior", -10, 190, 0);
      this.addText("Posterior", -10, -190, 0);
    }
    this.animate();

    // Fit scene to window size when window size changes
    window.addEventListener(
      "resize",
      () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );
  }

  addText(
    text,
    x,
    y,
    z,
    scale = 50,
    color = "white",
    font = "Bold 450px Arial",
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0
  ) {
    // Create a high-resolution canvas for the text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Increase canvas size for higher resolution
    canvas.width = 2048; // 4x higher resolution
    canvas.height = 2048;

    // Enable anti-aliasing for smoother text
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // Set text properties
    context.font = font;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Add a subtle outline to improve readability
    context.strokeStyle = "rgba(0, 0, 0, 0.5)";
    context.lineWidth = 8;
    context.strokeText(text, canvas.width / 2, canvas.height / 2);

    // Draw text on canvas
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas with better filtering
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    // Determine if we should use a sprite (always faces camera) or a plane (can be rotated)
    if (rotationX === 0 && rotationY === 0 && rotationZ === 0) {
      // No rotation - use a sprite for better visibility (always faces camera)
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false, // Make sure text is always visible
      });

      // Create sprite
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, z);
      sprite.scale.set(scale, scale, 1); // Adjust scale to make text visible

      // Add sprite to scene
      this.scene.add(sprite);

      // Return the sprite
      return sprite;
    } else {
      // With rotation - use a plane geometry
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide, // Visible from both sides
        depthTest: false, // Make sure text is always visible
      });

      // Create a plane geometry for the text
      const plane = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(plane, material);

      // Create a container to handle rotations properly
      const container = new THREE.Object3D();
      container.add(mesh);

      // Position and scale
      container.position.set(x, y, z);
      mesh.scale.set(scale, scale, 1);

      // Apply rotations
      container.rotation.set(rotationX, rotationY, rotationZ);

      // Add to scene
      this.scene.add(container);

      // Return the container
      return container;
    }
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
      map((state) => state.prefix),
      distinctUntilChanged((prev, curr) => isEqual(prev, curr))
    ).subscribe((items) => {
      const prefix = document.getElementById("dropdownMenuButton");
      prefix.innerText = ApiState.value.prefix;
    });

    // Listen to loading state
    UIState.pipe(
      map((state) => state.isLoading),
      distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
      skip(1)
    ).subscribe((items) => {
      loading(UIState.value.isLoading);
    });

    // Listen to selected celltypes
    SelectedState.pipe(
      map((state) => state.selectedCelltypes),
      distinctUntilChanged((prev, curr) => prev.join() === curr.join())
    ).subscribe(async (items) => {
      updateLoadingState(true);
      //   await this.updateInstancedMesh("selectedCelltype");
      this.updateCelltype();
      updateLoadingState(false);

      // Update URL params
      if (SelectedState.value.selectedCelltypes.length > 0) {
        const newCelltype = encodeURIComponent(
          JSON.stringify(SelectedState.value.selectedCelltypes)
        );
        params.set("celltype", newCelltype);
      } else {
        params.delete("celltype");
      }
      changeURL(params);
    });

    // Listen to selected genes
    SelectedState.pipe(
      map((state) => state.selectedGenes),
      distinctUntilChanged((prev, curr) => prev.join() === curr.join())
    ).subscribe(async (items) => {
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
        let firstElement = selectedGene.split("_")[0];
        if (
          ApiState.value.prefix == "6s" &&
          SelectedState.value.geneGenomeHover == false
        ) {
          getInterval(firstElement);
        }
        const newGenes = encodeURIComponent(
          JSON.stringify(SelectedState.value.selectedGenes)
        );
        params.set("gene", newGenes);
      } else {
        params.delete("gene");
      }
      //   await this.updateInstancedMesh("selectedGene");
      this.updateGene();
      changeURL(params);
      updateLoadingState(false);

      updateCelltypeBadgeApperance();
    });

    // Change selected ATAC
    SelectedState.pipe(
      map((state) => state.selectedAtacs),
      distinctUntilChanged((prev, curr) => prev.join() === curr.join())
    ).subscribe(async (items) => {
      clearGenes();
      if (SelectedState.value.mode === 2) {
        showSelectedAtacFilters();
      }
      updateLoadingState(true);
      showAtacFilters();
      if (SelectedState.value.selectedAtacs.length > 0) {
        const newAtacs = encodeURIComponent(
          JSON.stringify(SelectedState.value.selectedAtacs)
        );
        params.set("atac", newAtacs);
      } else {
        params.delete("atac");
      }
      //   await this.updateInstancedMesh("selectedAtac");
      this.updateAtac();
      changeURL(params);
      updateLoadingState(false);

      updateCelltypeBadgeApperance();
    });

    // Listen to dot size
    ButtonState.pipe(
      map((state) => state.dotSize),
      distinctUntilChanged()
    ).subscribe((dotSize) => {
      console.log("Dot size changed:", dotSize);
      // Update the shader uniform if the material exists
      if (
        this.pointsMeshSpatial &&
        this.pointsMeshSpatial.material.uniforms.dotSize
      ) {
        this.pointsMeshSpatial.material.uniforms.dotSize.value = dotSize;
        this.pointsMeshUMAP.material.uniforms.dotSize.value = dotSize;
      }
    });

    // Listent to gene percentile
    ButtonState.pipe(
      map((state) => state.genePercentile),
      distinctUntilChanged(),
      skip(1)
    ).subscribe(async (items) => {
      updateLoadingState(true);
      //   await this.updateInstancedMesh("genePercentile");
      this.updateAtac();
      updateLoadingState(false);
    });

    // Listen to gene mode
    SelectedState.pipe(
      map((state) => state.mode),
      distinctUntilChanged(),
      skip(1)
    ).subscribe((items) => {
      // console.log("Selected genes changed 2:", items);
      params.set("mode", items);
      changeURL(params);
    });
  }

  checkIntersections() {
    // Get current camera position to check if we've moved
    const currentCameraPosition = this.camera.position.clone();
    // const cameraHasMoved = !currentCameraPosition.equals(this.lastCameraPosition);
    this.lastCameraPosition.copy(currentCameraPosition);

    // Calculate camera distance to determine raycaster parameters
    const cameraDistance = this.camera.position.z;

    // Set more user-friendly thresholds for raycasting
    // Higher values make it easier to select points but less precise
    // Lower values require more precision but are more accurate
    const minThreshold = 0.2; // When zoomed in very close
    const maxThreshold = 2.0; // When zoomed out far

    // Calculate adaptive threshold based on camera distance
    // Use a non-linear curve to provide better usability across zoom levels
    let threshold;
    if (cameraDistance < 50) {
      // Close range - easier selection but still somewhat precise
      threshold = minThreshold;
    } else if (cameraDistance > 500) {
      // Far away - much larger threshold for easier selection
      threshold = maxThreshold;
    } else {
      // Middle range - use a quadratic curve for smoother transition
      // This gives more precision when closer and more leniency when farther
      const t = (cameraDistance - 50) / (500 - 50); // Normalized distance (0-1)
      threshold = minThreshold + t * t * (maxThreshold - minThreshold);
    }

    // Always update the threshold to ensure consistent behavior
    this.raycaster.params.Points.threshold = threshold;

    // Update the raycaster with the current mouse position and camera
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with the spatial points mesh
    const intersects = this.raycaster.intersectObject(this.pointsMeshSpatial);

    // If we found an intersection
    if (intersects.length > 0) {
      // Sort intersections by distance if there are multiple
      if (intersects.length > 1) {
        intersects.sort((a, b) => a.distance - b.distance);
      }

      // Get the index of the closest point that was intersected
      const index = intersects[0].index;

      // If this is a different point than the one we were previously hovering over
      if (this.hoveredPoint !== index) {
        this.hoveredPoint = index;

        // Get the cluster information for this point
        const point = this.jsonData[index];
        const clusterValue = point["clusters"];
        const position = intersects[0].point;

        // Show the tooltip with cluster information
        if (clusterValue !== "") {
          this.showTooltip(position, clusterValue);
        }
      }
    } else {
      // If we're not hovering over any point, hide the tooltip
      if (this.hoveredPoint !== null) {
        this.hoveredPoint = null;
        this.hideTooltip();
      }
    }
  }

  createTooltip() {
    // Create a tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "point-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontFamily = "Arial, sans-serif";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "1000";
    tooltip.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    tooltip.style.minWidth = "80px";

    // Add the tooltip to the document body
    document.body.appendChild(tooltip);

    return tooltip;
  }

  showTooltip(position, clusterValue) {
    // Convert 3D position to screen coordinates
    const vector = position.clone();
    vector.project(this.camera);

    const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
    const y = (-vector.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;

    // Get the color for this cluster from the palette
    const clusterColor = this.pallete[clusterValue] || "#5e5e5e";

    // Set the tooltip content with a colored circle and the cluster name
    this.tooltip.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div style="
                width: 12px; 
                height: 12px; 
                border-radius: 50%; 
                background-color: ${clusterColor}; 
                margin-right: 6px;
            "></div>
            <span>${clusterValue}</span>
        </div>
    `;

    this.tooltip.style.left = `${x + 10}px`;
    this.tooltip.style.top = `${y + 10}px`;
    this.tooltip.style.display = "block";
  }

  hideTooltip() {
    this.tooltip.style.display = "none";
  }

  async createPointsGeometry() {
    const count = this.jsonData.length;
    let pallete = ApiState.value.pallete;

    // Create buffer geometry
    const geometrySpatial = new THREE.BufferGeometry();
    const geometryUMAP = new THREE.BufferGeometry();

    // Create position buffer
    const positionsSpatial = new Float32Array(count * 3);
    const positionsUMAP = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const alphas = new Float32Array(count);
    const alphasUMAP = new Float32Array(count);

    const scalingFactor = 200;
    // Fill position and color buffers
    this.jsonData.forEach((point, i) => {
      positionsSpatial[i * 3] = point["X_spatial0_norm"] * scalingFactor;
      positionsSpatial[i * 3 + 1] =
        point["X_spatial1_norm"] *
        (ApiState.value.prefix == "6s" ? -scalingFactor : scalingFactor);
      positionsSpatial[i * 3 + 2] = point["X_spatial2_norm"] * scalingFactor;

      positionsUMAP[i * 3] =
        point["X_umap0_norm"] * 200 + ButtonState.value.umapOffset;
      positionsUMAP[i * 3 + 1] = point["X_umap1_norm"] * 200;
      positionsUMAP[i * 3 + 2] = 0;

      // Default color (will be updated later)
      const hexColor = pallete[point["clusters"]] || "#5e5e5e";
      const color = new THREE.Color(hexColor);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Default scale (will be updated later)
      scales[i] = 1.0;

      // Default alpha (fully opaque)
      alphas[i] = 1;
      alphasUMAP[i] = 0.8;
    });

    console.log(positionsSpatial);

    // Set attributes
    geometrySpatial.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsSpatial, 3)
    );
    geometrySpatial.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometrySpatial.setAttribute("size", new THREE.BufferAttribute(scales, 1));
    geometrySpatial.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    geometryUMAP.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsUMAP, 3)
    );
    geometryUMAP.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometryUMAP.setAttribute("size", new THREE.BufferAttribute(scales, 1));
    geometryUMAP.setAttribute(
      "alpha",
      new THREE.BufferAttribute(alphasUMAP, 1)
    );

    // Get current dot size from ButtonState for use in the shader
    const dotSizeUniform = { value: ButtonState.value.dotSize };

    // Define custom shaders for better control over point rendering
    const vertexShader = `
    attribute float size;
    attribute vec3 color;
    attribute float alpha;
    uniform float dotSize;
    varying vec3 vColor;
    varying float vAlpha;
    varying float vDistance;

    void main() {
        vColor = color;
        vAlpha = alpha;
        
        // Early exit if size or alpha is zero or negative - point will not be rendered
        if (size <= 0.0 || alpha <= 0.0) {
            // Move the point far off-screen (effectively hiding it)
            gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // Position outside clip space
            gl_PointSize = 0.0;
            return;
        }
        
        // Calculate the model view position
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Calculate distance from camera
        float distance = -mvPosition.z;
        vDistance = distance;
        
        // Get base size from the size attribute, scaled by the dotSize uniform
        float baseSize = size * dotSize * 0.4; // Scale factor to make it reasonable
        
        // Dynamic sizing based on distance with smoother transitions
        float minSize = max(0.5, dotSize * 0.2); // Minimum size scales with dotSize
        float maxSize = min(50.0, dotSize * 6.0); // Maximum size scales with dotSize
        float zoomFactor = 150.0; // LOWER value makes points shrink faster when zooming in
        
        // Use a smooth curve for size transition based on distance
        // This creates a more natural zoom feeling
        float distanceRatio = zoomFactor / distance;
        
        // Smooth adaptive sizing with cubic easing
        float t = clamp((distance - 100.0) / 200.0, 0.0, 1.0); // Shorter distance range for faster transition
        float easedT = 1.0 - (1.0 - t) * (1.0 - t) * (1.0 - t); // Cubic ease-out
        
        // Blend between close-up and far-away behaviors
        float closeUpFactor = 1.0;  // Size multiplier when close to camera
        float farAwayFactor = 2.0;   // Size multiplier when far from camera
        float scaleFactor = mix(closeUpFactor, farAwayFactor, easedT);
        
        // Calculate final adaptive size
        float adaptiveSize = baseSize * distanceRatio * scaleFactor;
        
        // Clamp size between min and max
        gl_PointSize = clamp(adaptiveSize, minSize, maxSize);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

    // Fragment shader that renders circular points with exact colors and a subtle border
    const fragmentShader = `
        precision highp float;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDistance;

        void main() {
            // Skip rendering if alpha is 0
            if (vAlpha <= 0.0) {
                discard;
                return;
            }
            
            // Calculate distance from center of point
            float dist = length(gl_PointCoord - vec2(0.5, 0.5));
            
            // Discard fragments outside the circle
            if (dist > 0.5) {
                discard;
            }
            gl_FragColor = vec4(vColor, vAlpha);
            
            // Create a subtle border/drop shadow effect
            float borderWidth = 0.05; // Width of the border (0.0-0.5)
            float borderSoftness = 0.02; // Softness of the border edge
            
            if (dist > (0.5 - borderWidth)) {
                // Border area - create a subtle dark edge
                float borderFactor = smoothstep(0.5 - borderWidth - borderSoftness, 0.5 - borderSoftness, dist);
                vec3 borderColor = vec3(0.0, 0.0, 0.0); // Black border
                
                // Blend between the point color and border color
                vec3 finalColor = mix(vColor, borderColor, borderFactor * 0.5); // 0.5 controls border intensity
                gl_FragColor = vec4(finalColor, vAlpha);
            } else {
                // Interior of the point - use exact colors with no modifications
                gl_FragColor = vec4(vColor, vAlpha);
            }
        }
    `;

    // Create custom shader material with uniforms for dynamic updates
    const material = new THREE.ShaderMaterial({
      uniforms: {
        dotSize: dotSizeUniform,
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      colorSpace: THREE.LinearSRGBColorSpace,
    });

    // Create points mesh
    this.pointsMeshSpatial = new THREE.Points(geometrySpatial, material);
    this.pointsMeshUMAP = new THREE.Points(geometryUMAP, material);

    // Set names for the meshes so they can be found by the overlay
    this.pointsMeshSpatial.name = "pointsMeshSpatial";
    this.pointsMeshUMAP.name = "pointsMeshUMAP";

    this.scene.add(this.pointsMeshSpatial);
    this.scene.add(this.pointsMeshUMAP);
  }

  async updateCelltype() {
    const celltypes = SelectedState.value.selectedCelltypes;
    const grey = "#8f8f8f";

    if (celltypes.length > 0) {
      const hexColors = this.jsonData.map((point) => {
        const clusterValue = point["clusters"];
        // Use the palette color for this cluster, or a default gray if not found
        return celltypes.includes(clusterValue)
          ? this.pallete[clusterValue]
          : grey;
      });

      const sizes = this.jsonData.map((point) => {
        if (ApiState.value.prefix == "6s") {
          return celltypes.includes(point["clusters"]) ? 2.0 : 0.25;
        } else {
          return celltypes.includes(point["clusters"]) ? 3 : 2;
        }
      });

      console.log("Celltypes selected without genes");
      this.updateColors(hexColors);
      this.updateScales(sizes);

      // Update badges and colorbars
      updateBadge("celltype", celltypes);
      hideColorbar();
      hideColorbarGreen();
      hideColorbarMagenta();
    } else {
      const hexColors = this.jsonData.map((point) => {
        const clusterValue = point["clusters"];
        // Use the palette color for this cluster, or a default gray if not found
        return this.pallete[clusterValue] || grey;
      });
      console.log("No celltypes selected without genes");
      const sizes = this.jsonData.map((point) => {
        if (ApiState.value.prefix == "6s") {
          return 1.5;
        } else {
          return 3;
        }
      });

      this.updateColors(hexColors);
      this.updateScales(sizes);

      // Update badges and colorbars
      updateBadge("celltype");
      hideColorbar();
      hideColorbarGreen();
      hideColorbarMagenta();
    }

    // Update celltype-related UI elements
    updateCelltypeBadge();
    updateCelltypeCheckboxes();
    updateCelltypeBadgeApperance();
  }

  async updateGene(isGeneChanged = false) {
    const genes = SelectedState.value.selectedGenes;
    if (genes.length == 0) {
      this.updateCelltype([]);
      return;
    }
    // when plotting gene
    let ctsClipped1;
    let ctsClipped2;

    // Get gene percentile value from state
    let genePercentile = ButtonState.value.genePercentile; // Default 99th percentile

    let nmax1 = 1;
    let minValue = 0;
    let absoluteMaxValue = 0;

    if (genes.length > 0) {
      try {
        let count1 = await getGene(genes[0]);

        // Calculate the 80th percentile value
        minValue = calculateGenePercentile(count1, 0.8);

        // Calculate the 99th percentile value (for initial visualization)
        nmax1 = calculateGenePercentile(count1, genePercentile);

        // Calculate the 100th percentile (absolute maximum)
        // Use a safer approach to find the maximum value to avoid stack overflow
        absoluteMaxValue = count1.reduce(
          (max, val) => (val > max ? val : max),
          0
        );

        // Check if we have a user-set value to use instead of the default 99th percentile
        if (ButtonState.value.currentGeneValue > 0 && isGeneChanged) {
          nmax1 = ButtonState.value.currentGeneValue;
        }

        console.log("Gene Percentile", genePercentile);
        console.log("nmax1", nmax1);

        // Use the selected value for visualization
        ctsClipped1 = normalizeArray(count1, nmax1);

        if (genes.length == 2) {
          let count2 = await getGene(genes[1]);
          let nmax2 = calculateGenePercentile(count2, genePercentile);
          ctsClipped2 = normalizeArray(count2, nmax2);

          // Make sure setLabelsMagenta is defined before calling it
          if (typeof setLabelsMagenta === "function") {
            setLabelsMagenta(0, nmax2);
          }
        }

        // Store the actual calculated range values in the state
        updateGeneExpressionRange(minValue, nmax1, absoluteMaxValue);

        // Update badges and colorbars based on the number of genes
        if (genes.length > 0) {
          updateBadge("gene", genes);
          if (genes.length > 1) {
            showColorbarGreen();
            showColorbarMagenta();
            hideColorbar();
          } else {
            showColorbar();
            hideColorbarGreen();
            hideColorbarMagenta();
          }
        } else {
          updateBadge("celltype");
          hideColorbar();
          hideColorbarGreen();
          hideColorbarMagenta();
        }

        // Update celltype-related UI elements
        updateCelltypeBadge();
        updateCelltypeCheckboxes();
        updateCelltypeBadgeApperance();
      } catch (error) {
        // Handle errors if the promise is rejected
        console.error("Error fetching data:", error);
      }
    }

    setLabels(0, nmax1);
    setLabelsGreen(0, nmax1);

    // Get dot size parameters from ButtonState
    const dotSize = ButtonState.value.dotSize;

    const colors = new Float32Array(this.jsonData.length * 3);
    const sizes = [];

    // Calculate scaling factors based on the current dot size
    const MIN_SIZE = dotSize / 10;
    const MAX_SIZE = dotSize / 2;

    // Scale function to map gene expression values to point sizes
    const scale = (value) => {
      return MIN_SIZE + (MAX_SIZE - MIN_SIZE) * value;
    };

    for (let i = 0; i < this.jsonData.length; i++) {
      if (genes.length == 1) {
        const val = coolwarm(ctsClipped1[i]);
        colors[i * 3] = val[0];
        colors[i * 3 + 1] = val[1];
        colors[i * 3 + 2] = val[2];
        sizes.push(scale(ctsClipped1[i]));
      } else {
        const val = coolwarm(ctsClipped1[i], ctsClipped2[i]);
        colors[i * 3] = val[0];
        colors[i * 3 + 1] = val[1];
        colors[i * 3 + 2] = val[2];
        let avg = (ctsClipped1[i] + ctsClipped2[i]) / 2;
        sizes.push(scale(avg));
      }
    }

    this.updateColorsStraight(colors);
    this.updateScales(sizes);
  }

  async updateAtac(isGeneChanged = false) {
    const atacs = SelectedState.value.selectedAtacs;
    if (atacs.length == 0) {
      this.updateGene();
      return;
    }
    // when plotting gene
    let ctsClipped1;
    let ctsClipped2;

    // Get gene percentile value from state
    let genePercentile = ButtonState.value.genePercentile; // Default 99th percentile

    let nmax1 = 1;
    let minValue = 0;
    let absoluteMaxValue = 0;

    if (atacs.length > 0) {
      try {
        let count1 = await getAtac(atacs[0]);

        // Calculate the 80th percentile value
        minValue = calculateGenePercentile(count1, 0.8);

        // Calculate the 99th percentile value (for initial visualization)
        nmax1 = calculateGenePercentile(count1, genePercentile);

        // Calculate the 100th percentile (absolute maximum)
        // Use a safer approach to find the maximum value to avoid stack overflow
        absoluteMaxValue = count1.reduce(
          (max, val) => (val > max ? val : max),
          0
        );

        // Check if we have a user-set value to use instead of the default 99th percentile
        if (ButtonState.value.currentGeneValue > 0 && isGeneChanged) {
          nmax1 = ButtonState.value.currentGeneValue;
        }

        console.log("Atac Percentile", genePercentile);
        console.log("nmax1", nmax1);

        // Use the selected value for visualization
        ctsClipped1 = normalizeArray(count1, nmax1);

        if (atacs.length == 2) {
          let count2 = await getAtac(atacs[1]);
          let nmax2 = calculateGenePercentile(count2, genePercentile);
          ctsClipped2 = normalizeArray(count2, nmax2);

          // Make sure setLabelsMagenta is defined before calling it
          if (typeof setLabelsMagenta === "function") {
            setLabelsMagenta(0, nmax2);
          }
        }

        // Store the actual calculated range values in the state
        updateGeneExpressionRange(minValue, nmax1, absoluteMaxValue);

        // Update badges and colorbars based on the number of genes
        if (atacs.length > 0) {
          updateBadge("atac", atacs);
          if (atacs.length > 1) {
            showColorbarGreen();
            showColorbarMagenta();
            hideColorbar();
          } else {
            showColorbar();
            hideColorbarGreen();
            hideColorbarMagenta();
          }
        } else {
          updateBadge("celltype");
          hideColorbar();
          hideColorbarGreen();
          hideColorbarMagenta();
        }

        // Update celltype-related UI elements
        updateCelltypeBadge();
        updateCelltypeCheckboxes();
        updateCelltypeBadgeApperance();
      } catch (error) {
        // Handle errors if the promise is rejected
        console.error("Error fetching data:", error);
      }
    }

    setLabels(0, nmax1);
    setLabelsGreen(0, nmax1);

    // Get dot size parameters from ButtonState
    const dotSize = ButtonState.value.dotSize;

    const colors = new Float32Array(this.jsonData.length * 3);
    const sizes = [];

    // Calculate scaling factors based on the current dot size
    const MIN_SIZE = dotSize / 20;
    const MAX_SIZE = dotSize / 4;

    // Scale function to map gene expression values to point sizes
    const scale = (value) => {
      return MIN_SIZE + (MAX_SIZE - MIN_SIZE) * value;
    };

    for (let i = 0; i < this.jsonData.length; i++) {
      if (atacs.length == 1) {
        const val = coolwarm(ctsClipped1[i]);
        colors[i * 3] = val[0];
        colors[i * 3 + 1] = val[1];
        colors[i * 3 + 2] = val[2];
        sizes.push(scale(ctsClipped1[i] * 2));
      } else {
        const val = coolwarm(ctsClipped1[i], ctsClipped2[i]);
        colors[i * 3] = val[0];
        colors[i * 3 + 1] = val[1];
        colors[i * 3 + 2] = val[2];
        let avg = (ctsClipped1[i] + ctsClipped2[i]) / 2;
        sizes.push(scale(avg));
      }
    }

    this.updateColorsStraight(colors);
    this.updateScales(sizes);
  }

  updateColorsStraight(colors) {
    const geometrySpatial = this.pointsMeshSpatial.geometry;
    const geometryUMAP = this.pointsMeshUMAP.geometry;
    geometrySpatial.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometryUMAP.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  updateColors(hexColors, rgb = false) {
    if (!this.pointsMeshSpatial || !hexColors || hexColors.length === 0) return;

    const geometrySpatial = this.pointsMeshSpatial.geometry;
    const geometryUMAP = this.pointsMeshUMAP.geometry;
    const colorAttribute = geometrySpatial.getAttribute("color");
    const count = colorAttribute.count;

    if (hexColors.length !== count) {
      console.error(
        `Color list length (${hexColors.length}) does not match point count (${count}).`
      );
      return;
    }

    const colorArray = new Float32Array(count * 3);

    hexColors.forEach((colorValue, i) => {
      // Parse hex directly without any modifications
      const hex = colorValue.startsWith("#")
        ? colorValue.substring(1)
        : colorValue;
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      colorArray[i * 3] = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;
    });

    geometrySpatial.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );
    geometryUMAP.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );
  }
  /**
   * Updates scales for all points.
   * @param {Array<number>} scales - List of scale values for each point.
   */
  updateScales(scales) {
    console.log("Updating scales for all points");
    if (
      !this.pointsMeshSpatial ||
      !this.pointsMeshUMAP ||
      !scales ||
      scales.length === 0
    )
      return;

    const geometrySpatial = this.pointsMeshSpatial.geometry;
    const geometryUMAP = this.pointsMeshUMAP.geometry;
    const count = this.jsonData.length;

    if (scales.length !== count) {
      console.error(
        `Scale list length (${scales.length}) does not match point count (${count}).`
      );
      return;
    }

    // Create a new array for the size attribute
    const sizeArraySpatial = new Float32Array(count);
    const sizeArrayUMAP = new Float32Array(count);

    // Fill the arrays with scale values
    for (let i = 0; i < count; i++) {
      sizeArraySpatial[i] = scales[i] * 1; // Apply scaling factor
      sizeArrayUMAP[i] = scales[i] * 1; // Apply scaling factor
    }

    // Replace the size attribute with the new arrays
    geometrySpatial.setAttribute(
      "size",
      new THREE.BufferAttribute(sizeArraySpatial, 1)
    );
    geometryUMAP.setAttribute(
      "size",
      new THREE.BufferAttribute(sizeArrayUMAP, 1)
    );

    console.log("Scales updated for all points.");
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
    this.instancedMesh = new THREE.InstancedMesh(
      sphereGeometry,
      material,
      count
    );
    this.instancedMeshUmap = new THREE.InstancedMesh(
      circleGeometry,
      material,
      count
    );
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
        console.error("Error fetching data:", error);
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
        console.error("Error fetching data:", error);
      }
    }
    setLabels(0, nmax1);
    setLabelsGreen(0, nmax1);
    // Create a mesh for each key in the JSON object
    for (let i = 0; i < count; i++) {
      if (atacs.length > 0) {
        // no celltypes or matches celltype
        if (
          celltypes.length === 0 ||
          celltypes.includes(jsonData[i]["clusters"])
        ) {
          let colorrgb;
          let scale;
          // if there's a second gene
          if (ctsClipped2) {
            colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
            scale =
              ((ctsClipped1[i] + ctsClipped2[i]) / 2) * dotSize + dotSize / 1.5;
          } else {
            colorrgb = coolwarm(ctsClipped1[i]);
            scale = ctsClipped1[i] * dotSize + dotSize / 1.5;
          }
          color = new THREE.Color(colorrgb);
          proj.scale.set(scale, scale, scale);
          umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
        } else {
          // don't color if not
          color = new THREE.Color("#5e5e5e");
          proj.scale.set(1, 1, 1);
          umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
        }
        // has celltype filters
      } else if (genes.length > 0) {
        // no celltypes or matches celltype
        if (
          celltypes.length === 0 ||
          celltypes.includes(jsonData[i]["clusters"])
        ) {
          let colorrgb;
          let scale;
          // if there's a second gene
          if (ctsClipped2) {
            colorrgb = coolwarm(ctsClipped1[i], ctsClipped2[i]);
            scale =
              ((ctsClipped1[i] + ctsClipped2[i]) / 2) * dotSize + dotSize / 1.5;
          } else {
            colorrgb = coolwarm(ctsClipped1[i]);
            scale = ctsClipped1[i] * dotSize + dotSize / 1.5;
          }
          color = new THREE.Color(colorrgb);
          proj.scale.set(scale, scale, scale);
          umap.scale.set(scale * umapmod, scale * umapmod, scale * umapmod);
        } else {
          // don't color if not
          color = new THREE.Color("#5e5e5e");
          proj.scale.set(1, 1, 1);
          umap.scale.set(1 * umapmod, 1 * umapmod, 1 * umapmod);
        }
        // has celltype filters
      } else {
        if (
          celltypes.includes(jsonData[i]["clusters"]) ||
          celltypes.length == 0
        ) {
          // color = new THREE.Color(jsonData[i]["clusters_colors"]);
          color = new THREE.Color(pallete[jsonData[i]["clusters"]]);
          proj.scale.set(dotSize, dotSize, dotSize);
          umap.scale.set(
            dotSize * umapmod,
            dotSize * umapmod,
            dotSize * umapmod
          );
        } else {
          color = new THREE.Color("#5e5e5e");
          proj.scale.set(smallDotSize, smallDotSize, smallDotSize);
          umap.scale.set(
            smallDotSize * umapmod,
            smallDotSize * umapmod,
            smallDotSize * umapmod
          );
        }
      }
      //plot projection
      let ymod = 1;
      if (ApiState.value.prefix == "6s") {
        ymod = -1;
      }
      proj.position.set(
        jsonData[i]["X_spatial0_norm"] * mod,
        jsonData[i]["X_spatial1_norm"] * ymod * mod,
        jsonData[i]["X_spatial2_norm"] * mod
      );
      proj.updateMatrix();
      this.instancedMesh.setMatrixAt(i, proj.matrix);
      this.instancedMesh.setColorAt(i, color);
      colors.push(color);
    }

    // Update badge legend
    if (atacs.length > 0) {
      // atac badges
      updateBadge("atac", atacs);
      if (atacs.length > 1) {
        hideColorbarGreen();
        hideColorbarMagenta();
        hideColorbar();
      } else {
        showColorbar();
        hideColorbarGreen();
        hideColorbarMagenta();
      }
    } else if (genes.length > 0) {
      // gene badges
      updateBadge("gene", genes);
      if (genes.length > 1) {
        showColorbarGreen();
        showColorbarMagenta();
        hideColorbar();
      } else {
        showColorbar();
        hideColorbarGreen();
        hideColorbarMagenta();
      }
    } else {
      // celltype badges
      updateBadge("celltype");
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

  setupEventListeners() {
    // Add mouse move event listener to track mouse position
    this.renderer.domElement.addEventListener("mousemove", (event) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Add click event listener for additional interaction if needed
    this.renderer.domElement.addEventListener("click", (event) => {
      // We already have the hovered point from the mousemove event
      if (this.hoveredPoint !== null) {
        const point = this.jsonData[this.hoveredPoint];
        const clusterValue = point["clusters"];
        console.log(`Clicked on point with cluster: ${clusterValue}`);

        // You can add additional actions here, such as selecting the cluster
        // or showing more detailed information in a separate panel
      }
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update(); // Only needed if controls.enableDamping is true
    // if (this.mouse.x !== 0 || this.mouse.y !== 0) {
    //   this.checkIntersections();
    // }

    this.renderer.render(this.scene, this.camera);
  };
}
