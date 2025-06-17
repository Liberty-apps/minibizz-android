import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Euro, Globe, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Mission, DOMAINES } from '../types/mission';
import { saveMission } from '../utils/missionStorage';
import { getUserSettings } from '../utils/storage';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: Mission | null;
  onSave: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  onSave
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    typeMission: 'service' as 'service' | 'produit' | 'intellectuel',
    domaine: '',
    lieu: '',
    enLigne: false,
    dateDebut: '',
    dateFin: '',
    budget: '',
    urgence: 'medium' as 'low' | 'medium' | 'high',
    visibilite: 'publique' as 'publique' | 'contacts'
  });

  useEffect(() => {
    if (isOpen) {
      if (mission) {
        setFormData({
          titre: mission.titre,
          description: mission.description,
          typeMission: mission.typeMission,
          domaine: mission.domaine,
          lieu: mission.lieu,
          enLigne: mission.enLigne,
          dateDebut: mission.dateDebut.toISOString().split('T')[0],
          dateFin: mission.dateFin ? mission.dateFin.toISOString().split('T')[0] : '',
          budget: mission.budget ? mission.budget.toString() : '',
          urgence: mission.urgence,
          visibilite: mission.visibilite
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, mission]);

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      typeMission: 'service',
      domaine: '',
      lieu: '',
      enLigne: false,
      dateDebut: '',
      dateFin: '',
      budget: '',
      urgence: 'medium',
      visibilite: 'publique'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const userSettings = getUserSettings();
    const now = new Date();

    const missionData: Mission = {
      id: mission?.id || Date.now().toString(),
      titre: formData.titre,
      description: formData.description,
      typeMission: formData.typeMission,
      domaine: formData.domaine,
      lieu: formData.lieu,
      enLigne: formData.enLigne,
      dateDebut: new Date(formData.dateDebut),
      dateFin: formData.dateFin ? new Date(formData.dateFin) : undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      urgence: formData.urgence,
      visibilite: formData.visibilite,
      statut: 'ouverte',
      auteurId: currentUser.uid,
      auteur: {
        nom: userSettings?.nom || 'Nom',
        prenom: userSettings?.prenom || 'Prénom',
        email: userSettings?.email || currentUser.email || '',
        telephone: userSettings?.telephone,
        domaines: [formData.domaine],
        note: 0,
        nbMissions: 0
      },
      candidatures: mission?.candidatures || [],
      dateCreation: mission?.dateCreation || now,
      dateModification: now
    };

    saveMission(missionData);
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {mission ? 'Modifier la mission' : 'Nouvelle mission'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la mission *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Création d'un logo pour startup"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrivez précisément la mission, les livrables attendus, les compétences requises..."
            />
          </div>

          {/* Type et Domaine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de mission *
              </label>
              <select
                required
                value={formData.typeMission}
                onChange={(e) => setFormData({ ...formData, typeMission: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="service">Prestation de service</option>
                <option value="produit">Vente de produit</option>
                <option value="intellectuel">Prestation intellectuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine *
              </label>
              <select
                required
                value={formData.domaine}
                onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un domaine</option>
                {DOMAINES.map(domaine => (
                  <option key={domaine} value={domaine}>{domaine}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lieu et En ligne */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                id="enLigne"
                checked={formData.enLigne}
                onChange={(e) => setFormData({ ...formData, enLigne: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enLigne" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>Mission réalisable en ligne</span>
              </label>
            </div>
            
            {!formData.enLigne && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu de la mission *
                </label>
                <input
                  type="text"
                  required={!formData.enLigne}
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Paris, Lyon, Marseille..."
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début souhaitée *
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
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Budget et Urgence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget indicatif (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgence *
              </label>
              <select
                required
                value={formData.urgence}
                onChange={(e) => setFormData({ ...formData, urgence: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Pas urgent</option>
                <option value="medium">Modéré</option>
                <option value="high">Urgent</option>
              </select>
            </div>
          </div>

          {/* Visibilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilité *
            </label>
            <select
              required
              value={formData.visibilite}
              onChange={(e) => setFormData({ ...formData, visibilite: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="publique">Publique (visible par tous)</option>
              <option value="contacts">Contacts uniquement</option>
            </select>
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
              <span>{mission ? 'Modifier' : 'Publier'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionModal;