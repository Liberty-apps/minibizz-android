export interface Mission {
  id: string;
  titre: string;
  description: string;
  typeMission: 'service' | 'produit' | 'intellectuel';
  domaine: string;
  lieu: string;
  enLigne: boolean;
  dateDebut: Date;
  dateFin?: Date;
  budget?: number;
  urgence: 'low' | 'medium' | 'high';
  visibilite: 'publique' | 'contacts';
  statut: 'ouverte' | 'en_cours' | 'terminee' | 'annulee';
  auteurId: string;
  auteur: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    domaines: string[];
    note?: number;
    nbMissions: number;
  };
  candidatures: Candidature[];
  attributaire?: string;
  dateCreation: Date;
  dateModification: Date;
}

export interface Candidature {
  id: string;
  missionId: string;
  candidatId: string;
  candidat: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    domaines: string[];
    note?: number;
    nbMissions: number;
  };
  message?: string;
  tarif?: number;
  disponibilite: Date;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  datePostulation: Date;
}

export interface Evaluation {
  id: string;
  missionId: string;
  evaluateurId: string;
  evalueId: string;
  serieux: number; // 1-5
  respectBrief: number; // 1-5
  communication: number; // 1-5
  avisLibre?: string;
  dateEvaluation: Date;
}

export const DOMAINES = [
  'Graphisme & Design',
  'Développement Web',
  'Rédaction & Traduction',
  'Marketing Digital',
  'Photographie',
  'Vidéo & Animation',
  'Conseil & Formation',
  'Comptabilité',
  'Juridique',
  'Architecture',
  'Artisanat',
  'Services à la personne',
  'Événementiel',
  'Autre'
];

export const URGENCE_LABELS = {
  low: 'Pas urgent',
  medium: 'Modéré',
  high: 'Urgent'
};

export const URGENCE_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};