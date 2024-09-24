import { SelectedState, toggleSelectedCelltype, updateSelectedAtac, updateSelectedGene, updateSelectedSingleGene } from "../../states/SelectedState";
import { ApiState } from "../../states/ApiState";

function createBadgeDelete(value_type, value, badge) {
    const delete_button = document.createElement("p");
    delete_button.innerText = "x";
    delete_button.className = 'delete';
    delete_button.setAttribute('data-badge_value', value);
    delete_button.onclick = () => {      
        if (value_type === 'celltype') {  
            toggleSelectedCelltype(value);
        } else if (value_type === 'gene') {
            const genes = [...SelectedState.value.selectedGenes]
            genes.splice(genes.indexOf(value), 1)
            updateSelectedGene(genes)
        } else if(value_type === 'atac') {
            const atacs = [...SelectedState.value.selectedAtacs]
            atacs.splice(atacs.indexOf(value), 1)
            updateSelectedAtac(atacs)
        }

        // remove element
        badge.remove();
    }

    badge.onmouseover = () => {
        delete_button.style.display = 'block';
    }
    badge.onmouseleave =() => {
        delete_button.style.display = 'none';

    }

    return delete_button;
}

export function updateBadge(label, gene_atac_value="") {
    const badge = document.querySelector('.showing-badge');

    if (!badge) {
        console.error('Badge container not found');
        return;
    }

    // Hide all labels by default
    const labels = badge.querySelectorAll('.showing-label');
    labels.forEach(label => label.style.display = 'none');

    // Show the specific label
    const span = badge.querySelector(`.showing-${label}`);
    if (span) {
        span.style.display = 'inline-block';

        // Show gene atac select badge if in gene atac mode
        if (label === 'gene' || label === 'atac') {
            gene_atac_value.forEach((select_value, index) => {
                const gene_atac_badge = document.createElement('span');
                gene_atac_badge.className = 'showing-label gene-atac-badge';
                gene_atac_badge.innerText = select_value;
                gene_atac_badge.title = select_value;

                // Set background color based on index
                gene_atac_badge.style.backgroundColor = index % 2 === 0 ? 'rgb(0, 200, 0)' : 'rgb(255, 0, 255)';

                const delete_button = createBadgeDelete(label, select_value, gene_atac_badge);
                gene_atac_badge.appendChild(delete_button);

                badge.appendChild(gene_atac_badge);
            });
        }

    } else {
        console.warn(`Unknown label: ${label}`);
    }
}

export function updateCelltypeBadge() {

    function createBadge(celltype) {

        const badge = document.createElement('span');
        badge.className = 'celltype-label'
        badge.title = celltype
        // badge.style.color = ApiState.value.pallete[celltype]
        badge.style.backgroundColor = ApiState.value.pallete[celltype]

        const badge_text = document.createElement("p");
        badge_text.className = 'celltype-text'
        badge_text.innerText = celltype
        badge.appendChild(badge_text);

        // attach delete button
        badge.appendChild(createBadgeDelete("celltype", celltype, badge));
        return badge
    }

    const celltype_badges = document.querySelector(".celltype-badges");
    const celltypes = SelectedState.value.selectedCelltypes;

    const created_badges = document.querySelectorAll('.celltype-label')
    const created_celltypes = [].map.call(created_badges, (created_badge) => created_badge.title);

    celltypes.forEach(celltype => {
        // Hasn't been created before
        if (!created_celltypes.includes(celltype)) {
            const badge = createBadge(celltype);
            celltype_badges.appendChild(badge);
        }
    })

    // Create static array for children
    const children = Array.from(celltype_badges.childNodes);

    // For all badges that aren't in celltype, delete them
    children.forEach(child => {
        if (!celltypes.includes(child.title)) {
            child.remove();
        }
    })
}


export function updateCelltypeBadgeApperance() {
    const celltypeBadges = document.querySelector(".celltype-badges")
    
    const genes = SelectedState.value.selectedGenes
    const atac = SelectedState.value.selectedAtacs

    function moveBadges(boolMove) {
        const colorbarWrappers = ["colorbar-wrapper", "colorbar-wrapper2", "colorbar-wrapper3"];
        let maxWidth = 0;
    
        // Loop through each colorbar wrapper
        colorbarWrappers.forEach((wrapperId) => {
            const colobar = document.getElementById(wrapperId);
            if (colobar) {
                const positionInfo = colobar.getBoundingClientRect();
                const colobarWidth = positionInfo.width;
                
                // Calculate the maximum width among all colorbars
                maxWidth = Math.max(maxWidth, colobarWidth);
            }
        });
    
        // Calculate distance and width based on the maximum width
        const distance = boolMove ? maxWidth + 5 : 0;
        const width = boolMove ? 25 : 30;
    
        // Apply transformations to celltypeBadges
        celltypeBadges.style.transform = `translateX(-${distance}px)`;
        celltypeBadges.style.width = `${width}vw`;
    }

    function hideBadges(boolHide) {
        celltypeBadges.style.display = boolHide ? 'none' : 'flex';
    }

    const selectingGenes = genes.length > 0
    const selectingAtac = atac.length > 0

    // console.log(selectingGenes, selectingAtac)

    moveBadges(selectingGenes)
    hideBadges(selectingAtac)    
}