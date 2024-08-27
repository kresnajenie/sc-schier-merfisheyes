import './SvgOverlay.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { SceneState } from '../../states/SceneState'; // Assuming you have a shared SceneState
import { ButtonState } from '../../states/ButtonState'; // Assuming you have a shared ButtonState

export function createSvgOverlay() {
    const svgOverlay = document.createElement('div');
    svgOverlay.id = 'svg-overlay';
    svgOverlay.className = 'svg-overlay';

    // Create a container for top controls
    const topControls = document.createElement('div');
    topControls.className = 'top-controls';

    // Append the top controls container to the overlay
    svgOverlay.appendChild(topControls);

    // Function to handle dragging
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let overlayStartX = 0;
    let overlayStartY = 0;

    topControls.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = svgOverlay.getBoundingClientRect();
        overlayStartX = rect.left;
        overlayStartY = rect.top;
    });

    const keepInBounds = () => {
        if (svgOverlay.offsetLeft < 0) {
            svgOverlay.style.left = "0%";
        }

        if (svgOverlay.offsetLeft + svgOverlay.offsetWidth > window.innerWidth) {
            svgOverlay.style.left = `${(window.innerWidth - svgOverlay.offsetWidth) / window.innerWidth * 100}%`;
        }

        const topBound = 0; // Adjust as necessary

        if (svgOverlay.offsetTop < topBound) {
            svgOverlay.style.top = `${topBound / window.innerHeight * 100}%`;
        }

        if (svgOverlay.offsetTop + svgOverlay.offsetHeight > window.innerHeight) {
            svgOverlay.style.top = `${(window.innerHeight - svgOverlay.offsetHeight) / window.innerHeight * 100}%`;
        }

        if (svgOverlay.offsetTop <= topBound && svgOverlay.offsetTop + svgOverlay.offsetHeight >= window.innerHeight) {
            svgOverlay.style.top = `${topBound / window.innerHeight * 100}%`;
            svgOverlay.style.height = `${window.innerHeight - topBound}px`;

            camera.aspect = svgOverlay.offsetWidth / svgOverlay.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(svgOverlay.offsetWidth, svgOverlay.offsetHeight);
        }

        if (svgOverlay.offsetLeft <= 0 && svgOverlay.offsetLeft + svgOverlay.offsetWidth >= window.innerWidth) {
            svgOverlay.style.left = `${0}%`;
            svgOverlay.style.width = `${window.innerWidth}px`;

            camera.aspect = svgOverlay.offsetWidth / svgOverlay.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(svgOverlay.offsetWidth, svgOverlay.offsetHeight);
        }
    };

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const newLeft = overlayStartX + (e.clientX - dragStartX);
            const newTop = overlayStartY + (e.clientY - dragStartY);

            svgOverlay.style.left = `${newLeft / window.innerWidth * 100}%`;
            svgOverlay.style.top = `${newTop / window.innerHeight * 100}%`;

            keepInBounds();
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Handle resizing from any edge or corner
    svgOverlay.addEventListener('mousemove', (e) => {
        const rect = svgOverlay.getBoundingClientRect();
        const offset = 10; // Sensitivity for edge detection

        const isRight = e.clientX > rect.right - offset && e.clientX < rect.right + offset;
        const isLeft = e.clientX > rect.left - offset && e.clientX < rect.left + offset;
        const isBottom = e.clientY > rect.bottom - offset && e.clientY < rect.bottom + offset;
        const isTop = e.clientY > rect.top - offset && e.clientY < rect.top + offset;

        const isTopLeft = isLeft && isTop;
        const isTopRight = isRight && isTop;
        const isBottomLeft = isLeft && isBottom;
        const isBottomRight = isRight && isBottom;

        if (isTopLeft) {
            svgOverlay.classList.add('resizable-corner');
            svgOverlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'nwse-resize';
        } else if (isTopRight) {
            svgOverlay.classList.add('resizable-corner');
            svgOverlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'nesw-resize';
        } else if (isBottomLeft) {
            svgOverlay.classList.add('resizable-corner');
            svgOverlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'nesw-resize';
        } else if (isBottomRight) {
            svgOverlay.classList.add('resizable-corner');
            svgOverlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'nwse-resize';
        } else if (isRight) {
            svgOverlay.classList.add('resizable-right');
            svgOverlay.classList.remove('resizable-corner', 'resizable-bottom', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'ew-resize';
        } else if (isLeft) {
            svgOverlay.classList.add('resizable-left');
            svgOverlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-bottom', 'resizable-top');
            svgOverlay.style.cursor = 'ew-resize';
        } else if (isBottom) {
            svgOverlay.classList.add('resizable-bottom');
            svgOverlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-top', 'resizable-left');
            svgOverlay.style.cursor = 'ns-resize';
        } else if (isTop) {
            svgOverlay.classList.add('resizable-top');
            svgOverlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-bottom', 'resizable-left');
            svgOverlay.style.cursor = 'ns-resize';
        } else {
            svgOverlay.style.cursor = 'default';
            svgOverlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-corner', 'resizable-top', 'resizable-left');
        }
    });

    svgOverlay.addEventListener('mousedown', (e) => {
        const rect = svgOverlay.getBoundingClientRect();
        const isRight = e.clientX > rect.right - 10 && e.clientX < rect.right + 10;
        const isLeft = e.clientX > rect.left - 10 && e.clientX < rect.left + 10;
        const isBottom = e.clientY > rect.bottom - 10 && e.clientY < rect.bottom + 10;
        const isTop = e.clientY > rect.top - 10 && e.clientY < rect.top + 10;

        const isTopLeft = isLeft && isTop;
        const isTopRight = isRight && isTop;
        const isBottomLeft = isLeft && isBottom;
        const isBottomRight = isRight && isBottom;

        if (isRight || isLeft || isBottom || isTop) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(event) {
                if (isBottomRight) {
                    svgOverlay.style.width = `${event.clientX - rect.left}px`;
                    svgOverlay.style.height = `${event.clientY - rect.top}px`;
                } else if (isBottomLeft) {
                    const newWidth = rect.right - event.clientX;
                    svgOverlay.style.width = `${newWidth}px`;
                    svgOverlay.style.height = `${event.clientY - rect.top}px`;
                    svgOverlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isTopRight) {
                    svgOverlay.style.width = `${event.clientX - rect.left}px`;
                    svgOverlay.style.height = `${rect.bottom - event.clientY}px`;
                    svgOverlay.style.top = `${event.clientY}px`;
                } else if (isTopLeft) {
                    const newWidth = rect.right - event.clientX;
                    const newHeight = rect.bottom - event.clientY;
                    svgOverlay.style.width = `${newWidth}px`;
                    svgOverlay.style.height = `${newHeight}px`;
                    svgOverlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                    svgOverlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                } else if (isRight) {
                    svgOverlay.style.width = `${event.clientX - rect.left}px`;
                } else if (isLeft) {
                    const newWidth = rect.right - event.clientX;
                    svgOverlay.style.width = `${newWidth}px`;
                    svgOverlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isBottom) {
                    svgOverlay.style.height = `${event.clientY - rect.top}px`;
                } else if (isTop) {
                    const newHeight = rect.bottom - event.clientY;
                    svgOverlay.style.height = `${newHeight}px`;
                    svgOverlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                }

                camera.aspect = svgOverlay.offsetWidth / svgOverlay.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(svgOverlay.offsetWidth, svgOverlay.offsetHeight);
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }
        }
    });

    const sceneContainer = document.createElement('div');
    sceneContainer.id = 'svgScene';
    sceneContainer.style.width = '100%';
    sceneContainer.style.height = '100%';
    svgOverlay.appendChild(sceneContainer);

    // Use the existing shared scene, camera, and renderer
    const scene = SceneState.value.scene;
    const camera = new THREE.PerspectiveCamera(75, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    const initialWidth = window.innerWidth * 0.25;
    const initialHeight = window.innerHeight * 0.5;

    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(initialWidth, initialHeight);

    renderer.render(scene, camera);
    sceneContainer.appendChild(renderer.domElement);

    camera.position.x = ButtonState.value.umapOffset;
    camera.position.y = ButtonState.value.cameraUmapPositionY;
    camera.position.z = ButtonState.value.cameraUmapPositionZ;

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableRotate = false;

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    };

    controls.touches = {
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN
    };

    camera.lookAt(-10000, 0, 0);
    controls.target.set(-10000, 0, 0);

    controls.update();
    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }


    // Now, add the SVG to the existing scene
    // const svgLoader = new SVGLoader();
    // svgLoader.load('/src/assets/images/C_6s_ackr3b_measured.svg', function(data) {
    //     const paths = data.paths;
    //     const group = new THREE.Group();

    //     paths.forEach((path) => {
    //         const material = new THREE.MeshBasicMaterial({
    //             color: path.color,
    //             side: THREE.DoubleSide,
    //             depthWrite: false
    //         });

    //         const shapes = path.toShapes(true);

    //         shapes.forEach((shape) => {
    //             const geometry = new THREE.ShapeGeometry(shape);
    //             const mesh = new THREE.Mesh(geometry, material);
    //             group.add(mesh);
    //         });
    //     });

    //     group.scale.multiplyScalar(0.005); // Scale down as SVGs are typically large
    //     group.position.x = -2.5; // Adjust as needed
    //     group.position.y = 2.5; // Adjust as needed

    //     scene.add(group);
    // });

    controls.update();
    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        keepInBounds();
    });

    return svgOverlay;
}

// Append the SVG overlay to the document body
document.body.appendChild(createSvgOverlay());
