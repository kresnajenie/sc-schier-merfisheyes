import { selectPrefix } from "../helpers/Prefix";
import { ApiState, updatePrefix } from "../states/GlobalState";

export function createDropdown() {
    const dropdownLi = document.createElement('li');
    dropdownLi.className = 'nav-item';

    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown';

    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'btn btn-secondary dropdown-toggle';
    dropdownButton.type = 'button';
    dropdownButton.id = 'dropdownMenuButton';
    dropdownButton.dataset.bsToggle = 'dropdown';
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = ApiState.value.prefix;

    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');

    dropdownMenu.appendChild(createDropdownItem('#50pe', '50pe'));
    dropdownMenu.appendChild(createDropdownItem('#75pe', '75pe'));

    dropdownDiv.appendChild(dropdownButton);
    dropdownDiv.appendChild(dropdownMenu);
    dropdownLi.appendChild(dropdownDiv);

    return dropdownLi;
}

function createDropdownItem(href, text) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'dropdown-item';
    link.href = href;
    link.innerHTML = text;

    link.onclick = () => {selectPrefix(text)};

    listItem.appendChild(link);
    return listItem;
}