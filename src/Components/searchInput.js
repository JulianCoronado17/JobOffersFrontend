import { getAllOffers, getCityWithID } from '../service/offersService.js';

const fetchCityName = async (cityId) => {
    if (!cityId) return "N/A";
    try {
        const cityData = await getCityWithID(cityId);
        return cityData.name || "N/A";
    } catch (error) {
        console.error('Error fetching city name:', error);
        return "N/A";
    }
};

export const initSearchBar = (searchInputId, searchButtonId, listContainerId, detailsContainerId) => {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);

    // Create the container for suggestions
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestions-container';
    suggestionsContainer.className = 'absolute left-0 top-full bg-white rounded-xl shadow-lg mt-2 w-full max-h-60 overflow-y-auto z-30';
    searchInput.parentNode.parentNode.appendChild(suggestionsContainer);

    let offers = [];

    // Fetch all offers when the search bar initializes
    const fetchOffers = async () => {
        try {
            const data = await getAllOffers();
            offers = data;
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    fetchOffers();

    const handleSearch = async () => {
        const searchTerm = searchInput.value.trim();
        suggestionsContainer.innerHTML = '';

        if (!searchTerm) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        // Filter offers based on title and technologies
        const lowerCaseTerm = searchTerm.toLowerCase();
        const filteredOffers = offers.filter(offer => {
            const titleMatch = offer.tittle.toLowerCase().includes(lowerCaseTerm);
            const techMatch = offer.technologyDto.some(tech =>
                tech.name.toLowerCase().includes(lowerCaseTerm)
            );
            return titleMatch || techMatch;
        });

        // Display suggestions
        if (filteredOffers.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'p-2 text-gray-500';
            noResults.textContent = 'No se encontraron resultados.';
            suggestionsContainer.appendChild(noResults);
            suggestionsContainer.style.display = 'block';
            return;
        }

        for (const offer of filteredOffers) {
            const cityName = await fetchCityName(offer.idCity);
            const workMode = offer.remote ? "Remoto" : "Presencial";
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'p-2 hover:bg-gray-100 cursor-pointer';
            suggestionItem.innerHTML = `
                <h2 class="text-sm font-semibold">${offer.tittle}</h2>
                <p class="text-xs text-gray-600">Zona: ${cityName} - ${workMode}</p>
                <p class="text-xs text-gray-600">Technologies: ${offer.technologyDto.map(tech => tech.name).join(', ')}</p>
            `;

            suggestionItem.addEventListener('click', () => {
                const detailsContainer = document.getElementById(detailsContainerId);
                renderOfferDetails(offer, detailsContainer); // Use existing renderOfferDetails function
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                searchInput.value = offer.tittle;
            });

            suggestionsContainer.appendChild(suggestionItem);
        }

        suggestionsContainer.style.display = 'block';
    };

    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value) handleSearch();
    });

    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    });

    // Optional: Trigger search on button click
    searchButton.addEventListener('click', handleSearch);
};

// Function to dynamically import and call renderOfferDetails (copied from offers.js)
async function renderOfferDetails(offer, container) {
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remoto" : "Presencial";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow flex flex-col h-full">
            <h2 class="text-2xl font-bold mb-2">${offer.tittle}</h2>
            <p class="mb-1"><strong>Zona:</strong> ${cityName}</p>
            <p class="mb-1"><strong>Modalidad:</strong> ${workMode}</p>
            <p class="mb-1"><strong>Fecha publicación:</strong> ${postedDate}</p>
            <p class="mb-1"><strong>Tecnologías:</strong> ${technologies}</p>
            <p class="mt-4 whitespace-pre-line">${offer.description}</p>

            <div class="mt-auto flex flex-col items-center border-t border-gray-200 py-4">
                <hr class="w-[450px] border-black mb-4" />
                <button onclick="window.print()" class="flex items-center text-black font-medium space-x-2">
                    <i data-lucide="printer" class="w-5 h-5"></i>
                    <span>Imprimir</span>
                </button>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}