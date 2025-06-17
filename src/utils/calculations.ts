import { CHARGES_SOCIALES, ActivityType } from '../types';

export const calculateNetRevenue = (grossAmount: number, activityType: ActivityType): number => {
  const chargeRate = CHARGES_SOCIALES[activityType];
  return grossAmount * (1 - chargeRate);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

export const calculateTVA = (amount: number, tvaRate: number = 0): number => {
  return amount * tvaRate;
};

export const calculateTotal = (sousTotal: number, tva: number): number => {
  return sousTotal + tva;
};