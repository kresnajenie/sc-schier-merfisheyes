import { ApiState } from '../../states/ApiState';
import { toggleSelectedCelltype, updateSelectedCelltype } from '../../states/SelectedState';
import './Overlay.css';

// Sample data
// const data = [
//     { X_umap0_norm: 0.5, X_umap1_norm: -0.3, clusters: 'Epidermis' },
//     { X_umap0_norm: -0.7, X_umap1_norm: 0.4, clusters: 'Epidermis' },
//     { X_umap0_norm: 0.1, X_umap1_norm: 0.9, clusters: 'Dermis' },
//     // More data points...
// ];

// const colors = ["white", "white", "blue"];

export function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';

    // Create a container for top controls
    const topControls = document.createElement('div');
    topControls.className = 'top-controls';

    // Append the top controls container to the overlay
    overlay.appendChild(topControls);

    // Create a text element for displaying the cluster label
    const textElement = document.createElement('div');
    textElement.className = 'cluster-text';
    textElement.textContent = 'Hover the UMAP'; // Initial empty text

    // Append the text element to the top controls container
    topControls.appendChild(textElement);

    // Plot the data on the overlay
    // plotInitialData(data, colors, textContainer);

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
                circle.style.backgroundColor = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`;
            }
        }
    });
}

// Function to plot the initial data with interactions and initial colors
export function plotInitialData(data, colors) {
    const overlay = document.getElementById('overlay');
    const textContainer = document.querySelector('.cluster-text'); // Access the text element directly

    const pallete = ApiState.value.pallete

    // Check if the overlay exists
    if (!overlay || !textContainer) {
        console.error('Overlay or text container element not found. Make sure the elements are present in the DOM.');
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
            circle.style.backgroundColor = `rgba(${color.r*255}, ${color.g*255}, ${color.b*255}, 1)`;
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

            // Update the text container with the cluster label and background color
            textContainer.style.display = 'block';
            textContainer.innerText = `${item.clusters}`; // Set the desired text
            textContainer.style.backgroundColor = pallete[item.clusters]; // Set the desired background color
        });

        circle.addEventListener('mouseleave', () => {
            const sameClusterCircles = document.querySelectorAll(
                `.circle[data-cluster="${item.clusters}"]`
            );
            sameClusterCircles.forEach((c) => c.classList.remove('hovered'));

            // Revert the text container to its default state
            textContainer.style.backgroundColor = ''; // Reset the background color
        });

        // Inside the forEach loop, after setting the hover event listeners
        circle.addEventListener('click', () => {
            // Your click handler logic here
            console.log(`Circle with cluster ${item.clusters} clicked!`);
            toggleSelectedCelltype(item.clusters);

            // Update textContainer with the click information
            textContainer.innerText = `${item.clusters}`;
            textContainer.style.backgroundColor = pallete[item.clusters];
        });

        overlay.appendChild(circle);
    });
}

// Remove the keepInBounds function as it is related to dragging functionality

document.body.appendChild(createOverlay());
