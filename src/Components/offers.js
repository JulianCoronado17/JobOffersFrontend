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

export const renderOfferPage = async (listContainerId, detailsContainerId) => {
    try {
        // Obtener todas las ofertas sin paginación
        const offers = await getAllOffers();
        console.log(offers);

        const listContainer = document.getElementById(listContainerId);
        const detailsContainer = document.getElementById(detailsContainerId);

        // Limpiar los contenedores
        listContainer.innerHTML = '';
        detailsContainer.innerHTML = '<p class="text-gray-500">Selecciona una oferta para ver más detalles.</p>';

        // Renderizar la lista de ofertas
        for (const offer of offers) {
            const cityName = await fetchCityName(offer.idCity);
            const workMode = offer.remote ? "Remoto" : "Presencial";

            const button = document.createElement('button');
            button.className = "w-full text-left bg-white border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition";
            button.dataset.id = offer.id;

            button.innerHTML = `
                <h2 class="text-lg font-semibold">${offer.tittle}</h2>
                <p class="text-sm text-gray-600">Zona: ${cityName}</p>
                <p class="text-sm text-gray-500">${workMode}</p>
            `;

            button.addEventListener('click', () => {
                renderOfferDetails(offer, detailsContainer);
            });

            listContainer.appendChild(button);
        }
    } catch (error) {
        console.error("Error al cargar las ofertas:", error);
        document.getElementById(listContainerId).innerHTML = 
            '<p class="text-red-500">Error al cargar las ofertas. Por favor, intenta nuevamente.</p>';
    }
};

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

function renderPagination(pagination, listContainerId, detailsContainerId, options) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    if (pagination.totalPages > 1) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'flex justify-center items-center space-x-2';

        const prevButton = createPaginationButton('', pagination.page - 1, 'move-left');
        prevButton.className = `px-3 py-1 border rounded flex items-center ${!pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-200'}`;
        paginationDiv.appendChild(prevButton);

        for (let i = 1; i <= pagination.totalPages; i++) {
            const isCurrentPage = i === pagination.page;
            const pageButton = createPaginationButton(i.toString(), i);
            pageButton.className = `px-3 py-1 border rounded ${isCurrentPage ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-200'}`;
            paginationDiv.appendChild(pageButton);
        }

        const nextButton = createPaginationButton('', pagination.page + 1, 'move-right');
        nextButton.className = `px-3 py-1 border rounded flex items-center ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-200'}`;
        paginationDiv.appendChild(nextButton);

        paginationContainer.appendChild(paginationDiv);

        function createPaginationButton(text, pageNum, iconName = null) {
            const button = document.createElement('button');

            if (iconName) {
                button.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
            } else {
                button.textContent = text;
            }

            button.addEventListener('click', (e) => {
                if ((pageNum < 1 || pageNum > pagination.totalPages)) {
                    e.preventDefault();
                    return;
                }

                const newOptions = { ...options, page: pageNum };
                renderOfferPage(listContainerId, detailsContainerId, newOptions);
                document.getElementById(listContainerId).scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            return button;
        }
        lucide.createIcons();
    }
}