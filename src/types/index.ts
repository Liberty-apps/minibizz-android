export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  siret?: string;
  createdAt: Date;
}

export interface DevisItem {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface PaymentTerms {
  delaiPaiement: number; // en jours
  modalitePaiement: 'comptant' | 'echeance' | 'acompte';
  pourcentageAcompte?: number;
  modesPaiement: string[]; // ['virement', 'cheque', 'especes', 'cb']
  penalitesRetard?: number; // taux journalier
  escompte?: number; // pourcentage si paiement anticipé
}

export interface Devis {
  id: string;
  numero: string;
  clientId: string;
  client: Client;
  items: DevisItem[];
  sousTotal: number;
  tva: number;
  total: number;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'facture';
  dateCreation: Date;
  dateValidite: Date;
  dureeValidite: number; // en jours
  notes?: string;
  conditions?: string;
  conditionsGenerees?: string; // CGV générées automatiquement
  modalitesPaiement: PaymentTerms;
}

export interface Facture {
  id: string;
  numero: string;
  devisId?: string;
  clientId: string;
  client: Client;
  items: DevisItem[];
  sousTotal: number;
  tva: number;
  total: number;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard';
  dateCreation: Date;
  dateEcheance: Date;
  datePaiement?: Date;
  notes?: string;
  conditions?: string;
  conditionsGenerees?: string;
  modalitesPaiement: PaymentTerms;
}

export interface UserSettings {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  siret: string;
  activite: 'vente' | 'service' | 'liberal';
  logo?: string;
  rib?: {
    iban: string;
    bic: string;
    banque: string;
  };
  cgv?: string;
  modalitesPaiementDefaut?: PaymentTerms;
}

export type ActivityType = 'vente' | 'service' | 'liberal';

export const CHARGES_SOCIALES: Record<ActivityType, number> = {
  vente: 0.123,      // 12.3%
  service: 0.211,    // 21.1%
  liberal: 0.22      // 22%
};

export const MODES_PAIEMENT = [
  { id: 'virement', label: 'Virement bancaire' },
  { id: 'cheque', label: 'Chèque' },
  { id: 'especes', label: 'Espèces' },
  { id: 'cb', label: 'Carte bancaire' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'stripe', label: 'Paiement en ligne' }
];

export const MODALITES_PAIEMENT = [
  { id: 'comptant', label: 'Comptant à la commande' },
  { id: 'echeance', label: 'À échéance' },
  { id: 'acompte', label: 'Acompte + solde' }
];