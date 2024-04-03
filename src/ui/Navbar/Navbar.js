import './Navbar.css';

import { createDropdown } from "../Dropdown";
import { createFilterIndicator } from './FilterIndicator';

export function createNavbar() {
    const navContainer = document.createElement('nav');
    navContainer.className = 'navbar navbar-expand-lg navbar-dark bg-dark';

    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid nav-container';


    containerFluid.appendChild(createTitle());

    containerFluid.appendChild(createFilterIndicator());

    containerFluid.appendChild(createCollapseDiv());

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

    const titleParagraph = document.createElement('p');
    titleParagraph.innerHTML = 'by <i>Bintu Lab</i>, data by <i>Schier Lab</i>';

    titleDiv.appendChild(titleLink);
    titleDiv.appendChild(titleParagraph);

    return titleDiv;
}

function createCollapseDiv() {
    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'collapse navbar-collapse';
    collapseDiv.id = 'navbarNav';

    const ulList = document.createElement('ul');
    ulList.className = 'navbar-nav ml-auto';

    ulList.appendChild(createDropdown());
    ulList.appendChild(createUploadItem());
    ulList.appendChild(createLoginItem());

    collapseDiv.appendChild(ulList);

    return collapseDiv;
}

function createUploadItem() {
    const uploadLi = document.createElement('li');
    uploadLi.className = 'nav-item';

    const uploadLink = document.createElement('a');
    uploadLink.className = 'nav-link active';
    uploadLink.href = '#';
    uploadLink.innerHTML = 'Upload';

    uploadLi.appendChild(uploadLink);

    return uploadLi;
}

function createLoginItem() {
    const loginLi = document.createElement('li');
    loginLi.className = 'nav-item';

    const loginLink = document.createElement('a');
    loginLink.className = 'nav-link';
    loginLink.id = 'loginPageButton';
    loginLink.href = 'login';
    loginLink.innerHTML = 'Login';

    loginLi.appendChild(loginLink);

    return loginLi;
}
