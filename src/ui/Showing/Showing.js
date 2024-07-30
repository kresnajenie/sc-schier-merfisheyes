export function updateBadge(label) {
    const badge = document.querySelector('.showing-badge');

    if (!badge) {
        console.error('Badge container not found');
        return;
    }

    // Hide all labels by default
    const labels = badge.querySelectorAll('.showing-label');
    labels.forEach(label => label.style.display = 'none');

    // Show the specific label
    const span = badge.querySelector(`.showing-${label}`);
    if (span) {
        span.style.display = 'inline-block';
    } else {
        console.warn(`Unknown label: ${label}`);
    }
}
