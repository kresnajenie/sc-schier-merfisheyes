import { SelectedState, toggleSelectedCelltype } from "../../states/SelectedState";
import { ApiState } from "../../states/ApiState";

export function updateBadge(label) {
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
    } else {
        console.warn(`Unknown label: ${label}`);
    }
}

export function updateCelltypeBadge() {

    function createCellBadgeDelete(celltype, badge) {
        const delete_button = document.createElement("p");
        delete_button.innerText = "x";
        delete_button.className = 'celltype-delete';
        delete_button.setAttribute('celltype', celltype);
        delete_button.onclick = () => {
            console.log(SelectedState.value.selectedCelltypes);
            console.log(celltype);
            
            toggleSelectedCelltype(celltype);

            console.log(SelectedState.value.selectedCelltypes);

            // remove element
            badge.remove();

        }
        return delete_button;
    }

    function createBadge(celltype) {

        const badge = document.createElement('span');
        badge.className = 'celltype-label'
        badge.title = celltype
        badge.style.color = ApiState.value.pallete[celltype]

        const badge_text = document.createElement("p");
        badge_text.className = 'celltype-text'
        badge_text.innerText = celltype
        badge.appendChild(badge_text);

        // attach delete button
        badge.appendChild(createCellBadgeDelete(celltype, badge));
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

    const children = celltype_badges.childNodes;

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
        const colobar = document.getElementById("colorbar-wrapper");
        const positionInfo = colobar.getBoundingClientRect();
        const colobarWidth = positionInfo.width

        const distance = boolMove ? colobarWidth + 5: 0
        const width = boolMove ? 25 : 30
        celltypeBadges.style.transform = `translateX(-${distance}px)`;
        celltypeBadges.style.width = `${width}vw`;
    }

    function hideBadges(boolHide) {
        celltypeBadges.style.display = boolHide ? 'none' : 'flex';
    }

    const selectingGenes = genes.length > 0
    const selectingAtac = atac.length > 0

    console.log(selectingGenes, selectingAtac)

    moveBadges(selectingGenes)
    hideBadges(selectingAtac)    
}