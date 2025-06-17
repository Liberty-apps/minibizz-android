import { Client, Devis, Facture, UserSettings } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'minibizz_clients',
  DEVIS: 'minibizz_devis',
  FACTURES: 'minibizz_factures',
  SETTINGS: 'minibizz_settings',
  COUNTERS: 'minibizz_counters'
};

// Clients
export const getClients = (): Client[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  const existingIndex = clients.findIndex(c => c.id === client.id);
  
  if (existingIndex >= 0) {
    clients[existingIndex] = client;
  } else {
    clients.push(client);
  }
  
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const deleteClient = (clientId: string): void => {
  const clients = getClients().filter(c => c.id !== clientId);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

// Devis
export const getDevis = (): Devis[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DEVIS);
  return data ? JSON.parse(data).map((d: any) => ({
    ...d,
    dateCreation: new Date(d.dateCreation),
    dateValidite: new Date(d.dateValidite)
  })) : [];
};

export const saveDevis = (devis: Devis): void => {
  const allDevis = getDevis();
  const existingIndex = allDevis.findIndex(d => d.id === devis.id);
  
  if (existingIndex >= 0) {
    allDevis[existingIndex] = devis;
  } else {
    allDevis.push(devis);
  }
  
  localStorage.setItem(STORAGE_KEYS.DEVIS, JSON.stringify(allDevis));
};

export const deleteDevis = (devisId: string): void => {
  const allDevis = getDevis().filter(d => d.id !== devisId);
  localStorage.setItem(STORAGE_KEYS.DEVIS, JSON.stringify(allDevis));
};

// Factures
export const getFactures = (): Facture[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FACTURES);
  return data ? JSON.parse(data).map((f: any) => ({
    ...f,
    dateCreation: new Date(f.dateCreation),
    dateEcheance: new Date(f.dateEcheance),
    datePaiement: f.datePaiement ? new Date(f.datePaiement) : undefined
  })) : [];
};

export const saveFacture = (facture: Facture): void => {
  const factures = getFactures();
  const existingIndex = factures.findIndex(f => f.id === facture.id);
  
  if (existingIndex >= 0) {
    factures[existingIndex] = facture;
  } else {
    factures.push(facture);
  }
  
  localStorage.setItem(STORAGE_KEYS.FACTURES, JSON.stringify(factures));
};

export const deleteFacture = (factureId: string): void => {
  const factures = getFactures().filter(f => f.id !== factureId);
  localStorage.setItem(STORAGE_KEYS.FACTURES, JSON.stringify(factures));
};

// Settings
export const getUserSettings = (): UserSettings | null => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : null;
};

export const saveUserSettings = (settings: UserSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Counters for numbering
export const getCounters = () => {
  const data = localStorage.getItem(STORAGE_KEYS.COUNTERS);
  return data ? JSON.parse(data) : { devis: 0, facture: 0 };
};

export const incrementCounter = (type: 'devis' | 'facture'): number => {
  const counters = getCounters();
  counters[type] += 1;
  localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  return counters[type];
};

export const generateDevisNumber = (): string => {
  const counter = incrementCounter('devis');
  const year = new Date().getFullYear();
  return `DEV-${year}-${counter.toString().padStart(4, '0')}`;
};

export const generateFactureNumber = (): string => {
  const counter = incrementCounter('facture');
  const year = new Date().getFullYear();
  return `FAC-${year}-${counter.toString().padStart(4, '0')}`;
};