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
    paginationContainer.className = "flex justify-center mt-4 gap-1";

    const createButton = (text, page, disabled = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.disabled = disabled;
        btn.className = `px-3 py-1 border rounded ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
        if (!disabled) {
            btn.addEventListener("click", () => {
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
        listContainer.classList.add("min-h-[550px]", "min-w-[400px]", "flex", "flex-col", "items-start");
        detailsContainer.innerHTML = '<p class="text-gray-500">Select a offer to see more details.</p>';

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
            button.className = "w-full max-w-full min-w-[350px] text-left bg-white border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition job-card";
            button.dataset.id = offer.id;

            button.innerHTML = `
                <h2 class="text-lg font-semibold">${offer.tittle}</h2>
                <p class="text-sm text-gray-600">Zone: ${cityName}</p>
                <p class="text-sm text-gray-500">${workMode}</p>
            `;

            button.addEventListener('click', () => {
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

async function renderOfferDetails(offer, container) {
    if (!container) {
        container = document.getElementById('offer-details');
    }

    container.classList.remove('hidden');
    container.classList.remove('slide-up');

    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-site";
    const cityName = await fetchCityName(offer.idCity);

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow flex flex-col h-full job-card relative">
            <button onclick="closeOfferDetails()" class="absolute top-2 right-4 md:hidden text-black text-xl font-bold z-50">×</button>

            <h2 class="text-2xl font-bold mb-2">${offer.tittle}</h2>
            <p class="mb-1"><strong>Zone:</strong> ${cityName}</p>
            <p class="mb-1"><strong>Modality:</strong> ${workMode}</p>
            <p class="mb-1"><strong>Publication Date:</strong> ${postedDate}</p>
            <p class="mb-1"><strong>Technologies:</strong> ${technologies}</p>
            <p class="mt-4 whitespace-pre-line">${offer.description}</p>

            <div class="mt-auto flex flex-col items-center border-t border-gray-200 py-4">
                <hr class="w-[450px] border-black mb-4" />
                <button id="download-pdf-btn" class="flex items-center text-black font-medium space-x-2 mt-2">
                    <i class="fa-solid fa-file-pdf text-lg"></i>
                    <span>Download PDF</span>
                </button>
            </div>
        </div>
    `;

    const pdfBtn = document.getElementById("download-pdf-btn");
    if (pdfBtn) {
        pdfBtn.addEventListener("click", () => {
            downloadOfferAsPDF(offer);
        });
    }

    if (window.innerWidth <= 767) {
        container.classList.add('slide-up');
        container.classList.remove('hidden');
        document.getElementById('overlay').classList.remove('hidden');
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

export const setOffers = (newOffers) => {
    offersGlobal = newOffers;
};



export const resetPage = () => {
    currentPage = 1;
};