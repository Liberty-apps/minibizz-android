import React, { useState } from 'react';
import { X, Send, Euro, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Mission, Candidature } from '../types/mission';
import { saveCandidature } from '../utils/missionStorage';
import { getUserSettings } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/calculations';

interface CandidatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission | null;
  onSave: () => void;
}

const CandidatureModal: React.FC<CandidatureModalProps> = ({
  isOpen,
  onClose,
  mission,
  onSave
}) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [tarif, setTarif] = useState('');
  const [disponibilite, setDisponibilite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !mission) return;

    const userSettings = getUserSettings();

    const candidature: Candidature = {
      id: Date.now().toString(),
      missionId: mission.id,
      candidatId: currentUser.uid,
      candidat: {
        nom: userSettings?.nom || 'Nom',
        prenom: userSettings?.prenom || 'Prénom',
        email: userSettings?.email || currentUser.email || '',
        telephone: userSettings?.telephone,
        domaines: [mission.domaine],
        note: 0,
        nbMissions: 0
      },
      message: message.trim() || undefined,
      tarif: tarif ? parseFloat(tarif) : undefined,
      disponibilite: new Date(disponibilite),
      statut: 'en_attente',
      datePostulation: new Date()
    };

    saveCandidature(candidature);
    onSave();
    
    // Reset form
    setMessage('');
    setTarif('');
    setDisponibilite('');
  };

  if (!isOpen || !mission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Candidater à la mission</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Mission Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{mission.titre}</h3>
            <p className="text-gray-600 text-sm mb-3">{mission.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{mission.auteur.prenom} {mission.auteur.nom}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Début: {formatDate(mission.dateDebut)}</span>
              </div>
              {mission.budget && (
                <div className="flex items-center space-x-1">
                  <Euro className="w-4 h-4" />
                  <span>Budget: {formatCurrency(mission.budget)}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message de motivation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message de motivation
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Présentez-vous et expliquez pourquoi vous êtes le bon candidat pour cette mission..."
              />
            </div>

            {/* Tarif proposé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif proposé (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tarif}
                onChange={(e) => setTarif(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre tarif pour cette mission"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optionnel - vous pourrez négocier directement avec le client
              </p>
            </div>

            {/* Disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité *
              </label>
              <input
                type="date"
                required
                value={disponibilite}
                onChange={(e) => setDisponibilite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                À partir de quand pouvez-vous commencer cette mission ?
              </p>
            </div>

            {/* Info candidature */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Informations importantes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Votre candidature sera envoyée directement au porteur de la mission</li>
                <li>• Vous recevrez une notification dès qu'il y aura une réponse</li>
                <li>• Les détails de contact seront échangés en cas d'acceptation</li>
                <li>• Vous pourrez évaluer mutuellement la collaboration à la fin</li>
              </ul>
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
                <Send className="w-4 h-4" />
                <span>Envoyer ma candidature</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidatureModal;