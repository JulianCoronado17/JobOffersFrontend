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
                <div class="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                    <h2 class="text-2xl font-bold mb-2">${offer.title}</h2>
                    <p class="mb-1"><strong>Zona:</strong> ${offer.zone}</p>
                    <p class="mb-1"><strong>Modalidad:</strong> ${offer.mode}</p>
                    <p class="mb-1"><strong>Salario:</strong> $${offer.moreInfo.price}</p>
                    <p class="mb-1"><strong>Contrato:</strong> ${offer.moreInfo.InfoAditional}</p>
                    <p class="mb-1"><strong>Horario:</strong> ${offer.moreInfo.Time}</p>
                    <p class="mt-4 whitespace-pre-line">${offer.moreInfo.Description}</p>

                    <div class="mt-8 flex flex-col items-center w-full">
                        <hr class="w-[450px] border-black mb-4" />
                        <button onclick="window.print()" class="flex items-center text-black font-medium space-x-2">
                            <img 
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAACUCAMAAAAQwc2tAAAAaVBMVEX///8AAADGxsY6Ojn6+voODgsVFRKenp14eHbs7Ozv7+9fX158fHxtbWxcXFyBgYF0dHVQUE8HBwMdHRsaGhqkpKTm5uTa2tq3t7ewsK8gICCXl5dWVlVLS0rh4eEuLixCQkDQ0NAnJyefyR/3AAACcklEQVR4nO3a646qMBQFYCq0KNJRKcjF6/j+D3lqO+rMyehuzDmya9b3B0k02Su0lV6SBAAAAAAAAAAAAAAAAAAAAADikM1o2dhFkrJOf9B0xzxJ1tSVpFV1wztIK6WpBKUySrZjl/pI1guj9IKilRH92LU+kuVCbgvya7OdFDnnhmVzVNsZ+bX1qhKsO4h7HmE5uD8P5GAEOXhBDl6Qg5d3yZE0Qn7QOWbn95IXVPOEiTcV6thNKN1RiYX/+Dl24T/0t5mFUeT0QwhlbrMURi/wE1uYeo6NPRm7/KtUmlP6nKGW6djlX8xqZaZkp/jdUqmaHhheY21zPDv8NOY9cuS8cgwhOfaT7Ntl7fo3sxwhz2MvZWkTtAep7d1nKj+SKHNshFjt3eVoL3lVHfZR5mgPp8X5eRxP5flue1omUeb4q3/4S4w5foMc/x5yIMf/8C1HFs7/gGeOrNPTMJedNaY58oDJoJczzzHUASFqwz5HfZiWlOVBMc0xXHPIVVtQ2tu+Gt8cgetXrHMkTfj+4NcPGOUoBqVS7eyUy9HP9T3zzuWQO3+bKjWwWSEtxWX1TRqXY/NowHU5jLysyIly7PKviu1toVAG5rguOwbst7/MOi+Xzle76vTyHu3bldr52zJfj138D4U/kLTx/bx4cGap8P18c71jKGuC9z9wnuEFLjnocTeOHPR4FUuO6p7zH3k0Obq7zUrrmNpVwLgbRQ5CHDne4VxfL+paE7PBaantvLYbu9aHQs692kHLSMP63Kt9MTHUOeTKnUPuOTerxK1gzWnsz4WfUasMduiNIAUAAAAAAAAAAAAAAAAAAAAAOH8AfNNIoaye7TUAAAAASUVORK5CYII=" 
                                class="w-12 h-12" 
                                alt="Impresora"
                            />
                            <span>Imprimir</span>
                        </button>
                    </div>
                </div>
            `;
        });

        listContainer.appendChild(button);
    });
};
