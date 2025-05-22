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

export const initSearchBar = (searchInputId, searchButtonId, listContainerId, detailsContainerId) => {
    const positionInput = document.getElementById('position-input');
    const locationInput = document.getElementById('location-input');
    const workModeSelect = document.getElementById('work-mode-select');
    const searchButton = document.getElementById(searchButtonId);

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

    const handleSearch = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const term = positionInput.value.trim().toLowerCase();
        const locationTerm = locationInput.value.trim().toLowerCase();
        const selectedMode = workModeSelect.value;

        const filteredOffers = allOffers.filter((offer) => {
            const titleMatch = offer.tittle.toLowerCase().includes(term);
            const locationMatch = offer.cityName.toLowerCase().includes(locationTerm);
            const modeMatch =
                selectedMode === "Place of Work" ||
                (selectedMode === "remoto" && offer.remote) ||
                (selectedMode === "presencial" && !offer.remote);
            return titleMatch && locationMatch && modeMatch;
        });

        setOffers(filteredOffers);
        resetPage();
        renderOfferPage(listContainerId, detailsContainerId);
    };

    // Reactive search: execute search on each input
    positionInput.addEventListener("input", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSearch();
    });
    
    locationInput.addEventListener("input", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSearch();
    });
    
    workModeSelect.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSearch();
    });

    // Also keep button functionality
    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSearch();
    });

    fetchOffers(); // Initialize on load
};