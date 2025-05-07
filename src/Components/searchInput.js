export const initSearchBar = (searchInputId, searchButtonId, listContainerId, detailsContainerId) => {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);

    // Crear el contenedor para las sugerencias
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestions-container';
    suggestionsContainer.className = 'absolute left-0 top-full bg-white rounded-xl shadow-lg mt-2 w-full max-h-60 overflow-y-auto z-30';
    searchInput.parentNode.parentNode.appendChild(suggestionsContainer);

    const handleSearch = async () => {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        const { data } = await searchOffers(searchTerm, { page: 1, pageSize: 10 });

        // Limpiar el contenedor de sugerencias
        suggestionsContainer.innerHTML = '';

        if (data.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'p-2 text-gray-500';
            noResults.textContent = 'No se encontraron resultados.';
            suggestionsContainer.appendChild(noResults);
            return;
        }

        // Renderizar las sugerencias
        data.forEach((offer) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'p-2 hover:bg-gray-100 cursor-pointer';
            suggestionItem.innerHTML = `
                <h2 class="text-sm font-semibold">${offer.title}</h2>
                <p class="text-xs text-gray-600">${offer.zone} - ${offer.mode}</p>
            `;

            suggestionItem.addEventListener('click', () => {
                const detailsContainer = document.getElementById(detailsContainerId);
                detailsContainer.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                        <h2 class="text-2xl font-bold mb-2">${offer.title}</h2>
                        <p class="mb-1"><strong>Zona:</strong> ${offer.zone}</p>
                        <p class="mb-1"><strong>Modalidad:</strong> ${offer.mode}</p>
                        <p class="mb-1"><strong>Salario:</strong> $${offer.moreInfo.price.toLocaleString('es-CO')}</p>
                        <p class="mb-1"><strong>Contrato:</strong> ${offer.moreInfo.InfoAditional}</p>
                        <p class="mb-1"><strong>Horario:</strong> ${offer.moreInfo.Time}</p>
                        <p class="mt-4 whitespace-pre-line">${offer.moreInfo.Description}</p>
                    </div>
                `;
                suggestionsContainer.innerHTML = '';
                searchInput.value = '';
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    };

    searchInput.addEventListener('input', handleSearch);

    document.addEventListener('click', (event) => {
        if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
            suggestionsContainer.innerHTML = '';
        }
    });
};
