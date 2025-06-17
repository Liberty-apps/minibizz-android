import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Devis, Facture } from '../types';
import { formatCurrency, formatDate } from './calculations';
import { getUserSettings } from './storage';
import { generatePaymentInstructions } from './conditionsGenerator';

export const generatePDF = async (item: Devis | Facture, type: 'devis' | 'factures'): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Get company info
    const settings = getUserSettings();

    // Add logo if available (smaller size)
    if (settings?.logo) {
      try {
        pdf.addImage(settings.logo, 'PNG', pageWidth - margin - 30, margin, 25, 15);
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }

    // Header - Company Info (more compact)
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const companyName = settings?.nom ? `${settings.prenom} ${settings.nom}` : 'Mon Entreprise';
    pdf.text(companyName, margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    if (settings?.adresse) {
      pdf.text(settings.adresse, margin, yPosition);
      yPosition += 4;
    }
    if (settings?.ville && settings?.codePostal) {
      pdf.text(`${settings.codePostal} ${settings.ville}`, margin, yPosition);
      yPosition += 4;
    }
    if (settings?.telephone) {
      pdf.text(`Tél: ${settings.telephone}`, margin, yPosition);
      yPosition += 4;
    }
    if (settings?.email) {
      pdf.text(`Email: ${settings.email}`, margin, yPosition);
      yPosition += 4;
    }
    if (settings?.siret) {
      pdf.text(`SIRET: ${settings.siret}`, margin, yPosition);
      yPosition += 4;
    }

    yPosition += 8;

    // Document title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const title = type === 'devis' ? 'DEVIS' : 'FACTURE';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, pageWidth - margin - titleWidth, yPosition);
    yPosition += 10;

    // Document info (more compact)
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`N° ${item.numero}`, pageWidth - margin - 50, yPosition);
    yPosition += 5;
    pdf.text(`Date: ${formatDate(item.dateCreation)}`, pageWidth - margin - 50, yPosition);
    yPosition += 5;

    if ('dateEcheance' in item) {
      pdf.text(`Échéance: ${formatDate(item.dateEcheance)}`, pageWidth - margin - 50, yPosition);
      yPosition += 5;
    }

    if ('dateValidite' in item) {
      pdf.text(`Validité: ${formatDate(item.dateValidite)}`, pageWidth - margin - 50, yPosition);
      yPosition += 5;
    }

    yPosition += 8;

    // Client info (more compact)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Facturé à:', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(item.client.nom, margin, yPosition);
    yPosition += 4;
    if (item.client.adresse) {
      pdf.text(item.client.adresse, margin, yPosition);
      yPosition += 4;
    }
    if (item.client.email) {
      pdf.text(item.client.email, margin, yPosition);
      yPosition += 4;
    }
    if (item.client.telephone) {
      pdf.text(item.client.telephone, margin, yPosition);
      yPosition += 4;
    }
    if (item.client.siret) {
      pdf.text(`SIRET: ${item.client.siret}`, margin, yPosition);
      yPosition += 4;
    }

    yPosition += 10;

    // Items table (more compact)
    const tableStartY = yPosition;
    const colWidths = [85, 20, 25, 25];
    const colPositions = [margin];
    for (let i = 1; i < colWidths.length; i++) {
      colPositions.push(colPositions[i - 1] + colWidths[i - 1]);
    }

    // Table header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 6, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', colPositions[0] + 1, yPosition + 4);
    pdf.text('Qté', colPositions[1] + 1, yPosition + 4);
    pdf.text('Prix unit. HT', colPositions[2] + 1, yPosition + 4);
    pdf.text('Total HT', colPositions[3] + 1, yPosition + 4);
    
    yPosition += 6;

    // Table content (more compact)
    pdf.setFont('helvetica', 'normal');
    item.items.forEach((ligne, index) => {
      const rowHeight = 6;
      
      // Draw row background (alternating)
      if (index % 2 === 1) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');
      }

      // Handle long descriptions with smaller font
      const descriptionLines = pdf.splitTextToSize(ligne.description, colWidths[0] - 2);
      const lineHeight = 3;
      const actualRowHeight = Math.max(rowHeight, descriptionLines.length * lineHeight + 1);

      pdf.text(descriptionLines, colPositions[0] + 1, yPosition + 3);
      pdf.text(ligne.quantite.toString(), colPositions[1] + 1, yPosition + 3);
      pdf.text(formatCurrency(ligne.prixUnitaire), colPositions[2] + 1, yPosition + 3);
      pdf.text(formatCurrency(ligne.total), colPositions[3] + 1, yPosition + 3);
      
      yPosition += actualRowHeight;
    });

    yPosition += 8;

    // Totals section (more compact)
    const totalsX = pageWidth - margin - 60;
    
    // Draw totals box
    pdf.setFillColor(248, 249, 250);
    pdf.rect(totalsX - 40, yPosition - 3, 60, 20, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(totalsX - 40, yPosition - 3, 60, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Sous-total HT:', totalsX - 35, yPosition);
    pdf.text(formatCurrency(item.sousTotal), totalsX + 10, yPosition);
    yPosition += 5;

    pdf.text('TVA:', totalsX - 35, yPosition);
    pdf.text(formatCurrency(item.tva), totalsX + 10, yPosition);
    yPosition += 5;

    // Total line
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Total TTC:', totalsX - 35, yPosition);
    pdf.text(formatCurrency(item.total), totalsX + 10, yPosition);

    yPosition += 15;

    // Payment information section (more compact)
    if (item.modalitesPaiement && yPosition < pageHeight - 80) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MODALITÉS DE PAIEMENT', margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');

      // Payment terms
      switch (item.modalitesPaiement.modalitePaiement) {
        case 'comptant':
          pdf.text('Paiement comptant à la commande', margin, yPosition);
          yPosition += 4;
          break;
        case 'echeance':
          pdf.text(`Paiement à ${item.modalitesPaiement.delaiPaiement} jours`, margin, yPosition);
          yPosition += 4;
          break;
        case 'acompte':
          const pourcentage = item.modalitesPaiement.pourcentageAcompte || 30;
          pdf.text(`Acompte: ${pourcentage}% - Solde: ${100 - pourcentage}%`, margin, yPosition);
          yPosition += 4;
          break;
      }

      // Payment instructions (limited)
      const instructions = generatePaymentInstructions(item.modalitesPaiement).slice(0, 2);
      instructions.forEach(instruction => {
        if (yPosition < pageHeight - 60) {
          pdf.text(instruction, margin, yPosition);
          yPosition += 3;
        }
      });

      yPosition += 6;
    }

    // Notes section (compact)
    if (item.notes && item.notes.trim() && yPosition < pageHeight - 50) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes:', margin, yPosition);
      yPosition += 4;
      
      pdf.setFont('helvetica', 'normal');
      const noteLines = pdf.splitTextToSize(item.notes, pageWidth - 2 * margin);
      const maxLines = Math.floor((pageHeight - yPosition - 40) / 3);
      const displayLines = noteLines.slice(0, maxLines);
      pdf.text(displayLines, margin, yPosition);
      yPosition += displayLines.length * 3 + 6;
    }

    // Custom conditions section (very compact)
    if (item.conditions && item.conditions.trim() && yPosition < pageHeight - 40) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Conditions particulières:', margin, yPosition);
      yPosition += 4;
      
      pdf.setFont('helvetica', 'normal');
      const conditionLines = pdf.splitTextToSize(item.conditions, pageWidth - 2 * margin);
      const maxLines = Math.floor((pageHeight - yPosition - 35) / 3);
      const displayLines = conditionLines.slice(0, maxLines);
      pdf.text(displayLines, margin, yPosition);
      yPosition += displayLines.length * 3 + 6;
    }

    // Generated conditions section (very compact, only if space available)
    if (item.conditionsGenerees && item.conditionsGenerees.trim() && yPosition < pageHeight - 30) {
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      const conditionLines = pdf.splitTextToSize(item.conditionsGenerees, pageWidth - 2 * margin);
      const maxLines = Math.floor((pageHeight - yPosition - 25) / 2.5);
      const displayLines = conditionLines.slice(0, maxLines);
      pdf.text(displayLines, margin, yPosition);
    }

    // Footer (compact)
    const footerY = pageHeight - 20;
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    if (settings?.rib?.iban) {
      pdf.text(`IBAN: ${settings.rib.iban}`, margin, footerY);
      if (settings.rib.bic) {
        pdf.text(`BIC: ${settings.rib.bic}`, margin, footerY + 3);
      }
    }

    // Generate QR Code for payment info (smaller)
    try {
      const qrData = `${title} ${item.numero}\nMontant: ${formatCurrency(item.total)}\nClient: ${item.client.nom}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { 
        width: 60,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - 15, footerY - 12, 12, 12);
    } catch (error) {
      console.warn('Could not generate QR code:', error);
    }

    // Page numbering
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page 1/1`, pageWidth - margin - 15, pageHeight - 5);

    // Save the PDF
    const fileName = `${type === 'devis' ? 'Devis' : 'Facture'}_${item.numero}_${item.client.nom.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    console.log(`PDF généré avec succès: ${fileName}`);

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Vérifiez que toutes les informations sont correctes.');
    throw error;
  }
};