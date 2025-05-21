import { getCityWithID } from '../service/offersService.js';

export async function downloadOfferAsPDF(offer) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores y estilos
    const colors = {
        primary: '#2563EB',      // Azul principal
        secondary: '#64748B',    // Gris azulado
        accent: '#059669',       // Verde esmeralda
        text: '#374151',         // Gris oscuro
        lightGray: '#F8FAFC',    // Gris muy claro
        border: '#E2E8F0'        // Gris para bordes
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Función para agregar header con estilo
    function addHeader() {
        // Rectángulo de fondo para el header
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Título principal
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Job Offer Details', pageWidth / 2, 25, { align: 'center' });
        
        yPosition = 55;
    }

    // Función para agregar una sección con estilo
    function addSection(title, content, isDescription = false) {
        // Verificar si necesitamos una nueva página
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
        }

        // Título de la sección
        doc.setFillColor(colors.lightGray);
        doc.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, yPosition + 5);
        
        yPosition += 20;

        // Contenido de la sección
        doc.setTextColor(colors.text);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        if (isDescription) {
            // Para descripciones largas, usar splitTextToSize
            const lines = doc.splitTextToSize(content, pageWidth - 40);
            doc.text(lines, 20, yPosition);
            yPosition += lines.length * 5 + 10;
        } else {
            doc.text(content, 20, yPosition);
            yPosition += 15;
        }
    }

    // Función para agregar información en dos columnas
    function addTwoColumnInfo(leftTitle, leftContent, rightTitle, rightContent) {
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
        }

        const columnWidth = (pageWidth - 50) / 2;
        
        // Columna izquierda
        doc.setFillColor(colors.lightGray);
        doc.rect(15, yPosition - 5, columnWidth, 25, 'F');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(leftTitle, 20, yPosition + 3);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(leftContent, 20, yPosition + 15);

        // Columna derecha
        doc.setFillColor(colors.lightGray);
        doc.rect(25 + columnWidth, yPosition - 5, columnWidth, 25, 'F');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(rightTitle, 30 + columnWidth, yPosition + 3);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(rightContent, 30 + columnWidth, yPosition + 15);

        yPosition += 35;
    }

    // Función para agregar tecnologías con tags
    function addTechnologies(technologies) {
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
        }

        // Título de la sección
        doc.setFillColor(colors.lightGray);
        doc.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Required Technologies', 20, yPosition + 5);
        
        yPosition += 25;

        // Crear tags para cada tecnología
        const techArray = technologies.split(', ');
        let xPosition = 20;
        let lineHeight = 0;

        techArray.forEach((tech, index) => {
            const textWidth = doc.getTextWidth(tech) + 8;
            
            // Verificar si necesitamos nueva línea
            if (xPosition + textWidth > pageWidth - 30) {
                xPosition = 20;
                yPosition += 20;
                lineHeight = 0;
            }

            // Dibujar el tag
            doc.setFillColor(colors.accent);
            doc.roundedRect(xPosition, yPosition - 8, textWidth, 12, 2, 2, 'F');
            
            // Texto del tag
            doc.setTextColor('#FFFFFF');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(tech, xPosition + 4, yPosition - 2);

            xPosition += textWidth + 8;
            lineHeight = Math.max(lineHeight, 12);
        });

        yPosition += Math.max(lineHeight, 12) + 15;
    }

    // Función para agregar footer
    function addFooter() {
        const footerY = pageHeight - 20;
        
        // Línea separadora
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.5);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
        
        // Texto del footer
        doc.setTextColor(colors.secondary);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, footerY);
        doc.text(`Page 1 of 1`, pageWidth - 20, footerY, { align: 'right' });
    }

    // Obtener datos
    const cityName = await getCityNameSafe(offer.idCity);
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString();
    const workMode = offer.remote ? "Remote Work" : "On-site Work";

    // Generar el PDF
    addHeader();
    
    // Título de la oferta con estilo especial
    doc.setFillColor(colors.accent);
    doc.rect(15, yPosition - 8, pageWidth - 30, 20, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(offer.tittle, pageWidth - 40);
    doc.text(titleLines, 20, yPosition);
    yPosition += (titleLines.length * 6) + 15;

    // Información en dos columnas
    addTwoColumnInfo('Location', cityName, 'Work Mode', workMode);
    addTwoColumnInfo('Publication Date', postedDate, 'Status', 'Active');

    // Tecnologías con tags
    if (technologies) {
        addTechnologies(technologies);
    }

    // Descripción
    if (offer.description) {
        addSection('Job Description', offer.description, true);
    }

    // Footer
    addFooter();

    // Guardar el archivo
    const fileName = `${offer.tittle.replace(/[^\w\s]/gi, '').replace(/\s+/g, "_")}_job_offer.pdf`;
    doc.save(fileName);
}

async function getCityNameSafe(cityId) {
    try {
        if (!cityId) return "Not specified";
        const cityData = await getCityWithID(cityId);
        return cityData.name || "Not specified";
    } catch (error) {
        console.error("Error fetching city name for PDF:", error);
        return "Not specified";
    }
}