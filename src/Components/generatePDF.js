import { getCityWithID } from '../service/offersService.js';

export async function downloadOfferAsPDF(offer) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores y estilos - PALETA MEJORADA
    const colors = {
        primary: '#2C3E50',       // Azul oscuro profesional (para encabezados)
        secondary: '#50E3C2',     // Verde agua (de tu diseño, para acentos)
        accent: '#3498DB',        // Azul brillante (para elementos importantes)
        text: '#34495E',          // Gris azulado oscuro (para texto principal)
        lightGray: '#F8F9FA',     // Gris muy claro (fondos de secciones)
        border: '#E0E0E0',        // Gris claro para bordes
        headerBg: '#FFFFFF',      // Blanco para el fondo del encabezado
        headerText: '#2C3E50',    // Texto del encabezado
        footerText: '#7F8C8D'     // Gris para texto de footer
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Función para agregar header con estilo mejorado
    function addHeader() {
        // Fondo blanco en lugar de coloreado
        doc.setFillColor(colors.headerBg);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Título principal con nuevo color
        doc.setTextColor(colors.headerText);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Job Offer Details', pageWidth / 2, 25, { align: 'center' });
        
        // Línea decorativa con el verde agua
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(1.5);
        doc.line(50, 32, pageWidth - 50, 32);
        
        yPosition = 55;
    }

    // Función para agregar una sección con estilo mejorado
    function addSection(title, content, isDescription = false) {
        // Verificar si necesitamos una nueva página
        if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
        }

        // Fondo de sección más sutil
        doc.setFillColor(colors.lightGray);
        doc.roundedRect(15, yPosition - 5, pageWidth - 30, 15, 3, 3, 'F');
        
        // Título de sección en azul oscuro
        doc.setTextColor(colors.primary);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, yPosition + 5);
        
        // Pequeña línea decorativa en verde agua
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(0.8);
        doc.line(20, yPosition + 8, 40, yPosition + 8);
        
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
        doc.roundedRect(15, yPosition - 5, columnWidth, 25, 3, 3, 'F');
        
        doc.setTextColor(colors.accent);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(leftTitle, 20, yPosition + 3);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(leftContent, 20, yPosition + 15);

        // Columna derecha
        doc.setFillColor(colors.lightGray);
        doc.roundedRect(25 + columnWidth, yPosition - 5, columnWidth, 25, 3, 3, 'F');
        
        doc.setTextColor(colors.accent);
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
        doc.roundedRect(15, yPosition - 5, pageWidth - 30, 15, 3, 3, 'F');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Required Technologies', 20, yPosition + 5);
        
        // Línea decorativa
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(0.8);
        doc.line(20, yPosition + 8, 40, yPosition + 8);
        
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

            // Dibujar el tag (usando el verde agua)
            doc.setFillColor(colors.secondary);
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

    // Función para agregar footer mejorado
    function addFooter() {
        const footerY = pageHeight - 20;
        
        // Línea separadora
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.5);
        doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
        
        // Texto del footer
        doc.setTextColor(colors.footerText);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, footerY);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - 20, footerY, { align: 'right' });
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
    doc.roundedRect(15, yPosition - 8, pageWidth - 30, 20, 3, 3, 'F');
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