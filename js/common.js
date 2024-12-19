const jsonFilePath = './CountriesData.json';

/**
 * Retrieves the country name from the specified query parameter in the URL.
 * @param {string} param - The name of the query parameter containing the country name.
 * @returns {string|null} - The country name, or null if the parameter doesn't exist.
 */
function getQueryParameter(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

/**
 * Fetches and parses JSON data from a given file path.
 * @param {string} filePath - The path to the JSON file or API endpoint.
 * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
 * @throws {Error} - Throws an error if the fetch request fails or if the response is not OK.
 */
async function fetchData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        return await response.json(); // Returns the parsed JSON data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrows the error for external handling
    }
}

/**
 * Creates an HTML element representing a country.
 * This function dynamically generates an element for a country,
 * either for a grid view or a detailed view, based on the provided options.
 * @param {Object} country - The country data object containing details like name, population, region, capital, and flag URL.
 * @param {Object} [options] - Configuration object to determine the rendering mode.
 * @param {boolean} [options.isGrid=true] - Determines whether the country should be rendered in grid view (default) or detailed view.
 * @returns {HTMLElement} - The generated HTML element for the country.
 */
function createCountryElement(country, options = {isGrid: true}) {
    // Set the container element for the flag and information section
    const container = document.createElement(options.isGrid ? 'a' : 'section');

    // Assign the main class to the container based on its type
    container.className = options.isGrid ? 'country scale-effect' : 'country-details';

    // Add a link if this is a grid page
    if (options.isGrid) {
        container.href = `details.html?name=${encodeURIComponent(country.name)}`;
    }

    // Create the flag area - shared for both types
    const flagDiv = document.createElement('div');
    flagDiv.className = 'country-flag';

    // Create an image inside the flag container
    const flagImg = document.createElement('img');
    flagImg.src = country.flag;
    flagImg.alt = `${country.name} Flag`;
    flagDiv.appendChild(flagImg); // Append the image to the flag container

    // Create the information section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'country-info';

    const title = document.createElement('h1');
    title.textContent = country.name;

    const population = document.createElement('p');
    const populationLabel = document.createElement('strong');
    populationLabel.textContent = 'Population: ';
    population.appendChild(populationLabel); // Add the bold label
    population.appendChild(document.createTextNode(country.population)); // Add the population text

    const region = document.createElement('p');
    const regionLabel = document.createElement('strong');
    regionLabel.textContent = 'Region: ';
    region.appendChild(regionLabel); // Add the bold label
    region.appendChild(document.createTextNode(country.region)); // Add the region text

    const capital = document.createElement('p');
    const capitalLabel = document.createElement('strong');
    capitalLabel.textContent = 'Capital: ';
    capital.appendChild(capitalLabel); // Add the bold label
    capital.appendChild(document.createTextNode(country.capital)); // Add the capital text

    infoDiv.append(title, population, region, capital); // Append details to the information container
    container.append(flagDiv, infoDiv); // Append the flag area and information section to the main container

    return container;
}


/**
 * Handles the theme toggle functionality:
 * - Applies the saved theme (light or dark) from localStorage when the page loads.
 * - Toggles the theme between light and dark when the toggle button is clicked.
 * - Saves the user's theme preference in localStorage to persist it across pages.
 */
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.querySelector('.theme-toggle');
    const themeText = toggleButton.querySelector('.theme-text');

    // Retrieve the saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        // Apply dark theme if previously saved as dark
        body.classList.add('dark-theme');
        themeText.textContent = 'Light Mode'; // Update toggle text to reflect current theme
    } else {
        // Default to light theme
        themeText.textContent = 'Dark Mode';
    }

    // Toggle theme on button click
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-theme'); // Toggle dark theme class
        localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Save updated theme in localStorage
        themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode'; // Update toggle text
    });
});




/**
 * Creates a reusable toast element and appends it to the DOM.
 * @returns {HTMLElement} The created toast element.
 */
function createToast() {
    const toast = document.createElement('div');
    toast.id = 'toast'; // Assign a unique ID
    toast.style.position = 'fixed';
    toast.style.bottom = '10px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#444';
    toast.style.color = '#fff';
    toast.style.padding = '8px 15px';
    toast.style.borderRadius = '4px';
    toast.style.fontSize = '14px';
    toast.style.display = 'none';
    document.body.appendChild(toast);
    return toast;
}

/**
 * Displays a toast notification with the given message.
 * If the toast element doesn't exist, it is created dynamically.
 * @param {string} message - The message to display in the toast.
 */
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = createToast(); // Create the toast element if it doesn't exist
    }
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';

    // Remove the toast after 1 second
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 1000); // Duration changed to 1 second
}