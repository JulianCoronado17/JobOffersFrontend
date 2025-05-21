import { getCityWithID } from '../service/offersService.js';

export async function downloadOfferAsPDF(offer) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const cityName = await getCityNameSafe(offer.idCity);
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote" : "On-site";

    const content = `
    Title: ${offer.tittle}
    Zone: ${cityName}
    Modality: ${workMode}
    Publication Date: ${postedDate}
    Technologies: ${technologies}

    Description:
    ${offer.description}
    `;

    const lines = doc.splitTextToSize(content, 180); // Ajusta al ancho de la página
    doc.text(lines, 10, 10);

    doc.save(`${offer.tittle.replace(/\s+/g, "_")}_offer.pdf`);
}

async function getCityNameSafe(cityId) {
    try {
        if (!cityId) return "N/A";
        const cityData = await getCityWithID(cityId);
        return cityData.name || "N/A";
    } catch (error) {
        console.error("Error fetching city name for PDF:", error);
        return "N/A";
    }
}
