import { ApiState, updatePrefix } from "../states/GlobalState";

export const selectPrefix = (prefix) => {

    const dropdownMenuButton = document.getElementById("dropdownMenuButton");

    updatePrefix(prefix)

    dropdownMenuButton.innerHTML = ApiState.value.prefix;
}