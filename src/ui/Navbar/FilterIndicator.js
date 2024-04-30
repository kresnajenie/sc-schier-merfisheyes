import './FilterIndicator.css'

export function createFilterIndicator() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown', 'dropdown-center');
    dropdownContainer.id = 'filter-container';

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'dropdown-toggle');
    button.type = 'button';
    button.dataset.bsToggle = 'dropdown';
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Show Selected Filters';

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu', 'list');

    const celltypeFiltersDiv = document.createElement('div');
    const celltypeFiltersTitle = document.createElement('b');
    celltypeFiltersTitle.textContent = 'Celltype Filters: ';
    const celltypeFiltersContent = document.createElement('div');
    celltypeFiltersContent.classList.add('listFilters');
    celltypeFiltersContent.id = 'cellFilters';
    celltypeFiltersContent.textContent = 'No celltype filters selected';
    celltypeFiltersDiv.appendChild(celltypeFiltersTitle);
    celltypeFiltersDiv.appendChild(celltypeFiltersContent);

    const hr = document.createElement('hr');

    const geneFilterDiv = document.createElement('div');
    const geneFilterTitle = document.createElement('b');
    geneFilterTitle.textContent = 'Gene Filter: ';
    const geneFilterContent = document.createElement('p');
    geneFilterContent.classList.add('listFilters');
    geneFilterContent.id = 'geneFilters';
    geneFilterContent.textContent = 'No gene filters selected';
    geneFilterDiv.appendChild(geneFilterTitle);
    geneFilterDiv.appendChild(geneFilterContent);

    dropdownMenu.appendChild(celltypeFiltersDiv);
    dropdownMenu.appendChild(hr);
    dropdownMenu.appendChild(geneFilterDiv);

    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(dropdownMenu);

    return dropdownContainer;
}
