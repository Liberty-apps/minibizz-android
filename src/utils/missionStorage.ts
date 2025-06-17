import { Mission, Candidature, Evaluation } from '../types/mission';

const STORAGE_KEYS = {
  MISSIONS: 'minibizz_missions',
  CANDIDATURES: 'minibizz_candidatures',
  EVALUATIONS: 'minibizz_evaluations',
  USER_PROFILE: 'minibizz_user_profile'
};

// Missions
export const getMissions = (): Mission[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
  return data ? JSON.parse(data).map((m: any) => ({
    ...m,
    dateDebut: new Date(m.dateDebut),
    dateFin: m.dateFin ? new Date(m.dateFin) : undefined,
    dateCreation: new Date(m.dateCreation),
    dateModification: new Date(m.dateModification)
  })) : [];
};

export const saveMission = (mission: Mission): void => {
  const missions = getMissions();
  const existingIndex = missions.findIndex(m => m.id === mission.id);
  
  if (existingIndex >= 0) {
    missions[existingIndex] = mission;
  } else {
    missions.push(mission);
  }
  
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
};

export const deleteMission = (missionId: string): void => {
  const missions = getMissions().filter(m => m.id !== missionId);
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
};

// Candidatures
export const getCandidatures = (): Candidature[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CANDIDATURES);
  return data ? JSON.parse(data).map((c: any) => ({
    ...c,
    disponibilite: new Date(c.disponibilite),
    datePostulation: new Date(c.datePostulation)
  })) : [];
};

export const saveCandidature = (candidature: Candidature): void => {
  const candidatures = getCandidatures();
  const existingIndex = candidatures.findIndex(c => c.id === candidature.id);
  
  if (existingIndex >= 0) {
    candidatures[existingIndex] = candidature;
  } else {
    candidatures.push(candidature);
  }
  
  localStorage.setItem(STORAGE_KEYS.CANDIDATURES, JSON.stringify(candidatures));
};

// Évaluations
export const getEvaluations = (): Evaluation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
  return data ? JSON.parse(data).map((e: any) => ({
    ...e,
    dateEvaluation: new Date(e.dateEvaluation)
  })) : [];
};

export const saveEvaluation = (evaluation: Evaluation): void => {
  const evaluations = getEvaluations();
  evaluations.push(evaluation);
  localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
};

// Profil utilisateur pour les missions
export const getUserProfile = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : {
    domaines: [],
    note: 0,
    nbMissions: 0
  };
};

export const saveUserProfile = (profile: any): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

// Utilitaires
export const getMissionsByUser = (userId: string): Mission[] => {
  return getMissions().filter(m => m.auteurId === userId);
};

export const getCandidaturesByUser = (userId: string): Candidature[] => {
  return getCandidatures().filter(c => c.candidatId === userId);
};

export const getCandidaturesByMission = (missionId: string): Candidature[] => {
  return getCandidatures().filter(c => c.missionId === missionId);
};