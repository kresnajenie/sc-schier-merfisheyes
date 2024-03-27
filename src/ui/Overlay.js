import './Overlay.css';

export function createOverlay() {
    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';

    // Create a button to drag the overlay
    const dragButton = document.createElement('button');
    dragButton.id = 'dragButton';
    dragButton.textContent = 'Drag';

    // Append drag button to the overlay
    overlay.appendChild(dragButton);

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

    // Make overlay resizable
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resizeHandle';
    resizeHandle.className = 'resize-handle';
    overlay.appendChild(resizeHandle);

    // Handle resizing
    resizeHandle.addEventListener('mousedown', resizeMouseDown);

    function resizeMouseDown(e) {
        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);
        e.preventDefault();
    }

    function resizeMouseMove(e) {
        overlay.style.width = `${e.clientX - overlay.offsetLeft}px`;
        overlay.style.height = `${e.clientY - overlay.offsetTop}px`;
    }

    function resizeMouseUp() {
        window.removeEventListener('mousemove', resizeMouseMove);
        window.removeEventListener('mouseup', resizeMouseUp);
    }

    return overlay;
}
