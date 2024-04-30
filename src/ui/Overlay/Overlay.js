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

    dragButton.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    })

    const keepInBounds = () => {
        if (overlay.offsetLeft < 0) {
            overlay.style.left = "0%";
        }

        if (overlay.offsetLeft + overlay.offsetWidth > window.innerWidth) {
            overlay.style.left = `${(window.innerWidth - overlay.offsetWidth) / window.innerWidth * 100}%`
        }

        const topBound = document.getElementsByClassName('navbar')[0].offsetHeight;

        if (overlay.offsetTop < topBound) {
            overlay.style.top = `${topBound / window.innerHeight * 100}%`;
        }

        if (overlay.offsetTop + overlay.offsetHeight > window.innerHeight) {
            overlay.style.top = `${(window.innerHeight - overlay.offsetHeight) / window.innerHeight * 100}%`
        }
    }

    document.addEventListener("mousemove", (e) => {

        if (isDragging) {
            overlay.style.left = `${(e.clientX - offsetX) / window.innerWidth * 100}%`;
            overlay.style.top = `${(e.clientY - offsetY) / window.innerHeight * 100}%`;

            keepInBounds();
        }
    })
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
    })

    // Add more content or functionality to the overlay as needed...

    // Handle MOUSE resizing
    resizeHandle.addEventListener('mousedown', resizeMouseDown);

    function resizeMouseDown(e) {
        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);
        e.preventDefault();
    }

    function resizeMouseMove(e) {
        
        const topBound = document.getElementsByClassName('navbar')[0].offsetHeight;

        // Bound the size to the window
        let x = e.clientX < 0 ? 0 : e.clientX
        let y = e.clientY < topBound ? topBound : e.clientY

        // Apply minimum constraints to prevent the overlay from disappearing or getting too small
        const minWidth = 100; // Minimum width
        const minHeight = 100; // Minimum height

        // if min size already and shrinking
        if (overlay.offsetWidth == minWidth && x > overlay.offsetLeft) {
            x = overlay.offsetLeft
        } 
        
        if (overlay.offsetHeight == minHeight && y > overlay.offsetTop) {
            y = overlay.offsetTop
        }

        const newWidth = overlay.offsetWidth + (overlay.offsetLeft - x);
        const newHeight = overlay.offsetHeight + (overlay.offsetTop - y);

        overlay.style.width = `${Math.max(newWidth, minWidth) / window.innerWidth * 100}%`;
        overlay.style.height = `${Math.max(newHeight, minHeight) / window.innerHeight * 100}%`;

        // Adjust the overlay's top and left positions to move along with the resize handle
        if (newWidth > minWidth) {
            overlay.style.left = `${x}px`;
        }

        if (newHeight > minHeight) {
            overlay.style.top = `${y}px`;
        }

        // Update camera and renderer
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }

    function resizeMouseUp() {
        window.removeEventListener('mousemove', resizeMouseMove);
        window.removeEventListener('mouseup', resizeMouseUp);
    }


    // Tablet DRAG Overlay
    dragButton.addEventListener("touchstart", (e) => {
        isDragging = true;
        offsetX = e.changedTouches[0].clientX;
        offsetY = e.changedTouches[0].clientY;
    })

    document.addEventListener("touchmove", (e) => {
        if (isDragging) {

            let x = e.changedTouches[0].clientX;
            if (x + overlay.offsetWidth > window.innerWidth) {
                x = window.innerWidth - overlay.offsetWidth;
            }

            overlay.style.left = `${x / window.innerWidth * 100}%`;
            overlay.style.top = `${(e.changedTouches[0].clientY) / window.innerHeight * 100}%`;

            keepInBounds()
        }
    });

    document.addEventListener("touchend", () => {
        isDragging = false;
    })

    resizeHandle.addEventListener('touchstart', resizeTouchStart);

    function resizeTouchStart(e) {
        window.addEventListener('touchmove', resizeTouchMove);
        window.addEventListener('touchend', resizeTouchEnd);
        e.preventDefault();
    }

    function resizeTouchMove(e) {

        const topBound = document.getElementsByClassName('navbar')[0].offsetHeight;

        // Bound the size to the window
        let x = e.changedTouches[0].clientX < 0 ? 0 : e.changedTouches[0].clientX
        let y = e.changedTouches[0].clientY < topBound ? topBound : e.changedTouches[0].clientY

        // Apply minimum constraints to prevent the overlay from disappearing or getting too small
        const minWidth = 100; // Minimum width
        const minHeight = 100; // Minimum height

        // if min size already and shrinking
        if (overlay.offsetWidth == minWidth && x > overlay.offsetLeft) {
            x = overlay.offsetLeft
        } 
        
        if (overlay.offsetHeight == minHeight && y > overlay.offsetTop) {
            y = overlay.offsetTop
        }

        const newWidth = overlay.offsetWidth + (overlay.offsetLeft - x);
        const newHeight = overlay.offsetHeight + (overlay.offsetTop - y);

        overlay.style.width = `${Math.max(newWidth, minWidth) / window.innerWidth * 100}%`;
        overlay.style.height = `${Math.max(newHeight, minHeight) / window.innerHeight * 100}%`;

        // Adjust the overlay's top and left positions to move along with the resize handle
        if (newWidth > minWidth) {
            overlay.style.left = `${x}px`;
        }

        if (newHeight > minHeight) {
            overlay.style.top = `${y}px`;
        }

        // Update camera and renderer
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }
    
    function resizeTouchEnd() {
        window.removeEventListener('touchmove', resizeTouchMove);
        window.removeEventListener('touchend', resizeTouchEnd);
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

window.addEventListener('resize', () => {
    const overlay = document.getElementById('overlay');
    const rect = overlay.getBoundingClientRect();

    // out of bounds horizontally
    if (
        (rect.x + rect.width > window.innerWidth && rect.y + rect.height > window.innerHeight)
        || rect.x < 0 || rect.y < 0
    ) {
        overlay.style.left = `${(window.innerWidth - rect.width) / window.innerWidth * 100}%`;
        overlay.style.top = `${(window.innerHeight - rect.height) / window.innerHeight * 100}%`;
    }
});

// renderer.render(scene, camera)