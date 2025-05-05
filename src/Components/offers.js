import { getPaginatedOffers } from '../service/offersService.js';

export const renderOfferPage = async (listContainerId, detailsContainerId, options = {}) => {
    const pageOptions = {
        page: options.page || 1,
        pageSize: options.pageSize || 5,
        sortBy: options.sortBy || null,
        sortOrder: options.sortOrder || 'asc',
        filters: options.filters || {}
    };

    const { data, pagination } = await getPaginatedOffers(pageOptions);

    const listContainer = document.getElementById(listContainerId);
    const detailsContainer = document.getElementById(detailsContainerId);

    listContainer.innerHTML = '';
    detailsContainer.innerHTML = '<p class="text-gray-500">Selecciona una oferta para ver más detalles.</p>';

    // Renderizar ofertas
    data.forEach((offer) => {
        const button = document.createElement('button');
        button.className = "w-full text-left bg-white border p-4 rounded-lg shadow mb-3 hover:bg-gray-100 transition";
        button.dataset.id = offer.id;

        button.innerHTML = `
            <h2 class="text-lg font-semibold">${offer.title}</h2>
            <p class="text-sm text-gray-600">${offer.zone}</p>
            <p class="text-sm text-gray-500">${offer.mode}</p>
        `;

        button.addEventListener('click', () => {
            renderOfferDetails(offer, detailsContainer);
        });

        listContainer.appendChild(button);
    });

    renderPagination(pagination, listContainerId, detailsContainerId, options);
};

function renderOfferDetails(offer, container) {
    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow flex flex-col h-full">
            <h2 class="text-2xl font-bold mb-2">${offer.title}</h2>
            <p class="mb-1"><strong>Zona:</strong> ${offer.zone}</p>
            <p class="mb-1"><strong>Modalidad:</strong> ${offer.mode}</p>
            <p class="mb-1"><strong>Salario:</strong> $${offer.moreInfo.price.toLocaleString('es-CO')}</p>
            <p class="mb-1"><strong>Contrato:</strong> ${offer.moreInfo.InfoAditional}</p>
            <p class="mb-1"><strong>Horario:</strong> ${offer.moreInfo.Time}</p>
            <p class="mt-4 whitespace-pre-line">${offer.moreInfo.Description}</p>

            <div class="mt-auto flex flex-col items-center border-t border-gray-200 py-4">
                <hr class="w-[450px] border-black mb-4" />
                <button onclick="window.print()" class="flex items-center text-black font-medium space-x-2">
                    <i data-lucide="printer" class="w-5 h-5"></i>
                    <span>Imprimir</span>
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
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
