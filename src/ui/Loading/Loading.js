import './Loading.css'

export function createLoadingIndicator() {
    // Create the loading indicator container
    const loadingIndicatorContainer = document.createElement('div');
    loadingIndicatorContainer.id = 'loadingIndicator';

    // Create the unordered list with the specified attributes
    const ulElement = document.createElement('ul');
    ulElement.setAttribute('helix', '');

    // Create list items with their child divs and span
    for (let i = 0; i < 10; i++) {
        const liElement = document.createElement('li');
        for (let j = 0; j < 2; j++) {
            const divElement = document.createElement('div');
            liElement.appendChild(divElement);
        }
        const spanElement = document.createElement('span');
        liElement.appendChild(spanElement);
        ulElement.appendChild(liElement);
    }

    // Append the ulElement to the loading indicator container
    loadingIndicatorContainer.appendChild(ulElement);

    // Return the loading indicator container
    return loadingIndicatorContainer;
}

// To use the function and append the loading indicator to an existing element in the DOM:
const loadingIndicator = createLoadingIndicator();
document.body.appendChild(loadingIndicator); // Assuming you want to append it to the body
