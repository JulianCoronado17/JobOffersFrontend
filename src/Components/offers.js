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
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "flex justify-center mt-4 gap-1 items-center";

    const createButton = (text, page, disabled = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.disabled = disabled;
        btn.className = `px-3 py-1 border rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
        if (!disabled) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentPage = page;
                renderOfferPage(listContainerId, detailsContainerId);
            });
        }
        return btn;
    };

    paginationContainer.appendChild(createButton("«", currentPage - 1, currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createButton(i, i));
    }

    paginationContainer.appendChild(createButton("»", currentPage + 1, currentPage === totalPages));

    return paginationContainer;
};

export const renderOfferPage = async (listContainerId, detailsContainerId) => {
    try {
        if (offersGlobal.length === 0) {
            offersGlobal = await getAllOffers();
        }

        const listContainer = document.getElementById(listContainerId);
        const detailsContainer = document.getElementById(detailsContainerId);

        listContainer.innerHTML = '';
        listContainer.classList.add("flex", "flex-col");

        // No resetear el contenedor de detalles si ya tiene contenido
        const hasOfferDetails = detailsContainer.innerHTML.includes('text-2xl font-bold');
        if (!hasOfferDetails) {
            detailsContainer.innerHTML = `
            <div class="h-full w-full flex flex-col items-center justify-center text-center text-gray-500 px-4">
                <i class="fas fa-briefcase fa-3x mb-4 text-[#50E3C2]"></i>
                <p class="text-lg font-medium">Select an offer to see more details</p>
                <p class="text-sm text-gray-400">Click on any job from the list to view its full description.</p>
            </div>
            `;
                    }

        const start = (currentPage - 1) * offersPerPage;
        const end = start + offersPerPage;
        const offersToShow = offersGlobal.slice(start, end);

        if (offersToShow.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center text-gray-400 py-20">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>No job offers found</p>
                </div>
            `;
            return;
        }

        for (const offer of offersToShow) {
            const cityName = await fetchCityName(offer.idCity);
            const workMode = offer.remote ? "Remote" : "On-Site";

            const button = document.createElement('button');
            button.className = "w-80 text-left bg-white lg:w-96 border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition";
            button.dataset.id = offer.id;

            button.innerHTML = `
                <h2 class="text-lg font-semibold">${offer.tittle}</h2>
                <p class="text-sm text-gray-600">Zone: ${cityName}</p>
                <p class="text-sm text-gray-500">${workMode}</p>
            `;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderOfferDetails(offer, detailsContainer);
            });

            listContainer.appendChild(button);
        }

        const totalPages = Math.ceil(offersGlobal.length / offersPerPage);
        listContainer.appendChild(renderPagination(totalPages, listContainerId, detailsContainerId));
    } catch (error) {
        console.error("Error loading job offers:", error);
        document.getElementById(listContainerId).innerHTML =
            '<p class="text-red-500">Error loading offers, please try again.</p>';
    }
};

function closeOfferDetails() {
    const container = document.getElementById('offer-details');
    container.classList.add('hidden');
    container.classList.remove('slide-up');
    hideOverlay();
}

window.closeOfferDetails = closeOfferDetails;

async function renderOfferDetails(offer, container) {
    if (!container) {
        container = document.getElementById('offer-details');
    }

    // Remover clase job-card que puede causar conflictos
    container.classList.remove('hidden');
    container.classList.remove('slide-up');

    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-site";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
    <div class="relative bg-white p-6 rounded-lg flex flex-col overflow-y-auto max-h-[390px] lg:max-h-[600px]">
        <button id="close-offer-btn" class="absolute top-2 right-4 md:hidden text-black text-xl font-bold z-70">X</button>

        <h2 class="text-2xl font-bold mb-4 text-[#2C3E50]">${offer.tittle}</h2>
        
        <div class="grid gap-3 mb-4">
            <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-[#50E3C2] w-5 mr-3"></i>
                <p><span class="font-semibold text-[#34495E]">Zone:</span> ${cityName}</p>
            </div>
            
            <div class="flex items-center">
                <i class="fas fa-laptop-house text-[#50E3C2] w-5 mr-3"></i>
                <p><span class="font-semibold text-[#34495E]">Modality:</span> ${workMode}</p>
            </div>
            
            <div class="flex items-center">
                <i class="fas fa-calendar-alt text-[#50E3C2] w-5 mr-3"></i>
                <p><span class="font-semibold text-[#34495E]">Publication Date:</span> ${postedDate}</p>
            </div>
            
            <div class="flex items-center">
                <i class="fas fa-code text-[#50E3C2] w-5 mr-3"></i>
                <p><span class="font-semibold text-[#34495E]">Technologies:</span> ${technologies}</p>
            </div>
        </div>
        <div class="mb-4">
            <h3 class="text-lg font-semibold text-[#2C3E50] mb-2 flex items-center">
                Description
            </h3>
            <p class="whitespace-pre-line text-[#34495E]">${offer.description}</p>
        </div>
        <div class="mt-auto flex flex-col items-center border-t border-gray-200 pt-4">
            <button id="download-pdf-btn" class="flex items-center bg-gray-100 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                <i class="fa-solid fa-print text-lg mr-2"></i>
                <span>Download</span>
            </button>
        </div>
    </div>
`;

    const closeBtn = container.querySelector('#close-offer-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeOfferDetails();
        });
    }

    const pdfBtn = document.getElementById("download-pdf-btn");
    if (pdfBtn) {
        pdfBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadOfferAsPDF(offer);
        });
    }

    if (window.innerWidth <= 767) {
        container.classList.add('slide-up');
        container.classList.remove('hidden');
        showOverlay();
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

const overlayElement = document.getElementById('overlay');
if (overlayElement) {
    overlayElement.addEventListener('click', closeOfferDetails);
}

function showOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Delegación para cerrar los detalles de oferta
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'close-offer-btn') {
        e.preventDefault();
        e.stopPropagation();
        closeOfferDetails();
    }
});

export const setOffers = (newOffers) => {
    offersGlobal = newOffers;
};

export const resetPage = () => {
    currentPage = 1;
};