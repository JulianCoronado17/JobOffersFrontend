import { getAllOffers, getCityWithID } from '../service/offersService.js';

let currentPage = 1;
const offersPerPage = 4;
let offersGlobal = [];

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

const renderPagination = (totalPages, listContainerId, detailsContainerId) => {
    if (totalPages <= 1) return document.createElement("div");

    const paginationContainer = document.createElement("div");
    paginationContainer.className = "flex justify-center mt-auto pt-4 gap-2";

    const createButton = (content, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.innerHTML = content;
        btn.disabled = isDisabled;
        btn.className = `
            w-10 h-10 flex items-center justify-center border border-blue-500 
            rounded-none font-semibold
            ${isActive ? "bg-blue-500 !text-white" : "bg-white text-blue-500 hover:bg-blue-100"}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            transition
        `;
        if (!isDisabled) {
            btn.addEventListener("click", () => {
                currentPage = page;
                renderOfferPage(listContainerId, detailsContainerId);
            });
        }
        return btn;
    };

    paginationContainer.appendChild(
        createButton(`<i class="fas fa-arrow-left"></i>`, currentPage - 1, false, currentPage === 1)
    );

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(
            createButton(`${i}`, i, currentPage === i)
        );
    }

    paginationContainer.appendChild(
        createButton(`<i class="fas fa-arrow-right"></i>`, currentPage + 1, false, currentPage === totalPages)
    );

    return paginationContainer;
};

export const renderOfferPage = async (listContainerId, detailsContainerId) => {
    try {
        if (offersGlobal.length === 0) {
            offersGlobal = await getAllOffers();
        }

        const listContainer = document.getElementById(listContainerId);
        const innerContainer = listContainer.querySelector("#offers-inner");
        const paginationWrapper = listContainer.querySelector("#pagination-wrapper");

        innerContainer.innerHTML = "";
        paginationWrapper.innerHTML = "";

        const detailsContainer = document.getElementById(detailsContainerId);
        detailsContainer.innerHTML = '<p class="text-gray-500">Select a offer to see more details.</p>';

        const start = (currentPage - 1) * offersPerPage;
        const end = start + offersPerPage;
        const offersToShow = offersGlobal.slice(start, end);

        if (offersToShow.length === 0) {
            innerContainer.innerHTML = `
                <div class="text-center text-gray-400 py-20 w-full text-sm">
                    <i class="fas fa-search fa-2x mb-2 block mx-auto"></i>
                    <p class="text-center">No job offers found</p>
                </div>
            `;
            return;
        }

        for (const offer of offersToShow) {
            const cityName = await fetchCityName(offer.idCity);
            const workMode = offer.remote ? "Remote" : "On-Site";

            const button = document.createElement('button');
            button.className = "w-full max-w-full min-w-[350px] text-left bg-white border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition";
            button.dataset.id = offer.id;

            button.innerHTML = `
                <h2 class="text-lg font-semibold">${offer.tittle}</h2>
                <p class="text-sm text-gray-600">Zone: ${cityName}</p>
                <p class="text-sm text-gray-500">${workMode}</p>
            `;

            button.addEventListener('click', () => {
                renderOfferDetails(offer, detailsContainer);
            });

            innerContainer.appendChild(button);
        }

        const totalPages = Math.ceil(offersGlobal.length / offersPerPage);
        paginationWrapper.appendChild(renderPagination(totalPages, listContainerId, detailsContainerId));
    } catch (error) {
        console.error("Error loading job offers:", error);
        document.getElementById(listContainerId).innerHTML = 
            '<p class="text-red-500">Error loading offers, please try again.</p>';
    }
};

async function renderOfferDetails(offer, container) {
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-site";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow flex flex-col h-full">
            <h2 class="text-2xl font-bold mb-2">${offer.tittle}</h2>
            <p class="mb-1"><strong>Zone:</strong> ${cityName}</p>
            <p class="mb-1"><strong>Modality:</strong> ${workMode}</p>
            <p class="mb-1"><strong>Publication Date:</strong> ${postedDate}</p>
            <p class="mb-1"><strong>Technologies:</strong> ${technologies}</p>
            <p class="mt-4 whitespace-pre-line">${offer.description}</p>
        </div>
    `;
}

export const setOffers = (newOffers) => {
    offersGlobal = newOffers;
};

export const resetPage = () => {
    currentPage = 1;
};
