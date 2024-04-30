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

    const keepInBounds = () => {
        // touching left
        if (genomeBrowser.offsetLeft < 0) {
            genomeBrowser.style.left = "0%";
        }

        // touching right
        if (genomeBrowser.offsetLeft + genomeBrowser.offsetWidth > window.innerWidth) {
            genomeBrowser.style.left = `${(window.innerWidth - genomeBrowser.offsetWidth) / window.innerWidth * 100}%`
        }

        // navbar height
        const topBound = document.getElementsByClassName('navbar')[0].offsetHeight;

        // touching navbar
        if (genomeBrowser.offsetTop < topBound) {
            genomeBrowser.style.top = `${topBound / window.innerHeight * 100}%`;
        }

        // touching bottom
        if (genomeBrowser.offsetTop + genomeBrowser.offsetHeight > window.innerHeight) {
            genomeBrowser.style.top = `${(window.innerHeight - genomeBrowser.offsetHeight) / window.innerHeight * 100}%`
        }

        // touching both top and bottom means we have to shrink it
        if (genomeBrowser.offsetTop <= topBound && genomeBrowser.offsetTop + genomeBrowser.offsetHeight >= window.innerHeight) {

            genomeBrowser.style.top = `${topBound / window.innerHeight * 100}%`;
            genomeBrowser.style.height = `${window.innerHeight - topBound}px`

            // Update camera and renderer
            camera.aspect = genomeBrowser.offsetWidth / genomeBrowser.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(genomeBrowser.offsetWidth, genomeBrowser.offsetHeight);
        }

        // touching both left and right means we have to shrink it
        if (genomeBrowser.offsetLeft <= 0 && genomeBrowser.offsetLeft + genomeBrowser.offsetWidth >= window.innerWidth) {
            genomeBrowser.style.left = `${0}%`;
            genomeBrowser.style.width = `${window.innerWidth}px`

            // Update camera and renderer
            camera.aspect = genomeBrowser.offsetWidth / genomeBrowser.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(genomeBrowser.offsetWidth, genomeBrowser.offsetHeight);
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            genomeBrowser.style.left = `${(e.clientX - offsetX) / window.innerWidth * 100}%`;
            genomeBrowser.style.top = `${(e.clientY - offsetY) / window.innerHeight * 100}%`;
        
            keepInBounds();
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

        const topBound = document.getElementsByClassName('navbar')[0].offsetHeight;

        // Bound the size to the window
        let x = e.clientX < 0 ? 0 : e.clientX
        let y = e.clientY < topBound ? topBound : e.clientY

        // Apply minimum constraints to prevent the genomeBrowser from disappearing or getting too small
        const minWidth = 100; // Minimum width
        const minHeight = 100; // Minimum height

        // if min size already and shrinking
        if (genomeBrowser.offsetWidth == minWidth && x > genomeBrowser.offsetLeft) {
            x = genomeBrowser.offsetLeft
        } 
        
        if (genomeBrowser.offsetHeight == minHeight && y > genomeBrowser.offsetTop) {
            y = genomeBrowser.offsetTop
        }

        const newWidth = genomeBrowser.offsetWidth + (genomeBrowser.offsetLeft - x);
        const newHeight = genomeBrowser.offsetHeight + (genomeBrowser.offsetTop -y);

        genomeBrowser.style.width = `${Math.max(newWidth, minWidth)}px`;
        genomeBrowser.style.height = `${Math.max(newHeight, minHeight)}px`;

        // Adjust the overlay's top and left positions to move along with the resize handle
        if (newWidth > minWidth) {
            genomeBrowser.style.left = `${x}px`;
        }

        if (newHeight > minHeight) {
            genomeBrowser.style.top = `${y}px`;
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


    // Create the content of the window
    const content = document.createElement('div');
    content.className = 'content';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://jbrowse.org/code/jb2/v2.11.0/?session=local-NLoreEqwAO1777EQQ4s0n'; 
    content.appendChild(iframe);

    genomeBrowser.appendChild(content);

    // if clips out of bounds
    window.addEventListener('resize', () => {
        keepInBounds()
    })

    return genomeBrowser;

}

document.body.appendChild(createGenomeBrowser());