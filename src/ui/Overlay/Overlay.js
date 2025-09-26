import "./Overlay.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SceneState } from "../../states/SceneState";
import { ButtonState } from "../../states/ButtonState";
import { MatrixState } from "../../states/MatrixState";
import { ApiState } from "../../states/ApiState";

export function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.className = "overlay";
  overlay.setAttribute("display_type", "maximize");

  // Create a container for top controls
  const topControls = document.createElement("div");
  topControls.className = "top-controls";

  // TODO: Can be abstracted out into a separate function
  // Creates minimize maximize button
  const minimizeButton = document.createElement("img");
  minimizeButton.className = "min_max_button";
  minimizeButton.id = "maximize"; // determines the state of the overlay
  minimizeButton.src = "/overlay_controls/minimize.png";

  // Toggle overlay minimize maximize state
  minimizeButton.onclick = (event) => {
    // Update button state
    const button = event.target;
    const overlay_state = button.id;
    let new_state = "";
    if (overlay_state === "maximize") {
      new_state = "minimize";
    } else {
      new_state = "maximize";
    }
    button.id = new_state;
    // Use the old state to make the icon the opposite of the state
    button.src = `/overlay_controls/${overlay_state}.png`;

    // Hide circles
    const canvas = document.querySelector(".overlay canvas");
    if (new_state == "minimize") {
      canvas.style.display = "none";
    } else {
      canvas.style.display = "block";
    }

    // Update overlay state
    if (overlay_state === "maximize") {
      overlay.style.transform = "translateX(90%)";
    } else {
      overlay.style.transform = "translateX(0%)";
    }
    overlay.setAttribute("display_type", new_state);
  };

  topControls.appendChild(minimizeButton);

  // Append the top controls container to the overlay
  overlay.appendChild(topControls);

  const sceneContainer = document.createElement("div");
  sceneContainer.id = "overlayScene";
  sceneContainer.style.width = "100%";
  sceneContainer.style.height = "100%";
  overlay.appendChild(sceneContainer);

  // Initialize the Three.js scene
  // const scene = new THREE.Scene();
  const scene = SceneState.value.scene;
  const camera = new THREE.PerspectiveCamera(
    75,
    sceneContainer.offsetWidth / sceneContainer.offsetHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  // Calculate dimensions based on the viewport size
  const initialWidth = window.innerWidth * 0.25; // 25% of the viewport width
  const initialHeight = window.innerHeight * 0.5; // 50% of the viewport height

  camera.aspect = initialWidth / initialHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(initialWidth, initialHeight);

  renderer.render(scene, camera);
  sceneContainer.appendChild(renderer.domElement);

  camera.position.x = ButtonState.value.offsetUMAP;
  camera.position.z = 150;

  // Add orbit controls to the camera
  const controls = new OrbitControls(camera, renderer.domElement);

  // Disable the rotation of the camera
  controls.enableRotate = false;

  // Set left mouse button for panning instead of rotating
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };

  controls.touches = {
    ONE: THREE.TOUCH.PAN,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  // Make the camera look at the object
  camera.lookAt(ButtonState.value.umapOffset, 0, 0);
  camera.position.set(ButtonState.value.umapOffset, 0, 300);
  controls.target.set(ButtonState.value.umapOffset, 0, 0);

  // Make the camera look at the object
  //   camera.lookAt(0, 0, 0);
  //   camera.position.set(0, 0, 200);
  //   controls.target.set(0, 0, 0);

  // Update the controls to apply the changes
  controls.update();
  renderer.render(scene, camera);

  // Create raycaster and mouse vector for hover detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredPoint = null;
  let lastCameraPosition = new THREE.Vector3();

  // Create tooltip for displaying point information
  const tooltip = createTooltip();

  function createTooltip() {
    // Create a tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "overlay-point-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.fontFamily = "Arial, sans-serif";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "1001"; // Higher than main tooltip
    tooltip.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    tooltip.style.minWidth = "80px";

    // Add the tooltip to the overlay
    overlay.appendChild(tooltip);

    return tooltip;
  }

  function showTooltip(position, clusterValue) {
    // Convert 3D position to screen coordinates
    const vector = position.clone();
    vector.project(camera);

    // Get overlay position and dimensions
    const rect = renderer.domElement.getBoundingClientRect();

    const x = (vector.x * 0.5 + 0.5) * rect.width;
    const y = (-vector.y * 0.5 + 0.5) * rect.height;

    // Get the color for this cluster from the palette
    const clusterColor = ApiState.value.pallete[clusterValue] || "#5e5e5e";

    // Set the tooltip content with a colored circle and the cluster name
    tooltip.innerHTML = `
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

    // Position the tooltip relative to the overlay
    const overlayRect = overlay.getBoundingClientRect();
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = "block";
  }

  function hideTooltip() {
    tooltip.style.display = "none";
  }

  function checkIntersections() {
    // Only check intersections if we have data
    if (!MatrixState.value.items || MatrixState.value.items.length === 0) {
      return;
    }

    // Get current camera position to check if we've moved
    const currentCameraPosition = camera.position.clone();
    const cameraHasMoved = !currentCameraPosition.equals(lastCameraPosition);
    lastCameraPosition.copy(currentCameraPosition);

    // Calculate camera distance to determine raycaster parameters
    const cameraDistance = camera.position.z;

    // Set adaptive threshold based on camera distance
    // Using higher thresholds for the overlay since it's smaller
    const minThreshold = 0.5; // When zoomed in very close
    const maxThreshold = 3.0; // When zoomed out far

    let threshold;
    if (cameraDistance < 50) {
      threshold = minThreshold;
    } else if (cameraDistance > 500) {
      threshold = maxThreshold;
    } else {
      const t = (cameraDistance - 50) / (500 - 50); // Normalized distance (0-1)
      threshold = minThreshold + t * t * (maxThreshold - minThreshold);
    }

    // Update the threshold
    raycaster.params.Points = raycaster.params.Points || {};
    raycaster.params.Points.threshold = threshold;

    // Update the raycaster with the current mouse position and camera
    raycaster.setFromCamera(mouse, camera);

    // Find the UMAP mesh in the scene by name
    const pointsMeshUMAP = scene.getObjectByName("pointsMeshUMAP");

    if (!pointsMeshUMAP) {
      console.log("UMAP mesh not found in overlay");
      return;
    }

    // Check for intersections with the UMAP points mesh
    const intersects = raycaster.intersectObject(pointsMeshUMAP);

    // If we found an intersection
    if (intersects.length > 0) {
      // Sort intersections by distance if there are multiple
      if (intersects.length > 1) {
        intersects.sort((a, b) => a.distance - b.distance);
      }

      // Get the index of the closest point that was intersected
      const index = intersects[0].index;

      // If this is a different point than the one we were previously hovering over
      if (hoveredPoint !== index) {
        hoveredPoint = index;

        // Get the cluster information for this point
        const point = MatrixState.value.items[index];
        if (point) {
          const clusterValue = point["clusters"];
          const position = intersects[0].point;

          // Show the tooltip with cluster information
          showTooltip(position, clusterValue);
        }
      }
    } else {
      // If we're not hovering over any point, hide the tooltip
      if (hoveredPoint !== null) {
        hoveredPoint = null;
        hideTooltip();
      }
    }
  }

  // Add mouse move event listener to track mouse position
  renderer.domElement.addEventListener("mousemove", (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Check for raycaster intersections if we have a mouse position
    if (mouse.x !== 0 || mouse.y !== 0) {
      checkIntersections();
    }

    renderer.render(scene, camera);
  }

  animate();

  // if clips out of bounds
  // window.addEventListener('resize', () => {
  //     keepInBounds()
  // })

  return overlay;
}

// document.body.appendChild(createOverlay());
