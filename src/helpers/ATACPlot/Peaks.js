import { SelectedState, updateGeneGenomeHover, updateSelectedAtac, updateSelectedGene, updateSelectedInterval } from "../../states/SelectedState";
import { map, distinctUntilChanged } from 'rxjs/operators';
import { clearAtacs, updateRadioItem } from "../Filtering/Atac";
import { ApiState, updateAtacs } from "../../states/ApiState";
import { clearGenes } from "../Filtering/Gene";
import { fetchIntervalGene } from "../APIClient";


// listens for changing celltype
SelectedState.pipe(
    map(state => state.intervalsData),
    distinctUntilChanged((prev, curr) => prev.join() === curr.join())
).subscribe(async items => {
    // console.log("Dari peaks ya")
    // console.log(items)
    updateLeftText(SelectedState.value.selectedGenes[0]);
    addBoxes(items);
});

// Function to update the text in the left-text div
function updateLeftText(name) {
    const leftTextDiv = document.querySelector('.left-text');
    leftTextDiv.textContent = name;
}


// Function to add boxes to the line container
export function addBoxes(data = []) {
    const lineContainer = document.getElementById('line-container');
    const middleSpace = document.getElementById('middle-space');

    // if (middleSpace) {
    //     middleSpace.addEventListener('click', () => {
    //         middleSpace.classList.toggle('clicked');
    //     });
    // }

    if (!lineContainer || !middleSpace) {
        console.error("Required elements not found");
        return;
    }

    if (data.length === 0) {
        middleSpace.style.display = 'none';
    } else {
        middleSpace.style.display = 'grid';

        // console.log("line-container found");
        let zIndex = 1; // Initialize zIndex

        // Clear all existing elements in the line container
        lineContainer.innerHTML = '';
        let hoverTimeout;
        let clickFlag = false; // Flag to disable mouseout behavior


        data.forEach(item => {
            const atacPeak = document.createElement('div');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';

            if (item.label === "atac") { //// if atac
                if (item.enriched === 1) {
                    atacPeak.className = 'atac-peaks-enriched'; // Set the background color
                } else {
                    atacPeak.className = 'atac-peaks';
                }
                tooltip.textContent = item.interval;
                atacPeak.style.zIndex = zIndex; // Set the zIndex for each atacPeak
                zIndex++; // Increment zIndex for the next atacPeak
                atacPeak.addEventListener('mouseout', () => {
                    atacPeak.style.zIndex = 1;
                });



                atacPeak.addEventListener('mouseover', () => {
                    if (!clickFlag) { // Only trigger hover effect if clickFlag is false
                        hoverTimeout = setTimeout(() => {
                            handlePeakClick(item);
                        }, 800); // 1000 milliseconds delay
                    }
                });
                
                atacPeak.addEventListener('mouseout', () => {
                    atacPeak.style.zindex = 1;
                    if (!clickFlag) { // Only trigger mouseout effect if clickFlag is false
                        clearTimeout(hoverTimeout); // Clear the timeout if the mouse leaves before 1 second
                        if (!atacPeak.classList.contains('clicked')) {
                            handlePeakClick([]);
                        }
                    }
                });
                
                atacPeak.addEventListener('click', () => {
                    clearTimeout(hoverTimeout); // Ensure no delayed hover action occurs after a click
                
                    // Remove the 'clicked' class from any other peaks
                    const currentlyClicked = document.querySelector('.atac-peaks.clicked, .atac-peaks-enriched.clicked');
                    if (currentlyClicked && currentlyClicked !== atacPeak) {
                        currentlyClicked.classList.remove('clicked');
                        currentlyClicked.style.background = ''; // Reset the background color
                    }
                
                    // Toggle the 'clicked' class on the current peak
                    atacPeak.classList.toggle('clicked');
                
                    clickFlag = atacPeak.classList.contains('clicked'); // Update the flag based on click
                
                    if (clickFlag) {
                        handlePeakClick(item); // Ensure the click overrides the hover-out effect
                    } else {
                        handlePeakClick([]); // Revert if clicked again, and re-enable hover functionality
                    }
                });

            } else { ///// if gene

                //// check gene strand
                let isLeft = item.label[0] === "-";

                //// check if mygene or not
                let mygene = item.label.split('__')[1] === "mygene";

                // console.log(item.label);
                // console.log(item.label.split('__')[1]);
                // console.log("isleft", isLeft);
                // console.log("mygene", mygene);

                if (mygene) {
                    if (isLeft) {
                        atacPeak.className = 'gene-left';
                    } else {
                        atacPeak.className = 'gene';
                    }
                } else {
                    if (isLeft) {
                        atacPeak.className = 'gene-left-border';
                    } else {
                        atacPeak.className = 'gene-border';
                    }
                }

                let gene = item.label.split('__').pop();
                tooltip.textContent = gene;


                atacPeak.addEventListener('mouseover', () => {
                    // if (!clickFlag) { // Only trigger hover effect if clickFlag is false
                    //     hoverTimeout = setTimeout(() => {
                    //         updateGeneGenomeHover(true)
                    //         handleGeneClick(item);
                    //         console.log(SelectedState.value.selectedGenesPrev)

                    //         // let celltypes = SelectedState.value.selectedGenes
                    //         // let gene = findGene(item.label.split("__").pop());
                    //         // if (gene == null) {
                    //         //     // alert(`You clicked on: ${item.label.split("__")}`);
                    //         //     alert(`Gene ${item} was not measured`);
                    //         // } else {
                    //         //     updateSelectedAtac([]);
                    //         //     let newcell = [gene]
                    //         //     updateSelectedGene([...newcell, ...celltypes]);
                    //         // }
                    //     }, 800); // 1000 milliseconds delay
                    // }
                });


                atacPeak.addEventListener('mouseout', () => {
                    atacPeak.style.zIndex = 196;
                
                    // if (!clickFlag) { // Only trigger mouseout effect if clickFlag is false
                    //     clearTimeout(hoverTimeout); // Clear the hover timeout
                
                    //     // Add a 300ms delay before executing the mouseout logic
                    //     setTimeout(() => {
                    //         if (!atacPeak.classList.contains('clicked')) {
                    //             console.log(SelectedState.value.selectedGenesPrev);
                    //             updateSelectedGene(SelectedState.value.selectedGenesPrev);
                    //         }
                    //     }, 300); // 300 milliseconds delay
                    // }
                });
                
                // Add click event listener
                atacPeak.addEventListener('click', async () => {
                    // updateGeneGenomeHover(false)
                    // try {
                    //     const interval = await fetchIntervalGene(item);
                    //     updateSelectedInterval(interval["intervals"]);
                    // } catch (error) {
                    //     console.error('Error fetching interval gene:', error);
                    // }
                    handleGeneClick(item);
                });
            }

            atacPeak.addEventListener('mouseover', () => {
                atacPeak.style.zIndex = 1998;
            });



            atacPeak.style.left = item.start * 100 + "%";
            atacPeak.style.width = item.width * 100 + "%";

            // Append the tooltip to the atacPeak
            atacPeak.appendChild(tooltip);

            lineContainer.appendChild(atacPeak);
            // console.log(`Added box with tooltip ${item.tooltip}`);
        });
    }
}

// Function to handle click events on peaks
function handlePeakClick(item) {
    console.log('Peak clicked:', item);
    // Add your custom logic here
    // For example, you could display more information about the peak, navigate to another page, etc.
    // console.log(typeof item.interval)
    // checkRadioButtonById(item.interval)
    if (item == []) {
        // updateSelectedAtac([]);
        clearAtacs();
        return;
    }
    updateSelectedAtac([item.interval])
}

// Function to check or uncheck a radio button by id and implement the specified behavior
function checkRadioButtonById(id) {
    const radioButton = document.getElementById(id);
    if (radioButton) {
        // Check the radio button
        radioButton.checked = true;

        // Implement the specified behavior
        if (SelectedState.value.selectedAtacs.length >= SelectedState.value.mode) {
            radioButton.checked = false;
        }

        // Single gene mode
        if (SelectedState.value.mode === 1 && SelectedState.value.selectedAtacs.length === 1) {
            // Deselect the first gene selected
            const prevAtac = document.querySelector(`[value=${CSS.escape(SelectedState.value.selectedAtacs[0])}]`);

            if (prevAtac) {
                prevAtac.checked = false;
            }

            // Not in shown or not the same gene
            if (prevAtac === null || prevAtac.value !== radioButton.value) {
                updateSelectedAtac([]); // Remove prev gene
                radioButton.checked = true;
            }
        }

        // Update radio item
        updateRadioItem(id, radioButton.checked);

        // Trigger the change event to ensure any attached event listeners are executed
        const event = new Event('change');
        radioButton.dispatchEvent(event);
    } else {
        console.error(`Radio button with id ${id} not found.`);
    }
}

// Function to handle click events on peaks
function handleGeneClick(item) {
    console.log('Gene clicked:', item);
    // Add your custom logic here
    // For example, you could display more information about the peak, navigate to another page, etc.
    let gene = findGene(item.label.split("__").pop());
    if (gene == null) {
        // alert(`You clicked on: ${item.label.split("__")}`);
        alert(`Gene ${item} was not measured`);
    } else {
        updateSelectedAtac([]);
        updateSelectedGene([gene]);
    }
}

function findGene(gene) {
    // console.log(`${gene}_measured`)
    if (ApiState.value.genes.includes(`${gene}_measured`)) {
        return `${gene}_measured`
    } else if (ApiState.value.genes.includes(`${gene}_imputed`)) {
        return `${gene}_imputed`
    } else {
        return null
    }

}

export async function getInterval(gene) {
    try {
        const interval = await fetchIntervalGene(gene);
        updateSelectedInterval(interval["intervals"]);
    } catch (error) {
        console.error('Error fetching interval gene:', error);
    }
}