import './Navbar.css';

export function createNavbar() {
    // Create a navbar container
    const navbar = document.createElement('nav');
    navbar.id = 'main-navbar';
    navbar.className = 'navbar';

    // Add content to the navbar
    const homeLink = document.createElement('a');
    homeLink.href = '#';
    homeLink.textContent = 'Home';
    navbar.appendChild(homeLink);

    // Add more links or content as needed...

    return navbar;
}
