import { ApiState } from "../states/ApiState";
import { changeURL } from "./URL";

// window.addEventListener('DOMContentLoaded', selectPrefix);

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