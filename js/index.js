/**
 * Initializes the countries grid by fetching country data and rendering it to the page.
 * - Fetches data from a JSON file.
 * - Builds and displays the grid of countries.
 * - Logs an error if data fetching fails.
 */
document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.querySelector('.countries-grid');

    fetchData(jsonFilePath)
        .then((countries) => {
            buildCountriesGrid(countries, gridElement, true);
        })
        .catch((error) => {
            console.error('Error initializing grid:', error);
        });
});

/**
 * Builds a grid displaying a list of countries with their data.
 * @param {Object} countries - Array of country objects containing data.
 * @param {HTMLElement} targetElement - The HTML element where the grid will be built.
 * @param {boolean} isGrid - If true, builds a grid view; otherwise, a single country view.
 */
function buildCountriesGrid(countries, targetElement, isGrid = true) {
    targetElement.innerHTML = ''; // Clear existing content
    countries.forEach((country) => {
        const countryElement = createCountryElement(country, {isGrid});
        targetElement.appendChild(countryElement);
    });
}

/**
 * Initializes dropdown functionality for region filtering.
 * - Toggles dropdown open/close on header click.
 * - Calls the `updateGrid` function to filter and display the results.
 */
document.addEventListener('DOMContentLoaded', () => {
    const dropdownWrapper = document.querySelector('.filters .dropdown-wrapper');
    const dropdownHeader = dropdownWrapper.querySelector('.dropdown-header');
    const dropdownBody = dropdownWrapper.querySelector('.dropdown-body');

    // Toggles the dropdown open/close state
    dropdownHeader.addEventListener('click', () => {
        dropdownWrapper.classList.toggle('open'); // Toggle the "open" class
    });

    // Handles region selection and updates the grid
    dropdownBody.addEventListener('click', async ({target}) => {
        const selectedRegion = target.dataset.region; // Retrieve the selected region
        if (!selectedRegion) return; // Exit if no region selected

        await updateGrid(selectedRegion, true); // Update grid by region
        dropdownWrapper.classList.remove('open'); // Close the dropdown
    });
});


/**
 * Listens to the input of search country search box and updates the grid.
 * - Calls the `updateGrid` function to display the results.
 * @event input - Triggered whenever the user types in the search box.
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');

    // Handles search input and updates the grid
    searchInput.addEventListener('input', async (event) => {
        const originalValue = event.target.value; // The input value before filtering
        const filteredValue = originalValue.replace(/[^a-zA-Z\s]/g, ''); // Filter input to allow only English letters and spaces

        // If the value was modified (invalid characters were removed), display a toast
        if (originalValue !== filteredValue) {
            showToast('Please type in English only.'); // Display a toast notification
        }

        event.target.value = filteredValue; // Update the input with the filtered value
        const dataOfCountryInput = filteredValue.trim(); // Trim whitespace
        await updateGrid(dataOfCountryInput, false); // Update the grid based on the filtered input
    });
});

/**
 * Updates the grid based on the selected region , searched country or its prefix.
 * - Fetches country data from the JSON file.
 * - Filters countries based on the selected region or search term.
 * - Builds and displays the filtered grid.
 *
 * @param {string} filterValue - The value for filtering (region or prefix).
 * @param {boolean} isRegionFilter - True if filtering by region, false for search prefix.
 */
async function updateGrid(filterValue, isRegionFilter) {
    const gridElement = document.querySelector('.countries-grid');

    // Normalize function to handle special characters
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    try {
        // Loads all countries from the data source
        const countries = await fetchData(jsonFilePath);

        // Filters countries based on the condition
        const filteredCountries = countries.filter((country) => {
            if (isRegionFilter) {
                // Filter by region
                return filterValue === 'all' || normalize(country.region) === normalize(filterValue);
            } else {
                // Filter by prefix
                return normalize(country.name).startsWith(normalize(filterValue));
            }
        });

        // Displays the filtered countries in the grid
        buildCountriesGrid(filteredCountries, gridElement);
    } catch (error) {
        console.error('Error updating grid:', error);
    }
}





