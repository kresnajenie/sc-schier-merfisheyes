import './Overlay.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneState } from '../../states/SceneState';
import { ButtonState } from '../../states/ButtonState';

export function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';

    // Create a container for top controls
    const topControls = document.createElement('div');
    topControls.className = 'top-controls';

    // Append the top controls container to the overlay
    overlay.appendChild(topControls);

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
        const rect = overlay.getBoundingClientRect();
        overlayStartX = rect.left;
        overlayStartY = rect.top;
    });

    const keepInBounds = () => {
        if (overlay.offsetLeft < 0) {
            overlay.style.left = "0%";
        }

        if (overlay.offsetLeft + overlay.offsetWidth > window.innerWidth) {
            overlay.style.left = `${(window.innerWidth - overlay.offsetWidth) / window.innerWidth * 100}%`;
        }

        const topBound = document.getElementsByClassName('navbar')[0]?.offsetHeight || 0;

        if (overlay.offsetTop < topBound) {
            overlay.style.top = `${topBound / window.innerHeight * 100}%`;
        }

        if (overlay.offsetTop + overlay.offsetHeight > window.innerHeight) {
            overlay.style.top = `${(window.innerHeight - overlay.offsetHeight) / window.innerHeight * 100}%`;
        }

        if (overlay.offsetTop <= topBound && overlay.offsetTop + overlay.offsetHeight >= window.innerHeight) {
            overlay.style.top = `${topBound / window.innerHeight * 100}%`;
            overlay.style.height = `${window.innerHeight - topBound}px`;

            camera.aspect = overlay.offsetWidth / overlay.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(overlay.offsetWidth, overlay.offsetHeight);
        }

        if (overlay.offsetLeft <= 0 && overlay.offsetLeft + overlay.offsetWidth >= window.innerWidth) {
            overlay.style.left = `${0}%`;
            overlay.style.width = `${window.innerWidth}px`;

            camera.aspect = overlay.offsetWidth / overlay.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(overlay.offsetWidth, overlay.offsetHeight);
        }
    };

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const newLeft = overlayStartX + (e.clientX - dragStartX);
            const newTop = overlayStartY + (e.clientY - dragStartY);

            overlay.style.left = `${newLeft / window.innerWidth * 100}%`;
            overlay.style.top = `${newTop / window.innerHeight * 100}%`;

            keepInBounds();
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Handle resizing from any edge or corner
    overlay.addEventListener('mousemove', (e) => {
        const rect = overlay.getBoundingClientRect();
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
            overlay.classList.add('resizable-corner');
            overlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'nwse-resize';
        } else if (isTopRight) {
            overlay.classList.add('resizable-corner');
            overlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'nesw-resize';
        } else if (isBottomLeft) {
            overlay.classList.add('resizable-corner');
            overlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'nesw-resize';
        } else if (isBottomRight) {
            overlay.classList.add('resizable-corner');
            overlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'nwse-resize';
        } else if (isRight) {
            overlay.classList.add('resizable-right');
            overlay.classList.remove('resizable-corner', 'resizable-bottom', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'ew-resize';
        } else if (isLeft) {
            overlay.classList.add('resizable-left');
            overlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-bottom', 'resizable-top');
            overlay.style.cursor = 'ew-resize';
        } else if (isBottom) {
            overlay.classList.add('resizable-bottom');
            overlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-top', 'resizable-left');
            overlay.style.cursor = 'ns-resize';
        } else if (isTop) {
            overlay.classList.add('resizable-top');
            overlay.classList.remove('resizable-corner', 'resizable-right', 'resizable-bottom', 'resizable-left');
            overlay.style.cursor = 'ns-resize';
        } else {
            overlay.style.cursor = 'default';
            overlay.classList.remove('resizable-right', 'resizable-bottom', 'resizable-corner', 'resizable-top', 'resizable-left');
        }
    });

    overlay.addEventListener('mousedown', (e) => {
        const rect = overlay.getBoundingClientRect();
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
                    overlay.style.width = `${event.clientX - rect.left}px`;
                    overlay.style.height = `${event.clientY - rect.top}px`;
                } else if (isBottomLeft) {
                    const newWidth = rect.right - event.clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${event.clientY - rect.top}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isTopRight) {
                    overlay.style.width = `${event.clientX - rect.left}px`;
                    overlay.style.height = `${rect.bottom - event.clientY}px`;
                    overlay.style.top = `${event.clientY}px`;
                } else if (isTopLeft) {
                    const newWidth = rect.right - event.clientX;
                    const newHeight = rect.bottom - event.clientY;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                    overlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                } else if (isRight) {
                    overlay.style.width = `${event.clientX - rect.left}px`;
                } else if (isLeft) {
                    const newWidth = rect.right - event.clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isBottom) {
                    overlay.style.height = `${event.clientY - rect.top}px`;
                } else if (isTop) {
                    const newHeight = rect.bottom - event.clientY;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                }

                camera.aspect = overlay.offsetWidth / overlay.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(overlay.offsetWidth, overlay.offsetHeight);
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }
        }
    });

    // Handle touch events for dragging and resizing
    topControls.addEventListener("touchstart", (e) => {
        isDragging = true;
        dragStartX = e.changedTouches[0].clientX;
        dragStartY = e.changedTouches[0].clientY;
        const rect = overlay.getBoundingClientRect();
        overlayStartX = rect.left;
        overlayStartY = rect.top;
    });

    document.addEventListener("touchmove", (e) => {
        if (isDragging) {
            let x = e.changedTouches[0].clientX;
            if (x + overlay.offsetWidth > window.innerWidth) {
                x = window.innerWidth - overlay.offsetWidth;
            }

            const newLeft = overlayStartX + (e.changedTouches[0].clientX - dragStartX);
            const newTop = overlayStartY + (e.changedTouches[0].clientY - dragStartY);

            overlay.style.left = `${newLeft / window.innerWidth * 100}%`;
            overlay.style.top = `${newTop / window.innerHeight * 100}%`;

            keepInBounds();
        }
    });

    document.addEventListener("touchend", () => {
        isDragging = false;
    });

    overlay.addEventListener('touchstart', (e) => {
        const rect = overlay.getBoundingClientRect();
        const isRight = e.changedTouches[0].clientX > rect.right - 10 && e.changedTouches[0].clientX < rect.right + 10;
        const isLeft = e.changedTouches[0].clientX > rect.left - 10 && e.changedTouches[0].clientX < rect.left + 10;
        const isBottom = e.changedTouches[0].clientY > rect.bottom - 10 && e.changedTouches[0].clientY < rect.bottom + 10;
        const isTop = e.changedTouches[0].clientY > rect.top - 10 && e.changedTouches[0].clientY < rect.top + 10;

        const isTopLeft = isLeft && isTop;
        const isTopRight = isRight && isTop;
        const isBottomLeft = isLeft && isBottom;
        const isBottomRight = isRight && isBottom;

        if (isRight || isLeft || isBottom || isTop) {
            window.addEventListener('touchmove', resizeTouchMove);
            window.addEventListener('touchend', stopResizeTouch);

            function resizeTouchMove(event) {
                if (isBottomRight) {
                    overlay.style.width = `${event.changedTouches[0].clientX - rect.left}px`;
                    overlay.style.height = `${event.changedTouches[0].clientY - rect.top}px`;
                } else if (isBottomLeft) {
                    const newWidth = rect.right - event.changedTouches[0].clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${event.changedTouches[0].clientY - rect.top}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isTopRight) {
                    overlay.style.width = `${event.changedTouches[0].clientX - rect.left}px`;
                    overlay.style.height = `${rect.bottom - event.changedTouches[0].clientY}px`;
                    overlay.style.top = `${event.changedTouches[0].clientY}px`;
                } else if (isTopLeft) {
                    const newWidth = rect.right - event.changedTouches[0].clientX;
                    const newHeight = rect.bottom - event.changedTouches[0].clientY;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                    overlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                } else if (isRight) {
                    overlay.style.width = `${event.changedTouches[0].clientX - rect.left}px`;
                } else if (isLeft) {
                    const newWidth = rect.right - event.changedTouches[0].clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.left = `${rect.right - newWidth}px`; // Adjust the left position
                } else if (isBottom) {
                    overlay.style.height = `${event.changedTouches[0].clientY - rect.top}px`;
                } else if (isTop) {
                    const newHeight = rect.bottom - event.changedTouches[0].clientY;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`; // Adjust the top position
                }

                camera.aspect = overlay.offsetWidth / overlay.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(overlay.offsetWidth, overlay.offsetHeight);
            }

            function stopResizeTouch() {
                window.removeEventListener('touchmove', resizeTouchMove);
                window.removeEventListener('touchend', stopResizeTouch);
            }
        }
    });

    const sceneContainer = document.createElement('div');
    sceneContainer.id = 'overlayScene';
    sceneContainer.style.width = '100%';
    sceneContainer.style.height = '100%';
    overlay.appendChild(sceneContainer);

    const scene = SceneState.value.scene;
    scene.background = new THREE.Color(0x000000); // Hexadecimal color value
    // scene.background = new THREE.Color(0x121212); // Hexadecimal color value

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

    camera.lookAt(10000, 0, 10);
    controls.target.set(10000, 0, 10);

    controls.update();
    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        keepInBounds();
    });

    return overlay;
}

document.body.appendChild(createOverlay());
