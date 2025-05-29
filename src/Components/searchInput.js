import { getAllOffers, getCityWithID } from '../service/offersService.js';
import { renderOfferPage, setOffers, resetPage } from './offers.js';

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

// Utilidad para seleccionar el input visible entre móvil y desktop
const getVisibleInput = (desktopId, mobileId) => {
    const desktopInput = document.getElementById(desktopId);
    const mobileInput = document.getElementById(mobileId);

    const isMobile = window.innerWidth <= 767;
    return isMobile ? mobileInput : desktopInput;
};


export const initSearchBar = (listContainerId, detailsContainerId) => {
    const positionInput = getVisibleInput('position-input-desktop', 'position-input-mobile');
    const locationInput = getVisibleInput('location-input-desktop', 'location-input-mobile');
    const workModeSelects = document.querySelectorAll('.work-mode-select');
    const searchButton = document.getElementById('search-button');

    let allOffers = [];

    const fetchOffers = async () => {
        try {
            const data = await getAllOffers();
            allOffers = await addCityNamesToOffers(data);
            setOffers(allOffers);
            resetPage();
            renderOfferPage(listContainerId, detailsContainerId);
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

    const handleSearch = () => {
        const term = positionInput.value.trim().toLowerCase();
        const locationTerm = locationInput.value.trim().toLowerCase();

        let selectedMode = "Place of Work";
        workModeSelects.forEach(select => {
            if (select.offsetParent !== null) {
                selectedMode = select.value;
            }
        });

        const filteredOffers = allOffers.filter((offer) => {
            const titleMatch = offer.tittle.toLowerCase().includes(term);
            const locationMatch = offer.cityName.toLowerCase().includes(locationTerm);
            const modeMatch =
                selectedMode === "Place of Work" ||
                (selectedMode === "remoto" && offer.remote) ||
                (selectedMode === "presencial" && !offer.remote);
            return titleMatch && locationMatch && modeMatch;
        });

        const innerContainer = document.querySelector("#offers-inner");
        const paginationWrapper = document.querySelector("#pagination-wrapper");

        innerContainer.innerHTML = "";
        paginationWrapper.innerHTML = "";

        if (filteredOffers.length === 0) {
            innerContainer.innerHTML = `
                <div class="text-center text-gray-400 py-20 w-full text-sm">
                    <i class="fas fa-search fa-2x mb-2 block mx-auto"></i>
                    <p class="text-center">No job offers found</p>
                </div>
            `;
            return;
        }

        setOffers(filteredOffers);
        resetPage();
        renderOfferPage(listContainerId, detailsContainerId);
    };

    positionInput.addEventListener("input", handleSearch);
    locationInput.addEventListener("input", handleSearch);
    workModeSelects.forEach(select => select.addEventListener("change", handleSearch));
    if (searchButton) searchButton.addEventListener("click", handleSearch);

    fetchOffers(); // Cargar las ofertas al inicio
};
