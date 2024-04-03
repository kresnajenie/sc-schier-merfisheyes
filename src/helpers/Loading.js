export const loading = (state) => {

    const loadingIndicator = document.getElementById('loadingIndicator')

    if (state) {
        loadingIndicator.style.display = 'flex';
    } else {
        loadingIndicator.style.display = 'none';
    }
}