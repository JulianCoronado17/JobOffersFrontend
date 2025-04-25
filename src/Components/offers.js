import { GetAllOffers } from '../service/offersService.js';

export const renderOfferPage = async (listContainerId, detailsContainerId) => {
    const { data } = await GetAllOffers();

    const listContainer = document.getElementById(listContainerId);
    const detailsContainer = document.getElementById(detailsContainerId);
    listContainer.innerHTML = '';
    detailsContainer.innerHTML = '<p class="text-gray-500">Selecciona una oferta para ver más detalles.</p>';

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
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-2xl font-bold mb-2">${offer.title}</h2>
                    <p class="mb-1"><strong>Zona:</strong> ${offer.zone}</p>
                    <p class="mb-1"><strong>Modalidad:</strong> ${offer.mode}</p>
                    <p class="mb-1"><strong>Salario:</strong> $${offer.moreInfo.price}</p>
                    <p class="mb-1"><strong>Contrato:</strong> ${offer.moreInfo.InfoAditional}</p>
                    <p class="mb-1"><strong>Horario:</strong> ${offer.moreInfo.Time}</p>
                    <p class="mt-4 whitespace-pre-line">${offer.moreInfo.Description}</p>
                </div>
            `;
        });

        listContainer.appendChild(button);
    });
};
