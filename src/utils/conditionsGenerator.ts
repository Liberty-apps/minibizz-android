import { PaymentTerms, MODES_PAIEMENT } from '../types';

export const generateConditionsGenerales = (
  modalitesPaiement: PaymentTerms,
  type: 'devis' | 'facture',
  dureeValidite?: number
): string => {
  const conditions: string[] = [];

  // En-tête
  conditions.push(`CONDITIONS GÉNÉRALES DE ${type.toUpperCase()}`);
  conditions.push('');

  // Validité du devis
  if (type === 'devis' && dureeValidite) {
    conditions.push(`VALIDITÉ`);
    conditions.push(`Ce devis est valable ${dureeValidite} jour${dureeValidite > 1 ? 's' : ''} à compter de sa date d'émission.`);
    conditions.push('');
  }

  // Modalités de paiement
  conditions.push('MODALITÉS DE PAIEMENT');
  
  switch (modalitesPaiement.modalitePaiement) {
    case 'comptant':
      conditions.push('Paiement comptant à la commande.');
      break;
    case 'echeance':
      conditions.push(`Paiement à ${modalitesPaiement.delaiPaiement} jour${modalitesPaiement.delaiPaiement > 1 ? 's' : ''} à compter de la date de ${type === 'devis' ? 'commande' : 'facture'}.`);
      break;
    case 'acompte':
      const pourcentage = modalitesPaiement.pourcentageAcompte || 30;
      conditions.push(`Acompte de ${pourcentage}% à la commande.`);
      conditions.push(`Solde de ${100 - pourcentage}% à ${modalitesPaiement.delaiPaiement} jour${modalitesPaiement.delaiPaiement > 1 ? 's' : ''}.`);
      break;
  }

  // Modes de paiement acceptés
  const modesAcceptes = modalitesPaiement.modesPaiement
    .map(mode => MODES_PAIEMENT.find(m => m.id === mode)?.label)
    .filter(Boolean);
  
  if (modesAcceptes.length > 0) {
    conditions.push(`Modes de paiement acceptés : ${modesAcceptes.join(', ')}.`);
  }

  conditions.push('');

  // Pénalités de retard
  if (modalitesPaiement.penalitesRetard && modalitesPaiement.penalitesRetard > 0) {
    conditions.push('PÉNALITÉS DE RETARD');
    conditions.push(`En cas de retard de paiement, des pénalités de ${modalitesPaiement.penalitesRetard}% par jour de retard seront appliquées.`);
    conditions.push('Une indemnité forfaitaire de 40€ pour frais de recouvrement sera également due.');
    conditions.push('');
  }

  // Escompte
  if (modalitesPaiement.escompte && modalitesPaiement.escompte > 0) {
    conditions.push('ESCOMPTE');
    conditions.push(`Un escompte de ${modalitesPaiement.escompte}% est accordé pour tout paiement anticipé de plus de 10 jours.`);
    conditions.push('');
  }

  // Conditions générales
  conditions.push('CONDITIONS GÉNÉRALES');
  
  if (type === 'devis') {
    conditions.push('- Ce devis devient un contrat dès acceptation par le client.');
    conditions.push('- Toute modification en cours de réalisation fera l\'objet d\'un avenant.');
    conditions.push('- Les prix sont exprimés en euros et hors taxes (TVA non applicable, art. 293 B du CGI).');
  } else {
    conditions.push('- Cette facture est payable à réception.');
    conditions.push('- Aucun escompte ne sera accordé pour paiement anticipé sauf mention contraire.');
    conditions.push('- TVA non applicable, art. 293 B du CGI.');
  }
  
  conditions.push('- En cas de litige, seuls les tribunaux français seront compétents.');
  conditions.push('- Conformément à la loi, le délai de prescription est de 5 ans.');

  return conditions.join('\n');
};

export const generatePaymentInstructions = (modalitesPaiement: PaymentTerms): string[] => {
  const instructions: string[] = [];

  modalitesPaiement.modesPaiement.forEach(mode => {
    switch (mode) {
      case 'virement':
        instructions.push('Virement bancaire : Coordonnées bancaires en bas de facture');
        break;
      case 'cheque':
        instructions.push('Chèque : À l\'ordre de [Nom de l\'entreprise]');
        break;
      case 'especes':
        instructions.push('Espèces : Remise contre reçu');
        break;
      case 'cb':
        instructions.push('Carte bancaire : Paiement sur place ou par terminal');
        break;
      case 'paypal':
        instructions.push('PayPal : Envoi d\'une demande de paiement par email');
        break;
      case 'stripe':
        instructions.push('Paiement en ligne : Lien de paiement sécurisé fourni');
        break;
    }
  });

  return instructions;
};