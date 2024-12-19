/**
 * - Fetches and displays details for a specific country based on the URL parameter.
 * - Retrieves the country name from the URL.
 * - Fetches country data and finds the relevant country.
 * - Displays the country's details or logs an error if not found.
 * - Hides the loader after completing the process.
 */
document.addEventListener('DOMContentLoaded', () => {
    const countryDetailsSection = document.querySelector('.country-details');
    const loader = document.querySelector('.loader');
    const countryName = getQueryParameter('name');

    if (!countryName) {
        hideLoader(loader);
        return logError('No country name in URL');
    }

    fetchData(jsonFilePath)
        .then((countries) => {
            const country = findCountryByName(countries, countryName);
            if (!country) throw new Error(`Country with name "${countryName}" not found!`);

            clearElementContent(countryDetailsSection);
            countryDetailsSection.appendChild(createCountryElement(country, {isGrid: false}));
        })
        .catch((error) => logError(error.message || 'Error fetching country details'))
        .finally(() => hideLoader(loader));
});

/** Hides the loader element. */
function hideLoader(loader) {
    if (loader) loader.style.display = 'none';
}

/** Finds a country by name in a list of countries. */
function findCountryByName(countries, name) {
    return countries.find((country) => country.name === name) || null;
}

/** Clears the content of an HTML element. */
function clearElementContent(element) {
    if (element) element.innerHTML = '';
}

/** Logs an error message to the console. */
function logError(message) {
    console.error(message);
}
