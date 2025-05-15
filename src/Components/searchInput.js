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
    const positionInput = document.getElementById('position-input');
    const locationInput = document.getElementById('location-input');
    const workModeSelect = document.getElementById('work-mode-select'); // <-- NUEVO
    const searchButton = document.getElementById(searchButtonId);
    const listContainer = document.getElementById(listContainerId);

    let offers = [];

    const fetchOffers = async () => {
        try {
            const data = await getAllOffers();
            offers = await addCityNamesToOffers(data); // Agregar nombres de ciudad
            updateOfferList(offers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const addCityNamesToOffers = async (offers) => {
        const updatedOffers = [];
        for (const offer of offers) {
            const cityName = await fetchCityName(offer.idCity);
            updatedOffers.push({ ...offer, cityName });
        }
        return updatedOffers;
    };

    fetchOffers();

    const updateOfferList = async (filteredOffers) => {
        listContainer.innerHTML = '';

        if (filteredOffers.length === 0) {
            listContainer.innerHTML = '<p class="text-gray-500 text-center w-full">No job offers found.</p>';
            return;
        }

        for (const offer of filteredOffers) {
            const workMode = offer.remote ? "Remote" : "On-Site";
            const offerCard = document.createElement('div');
            offerCard.className = 'bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer';
            offerCard.innerHTML = `
                <h2 class="text-lg font-semibold mb-1">${offer.tittle}</h2>
                <p class="text-sm text-gray-600 mb-1">Zone: ${offer.cityName} - ${workMode}</p>
                <p class="text-sm text-gray-600">Technologies: ${offer.technologyDto.map(tech => tech.name).join(', ')}</p>
            `;
            offerCard.addEventListener('click', () => {
                const detailsContainer = document.getElementById(detailsContainerId);
                renderOfferDetails(offer, detailsContainer);
            });

            listContainer.appendChild(offerCard);
        }
    };

    const handleSearch = async () => {
    const term = positionInput.value.trim().toLowerCase();
    const locationTerm = locationInput.value.trim().toLowerCase();
    const selectedMode = workModeSelect.value; // "remoto", "presencial" o "Place of Work" (por defecto)

    const filteredOffers = offers.filter((offer) => {
        const title = offer.tittle?.toLowerCase() || '';
        const techs = offer.technologyDto?.map(t => t.name.toLowerCase()) || [];
        const city = offer.cityName?.toLowerCase() || '';
        const isRemote = offer.remote;

        const matchTitleOrTech =
            term === '' ||
            title.includes(term) ||
            techs.some(t => t.includes(term));

        const matchLocation =
            locationTerm === '' ||
            city.includes(locationTerm);

        const matchMode =
            selectedMode === 'Place of Work' ||
            (selectedMode === 'remoto' && isRemote) ||
            (selectedMode === 'presencial' && !isRemote);

        return matchTitleOrTech && matchLocation && matchMode;
    });

    await updateOfferList(filteredOffers);
};

    positionInput.addEventListener('input', handleSearch);
    locationInput.addEventListener('input', handleSearch);
    workModeSelect.addEventListener('change', handleSearch); // NUEVO
    searchButton.addEventListener('click', handleSearch);
};

// Función para mostrar detalles de una oferta
async function renderOfferDetails(offer, container) {
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-Site";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow flex flex-col h-full">
            <h2 class="text-2xl font-bold mb-2">${offer.tittle}</h2>
            <p class="mb-1"><strong>Zone:</strong> ${cityName}</p>
            <p class="mb-1"><strong>Mode:</strong> ${workMode}</p>
            <p class="mb-1"><strong>Publication Date:</strong> ${postedDate}</p>
            <p class="mb-1"><strong>Technologies:</strong> ${technologies}</p>
            <p class="mt-4 whitespace-pre-line">${offer.description}</p>

            <div class="mt-auto flex flex-col items-center border-t border-gray-200 py-4">
                <hr class="w-[450px] border-black mb-4" />
                <button onclick="window.print()" class="flex items-center text-black font-medium space-x-2">
                    <i class="fa-solid fa-print text-lg"></i>
                    <span>Print</span>
                </button>
            </div>
        </div>
    `;
}
