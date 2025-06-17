import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Euro,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  Send,
  Star,
  AlertCircle,
  Globe,
  Home,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMissions, saveMission, deleteMission, getCandidaturesByMission } from '../utils/missionStorage';
import { getUserSettings } from '../utils/storage';
import { Mission, DOMAINES, URGENCE_LABELS, URGENCE_COLORS } from '../types/mission';
import { formatCurrency, formatDate } from '../utils/calculations';
import MissionModal from '../components/MissionModal';
import CandidatureModal from '../components/CandidatureModal';

const Missions: React.FC = () => {
  const { currentUser } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomaine, setFilterDomaine] = useState('all');
  const [filterUrgence, setFilterUrgence] = useState('all');
  const [filterLieu, setFilterLieu] = useState('all');
  const [activeTab, setActiveTab] = useState<'toutes' | 'mes_missions' | 'mes_candidatures'>('toutes');
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  useEffect(() => {
    filterMissions();
  }, [missions, searchTerm, filterDomaine, filterUrgence, filterLieu, activeTab]);

  const loadMissions = () => {
    const allMissions = getMissions();
    setMissions(allMissions);
  };

  const filterMissions = () => {
    let filtered = missions;

    // Filtrer par onglet
    if (activeTab === 'mes_missions') {
      filtered = filtered.filter(m => m.auteurId === currentUser?.uid);
    } else if (activeTab === 'mes_candidatures') {
      // TODO: Implémenter le filtre pour les missions où l'utilisateur a candidaté
      filtered = filtered.filter(m => m.auteurId !== currentUser?.uid);
    } else {
      // Toutes les missions sauf les siennes
      filtered = filtered.filter(m => m.auteurId !== currentUser?.uid && m.statut === 'ouverte');
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.domaine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par domaine
    if (filterDomaine !== 'all') {
      filtered = filtered.filter(m => m.domaine === filterDomaine);
    }

    // Filtrer par urgence
    if (filterUrgence !== 'all') {
      filtered = filtered.filter(m => m.urgence === filterUrgence);
    }

    // Filtrer par lieu
    if (filterLieu !== 'all') {
      if (filterLieu === 'en_ligne') {
        filtered = filtered.filter(m => m.enLigne);
      } else {
        filtered = filtered.filter(m => !m.enLigne);
      }
    }

    setFilteredMissions(filtered);
  };

  const handleCreateMission = () => {
    setEditingMission(null);
    setShowMissionModal(true);
  };

  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setShowMissionModal(true);
  };

  const handleDeleteMission = (missionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
      deleteMission(missionId);
      loadMissions();
    }
  };

  const handleCandidater = (mission: Mission) => {
    setSelectedMission(mission);
    setShowCandidatureModal(true);
  };

  const handleMissionSaved = () => {
    loadMissions();
    setShowMissionModal(false);
    setEditingMission(null);
  };

  const handleCandidatureSaved = () => {
    setShowCandidatureModal(false);
    setSelectedMission(null);
  };

  const getUrgenceIcon = (urgence: string) => {
    switch (urgence) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const canEditMission = (mission: Mission) => {
    return mission.auteurId === currentUser?.uid && mission.statut === 'ouverte';
  };

  const canDeleteMission = (mission: Mission) => {
    return mission.auteurId === currentUser?.uid && mission.candidatures.length === 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Handshake className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partage de Missions</h1>
            <p className="text-gray-600">Collaborez avec d'autres auto-entrepreneurs</p>
          </div>
        </div>
        <button 
          onClick={handleCreateMission}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Publier une mission</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('toutes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'toutes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Toutes les missions</span>
          </button>
          <button
            onClick={() => setActiveTab('mes_missions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'mes_missions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Mes missions</span>
          </button>
          <button
            onClick={() => setActiveTab('mes_candidatures')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'mes_candidatures'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Mes candidatures</span>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterDomaine}
            onChange={(e) => setFilterDomaine(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les domaines</option>
            {DOMAINES.map(domaine => (
              <option key={domaine} value={domaine}>{domaine}</option>
            ))}
          </select>

          <select
            value={filterUrgence}
            onChange={(e) => setFilterUrgence(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes urgences</option>
            <option value="low">Pas urgent</option>
            <option value="medium">Modéré</option>
            <option value="high">Urgent</option>
          </select>

          <select
            value={filterLieu}
            onChange={(e) => setFilterLieu(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les lieux</option>
            <option value="en_ligne">En ligne</option>
            <option value="presentiel">Présentiel</option>
          </select>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid gap-6">
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{mission.titre}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${URGENCE_COLORS[mission.urgence]}`}>
                      {getUrgenceIcon(mission.urgence)}
                      <span className="ml-1">{URGENCE_LABELS[mission.urgence]}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{mission.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{mission.domaine}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {mission.enLigne ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      <span>{mission.enLigne ? 'En ligne' : mission.lieu}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Début: {formatDate(mission.dateDebut)}</span>
                    </div>
                    {mission.budget && (
                      <div className="flex items-center space-x-1">
                        <Euro className="w-4 h-4" />
                        <span>{formatCurrency(mission.budget)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{mission.candidatures.length} candidature(s)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-600">Par {mission.auteur.prenom} {mission.auteur.nom}</span>
                      {mission.auteur.note && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-yellow-600">{mission.auteur.note.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {activeTab === 'mes_missions' ? (
                    <>
                      {canEditMission(mission) && (
                        <button 
                          onClick={() => handleEditMission(mission)}
                          className="text-gray-600 hover:text-blue-600"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDeleteMission(mission) && (
                        <button 
                          onClick={() => handleDeleteMission(mission.id)}
                          className="text-gray-600 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={() => handleCandidater(mission)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Candidater</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Handshake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'toutes' ? 'Aucune mission disponible' : 
               activeTab === 'mes_missions' ? 'Aucune mission publiée' : 
               'Aucune candidature'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'toutes' ? 'Soyez le premier à publier une mission !' : 
               activeTab === 'mes_missions' ? 'Commencez par publier votre première mission' : 
               'Candidatez à des missions pour les voir apparaître ici'}
            </p>
            {activeTab !== 'mes_candidatures' && (
              <button 
                onClick={handleCreateMission}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Publier une mission
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <MissionModal
        isOpen={showMissionModal}
        onClose={() => {
          setShowMissionModal(false);
          setEditingMission(null);
        }}
        mission={editingMission}
        onSave={handleMissionSaved}
      />

      <CandidatureModal
        isOpen={showCandidatureModal}
        onClose={() => {
          setShowCandidatureModal(false);
          setSelectedMission(null);
        }}
        mission={selectedMission}
        onSave={handleCandidatureSaved}
      />
    </div>
  );
};

export default Missions;