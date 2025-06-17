import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Euro, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getClients, getDevis, getFactures, getUserSettings } from '../utils/storage';
import { formatCurrency, calculateNetRevenue } from '../utils/calculations';
import { Client, Devis, Facture, UserSettings } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    setClients(getClients());
    setDevis(getDevis());
    setFactures(getFactures());
    setSettings(getUserSettings());
  }, []);

  const totalFacture = factures.reduce((sum, facture) => sum + facture.total, 0);
  const totalDevis = devis.reduce((sum, devis) => sum + devis.total, 0);
  const facturesPayees = factures.filter(f => f.statut === 'payee');
  const totalPaye = facturesPayees.reduce((sum, facture) => sum + facture.total, 0);
  
  const netRevenue = settings ? calculateNetRevenue(totalPaye, settings.activite) : 0;

  const recentDevis = devis.slice(0, 5);
  const recentFactures = factures.slice(0, 5);

  const stats = [
    {
      name: 'Clients',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Devis',
      value: devis.length,
      icon: FileText,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Factures',
      value: factures.length,
      icon: FileText,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'CA Total',
      value: formatCurrency(totalPaye),
      icon: Euro,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

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

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'devis':
        navigate('/devis');
        break;
      case 'facture':
        navigate('/devis');
        break;
      case 'client':
        navigate('/clients');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Summary */}
      {settings && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Revenus estimés</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Chiffre d'affaires brut</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPaye)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Charges sociales estimées</p>
              <p className="text-xl font-bold text-red-600">
                -{formatCurrency(totalPaye - netRevenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenu net estimé</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(netRevenue)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Estimation basée sur le taux de charges sociales pour l'activité {settings.activite}
          </p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Devis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Devis récents</h3>
          </div>
          <div className="p-6">
            {recentDevis.length > 0 ? (
              <div className="space-y-4">
                {recentDevis.map((devis) => (
                  <div key={devis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{devis.numero}</p>
                      <p className="text-sm text-gray-600">{devis.client.nom}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(devis.total)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(devis.statut)}`}>
                        {devis.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun devis créé</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Factures */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Factures récentes</h3>
          </div>
          <div className="p-6">
            {recentFactures.length > 0 ? (
              <div className="space-y-4">
                {recentFactures.map((facture) => (
                  <div key={facture.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{facture.numero}</p>
                      <p className="text-sm text-gray-600">{facture.client.nom}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(facture.total)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(facture.statut)}`}>
                        {facture.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune facture créée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleQuickAction('devis')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Nouveau devis</span>
          </button>
          <button 
            onClick={() => handleQuickAction('facture')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Nouvelle facture</span>
          </button>
          <button 
            onClick={() => handleQuickAction('client')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600">Nouveau client</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;