export interface RendezVous {
  id: string;
  titre: string;
  description?: string;
  clientId: string;
  client: {
    nom: string;
    email: string;
    telephone?: string;
  };
  dateDebut: Date;
  dateFin: Date;
  type: 'rendez_vous' | 'echeance_devis' | 'echeance_facture' | 'indisponibilite';
  statut: 'planifie' | 'confirme' | 'annule' | 'reporte';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  lieu?: string;
  notes?: string;
  rappel?: {
    actif: boolean;
    delai: number; // en minutes avant le RDV
  };
  devisId?: string;
  factureId?: string;
  dateCreation: Date;
  dateModification: Date;
}

export interface Disponibilite {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  type: 'disponible' | 'indisponible';
  motif?: string;
  recurrence?: {
    type: 'aucune' | 'quotidienne' | 'hebdomadaire' | 'mensuelle';
    fin?: Date;
    jours?: number[]; // 0=dimanche, 1=lundi, etc.
  };
}

export interface CreneauLibre {
  debut: Date;
  fin: Date;
  duree: number; // en minutes
}

export const TYPE_LABELS = {
  rendez_vous: 'Rendez-vous client',
  echeance_devis: 'Échéance devis',
  echeance_facture: 'Échéance facture',
  indisponibilite: 'Indisponibilité'
};

export const TYPE_COLORS = {
  rendez_vous: 'bg-blue-100 text-blue-800 border-blue-200',
  echeance_devis: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  echeance_facture: 'bg-green-100 text-green-800 border-green-200',
  indisponibilite: 'bg-red-100 text-red-800 border-red-200'
};

export const PRIORITE_LABELS = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente'
};

export const PRIORITE_COLORS = {
  basse: 'bg-gray-100 text-gray-800',
  normale: 'bg-blue-100 text-blue-800',
  haute: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800'
};