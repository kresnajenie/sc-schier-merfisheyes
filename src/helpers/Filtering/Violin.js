import { ApiState } from "../../states/ApiState";
import { SelectedState, updateMode, updateSelectedGene, updateSelectedInterval } from "../../states/SelectedState";
import { updateSelectedAtac } from "../../states/SelectedState";


export function violinImageSearch(geneName) {

    function rotateImage() {
        // Get the image element by its ID
        const image = document.getElementById('violinImage');
        // Increase the rotation angle by 90 degrees each time
        let rotationAngle = 90; 
        // Apply the rotation using CSS transform property
        image.style.transform = `rotate(${rotationAngle}deg)`;
    }

    console.log("condition is", geneName);

    const condition = geneName;
    
    const violinContainer = document.getElementById('violinContainer');

<<<<<<< HEAD
    // const toggleViolinRadio = document.getElementById('toggleViolinRadio');
=======
    const toggleViolinRadio = document.getElementById('toggleViolinRadio');

    const violinImage = document.getElementById("violin-image");

    const noViolinContainer = document.getElementById('noViolinContainer');

    const violinPlots = {
        "ackr3b_measured": "src/assets/images/A_50p_ackr3b_measured.jpeg",
        "ctslb_imputed": "src/assets/images/B_75p_ctslb_imputed.jpeg",
        "egr2b_imputed": "src/assets/images/C_6s_egr2b_imputed.png",
        "epha4a_imputed": "src/assets/images/C_6s_epha4a_imputed.png",
        "musk_imputed": "src/assets/images/C_6s_musk_imputed.png",
        "myod1_measured": "src/assets/images/C_6s_myod1_measured.png",
        "noto_measured": "src/assets/images/C_6s_noto_measured.png",
        "slit3_imputed": "src/assets/images/C_6s_slit3_imputed.png",
        "sox3_measured": "src/assets/images/C_6s_sox3_measured",
        "tbxta_measured": "src/assets/images/C_6s_tbxta_measured.png"
    };
>>>>>>> 8fa20966322dc3688d8f7f96fd3114e5285f3305
    
    // const violinImage = document.getElementById("violin-image");
    
    const noViolinContainer = document.getElementById('noViolinContainer');
    
    if (geneName !== undefined) {
        const dropdownMenuButton = document.getElementById("dropdownMenuButton");
        const prefix = dropdownMenuButton.innerText;
        console.log(prefix);
    
        
    
        // link ex:
    
        // https://violinplots.s3.us-west-2.amazonaws.com/C_6s_violin_plot/C_6s_ACOT12_imputed.jpeg
        // https://violinplots.s3.us-west-2.amazonaws.com/B_75p_violin_plot/B_75p_ACVR1C_imputed.jpeg
        // https://violinplots.s3.us-west-2.amazonaws.com/A_50p_violin_plot/A_50p_ACOT12_imputed.jpeg
    
    
        const originalLink = "https://violinplots.s3.us-west-2.amazonaws.com/";
        let setLink = "";

        // let originalString = geneName;
        // let index = originalString.indexOf("_");

        // let resultString = "";

        // if (index !== -1) {
        //     let beforeUnderscore = originalString.slice(0, index).toUpperCase();
        //     let afterUnderscore = originalString.slice(index);
        //     resultString = beforeUnderscore + afterUnderscore;
        // } else {
        //     resultString = originalString.toUpperCase();
        // }

        // console.log(resultString);
    
        if (prefix == "6s") {
            setLink = originalLink + "C_6s_violin_plot/C_6s_" + geneName + ".jpeg";
        } else if (prefix == "75pe") {
            setLink = originalLink + "B_75p_violin_plot/B_75p_" + geneName + ".jpeg";
        } else {
            setLink = originalLink + "A_50p_violin_plot/A_50p_" + geneName + ".jpeg";
        }

        console.log(setLink);
    
        // const violinPlots = {
        //     "ackr3b_measured": "src/assets/images/C_6s_ackr3b_measured.png",
        //     "ctslb_imputed": "src/assets/images/C_6s_ctslb_imputed.png",
        //     "egr2b_imputed": "src/assets/images/C_6s_egr2b_imputed.png",
        //     "epha4a_imputed": "src/assets/images/C_6s_epha4a_imputed.png",
        //     "musk_imputed": "src/assets/images/C_6s_musk_imputed.png",
        //     "myod1_measured": "src/assets/images/C_6s_myod1_measured.png",
        //     "noto_measured": "src/assets/images/C_6s_noto_measured.png",
        //     "slit3_imputed": "src/assets/images/C_6s_slit3_imputed.png",
        //     "sox3_measured": "src/assets/images/C_6s_sox3_measured",
        //     "tbxta_measured": "src/assets/images/C_6s_tbxta_measured.png"
        // };
        
        // violinImage.src = setLink;
        // violinContainer.style.display = 'none';
        
        
        // violinContainer.style.maxWidth = setLink.naturalHeight;
        // violinContainer.style.maxHeight = setLink.naturalWidth;

        // let rotationAngle = 90; 
        // violinImage.style.transform = `rotate(${rotationAngle}deg)`;


        const canvas = document.getElementById('violin-canvas');
        const ctx = canvas.getContext('2d');
        const violinImage = new Image();
        violinImage.id = "violin-image";
        violinImage.class = "violin-image";
        violinImage.src = setLink; 
        violinImage.crossOrigin = 'anonymous';

        violinImage.onload = function () {
            const violinImageWidth = violinImage.width;
            const violinImageHeight = violinImage.height;
    
            // Set the canvas size to fit the rotated image
            canvas.width = violinImageHeight;
            canvas.height = violinImageWidth;
    
            // Move the origin to the center of the canvas
            ctx.translate(canvas.width / 2, canvas.height / 2);
    
            // Rotate the canvas by 90 degrees (clockwise)
            ctx.rotate(90 * Math.PI / 180); // Convert degrees to radians
    
            // Draw the image on the rotated canvas
            ctx.drawImage(violinImage, -violinImageWidth / 2, -violinImageHeight / 2);
        };

    
        // if (violinPlots[condition]) {
        //     console.log("display", condition);
        //     violinImage.src = violinPlots[condition];
        //     violinContainer.style.display = 'none';
    
        // } else {
        //     violinImage.src = "";
        //     // violinImage.alt = "No violin plot for selected gene";
        //     console.error('Invalid key: No image found for this condition.');
        // }
    } else {
        // violinImage.src = "";
        // violinImage.alt = "No violin plot for selected gene";
        console.error('Invalid key: No image found for this condition.');
        violinContainer.style.display = 'none';
        noViolinContainer.style.display = 'none';
    }


}

