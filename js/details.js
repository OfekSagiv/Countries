/**
 * - Fetches and displays details for a specific country based on the URL parameter.
 * - Retrieves the country name from the URL.
 * - Fetches country data and finds the relevant country.
 * - Displays the country's details or logs an error if not found.
 * - Hides the loader after completing the process.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const countryDetailsSection = document.getElementById('country-details-id');
    const loader = document.querySelector('.loader');
    const countryName = getQueryParameter('name');

    if (!countryName) {
        hideLoader(loader);
        return console.error('No country name in URL');
    }

    try {
        const countries = await fetchData(jsonFilePath); // Await fetching the data
        const country = findCountryByName(countries, countryName); // Find the country
        if (!country) throw new Error(`Country with name "${countryName}" not found!`);

        clearAllChildrenFromParent(countryDetailsSection); // Clear previous content
        countryDetailsSection.appendChild(createCountryElement(country, { isGrid: false })); // Append new content
    } catch (error) {
        console.error('Error fetching country details:', error); // Handle errors
    } finally {
        hideLoader(loader); // Always hide the loader
    }
});

/** Hides the loader element. */
function hideLoader(loader) {
    if (loader) loader.style.display = 'none';
}

/** Finds a country by name in a list of countries. */
function findCountryByName(countries, name) {
    return countries.find((country) => country.name === name);
}

