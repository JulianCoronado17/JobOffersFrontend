import { getPaginatedOffers } from '../service/offersService.js';

export const renderOfferPage = async (listContainerId, detailsContainerId, options = {}) => {
    // Configuración por defecto: 5 elementos por página
    const pageOptions = {
        page: options.page || 1,
        pageSize: options.pageSize || 5,
        sortBy: options.sortBy || null,
        sortOrder: options.sortOrder || 'asc',
        filters: options.filters || {}
    };

    // Obtener datos paginados
    const { data, pagination } = await getPaginatedOffers(pageOptions);

    // Obtener los contenedores
    const listContainer = document.getElementById(listContainerId);
    const detailsContainer = document.getElementById(detailsContainerId);
    
    // Limpiar los contenedores
    listContainer.innerHTML = '';
    detailsContainer.innerHTML = '<p class="text-gray-500">Selecciona una oferta para ver más detalles.</p>';

    // Renderizar la lista de ofertas
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
            detailsContainer.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                    <h2 class="text-2xl font-bold mb-2">${offer.title}</h2>
                    <p class="mb-1"><strong>Zona:</strong> ${offer.zone}</p>
                    <p class="mb-1"><strong>Modalidad:</strong> ${offer.mode}</p>
                    <p class="mb-1"><strong>Salario:</strong> $${offer.moreInfo.price.toLocaleString('es-CO')}</p>
                    <p class="mb-1"><strong>Contrato:</strong> ${offer.moreInfo.InfoAditional}</p>
                    <p class="mb-1"><strong>Horario:</strong> ${offer.moreInfo.Time}</p>
                    <p class="mt-4 whitespace-pre-line">${offer.moreInfo.Description}</p>

                    <div class="mt-8 flex flex-col items-center w-full">
                        <hr class="w-[450px] border-black mb-4" />
                        <button onclick="window.print()" class="flex items-center text-black font-medium space-x-2">
                            <span>Imprimir</span>
                        </button>
                    </div>
                </div>
            `;
        });

        listContainer.appendChild(button);
    });

    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        paginationContainer.className = 'mt-4 flex justify-center';
        listContainer.parentNode.appendChild(paginationContainer);
    } else {
        paginationContainer.innerHTML = '';
    }
    if (pagination.totalPages > 1) {
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'flex justify-center items-center space-x-2 py-4';
        
        if (pagination.hasPrevPage) {
            const prevButton = createPaginationButton('Anterior', pagination.page - 1);
            prevButton.className = 'px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200';
            paginationDiv.appendChild(prevButton);
        }
        for (let i = 1; i <= pagination.totalPages; i++) {
            const isCurrentPage = i === pagination.page;
            const pageButton = createPaginationButton(i.toString(), i);
            
            if (isCurrentPage) {
                pageButton.className = 'px-3 py-1 border rounded bg-gradient-to-r from-[#50E3C2] to-[#4A90E2] text-white font-bold';
            } else {
                pageButton.className = 'px-3 py-1 border rounded hover:bg-gray-200';
            }
            
            paginationDiv.appendChild(pageButton);
        }
        
        if (pagination.hasNextPage) {
            const nextButton = createPaginationButton('Siguiente', pagination.page + 1);
            nextButton.className = 'px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200';
            paginationDiv.appendChild(nextButton);
        }
        
        paginationContainer.appendChild(paginationDiv);
    }
    
    function createPaginationButton(text, pageNum) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            const newOptions = {...options, page: pageNum};
            renderOfferPage(listContainerId, detailsContainerId, newOptions);
            
            document.getElementById(listContainerId).scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return button;
    }
};
export const initOfferPage = (listContainerId, detailsContainerId) => {
    renderOfferPage(listContainerId, detailsContainerId);
};