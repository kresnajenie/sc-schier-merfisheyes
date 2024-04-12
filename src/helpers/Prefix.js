import { ApiState, updatePrefix } from "../states/ApiState";
import { changeURL } from "./URL";

export const selectPrefix = (prefix) => {
    const dropdownMenuButton = document.getElementById("dropdownMenuButton");

    const url = new URL(window.location);
    const params = new URLSearchParams(""); // clears out the params

    params.append('prefix', prefix);
    changeURL(params);

    if (prefix !== ApiState.value.prefix) {
        updatePrefix(prefix)
        dropdownMenuButton.innerHTML = ApiState.value.prefix;

        window.location.reload();
    }
}