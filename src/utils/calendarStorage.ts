import { RendezVous, Disponibilite, CreneauLibre } from '../types/calendar';
import { getDevis, getFactures } from './storage';

const STORAGE_KEYS = {
  RENDEZ_VOUS: 'minibizz_rendez_vous',
  DISPONIBILITES: 'minibizz_disponibilites'
};

// Rendez-vous
export const getRendezVous = (): RendezVous[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RENDEZ_VOUS);
  return data ? JSON.parse(data).map((rdv: any) => ({
    ...rdv,
    dateDebut: new Date(rdv.dateDebut),
    dateFin: new Date(rdv.dateFin),
    dateCreation: new Date(rdv.dateCreation),
    dateModification: new Date(rdv.dateModification)
  })) : [];
};

export const saveRendezVous = (rdv: RendezVous): void => {
  const rendezVous = getRendezVous();
  const existingIndex = rendezVous.findIndex(r => r.id === rdv.id);
  
  if (existingIndex >= 0) {
    rendezVous[existingIndex] = rdv;
  } else {
    rendezVous.push(rdv);
  }
  
  localStorage.setItem(STORAGE_KEYS.RENDEZ_VOUS, JSON.stringify(rendezVous));
};

export const deleteRendezVous = (rdvId: string): void => {
  const rendezVous = getRendezVous().filter(r => r.id !== rdvId);
  localStorage.setItem(STORAGE_KEYS.RENDEZ_VOUS, JSON.stringify(rendezVous));
};

// Disponibilités
export const getDisponibilites = (): Disponibilite[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DISPONIBILITES);
  return data ? JSON.parse(data).map((disp: any) => ({
    ...disp,
    dateDebut: new Date(disp.dateDebut),
    dateFin: new Date(disp.dateFin),
    recurrence: disp.recurrence ? {
      ...disp.recurrence,
      fin: disp.recurrence.fin ? new Date(disp.recurrence.fin) : undefined
    } : undefined
  })) : [];
};

export const saveDisponibilite = (disp: Disponibilite): void => {
  const disponibilites = getDisponibilites();
  const existingIndex = disponibilites.findIndex(d => d.id === disp.id);
  
  if (existingIndex >= 0) {
    disponibilites[existingIndex] = disp;
  } else {
    disponibilites.push(disp);
  }
  
  localStorage.setItem(STORAGE_KEYS.DISPONIBILITES, JSON.stringify(disponibilites));
};

export const deleteDisponibilite = (dispId: string): void => {
  const disponibilites = getDisponibilites().filter(d => d.id !== dispId);
  localStorage.setItem(STORAGE_KEYS.DISPONIBILITES, JSON.stringify(disponibilites));
};

// Génération automatique des échéances
export const generateEcheancesAutomatiques = (): RendezVous[] => {
  const devis = getDevis();
  const factures = getFactures();
  const echeances: RendezVous[] = [];

  // Échéances de devis (date de validité)
  devis.forEach(devis => {
    if (devis.statut === 'envoye' && devis.dateValidite > new Date()) {
      echeances.push({
        id: `echeance-devis-${devis.id}`,
        titre: `Échéance devis ${devis.numero}`,
        description: `Date limite de validité du devis`,
        clientId: devis.clientId,
        client: devis.client,
        dateDebut: new Date(devis.dateValidite.getTime() - 24 * 60 * 60 * 1000), // 1 jour avant
        dateFin: devis.dateValidite,
        type: 'echeance_devis',
        statut: 'planifie',
        priorite: 'haute',
        devisId: devis.id,
        dateCreation: new Date(),
        dateModification: new Date()
      });
    }
  });

  // Échéances de factures (date d'échéance)
  factures.forEach(facture => {
    if (facture.statut === 'envoyee' && facture.dateEcheance > new Date()) {
      echeances.push({
        id: `echeance-facture-${facture.id}`,
        titre: `Échéance facture ${facture.numero}`,
        description: `Date limite de paiement`,
        clientId: facture.clientId,
        client: facture.client,
        dateDebut: new Date(facture.dateEcheance.getTime() - 24 * 60 * 60 * 1000), // 1 jour avant
        dateFin: facture.dateEcheance,
        type: 'echeance_facture',
        statut: 'planifie',
        priorite: 'haute',
        factureId: facture.id,
        dateCreation: new Date(),
        dateModification: new Date()
      });
    }
  });

  return echeances;
};

// Recherche de créneaux libres
export const findCreneauxLibres = (
  date: Date,
  dureeMinutes: number = 60
): CreneauLibre[] => {
  const rendezVous = getRendezVous();
  const disponibilites = getDisponibilites();
  const creneaux: CreneauLibre[] = [];

  // Définir les heures de travail par défaut (9h-18h)
  const debutJournee = new Date(date);
  debutJournee.setHours(9, 0, 0, 0);
  const finJournee = new Date(date);
  finJournee.setHours(18, 0, 0, 0);

  // Vérifier les indisponibilités
  const indisponibilites = disponibilites.filter(d => 
    d.type === 'indisponible' &&
    d.dateDebut <= finJournee &&
    d.dateFin >= debutJournee
  );

  // Vérifier les rendez-vous existants
  const rdvJour = rendezVous.filter(rdv =>
    rdv.dateDebut.toDateString() === date.toDateString() &&
    rdv.statut !== 'annule'
  ).sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime());

  // Calculer les créneaux libres
  let currentTime = debutJournee;

  rdvJour.forEach(rdv => {
    if (rdv.dateDebut.getTime() - currentTime.getTime() >= dureeMinutes * 60 * 1000) {
      // Vérifier qu'il n'y a pas d'indisponibilité
      const hasIndispo = indisponibilites.some(indispo =>
        indispo.dateDebut < rdv.dateDebut && indispo.dateFin > currentTime
      );

      if (!hasIndispo) {
        creneaux.push({
          debut: new Date(currentTime),
          fin: new Date(rdv.dateDebut),
          duree: (rdv.dateDebut.getTime() - currentTime.getTime()) / (1000 * 60)
        });
      }
    }
    currentTime = new Date(Math.max(currentTime.getTime(), rdv.dateFin.getTime()));
  });

  // Créneau après le dernier RDV
  if (finJournee.getTime() - currentTime.getTime() >= dureeMinutes * 60 * 1000) {
    const hasIndispo = indisponibilites.some(indispo =>
      indispo.dateDebut < finJournee && indispo.dateFin > currentTime
    );

    if (!hasIndispo) {
      creneaux.push({
        debut: new Date(currentTime),
        fin: new Date(finJournee),
        duree: (finJournee.getTime() - currentTime.getTime()) / (1000 * 60)
      });
    }
  }

  return creneaux.filter(c => c.duree >= dureeMinutes);
};

// Utilitaires de date
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekDays = (date: Date): Date[] => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi = début de semaine
  startOfWeek.setDate(diff);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startOfWeek, i));
  }
  return days;
};

export const getMonthDays = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }
  return days;
};