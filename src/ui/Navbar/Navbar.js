import './Navbar.css';

import { createDropdown } from "../Dropdown";
import { createFilterIndicator } from './FilterIndicator';

export function createNavbar() {
    const navContainer = document.createElement('nav');
    navContainer.className = 'sidenav navbar navbar-expand-lg navbar-dark bg-dark';
    navContainer.setAttribute('data-mdb-sidenav-init', '');
    navContainer.setAttribute('data-mdb-right', 'true');

    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid nav-container';

    containerFluid.appendChild(createTitle());

    containerFluid.appendChild(createFilterIndicator());

    containerFluid.appendChild(createDropdown())

    navContainer.appendChild(containerFluid);

    return navContainer;
}

function createTitle() {
    const titleDiv = document.createElement('div');
    titleDiv.id = 'title';

    const titleLink = document.createElement('a');
    titleLink.className = 'navbar-brand';
    titleLink.href = '/#';
    titleLink.innerHTML = '<b>FISHEYES</b>';

    const titleParagraph = document.createElement('div');
    titleParagraph.className = 'title-paragraph';
    titleParagraph.innerHTML = '<p>by <i>Bintu Lab</i>, </p><p>data by <i>Schier Lab</i></p>';

    titleDiv.appendChild(titleLink);
    titleDiv.appendChild(titleParagraph);

    return titleDiv;
}

