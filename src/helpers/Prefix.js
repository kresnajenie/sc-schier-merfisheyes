import { ApiState } from "../states/ApiState";
import { changeURL } from "./URL";

/**
 * Function to load prefix options into the dropdown menu.
 */
export function loadPrefixOptions() {
    const prefixOptions = ApiState.value.prefixOptions;

    const prefixDropdown = document.querySelector('#prefix-dropdown-container .dropdown-menu');

    console.log("PREFIXXXX")
    console.log(prefixDropdown)

    for (let i = 0; i < prefixOptions.length; i++) {
        const prefixItem = document.createElement('p');
        prefixItem.innerHTML = `<a class="dropdown-item">${prefixOptions[i]}</a>`

        prefixDropdown.appendChild(prefixItem);
    }
}

/**
 * Selects a prefix from the dropdown menu and updates the URL and page reload if necessary.
 */
export function selectPrefix() {
    const dropdownMenuButton = document.getElementById("dropdownMenuButton");
    const prefixItems = document.getElementsByClassName("dropdown-item");

    for (let i = 0; i < prefixItems.length; i++) {
        
        prefixItems.item(i).addEventListener("click", () => {

            const params = new URLSearchParams(""); // clears out the params

            params.append('prefix', prefixItems.item(i).innerText);
            changeURL(params);

            if (prefixItems.item(i).innerText !== ApiState.value.prefix) {
                dropdownMenuButton.innerHTML = ApiState.value.prefix;
                window.location.reload();
            }
        })
    }
}