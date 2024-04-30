import './GenomeBrowser.css';

export function createGenomeBrowser() {
    const genomeBrowser = document.createElement('div');
    genomeBrowser.className = 'genome-browser';
    genomeBrowser.id = 'genome-browser';

    // create container for top constrols
    const browserControls = document.createElement('div');
    browserControls.className = 'browser-controls';

    // Drag Button
    const dragButtonBrowser = document.createElement('button');
    dragButtonBrowser.id = 'drag-button-browser';
    dragButtonBrowser.textContent = 'Drag';
    dragButtonBrowser.className = 'btn btn-primary';

    // Resize Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resizeHandleBrowser';
    resizeHandle.className = 'resize-handleBrowser';

    // Append drag button and resize handle to the top controls container
    browserControls.appendChild(dragButtonBrowser);
    browserControls.appendChild(resizeHandle);

    // append top controls to genomeBrowser
    genomeBrowser.appendChild(browserControls);

    // Function to handle dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragButtonBrowser.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            genomeBrowser.style.left = `${(e.clientX - offsetX) / window.innerWidth * 100}%`;
            genomeBrowser.style.top = `${(e.clientY - offsetY) / window.innerHeight * 100}%`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Handle resizing
    resizeHandle.addEventListener('mousedown', resizeMouseDown);

    function resizeMouseDown(e) {
        window.addEventListener('mousemove', resizeMouseMove);
        window.addEventListener('mouseup', resizeMouseUp);
        e.preventDefault();
    }

    function resizeMouseMove(e) {
        const newWidth = genomeBrowser.offsetWidth + (genomeBrowser.offsetLeft - e.clientX);
        const newHeight = genomeBrowser.offsetHeight + (genomeBrowser.offsetTop - e.clientY);

        // Apply minimum constraints to prevent the genomeBrowser from disappearing or getting too small
        const minWidth = 100; // Minimum width
        const minHeight = 100; // Minimum height

        genomeBrowser.style.width = `${Math.max(newWidth, minWidth) / window.innerWidth * 100}%`;
        genomeBrowser.style.height = `${Math.max(newHeight, minHeight) / window.innerHeight * 100}%`;

        // Adjust the genomeBrowser's top and left positions to move along with the resize handle
        genomeBrowser.style.left = `${e.clientX}px`;
        genomeBrowser.style.top = `${e.clientY}px`;

        // Update camera and renderer
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    }

    function resizeMouseUp() {
        window.removeEventListener('mousemove', resizeMouseMove);
        window.removeEventListener('mouseup', resizeMouseUp);
    }


    // Create the content of the window
    const content = document.createElement('div');
    content.className = 'content';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://jbrowse.org/code/jb2/v2.11.0/?session=local-NLoreEqwAO1777EQQ4s0n'; 
    content.appendChild(iframe);

    genomeBrowser.appendChild(content);

    return genomeBrowser;

}

document.body.appendChild(createGenomeBrowser());

window.addEventListener('resize', () => {
    const genomeBrowser = document.getElementById('genomeBrowser');
    const rect = genomeBrowser.getBoundingClientRect();

    // out of bounds horizontally
    if (
        (rect.x + rect.width > window.innerWidth && rect.y + rect.height > window.innerHeight)
        || rect.x < 0 || rect.y < 0
    ) {
        genomeBrowser.style.left = `${(window.innerWidth - rect.width) / window.innerWidth * 100}%`;
        genomeBrowser.style.top = `${(window.innerHeight - rect.height) / window.innerHeight * 100}%`;
    }
});