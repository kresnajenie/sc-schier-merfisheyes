import './Overlay.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneState } from '../../states/SceneState';



export function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';

    // Create a container for top controls
    const topControls = document.createElement('div');
    topControls.className = 'top-controls';

    // Drag Button
    const dragButton = document.createElement('button');
    dragButton.id = 'dragButton';
    dragButton.textContent = 'Drag';
    dragButton.className = 'btn btn-primary'; 

    // Resize Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resizeHandle';
    resizeHandle.className = 'resize-handle';

    // Append drag button and resize handle to the top controls container
    topControls.appendChild(dragButton);
    topControls.appendChild(resizeHandle);

    // Then append the top controls container to the overlay
    overlay.appendChild(topControls);

    // Function to handle dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragButton.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            overlay.style.left = `${e.clientX - offsetX}px`;
            overlay.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Add more content or functionality to the overlay as needed...



    // Handle resizing
    resizeHandle.addEventListener('mousedown', resizeMouseDown);

    function resizeMouseDown(e) {
        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);
        e.preventDefault();
    }

    // function resizeMouseMove(e) {
    //     overlay.style.width = `${e.clientX - overlay.offsetLeft}px`;
    //     overlay.style.height = `${e.clientY - overlay.offsetTop}px`;
    // }
    // Update camera and renderer

    
    function resizeMouseMove(e) {
        const newWidth = overlay.offsetWidth + (overlay.offsetLeft - e.clientX);
        const newHeight = overlay.offsetHeight + (overlay.offsetTop - e.clientY);
    
        // Apply minimum constraints to prevent the overlay from disappearing or getting too small
        const minWidth = 100; // Minimum width
        const minHeight = 100; // Minimum height
    
        overlay.style.width = `${Math.max(newWidth, minWidth)}px`;
        overlay.style.height = `${Math.max(newHeight, minHeight)}px`;
    
        // Adjust the overlay's top and left positions to move along with the resize handle
        overlay.style.left = `${e.clientX}px`;
        overlay.style.top = `${e.clientY}px`;
    
        // Update camera and renderer
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }    
    
    function resizeMouseUp() {
        window.removeEventListener('mousemove', resizeMouseMove);
        window.removeEventListener('mouseup', resizeMouseUp);
    }

    const sceneContainer = document.createElement('div');
    sceneContainer.id = 'overlayScene';
    sceneContainer.style.width = '100%';
    sceneContainer.style.height = '100%';
    overlay.appendChild(sceneContainer);

    // Initialize the Three.js scene
    // const scene = new THREE.Scene();
    const scene = SceneState.value.scene;
    const camera = new THREE.PerspectiveCamera(75, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    // console.log(sceneContainer.offsetWidth)
    // console.log(sceneContainer.offsetHeight)
    // renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
    // renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);

    // Calculate dimensions based on the viewport size
    const initialWidth = window.innerWidth * 0.25; // 25% of the viewport width
    const initialHeight = window.innerHeight * 0.5; // 50% of the viewport height

    // Set renderer size directly
    renderer.setSize(initialWidth, initialHeight);

    // camera.aspect = sceneContainer.offsetWidth / sceneContainer.offsetHeight;
    console.log("halo")
    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    sceneContainer.appendChild(renderer.domElement);

    camera.position.x = 10000;
    camera.position.z = 150;



    // Add orbit controls to the camera
    const controls = new OrbitControls(camera, renderer.domElement);

    // Disable the rotation of the camera
    controls.enableRotate = false;

    // Set left mouse button for panning instead of rotating
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    };

   // Make the camera look at the object
    camera.lookAt(10000, 0, 10);

    // Set the controls target to the position you want the camera to focus on
    controls.target.set(10000, 0, 10);

    // Update the controls to apply the changes
    controls.update();
    renderer.render(scene, camera);


    // function disposeScene(scene, renderer, controls) {
    //     // Dispose of scene resources
    //     scene.traverse(function (object) {
    //         if (object.isMesh) {
    //             if (object.geometry) object.geometry.dispose();
    //             if (object.material) {
    //                 if (object.material.map) object.material.map.dispose();
    //                 object.material.dispose();
    //             }
    //         }
    //     });
    
    //     // Dispose of renderer and its DOM element
    //     if (renderer) {
    //         renderer.domElement.remove();
    //         renderer.dispose();
    //     }
    
    //     // Dispose of controls if they exist
    //     if (controls) controls.dispose();
    
    //     // Remove the event listeners related to the overlay interactions
    //     // Assuming these functions are defined in the scope where the overlay is manipulated
    //     document.removeEventListener('mousemove', resizeMouseMove);
    //     document.removeEventListener('mouseup', resizeMouseUp);
    // }
    

    // // Create a close button to dispose of the scene and remove the overlay
    // const closeButton = document.createElement('button');
    //     closeButton.textContent = 'Close';
    //     closeButton.addEventListener('click', function () {
    //     disposeScene(scene, renderer, controls);
    //     overlay.remove();
    // });
    
    // // Append the close button to the overlay
    // overlay.appendChild(closeButton);
    

    function animate() {
        requestAnimationFrame(animate);
        // controls.update();
        renderer.render(scene, camera);
    }

    animate();

    return overlay;
}

document.body.appendChild(createOverlay());

// renderer.render(scene, camera)