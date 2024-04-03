import { ApiState, updatePrefix } from "../states/ApiState";

export const selectPrefix = (prefix) => {

    const dropdownMenuButton = document.getElementById("dropdownMenuButton");

    updatePrefix(prefix)

    dropdownMenuButton.innerHTML = ApiState.value.prefix;
}