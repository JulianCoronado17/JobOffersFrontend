
import { getAllOffers, getCityWithID } from '../service/offersService.js';
import { downloadOfferAsPDF } from './generatePDF.js';

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
    paginationContainer.className = "flex justify-center mt-auto pt-4 gap-2 animate-fade-in";

    const createButton = (content, page, isActive = false, isDisabled = false) => {
        const btn = document.createElement("button");
        btn.innerHTML = content;
        btn.disabled = isDisabled;
        btn.className = `
            pagination-font w-10 h-10 flex items-center justify-center border border-blue-500 
            rounded-none text-[12px] font-normaltransition duration-300 ease-in-out transform
            ${isActive ? "bg-blue-500 !text-white scale-100" : "bg-white text-blue-500 hover:bg-blue-100 hover:scale-105 hover:shadow-md"}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
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
        if (!listContainer) {
            console.error(`No se encontró el elemento con id "${listContainerId}"`);
            return;
        }

        const innerContainer = listContainer.querySelector("#offers-inner");
        const paginationWrapper = listContainer.querySelector("#pagination-wrapper");

        if (!innerContainer || !paginationWrapper) {
            console.error(`No se encontraron los contenedores internos: #offers-inner o #pagination-wrapper`);
            return;
        }

        innerContainer.innerHTML = "";
        paginationWrapper.innerHTML = "";

        const detailsContainer = document.getElementById(detailsContainerId);
        if (detailsContainer && !detailsContainer.querySelector('.job-details-card') && !detailsContainer.querySelector('#offer-placeholder')) {
            detailsContainer.innerHTML = `
                <div id="offer-placeholder" class="text-center text-gray-400 py-20 w-full text-sm flex flex-col items-center justify-center h-full">
                    <i class="fas fa-clipboard-list fa-2x mb-2 block"></i>
                    <p class="text-center text-gray-500 text-base">Select a job offer to view details</p>
                </div>
            `;
        }

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
            button.className = "w-full max-w-full min-w-[350px] text-left bg-white border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition job-card duration-300 ease-in-out animate-fade-in ";
            button.dataset.id = offer.id;

            button.innerHTML = `
  <h2 class="text-lg font-semibold">${offer.tittle}</h2>
  <div class="flex items-center gap-2 text-sm text-gray-700">
    <i class="fas fa-map-marker-alt text-gray-800 w-4"></i> ${cityName}
  </div>
  <div class="flex items-center gap-2 text-sm text-gray-700">
    <i class="fas fa-briefcase text-gray-800 w-4"></i> ${workMode}
  </div>
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
        const listContainer = document.getElementById(listContainerId);
        if (listContainer) {
            listContainer.innerHTML = '<p class="text-red-500">Error loading offers, please try again.</p>';
        }
    }
};

function closeOfferDetails() {
    const container = document.getElementById('offer-details');
    if (container) {
        container.classList.add('hidden');
        container.classList.remove('slide-up');
    }
    hideOverlay();
}
window.closeOfferDetails = closeOfferDetails;

async function renderOfferDetails(offer, container) {
    if (!container) {
        container = document.getElementById('offer-details');
    }

    const placeholder = container.querySelector('#offer-placeholder');
    if (placeholder) placeholder.remove();

    container.classList.remove('hidden');
    container.classList.remove('slide-up');

    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-site";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
  <div class="relative bg-white p-6 rounded-lg shadow h-full flex flex-col justify-between animate-fade-in job-card">
    <button id="close-offer-btn" class="absolute top-2 right-4 md:hidden text-black text-xl font-bold z-70">X</button>
    <div>
      <h2 class="text-2xl font-bold mb-2">${offer.tittle}</h2>
      <p class="mb-1 flex items-center gap-2 text-gray-700"><i class="fas fa-map-marker-alt text-gray-800 w-5"></i> ${cityName}</p>
<p class="mb-1 flex items-center gap-2 text-gray-700"><i class="fas fa-briefcase text-gray-800 w-5"></i> ${workMode}</p>
<p class="mb-1 flex items-center gap-2 text-gray-700"><i class="fas fa-clock text-gray-800 w-5"></i> ${postedDate}</p>
<p class="mb-1 flex items-center gap-2 text-gray-700"><i class="fas fa-code text-gray-800 w-5"></i> ${technologies}</p>

      <p class="mt-4 whitespace-pre-line text-gray-800">${offer.description}</p>
      <div class="mt-auto flex flex-col items-center border-t border-gray-200 py-4">
        <hr class="w-[450px] border-black mb-4" />
        <button id="download-pdf-btn" class="flex items-center text-black font-medium space-x-2 mt-2">
          <i class="fa-solid fa-file-pdf text-lg"></i>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
    <div>
      <hr class="my-6 border-t border-gray-300" />
      <div class="w-full flex justify-center text-gray-600 hover:text-gray-800 cursor-pointer text-sm"
           onclick="window.print()">
        <i class="fas fa-print mr-2"></i> imprimir
      </div>
    </div>
  </div>
`;


    const closeBtn = container.querySelector('#close-offer-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeOfferDetails);

    if (window.innerWidth <= 767) {
        container.classList.add('slide-up');
        container.classList.remove('hidden');
        showOverlay();
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

document.getElementById('overlay')?.addEventListener('click', closeOfferDetails);

function showOverlay() {
    const overlay = document.getElementById('overlay');
    overlay?.classList.remove('hidden');
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay?.classList.add('hidden');
}

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'close-offer-btn') {
        closeOfferDetails();
    }
});

export const setOffers = (newOffers) => {
    offersGlobal = newOffers;
};

export const resetPage = () => {
    currentPage = 1;
};
