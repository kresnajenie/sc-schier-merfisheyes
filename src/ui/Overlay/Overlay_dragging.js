import './Overlay.css';

// Sample data
const data = [
    { X_umap0_norm: 0.5, X_umap1_norm: -0.3, clusters: 'Epidermis' },
    { X_umap0_norm: -0.7, X_umap1_norm: 0.4, clusters: 'Epidermis' },
    { X_umap0_norm: 0.1, X_umap1_norm: 0.9, clusters: 'Dermis' },
    // More data points...
];

const colors = ["white", "white", "blue"]

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
        }

        if (overlay.offsetLeft <= 0 && overlay.offsetLeft + overlay.offsetWidth >= window.innerWidth) {
            overlay.style.left = `${0}%`;
            overlay.style.width = `${window.innerWidth}px`;
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
            overlay.style.cursor = 'nwse-resize';
        } else if (isTopRight) {
            overlay.classList.add('resizable-corner');
            overlay.style.cursor = 'nesw-resize';
        } else if (isBottomLeft) {
            overlay.classList.add('resizable-corner');
            overlay.style.cursor = 'nesw-resize';
        } else if (isBottomRight) {
            overlay.classList.add('resizable-corner');
            overlay.style.cursor = 'nwse-resize';
        } else if (isRight) {
            overlay.classList.add('resizable-right');
            overlay.style.cursor = 'ew-resize';
        } else if (isLeft) {
            overlay.classList.add('resizable-left');
            overlay.style.cursor = 'ew-resize';
        } else if (isBottom) {
            overlay.classList.add('resizable-bottom');
            overlay.style.cursor = 'ns-resize';
        } else if (isTop) {
            overlay.classList.add('resizable-top');
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
                    overlay.style.left = `${rect.right - newWidth}px`;
                } else if (isTopRight) {
                    overlay.style.width = `${event.clientX - rect.left}px`;
                    overlay.style.height = `${rect.bottom - event.clientY}px`;
                    overlay.style.top = `${event.clientY}px`;
                } else if (isTopLeft) {
                    const newWidth = rect.right - event.clientX;
                    const newHeight = rect.bottom - event.clientY;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.left = `${rect.right - newWidth}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`;
                } else if (isRight) {
                    overlay.style.width = `${event.clientX - rect.left}px`;
                } else if (isLeft) {
                    const newWidth = rect.right - event.clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.left = `${rect.right - newWidth}px`;
                } else if (isBottom) {
                    overlay.style.height = `${event.clientY - rect.top}px`;
                } else if (isTop) {
                    const newHeight = rect.bottom - event.clientY;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`;
                }
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
                    overlay.style.left = `${rect.right - newWidth}px`;
                } else if (isTopRight) {
                    overlay.style.width = `${event.changedTouches[0].clientX - rect.left}px`;
                    overlay.style.height = `${rect.bottom - event.changedTouches[0].clientY}px`;
                    overlay.style.top = `${event.changedTouches[0].clientY}px`;
                } else if (isTopLeft) {
                    const newWidth = rect.right - event.changedTouches[0].clientX;
                    const newHeight = rect.bottom - event.changedTouches[0].clientY;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.left = `${rect.right - newWidth}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`;
                } else if (isRight) {
                    overlay.style.width = `${event.changedTouches[0].clientX - rect.left}px`;
                } else if (isLeft) {
                    const newWidth = rect.right - event.changedTouches[0].clientX;
                    overlay.style.width = `${newWidth}px`;
                    overlay.style.left = `${rect.right - newWidth}px`;
                } else if (isBottom) {
                    overlay.style.height = `${event.changedTouches[0].clientY - rect.top}px`;
                } else if (isTop) {
                    const newHeight = rect.bottom - event.changedTouches[0].clientY;
                    overlay.style.height = `${newHeight}px`;
                    overlay.style.top = `${rect.bottom - newHeight}px`;
                }
            }

            function stopResizeTouch() {
                window.removeEventListener('touchmove', resizeTouchMove);
                window.removeEventListener('touchend', stopResizeTouch);
            }
        }
    });

    // Plot the data on the overlay
    // plotInitialData(data, colors, overlay);

    window.addEventListener('resize', () => {
        keepInBounds();
    });

    return overlay;
}

// Function to update circle colors based on a provided color list
export function updateCircleColors(colors) {
    const circles = document.querySelectorAll('.circle');

    // Update each circle's color based on the provided colors list
    circles.forEach((circle) => {
        const index = parseInt(circle.dataset.index, 10); // Retrieve index stored earlier

        const color = colors[index];
        if (color) {
            // Check if color is a string or an object
            if (typeof color === 'string') {
                // If it's a string, use it directly
                circle.style.backgroundColor = color;
            } else if (typeof color === 'object' && color.r !== undefined && color.g !== undefined && color.b !== undefined) {
                // If it's an object, assume {r, g, b} format and convert to rgba
                circle.style.backgroundColor = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.5)`;
            }
        }
    });
}


// Function to plot the initial data with interactions and initial colors
export function plotInitialData(data, colors) {
    // Get the overlay component by its ID
    const overlay = document.getElementById('overlay');

    // Check if the overlay exists
    if (!overlay) {
        console.error('Overlay element not found. Make sure the overlay is present in the DOM.');
        return;
    }

    // Create circles for each data point
    data.forEach((item, index) => {
        const circle = document.createElement('div');
        circle.className = 'circle';
        
        // Set position based on normalized coordinates (-1 to 1)
        const x = ((item.X_umap0_norm + 1) / 2) * 100; // Normalize to percentage
        const y = ((1 - item.X_umap1_norm) / 2) * 100; // Inverted to match CSS positioning
        
        circle.style.left = `${x}%`;
        circle.style.top = `${y}%`;
        circle.dataset.cluster = item.clusters;
        circle.dataset.index = index; // Store the index to match colors later

        // Set initial color if available
        const color = colors[index];
        if (color) {
            circle.style.backgroundColor = `rgb(${color.r*255}, ${color.g*255}, ${color.b*255}, 0.5)`;
        }

        // Adjust the size of the circle
        circle.style.width = '2.5px'; // Set your desired width
        circle.style.height = '2.5px'; // Set your desired height

        // Add hover event listeners
        circle.addEventListener('mouseenter', () => {
            const sameClusterCircles = document.querySelectorAll(
                `.circle[data-cluster="${item.clusters}"]`
            );
            sameClusterCircles.forEach((c) => c.classList.add('hovered'));
        });

        circle.addEventListener('mouseleave', () => {
            const sameClusterCircles = document.querySelectorAll(
                `.circle[data-cluster="${item.clusters}"]`
            );
            sameClusterCircles.forEach((c) => c.classList.remove('hovered'));
        });

        overlay.appendChild(circle);
    });
}



document.body.appendChild(createOverlay());
