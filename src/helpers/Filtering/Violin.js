import { ApiState } from "../../states/ApiState";
import { SelectedState, updateMode, updateSelectedGene, updateSelectedInterval } from "../../states/SelectedState";
import { updateSelectedAtac } from "../../states/SelectedState";

export function violinImageSearch(geneName) {
    console.log("condition is", geneName);

    const condition = geneName;

    const violinContainer = document.getElementById('violinContainer');

    const toggleViolinRadio = document.getElementById('toggleViolinRadio');

    const violinImage = document.getElementById("violin-image");

    const noViolinContainer = document.getElementById('noViolinContainer');

    const violinPlots = {
        "ackr3b_measured": "src/assets/images/C_6s_ackr3b_measured.png",
        "ctslb_imputed": "src/assets/images/C_6s_ctslb_imputed.png",
        "egr2b_imputed": "src/assets/images/C_6s_egr2b_imputed.png",
        "epha4a_imputed": "src/assets/images/C_6s_epha4a_imputed.png",
        "musk_imputed": "src/assets/images/C_6s_musk_imputed.png",
        "myod1_measured": "src/assets/images/C_6s_myod1_measured.png",
        "noto_measured": "src/assets/images/C_6s_noto_measured.png",
        "slit3_imputed": "src/assets/images/C_6s_slit3_imputed.png",
        "sox3_measured": "src/assets/images/C_6s_sox3_measured",
        "tbxta_measured": "src/assets/images/C_6s_tbxta_measured.png"
    };
    

    if (violinPlots[condition]) {
        console.log("display", condition);
        violinImage.src = violinPlots[condition];
        violinContainer.style.display = 'none';

    } else {
        violinImage.src = "";
        // violinImage.alt = "No violin plot for selected gene";
        console.error('Invalid key: No image found for this condition.');
    }
}
