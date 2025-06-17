import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getDevis, getFactures, deleteDevis, deleteFacture, saveDevis, saveFacture } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/calculations';
import { Devis, Facture } from '../types';
import DevisFactureModal from '../components/DevisFactureModal';
import { generatePDF } from '../utils/pdf';

const DevisFactures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'devis' | 'factures'>('devis');
  const [devis, setDevis] = useState<Devis[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Devis | Facture | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDevis(getDevis());
    setFactures(getFactures());
  };

  const handleDeleteDevis = (id: string) => {
    const devisItem = devis.find(d => d.id === id);
    if (devisItem && ['accepte', 'facture'].includes(devisItem.statut)) {
      alert('Impossible de supprimer un devis validé');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      deleteDevis(id);
      loadData();
    }
  };

  const handleDeleteFacture = (id: string) => {
    const factureItem = factures.find(f => f.id === id);
    if (factureItem && factureItem.statut === 'payee') {
      alert('Impossible de supprimer une facture payée');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteFacture(id);
      loadData();
    }
  };

  const handleEdit = (item: Devis | Facture) => {
    const canEdit = item.statut === 'brouillon' || 
      (activeTab === 'devis' && item.statut === 'envoye') ||
      (activeTab === 'factures' && item.statut === 'envoyee');
    
    if (!canEdit) {
      alert('Ce document ne peut plus être modifié car il a été validé');
      return;
    }
    
    setEditingItem(item);
    setShowModal(true);
  };

  const handleView = (item: Devis | Facture) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDownload = async (item: Devis | Facture) => {
    try {
      setDownloadingId(item.id);
      console.log('Génération du PDF pour:', item.numero);
      
      // Vérifier que l'item a bien des données
      if (!item.items || item.items.length === 0) {
        throw new Error('Aucun élément à facturer trouvé');
      }
      
      if (!item.client) {
        throw new Error('Informations client manquantes');
      }

      await generatePDF(item, activeTab);
      console.log('PDF généré avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSend = (item: Devis | Facture) => {
    const newStatus = activeTab === 'devis' ? 'envoye' : 'envoyee';
    const updatedItem = { ...item, statut: newStatus as any };
    
    if (activeTab === 'devis') {
      saveDevis(updatedItem as Devis);
    } else {
      saveFacture(updatedItem as Facture);
    }
    
    loadData();
    alert(`${activeTab === 'devis' ? 'Devis' : 'Facture'} marqué(e) comme envoyé(e)`);
  };

  const handleStatusChange = (item: Devis | Facture, newStatus: string) => {
    const updatedItem = { ...item, statut: newStatus as any };
    
    if (activeTab === 'devis') {
      saveDevis(updatedItem as Devis);
    } else {
      if (newStatus === 'payee') {
        (updatedItem as Facture).datePaiement = new Date();
      }
      saveFacture(updatedItem as Facture);
    }
    
    loadData();
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'bg-gray-100 text-gray-800';
      case 'envoye': return 'bg-blue-100 text-blue-800';
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      case 'facture': return 'bg-purple-100 text-purple-800';
      case 'envoyee': return 'bg-blue-100 text-blue-800';
      case 'payee': return 'bg-green-100 text-green-800';
      case 'en_retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canDelete = (item: Devis | Facture) => {
    if (activeTab === 'devis') {
      return !['accepte', 'facture'].includes(item.statut);
    } else {
      return item.statut !== 'payee';
    }
  };

  const canEdit = (item: Devis | Facture) => {
    return item.statut === 'brouillon' || 
      (activeTab === 'devis' && item.statut === 'envoye') ||
      (activeTab === 'factures' && item.statut === 'envoyee');
  };

  const filteredDevis = devis.filter(d => {
    const matchesSearch = d.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || d.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredFactures = factures.filter(f => {
    const matchesSearch = f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || f.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devis & Factures</h1>
          <p className="text-gray-600">Gérez vos devis et factures</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau {activeTab === 'devis' ? 'devis' : 'facture'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('devis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'devis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Devis ({devis.length})
          </button>
          <button
            onClick={() => setActiveTab('factures')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'factures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Factures ({factures.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par numéro ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            {activeTab === 'devis' ? (
              <>
                <option value="brouillon">Brouillon</option>
                <option value="envoye">Envoyé</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="facture">Facturé</option>
              </>
            ) : (
              <>
                <option value="brouillon">Brouillon</option>
                <option value="envoyee">Envoyée</option>
                <option value="payee">Payée</option>
                <option value="en_retard">En retard</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'devis' ? (
          <div className="overflow-x-auto">
            {filteredDevis.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevis.map((devis) => (
                    <tr key={devis.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {devis.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {devis.client.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(devis.dateCreation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(devis.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(devis.statut)}`}>
                            {devis.statut}
                          </span>
                          {devis.statut === 'envoye' && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleStatusChange(devis, 'accepte')}
                                className="text-green-600 hover:text-green-800"
                                title="Marquer comme accepté"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(devis, 'refuse')}
                                className="text-red-600 hover:text-red-800"
                                title="Marquer comme refusé"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleView(devis)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit(devis) && (
                            <button 
                              onClick={() => handleEdit(devis)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDownload(devis)}
                            disabled={downloadingId === devis.id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Télécharger PDF"
                          >
                            {downloadingId === devis.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          {devis.statut === 'brouillon' && (
                            <button 
                              onClick={() => handleSend(devis)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Marquer comme envoyé"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete(devis) && (
                            <button 
                              onClick={() => handleDeleteDevis(devis.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devis trouvé</h3>
                <p className="text-gray-500 mb-4">Commencez par créer votre premier devis</p>
                <button 
                  onClick={() => {
                    setEditingItem(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer un devis
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredFactures.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Échéance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFactures.map((facture) => (
                    <tr key={facture.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {facture.numero}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facture.client.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(facture.dateCreation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(facture.dateEcheance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(facture.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(facture.statut)}`}>
                            {facture.statut}
                          </span>
                          {facture.statut === 'envoyee' && (
                            <button
                              onClick={() => handleStatusChange(facture, 'payee')}
                              className="text-green-600 hover:text-green-800"
                              title="Marquer comme payée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleView(facture)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit(facture) && (
                            <button 
                              onClick={() => handleEdit(facture)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDownload(facture)}
                            disabled={downloadingId === facture.id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Télécharger PDF"
                          >
                            {downloadingId === facture.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          {facture.statut === 'brouillon' && (
                            <button 
                              onClick={() => handleSend(facture)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Marquer comme envoyée"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete(facture) && (
                            <button 
                              onClick={() => handleDeleteFacture(facture.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture trouvée</h3>
                <p className="text-gray-500 mb-4">Commencez par créer votre première facture</p>
                <button 
                  onClick={() => {
                    setEditingItem(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer une facture
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <DevisFactureModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        type={activeTab === 'factures' ? 'facture' : 'devis'}
        editingItem={editingItem}
        onSave={() => {
          loadData();
          setShowModal(false);
          setEditingItem(null);
        }}
      />
    </div>
  );
};

export default DevisFactures;