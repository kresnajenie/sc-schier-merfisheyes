import { selectPrefix } from "../helpers/Prefix";
import { ApiState, updatePrefix } from "../states/ApiState";

export function createDropdown() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.id = "prefix-dropdown-container"
    dropdownContainer.style.display = "flex"
    dropdownContainer.style.justifyContent = 'flex-end';
    dropdownContainer.style.zIndex = "1000";
    
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown dropdown-center';

    dropdownContainer.appendChild(dropdownDiv);

    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'btn btn-secondary dropdown-toggle';
    dropdownButton.type = 'button';
    dropdownButton.id = 'dropdownMenuButton';
    dropdownButton.dataset.bsToggle = 'dropdown';
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = ApiState.value.prefix;

    dropdownButton.style.width = '80px'

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';

    dropdownMenu.style.minWidth = '80px';
    dropdownMenu.style.maxWidth = '80px';
    

    dropdownMenu.appendChild(createDropdownItem('#50pe', '50pe'));
    dropdownMenu.appendChild(createDropdownItem('#75pe', '75pe'));
    dropdownMenu.appendChild(createDropdownItem('#6s', '6s'));

    dropdownDiv.appendChild(dropdownButton);
    dropdownDiv.appendChild(dropdownMenu);

    return dropdownContainer;
}

function createDropdownItem(href, text) {
    const listItem = document.createElement('p');
    const link = document.createElement('a');
    link.className = 'dropdown-item';
    link.style.cursor = 'pointer';
    link.innerHTML = text;
    link.style.textAlign = 'center';

    link.onclick = () => {selectPrefix(text)};

    listItem.appendChild(link);
    return listItem;
}