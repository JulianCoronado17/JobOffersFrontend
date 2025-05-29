import { getCityWithID } from '../service/offersService.js';

export async function downloadOfferAsPDF(offer) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de colores - Manteniendo los existentes
    const colors = {
        primary: '#2C3E50',      
        secondary: '#50E3C2',     
        accent: '#3498DB',        
        text: '#34495E',          
        lightGray: '#F5F7FA',     
        border: '#DFE3E8',        
        headerBg: '#FFFFFF',      
        headerText: '#2C3E50',    
        footerText: '#7F8C8D',    
        companyBrand: '#2C3E50'   
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    let yPosition = margin;

    function addCorporateHeader() {
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, pageWidth, 8, 'F');
        
        doc.setFillColor(colors.secondary);
        doc.rect(0, 8, pageWidth, 2, 'F');
        
        doc.setTextColor(colors.companyBrand);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('JOB OFFERS', margin, 25);
        
        doc.setTextColor(colors.footerText);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('To advance is to grow', margin, 32);
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('PROPOSED EMPLOYMENT OPPORTUNITIES', pageWidth / 2, 45, { align: 'center' });
        
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(1.2);
        doc.line(margin + 30, 48, pageWidth - margin - 30, 48);
        
        
        yPosition = 65;
    }

    function addExecutiveSection(title, isSubheader = false) {
        if (yPosition > pageHeight - 50) {
            doc.addPage();
            addPageNumbers();
            yPosition = margin;
        }

        if (isSubheader) {
            doc.setFillColor(colors.lightGray);
            doc.rect(margin, yPosition - 2, pageWidth - margin * 2, 10, 'F');
            
            doc.setTextColor(colors.primary);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(title.toUpperCase(), margin + 5, yPosition + 5);
            
            doc.setDrawColor(colors.secondary);
            doc.setLineWidth(2);
            doc.line(margin, yPosition + 8, margin + 60, yPosition + 8);
            
            yPosition += 18;
        } else {
            doc.setFillColor(colors.primary);
            doc.rect(margin - 5, yPosition - 3, pageWidth - margin * 2 + 10, 14, 'F');
            
            doc.setTextColor('#FFFFFF');
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title.toUpperCase(), margin, yPosition + 6);
            
            yPosition += 20;
        }
    }

    function addExecutiveTable(data, hasHeader = false) {
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            addPageNumbers();
            yPosition = margin;
        }

        const cellPadding = 8;
        const rowHeight = 12;
        const col1Width = 70;
        const col2Width = pageWidth - margin * 2 - col1Width;

        data.forEach((row, index) => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                addPageNumbers();
                yPosition = margin;
            }

            const [label, value] = row;
            
            if (index % 2 === 0) {
                doc.setFillColor(colors.lightGray);
                doc.rect(margin, yPosition, pageWidth - margin * 2, rowHeight, 'F');
            }
            
            doc.setDrawColor(colors.border);
            doc.setLineWidth(0.3);
            doc.rect(margin, yPosition, pageWidth - margin * 2, rowHeight);
            doc.line(margin + col1Width, yPosition, margin + col1Width, yPosition + rowHeight);
            
            doc.setTextColor(colors.primary);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(label, margin + cellPadding, yPosition + 8);
            
            doc.setTextColor(colors.text);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(value, col2Width - cellPadding * 2);
            doc.text(lines, margin + col1Width + cellPadding, yPosition + 8);
            
            yPosition += rowHeight;
        });
        
        yPosition += 10;
    }

    function addCorporateSkills(technologies) {
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            addPageNumbers();
            yPosition = margin;
        }

        addExecutiveSection('Technical Requirements & Competencies', true);
        
        doc.setFillColor('#FBFCFD');
        doc.rect(margin, yPosition, pageWidth - margin * 2, 40, 'F');
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(1);
        doc.rect(margin, yPosition, pageWidth - margin * 2, 40);
        
        const techArray = technologies.split(', ');
        let currentX = margin + 10;
        let currentY = yPosition + 12;
        const skillWidth = 45;
        const skillHeight = 8;
        const skillsPerRow = Math.floor((pageWidth - margin * 2 - 20) / (skillWidth + 5));
        
        doc.setFontSize(8);
        
        techArray.forEach((tech, index) => {
            if (index > 0 && index % skillsPerRow === 0) {
                currentY += 12;
                currentX = margin + 10;
            }
            
            doc.setFillColor(colors.primary);
            doc.rect(currentX, currentY - 6, skillWidth, skillHeight, 'F');
            
            doc.setTextColor('#FFFFFF');
            doc.setFont('helvetica', 'bold');
            const textWidth = doc.getTextWidth(tech);
            const textX = currentX + (skillWidth - textWidth) / 2;
            doc.text(tech, textX, currentY);
            
            currentX += skillWidth + 5;
        });

        yPosition += 50;
    }

    function addExecutiveDescription(title, content) {
        if (yPosition > pageHeight - 60) {
            doc.addPage();
            addPageNumbers();
            yPosition = margin;
        }

        addExecutiveSection(title, true);
        
        doc.setDrawColor(colors.border);
        doc.setLineWidth(0.8);
        yPosition += 8;
        
        doc.setTextColor(colors.text);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const lines = doc.splitTextToSize(content, pageWidth - margin * 2 - 10);
        const maxLinesPerPage = Math.floor((pageHeight - yPosition - 40) / 6);
        
        for (let i = 0; i < lines.length; i += maxLinesPerPage) {
            if (i > 0) {
                doc.addPage();
                addPageNumbers();
                yPosition = margin;
            }
            
            const pageLines = lines.slice(i, i + maxLinesPerPage);
            doc.text(pageLines, margin + 5, yPosition);
            yPosition += pageLines.length * 6 + 15;
        }
    }

    function addPageNumbers() {
        const totalPages = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            
            const footerY = pageHeight - 12;
            
            doc.setDrawColor(colors.primary);
            doc.setLineWidth(0.8);
            doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
            
            doc.setTextColor(colors.footerText);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            
            doc.text('STRICTLY CONFIDENTIAL - NOT FOR DISTRIBUTION', margin, footerY);
            
            doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { 
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
            })} at ${new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            })}`, pageWidth / 2, footerY, { align: 'center' });
            
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: 'right' });
        }
    }

    function addAuthenticityStamp() {
        const stampX = pageWidth - 60;
        const stampY = pageHeight - 60;
        
        doc.setDrawColor(colors.secondary);
        doc.setLineWidth(2);
        doc.circle(stampX, stampY, 20, 'S');
        
        doc.setDrawColor(colors.primary);
        doc.setLineWidth(1);
        doc.circle(stampX, stampY, 15, 'S');
        
        doc.setTextColor(colors.primary);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('OFFICIAL', stampX, stampY - 3, { align: 'center' });
        doc.text('DOCUMENT', stampX, stampY + 3, { align: 'center' });
        
        doc.setFontSize(5);
        doc.text(new Date().getFullYear().toString(), stampX, stampY + 8, { align: 'center' });
    }

    
    const cityName = await getCityNameSafe(offer.idCity);
    const technologies = offer.technologyDto.map(tech => tech.name).join(', ');
    const postedDate = new Date(offer.datePosted).toLocaleDateString('en-GB', { 
        day: '2-digit',
        month: 'long', 
        year: 'numeric' 
    });
    const workModality = offer.remote ? "Remote Work Arrangement" : "On-Premises Assignment";
    const offerStatus = "Active Recruitment Process";

    addCorporateHeader();
    
    addExecutiveSection('Position Information');
    
    doc.setFillColor(colors.accent);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 15, 'F');
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(offer.tittle.toUpperCase(), pageWidth / 2, yPosition + 10, { align: 'center' });
    yPosition += 25;

    addExecutiveTable([
        ['Position Title:', offer.tittle],
        ['Geographic Location:', cityName],
        ['Work Modality:', workModality],
        ['Publication Date:', postedDate],
        ['Current Status:', offerStatus],
        ['Department:', 'Human Resources'],
        ['Classification:', 'Professional Position']
    ]);

    if (technologies) {
        addCorporateSkills(technologies);
    }

    if (offer.description) {
        addExecutiveDescription('Detailed Position Description', offer.description);
    }

    // // Sección de términos y condiciones
    // addExecutiveSection('Terms and Conditions', true);
    // doc.setTextColor(colors.text);
    // doc.setFontSize(9);
    // doc.setFont('helvetica', 'normal');
    
    // const terms = [
    //     'This document constitutes a formal employment opportunity proposal.',
    //     'All information contained herein is strictly confidential.',
    //     'This offer is subject to verification of qualifications and references.',
    //     'Terms and conditions may be subject to negotiation.',
    //     'This document does not constitute a binding employment contract.'
    // ];
    
    // terms.forEach(term => {
    //     doc.text(`• ${term}`, margin + 5, yPosition);
    //     yPosition += 8;
    // });

    
    addPageNumbers();

    const sanitizedTitle = offer.tittle.replace(/[^\w\s]/gi, '').replace(/\s+/g, "_").toUpperCase();
    const fileName = `EMPLOYMENT_PROPOSAL_${sanitizedTitle}_REF_HR_${offer.id || '000'}_${new Date().getFullYear()}.pdf`;
    
    doc.save(fileName);
}

async function getCityNameSafe(cityId) {
    try {
        if (!cityId) return "Location To Be Determined";
        const cityData = await getCityWithID(cityId);
        return cityData.name || "Location To Be Determined";
    } catch (error) {
        console.error("Error retrieving geographic location data:", error);
        return "Location To Be Determined";
    }
}