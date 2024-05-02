import './Filter.css'

export function createFilter() {
    const filter = document.createElement("div");
    filter.className = "filter";

    const cellDescDiv = document.createElement("div");
    cellDescDiv.className = "desc-container";
    const cellToggle = createButton("toggleCellCheckbox", "Celltype", "cell-desc")
    const cellDesc = createDescBox("cell-desc", "Click to filter by celltypes")

    cellDescDiv.appendChild(cellToggle);
    cellDescDiv.appendChild(cellDesc);
    filter.appendChild(cellDescDiv);

    const checkbox = createCheckboxContainer();
    filter.appendChild(checkbox);

    const geneDescDiv = document.createElement("div");
    geneDescDiv.className = "desc-container";
    const geneToggle = createButton("toggleGeneRadio", "Gene", "gene-desc")
    const geneDesc = createDescBox("gene-desc", "Click to filter by genes")

    geneDescDiv.appendChild(geneToggle)
    geneDescDiv.appendChild(geneDesc)
    filter.appendChild(geneDescDiv);

    const radio = createGeneRadioContainer();
    filter.appendChild(radio);

    const icons = createIcon();
    filter.appendChild(icons);

    return filter;
}

function createButton(id, text, target) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-target", target);

    button.classList.add("toggles", "btn");
    button.id = id;
    button.textContent = text;

    return button;
}

function createCheckboxContainer() {
    // Create main container div
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("checkbox-container");
    containerDiv.id = "cellCheckbox";
    containerDiv.style.display = "none";
    containerDiv.style.zIndex = 1000;

    // Create textbox input and clear button
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input-elements");

    const textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.classList.add("textInput");
    textBox.id = "cellTextbox";
    textBox.placeholder = "Search celltype";

    const clearButton = document.createElement("button");
    clearButton.setAttribute("type", "button");
    clearButton.classList.add("clearButton", "btn", "btn-danger");
    clearButton.id = "cellClearButton";
    clearButton.textContent = "Clear";

    inputDiv.appendChild(textBox);
    inputDiv.appendChild(clearButton);

    // Create checkboxes div
    const checkboxesDiv = document.createElement("div");
    checkboxesDiv.classList.add("checkboxes");
    checkboxesDiv.id = "cellCheckboxes";

    // Create not found message div
    const notFoundDiv = document.createElement("div");
    notFoundDiv.classList.add("notfound", "alert", "alert-danger", "alert-dismissible", "fade", "show");
    notFoundDiv.id = "cellNotFound";
    notFoundDiv.textContent = "No cell types of that name found.";

    // Append child elements to container div
    containerDiv.appendChild(inputDiv);
    containerDiv.appendChild(checkboxesDiv);
    containerDiv.appendChild(notFoundDiv);

    return containerDiv;
}

function createGeneRadioContainer() {
    // Create main container div
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("checkbox-container");
    containerDiv.id = "geneRadioContainer";
    containerDiv.style.display = "none";

    // Create textbox input and clear button
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("input-elements");

    const textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.classList.add("textInput");
    textBox.id = "geneTextbox";
    textBox.placeholder = "Search gene (only 2 can be selected)";

    const clearButton = document.createElement("button");
    clearButton.setAttribute("type", "button");
    clearButton.classList.add("clearButton", "btn", "btn-danger");
    clearButton.id = "geneClearButton";
    clearButton.textContent = "Clear";

    const modeButton = document.createElement("button");
    modeButton.setAttribute("type", "button");
    modeButton.classList.add("modeButton", "btn", "btn-success");
    modeButton.id = "modeButton";
    modeButton.textContent = "2 Genes Mode"

    inputDiv.appendChild(textBox);
    inputDiv.appendChild(clearButton);
    inputDiv.appendChild(modeButton);

    // Create checkboxes div
    const checkboxesDiv = document.createElement("div");
    checkboxesDiv.classList.add("checkboxes");
    checkboxesDiv.id = "geneRadio";

    // Create not found message div
    const notFoundDiv = document.createElement("div");
    notFoundDiv.classList.add("notfound", "alert", "alert-danger", "alert-dismissible", "fade", "show");
    notFoundDiv.id = "geneNotFound";
    notFoundDiv.textContent = "No genes of that name found.";

    // Append child elements to container div
    containerDiv.appendChild(inputDiv);
    containerDiv.appendChild(checkboxesDiv);
    containerDiv.appendChild(notFoundDiv);

    return containerDiv;
}

// Function to create and return the icon div element
function createIcon() {
    // Create icon container div
    const iconDiv = document.createElement("div");
    iconDiv.classList.add("icon");

    const pointSize = createOtherButton("togglePointSize", "pointSizeBox", "M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12ZM12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13Z", "M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z");
    const pointSizeBox = createDescBox("pointSizeBox", "Click to change dot size.");
    const pointSliderBox = createSlider("pointSizeSliderBox", "pointSizeSlider", "pointSizeSliderNumContainer", "pointSizeSliderValue", "pointSizeMinId", "pointSizeMaxId", 0.1, 15.00, 5.00);
    
    const genePercentile = createOtherButton("toggleGenePercentile", "genePercentileBox", "M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z", "M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z");
    const genePercentileBox = createDescBox("genePercentileBox", "Click to change the gene percentile.");
    const geneSliderBox = createSlider("geneSliderBox", "geneSlider", "geneSliderNumContainer", "geneSliderValue", "geneMinId", "geneMaxId", 80.00, 99.99, 99.00);

    const pointSizeContainer = document.createElement('div');
    pointSizeContainer.style.display = "flex";
    pointSizeContainer.style.flexDirection = "row";
    pointSizeContainer.style.width = "max-content"
    pointSizeContainer.style.gap = "5px"

    pointSizeContainer.appendChild(pointSize);
    pointSizeContainer.appendChild(pointSizeBox);

    iconDiv.appendChild(pointSizeContainer);
    iconDiv.appendChild(pointSliderBox);

    const genePercentileContainer = document.createElement('div');
    genePercentileContainer.style.display = "flex";
    genePercentileContainer.style.flexDirection = "row";
    genePercentileContainer.style.width = "max-content"
    genePercentileContainer.style.gap = "5px"

    genePercentileContainer.appendChild(genePercentile)
    genePercentileContainer.appendChild(genePercentileBox)

    iconDiv.appendChild(genePercentileContainer);
    iconDiv.appendChild(geneSliderBox);

    return iconDiv;
}

function createDescBox(id, content) {
    const box = document.createElement('div');
    box.classList.add("descBox")
    box.id = id;
    box.textContent = content;
    box.style.display = 'none';

    return box;
}

function createSlider(sliderContainerId, sliderId, sliderContainerId2, sliderValueId, sliderMinId, sliderMaxId, min, max, value) {

    const sliderContainer = document.createElement('div');
    sliderContainer.id = sliderContainerId;
    sliderContainer.classList.add("slider-container")
    sliderContainer.style.display = 'none';

    const slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('value', value);
    slider.setAttribute('step', 0.01);
    slider.classList.add('slider');
    slider.id = sliderId;

    const sliderContainer2 = document.createElement('div');
    sliderContainer2.id = sliderContainerId2;
    sliderContainer2.classList.add("slider-container-inner")

    const sliderMin = document.createElement('div');
    sliderMin.classList.add('slider-min-max');
    sliderMin.id = sliderMinId;
    sliderMin.innerText = "Min: " + parseFloat(min).toFixed(2);

    const sliderValue = document.createElement('input');
    sliderValue.classList.add('slider-value');
    sliderValue.id = sliderValueId;
    sliderValue.setAttribute('step', 0.01);
    sliderValue.setAttribute('type', 'text');
    sliderValue.value = parseFloat(value).toFixed(2);
    sliderValue.min = min
    sliderValue.max = max;

    const sliderMax = document.createElement('div');
    sliderMax.classList.add('slider-min-max');
    sliderMax.id = sliderMaxId;
    sliderMax.innerText = "Max: " + parseFloat(max).toFixed(2);

    sliderContainer.appendChild(slider);
    sliderContainer2.appendChild(sliderMin);
    sliderContainer2.appendChild(sliderValue);
    sliderContainer2.appendChild(sliderMax);
    sliderContainer.appendChild(sliderContainer2);

    return sliderContainer;
}

function createOtherButton(id, dataTarget, content1, content2) {
    // Create button element
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-target", dataTarget)
    button.classList.add("iconBtn", "btn");
    button.id = id;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");

    // Create first path element and set attributes
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute("clip-rule", "evenodd");
    path1.setAttribute("d", content1);
    path1.setAttribute("fill", "currentColor");

    // Create second path element and set attributes
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("clip-rule", "evenodd");
    path2.setAttribute("d", content2);
    path2.setAttribute("fill", "currentColor");

    // Append paths to SVG
    svg.appendChild(path1);
    svg.appendChild(path2);

    // Append SVG to button
    button.appendChild(svg);

    return button;
}