import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, CreditCard, Calendar, Percent, Euro } from 'lucide-react';
import { Client, DevisItem, Devis, Facture, PaymentTerms, MODES_PAIEMENT, MODALITES_PAIEMENT } from '../types';
import { getClients, saveDevis, saveFacture, generateDevisNumber, generateFactureNumber, getUserSettings } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';
import { generateConditionsGenerales } from '../utils/conditionsGenerator';

interface DevisFactureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'devis' | 'facture';
  editingItem?: Devis | Facture | null;
  onSave: () => void;
}

const DevisFactureModal: React.FC<DevisFactureModalProps> = ({
  isOpen,
  onClose,
  type,
  editingItem,
  onSave
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  const [items, setItems] = useState<DevisItem[]>([
    { id: '1', description: '', quantite: 1, prixUnitaire: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState('');
  const [dureeValidite, setDureeValidite] = useState(30);
  const [modalitesPaiement, setModalitesPaiement] = useState<PaymentTerms>({
    delaiPaiement: 30,
    modalitePaiement: 'echeance',
    modesPaiement: ['virement'],
    penalitesRetard: 0,
    escompte: 0
  });
  const [activeTab, setActiveTab] = useState<'items' | 'paiement' | 'conditions'>('items');

  useEffect(() => {
    if (isOpen) {
      setClients(getClients());
      const userSettings = getUserSettings();
      
      if (editingItem) {
        setSelectedClientId(editingItem.clientId);
        setCustomNumber(editingItem.numero);
        setItems(editingItem.items);
        setNotes(editingItem.notes || '');
        setConditions(editingItem.conditions || '');
        setDureeValidite('dureeValidite' in editingItem ? editingItem.dureeValidite : 30);
        setModalitesPaiement(editingItem.modalitesPaiement || {
          delaiPaiement: 30,
          modalitePaiement: 'echeance',
          modesPaiement: ['virement'],
          penalitesRetard: 0,
          escompte: 0
        });
      } else {
        resetForm();
        // Charger les modalités par défaut depuis les paramètres
        if (userSettings?.modalitesPaiementDefaut) {
          setModalitesPaiement(userSettings.modalitesPaiementDefaut);
        }
      }
    }
  }, [isOpen, editingItem]);

  const resetForm = () => {
    setSelectedClientId('');
    setCustomNumber('');
    setItems([{ id: '1', description: '', quantite: 1, prixUnitaire: 0, total: 0 }]);
    setNotes('');
    setConditions('');
    setDureeValidite(30);
    setModalitesPaiement({
      delaiPaiement: 30,
      modalitePaiement: 'echeance',
      modesPaiement: ['virement'],
      penalitesRetard: 0,
      escompte: 0
    });
    setActiveTab('items');
  };

  const addItem = () => {
    const newItem: DevisItem = {
      id: Date.now().toString(),
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof DevisItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantite' || field === 'prixUnitaire') {
          updatedItem.total = updatedItem.quantite * updatedItem.prixUnitaire;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const updateModalitesPaiement = (field: keyof PaymentTerms, value: any) => {
    setModalitesPaiement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleModePaiement = (mode: string) => {
    setModalitesPaiement(prev => ({
      ...prev,
      modesPaiement: prev.modesPaiement.includes(mode)
        ? prev.modesPaiement.filter(m => m !== mode)
        : [...prev.modesPaiement, mode]
    }));
  };

  const calculateTotals = () => {
    const sousTotal = items.reduce((sum, item) => sum + item.total, 0);
    const tva = 0; // Auto-entrepreneur généralement exonéré de TVA
    const total = sousTotal + tva;
    return { sousTotal, tva, total };
  };

  const handleSave = () => {
    if (!selectedClientId) {
      alert('Veuillez sélectionner un client');
      return;
    }

    if (modalitesPaiement.modesPaiement.length === 0) {
      alert('Veuillez sélectionner au moins un mode de paiement');
      return;
    }

    const selectedClient = clients.find(c => c.id === selectedClientId);
    if (!selectedClient) return;

    const { sousTotal, tva, total } = calculateTotals();
    const now = new Date();

    // Utiliser le numéro personnalisé ou générer automatiquement
    const numero = customNumber.trim() || (editingItem?.numero || (type === 'devis' ? generateDevisNumber() : generateFactureNumber()));

    // Générer les conditions générales automatiquement
    const conditionsGenerees = generateConditionsGenerales(modalitesPaiement, type, dureeValidite);

    if (type === 'devis') {
      const devis: Devis = {
        id: editingItem?.id || Date.now().toString(),
        numero,
        clientId: selectedClientId,
        client: selectedClient,
        items,
        sousTotal,
        tva,
        total,
        statut: 'brouillon',
        dateCreation: editingItem?.dateCreation || now,
        dateValidite: new Date(now.getTime() + dureeValidite * 24 * 60 * 60 * 1000),
        dureeValidite,
        notes,
        conditions,
        conditionsGenerees,
        modalitesPaiement
      };
      saveDevis(devis);
    } else {
      const facture: Facture = {
        id: editingItem?.id || Date.now().toString(),
        numero,
        clientId: selectedClientId,
        client: selectedClient,
        items,
        sousTotal,
        tva,
        total,
        statut: 'brouillon',
        dateCreation: editingItem?.dateCreation || now,
        dateEcheance: new Date(now.getTime() + modalitesPaiement.delaiPaiement * 24 * 60 * 60 * 1000),
        notes,
        conditions,
        conditionsGenerees,
        modalitesPaiement
      };
      saveFacture(facture);
    }

    onSave();
    onClose();
  };

  // Vérifier si le document peut être modifié
  const canEdit = !editingItem || 
    (editingItem.statut === 'brouillon') ||
    (type === 'devis' && editingItem.statut === 'envoye') ||
    (type === 'facture' && editingItem.statut === 'envoyee');

  if (!isOpen) return null;

  const { sousTotal, tva, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editingItem ? `${canEdit ? 'Modifier' : 'Voir'} ${type}` : `Nouveau ${type}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!canEdit && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Ce document ne peut plus être modifié car il a été validé.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prestations
            </button>
            <button
              onClick={() => setActiveTab('paiement')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'paiement'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Modalités de paiement</span>
            </button>
            <button
              onClick={() => setActiveTab('conditions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'conditions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Conditions
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Selection and Number - Always visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nom} - {client.email}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro du {type}
              </label>
              <input
                type="text"
                value={customNumber}
                onChange={(e) => setCustomNumber(e.target.value)}
                disabled={!canEdit}
                placeholder={`Laissez vide pour génération automatique`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {customNumber.trim() ? `Numéro personnalisé: ${customNumber}` : 'Numéro généré automatiquement'}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'items' && (
            <>
              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Prestations / Produits
                  </label>
                  {canEdit && (
                    <button
                      onClick={addItem}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          disabled={!canEdit}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qté"
                          min="0.01"
                          step="0.01"
                          value={item.quantite}
                          onChange={(e) => updateItem(item.id, 'quantite', parseFloat(e.target.value) || 0)}
                          disabled={!canEdit}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Prix HT"
                          min="0"
                          step="0.01"
                          value={item.prixUnitaire}
                          onChange={(e) => updateItem(item.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                          disabled={!canEdit}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="col-span-1">
                        {canEdit && (
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sous-total HT :</span>
                    <span className="text-sm font-medium">{formatCurrency(sousTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">TVA :</span>
                    <span className="text-sm font-medium">{formatCurrency(tva)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total TTC :</span>
                    <span className="font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'paiement' && (
            <div className="space-y-6">
              {/* Durée de validité pour devis */}
              {type === 'devis' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée de validité du devis (jours)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={dureeValidite}
                      onChange={(e) => setDureeValidite(parseInt(e.target.value) || 30)}
                      disabled={!canEdit}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">jours</span>
                  </div>
                </div>
              )}

              {/* Modalité de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalité de paiement *
                </label>
                <div className="space-y-2">
                  {MODALITES_PAIEMENT.map(modalite => (
                    <label key={modalite.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="modalitePaiement"
                        value={modalite.id}
                        checked={modalitesPaiement.modalitePaiement === modalite.id}
                        onChange={(e) => updateModalitesPaiement('modalitePaiement', e.target.value)}
                        disabled={!canEdit}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{modalite.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Acompte si modalité acompte */}
              {modalitesPaiement.modalitePaiement === 'acompte' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourcentage d'acompte
                  </label>
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={modalitesPaiement.pourcentageAcompte || 30}
                      onChange={(e) => updateModalitesPaiement('pourcentageAcompte', parseInt(e.target.value))}
                      disabled={!canEdit}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              )}

              {/* Délai de paiement */}
              {modalitesPaiement.modalitePaiement !== 'comptant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai de paiement (jours)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={modalitesPaiement.delaiPaiement}
                      onChange={(e) => updateModalitesPaiement('delaiPaiement', parseInt(e.target.value) || 30)}
                      disabled={!canEdit}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">jours</span>
                  </div>
                </div>
              )}

              {/* Modes de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modes de paiement acceptés *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MODES_PAIEMENT.map(mode => (
                    <label key={mode.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={modalitesPaiement.modesPaiement.includes(mode.id)}
                        onChange={() => toggleModePaiement(mode.id)}
                        disabled={!canEdit}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options avancées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pénalités de retard (% par jour)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.01"
                      value={modalitesPaiement.penalitesRetard || 0}
                      onChange={(e) => updateModalitesPaiement('penalitesRetard', parseFloat(e.target.value) || 0)}
                      disabled={!canEdit}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">% / jour</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escompte paiement anticipé (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={modalitesPaiement.escompte || 0}
                      onChange={(e) => updateModalitesPaiement('escompte', parseFloat(e.target.value) || 0)}
                      disabled={!canEdit}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="space-y-6">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes personnalisées
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!canEdit}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Notes additionnelles..."
                />
              </div>

              {/* Conditions particulières */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions particulières
                </label>
                <textarea
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  disabled={!canEdit}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Conditions spécifiques à cette mission..."
                />
              </div>

              {/* Aperçu des conditions générées */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu des conditions générales (générées automatiquement)
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans">
                    {generateConditionsGenerales(modalitesPaiement, type, dureeValidite)}
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ces conditions seront automatiquement ajoutées au document PDF
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {canEdit ? 'Annuler' : 'Fermer'}
          </button>
          {canEdit && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevisFactureModal;