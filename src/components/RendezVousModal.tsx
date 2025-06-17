import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, User, AlertCircle, Bell } from 'lucide-react';
import { RendezVous, TYPE_LABELS, PRIORITE_LABELS } from '../types/calendar';
import { getClients } from '../utils/storage';
import { saveRendezVous } from '../utils/calendarStorage';
import { Client } from '../types';

interface RendezVousModalProps {
  isOpen: boolean;
  onClose: () => void;
  rendezVous?: RendezVous | null;
  onSave: () => void;
  selectedDate?: Date;
}

const RendezVousModal: React.FC<RendezVousModalProps> = ({
  isOpen,
  onClose,
  rendezVous,
  onSave,
  selectedDate
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    clientId: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
    type: 'rendez_vous' as 'rendez_vous' | 'echeance_devis' | 'echeance_facture' | 'indisponibilite',
    priorite: 'normale' as 'basse' | 'normale' | 'haute' | 'urgente',
    lieu: '',
    notes: '',
    rappelActif: false,
    rappelDelai: 30
  });

  useEffect(() => {
    if (isOpen) {
      setClients(getClients());
      
      if (rendezVous) {
        setFormData({
          titre: rendezVous.titre,
          description: rendezVous.description || '',
          clientId: rendezVous.clientId,
          dateDebut: rendezVous.dateDebut.toISOString().split('T')[0],
          heureDebut: rendezVous.dateDebut.toTimeString().slice(0, 5),
          dateFin: rendezVous.dateFin.toISOString().split('T')[0],
          heureFin: rendezVous.dateFin.toTimeString().slice(0, 5),
          type: rendezVous.type,
          priorite: rendezVous.priorite,
          lieu: rendezVous.lieu || '',
          notes: rendezVous.notes || '',
          rappelActif: rendezVous.rappel?.actif || false,
          rappelDelai: rendezVous.rappel?.delai || 30
        });
      } else {
        const defaultDate = selectedDate || new Date();
        const defaultTime = '09:00';
        const endTime = '10:00';
        
        setFormData({
          titre: '',
          description: '',
          clientId: '',
          dateDebut: defaultDate.toISOString().split('T')[0],
          heureDebut: defaultTime,
          dateFin: defaultDate.toISOString().split('T')[0],
          heureFin: endTime,
          type: 'rendez_vous',
          priorite: 'normale',
          lieu: '',
          notes: '',
          rappelActif: false,
          rappelDelai: 30
        });
      }
    }
  }, [isOpen, rendezVous, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId && formData.type === 'rendez_vous') {
      alert('Veuillez sélectionner un client');
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    const dateDebut = new Date(`${formData.dateDebut}T${formData.heureDebut}`);
    const dateFin = new Date(`${formData.dateFin}T${formData.heureFin}`);

    if (dateFin <= dateDebut) {
      alert('La date de fin doit être postérieure à la date de début');
      return;
    }

    const rdv: RendezVous = {
      id: rendezVous?.id || Date.now().toString(),
      titre: formData.titre,
      description: formData.description,
      clientId: formData.clientId,
      client: selectedClient ? {
        nom: selectedClient.nom,
        email: selectedClient.email,
        telephone: selectedClient.telephone
      } : {
        nom: 'Indisponibilité',
        email: ''
      },
      dateDebut,
      dateFin,
      type: formData.type,
      statut: 'planifie',
      priorite: formData.priorite,
      lieu: formData.lieu,
      notes: formData.notes,
      rappel: formData.rappelActif ? {
        actif: true,
        delai: formData.rappelDelai
      } : undefined,
      dateCreation: rendezVous?.dateCreation || new Date(),
      dateModification: new Date()
    };

    saveRendezVous(rdv);
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {rendezVous ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Rendez-vous client, Réunion projet..."
            />
          </div>

          {/* Type et Priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité *
              </label>
              <select
                required
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(PRIORITE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client */}
          {formData.type === 'rendez_vous' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nom} - {client.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date et heure de début */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                required
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de début *
              </label>
              <input
                type="time"
                required
                value={formData.heureDebut}
                onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date et heure de fin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin *
              </label>
              <input
                type="date"
                required
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de fin *
              </label>
              <input
                type="time"
                required
                value={formData.heureFin}
                onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu
            </label>
            <input
              type="text"
              value={formData.lieu}
              onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Bureau, Visioconférence, Chez le client..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Détails du rendez-vous..."
            />
          </div>

          {/* Rappel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="rappel"
                checked={formData.rappelActif}
                onChange={(e) => setFormData({ ...formData, rappelActif: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rappel" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Bell className="w-4 h-4" />
                <span>Activer le rappel</span>
              </label>
            </div>
            
            {formData.rappelActif && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai de rappel (minutes avant)
                </label>
                <select
                  value={formData.rappelDelai}
                  onChange={(e) => setFormData({ ...formData, rappelDelai: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={120}>2 heures</option>
                  <option value={1440}>1 jour</option>
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{rendezVous ? 'Modifier' : 'Créer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RendezVousModal;