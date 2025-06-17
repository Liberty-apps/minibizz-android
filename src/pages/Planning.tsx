import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Bell,
  Grid3X3,
  List,
  Zap
} from 'lucide-react';
import { 
  getRendezVous, 
  saveRendezVous, 
  deleteRendezVous, 
  generateEcheancesAutomatiques,
  findCreneauxLibres,
  getWeekDays,
  getMonthDays,
  isSameDay,
  addDays
} from '../utils/calendarStorage';
import { RendezVous, TYPE_LABELS, TYPE_COLORS, PRIORITE_LABELS, PRIORITE_COLORS } from '../types/calendar';
import { formatDate } from '../utils/calculations';
import RendezVousModal from '../components/RendezVousModal';

const Planning: React.FC = () => {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [echeancesAuto, setEcheancesAuto] = useState<RendezVous[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [showModal, setShowModal] = useState(false);
  const [editingRdv, setEditingRdv] = useState<RendezVous | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriorite, setFilterPriorite] = useState('all');
  const [showCreneauxLibres, setShowCreneauxLibres] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const rdvData = getRendezVous();
    const echeances = generateEcheancesAutomatiques();
    setRendezVous(rdvData);
    setEcheancesAuto(echeances);
  };

  const handleCreateRdv = (date?: Date) => {
    setEditingRdv(null);
    setSelectedDate(date || currentDate);
    setShowModal(true);
  };

  const handleEditRdv = (rdv: RendezVous) => {
    setEditingRdv(rdv);
    setSelectedDate(null);
    setShowModal(true);
  };

  const handleDeleteRdv = (rdvId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      deleteRendezVous(rdvId);
      loadData();
    }
  };

  const handleStatusChange = (rdv: RendezVous, newStatus: RendezVous['statut']) => {
    const updatedRdv = { ...rdv, statut: newStatus, dateModification: new Date() };
    saveRendezVous(updatedRdv);
    loadData();
  };

  const handleRdvSaved = () => {
    loadData();
    setShowModal(false);
    setEditingRdv(null);
    setSelectedDate(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getFilteredRdv = () => {
    const allRdv = [...rendezVous, ...echeancesAuto];
    
    return allRdv.filter(rdv => {
      const matchesSearch = rdv.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rdv.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || rdv.type === filterType;
      const matchesPriorite = filterPriorite === 'all' || rdv.priorite === filterPriorite;
      
      return matchesSearch && matchesType && matchesPriorite;
    });
  };

  const getRdvForDate = (date: Date) => {
    return getFilteredRdv().filter(rdv => isSameDay(rdv.dateDebut, date));
  };

  const getRdvForPeriod = () => {
    const filtered = getFilteredRdv();
    
    switch (viewMode) {
      case 'day':
        return filtered.filter(rdv => isSameDay(rdv.dateDebut, currentDate));
      case 'week':
        const weekDays = getWeekDays(currentDate);
        return filtered.filter(rdv => 
          weekDays.some(day => isSameDay(rdv.dateDebut, day))
        );
      case 'month':
        const monthDays = getMonthDays(currentDate);
        return filtered.filter(rdv => 
          monthDays.some(day => isSameDay(rdv.dateDebut, day))
        );
      default:
        return filtered;
    }
  };

  const getStatusIcon = (statut: RendezVous['statut']) => {
    switch (statut) {
      case 'planifie': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'confirme': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'annule': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'reporte': return <RotateCcw className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getCreneauxLibres = (date: Date) => {
    return findCreneauxLibres(date, 60);
  };

  const renderDayView = () => {
    const rdvJour = getRdvForDate(currentDate);
    const creneauxLibres = showCreneauxLibres ? getCreneauxLibres(currentDate) : [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <button
            onClick={() => handleCreateRdv(currentDate)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV</span>
          </button>
        </div>

        {/* Créneaux libres */}
        {showCreneauxLibres && creneauxLibres.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Créneaux libres disponibles</span>
            </h4>
            <div className="space-y-2">
              {creneauxLibres.map((creneau, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
                  <span className="text-sm text-gray-700">
                    {formatTime(creneau.debut)} - {formatTime(creneau.fin)} 
                    <span className="text-gray-500 ml-2">({Math.floor(creneau.duree)} min)</span>
                  </span>
                  <button
                    onClick={() => {
                      const rdvDate = new Date(creneau.debut);
                      setSelectedDate(rdvDate);
                      setShowModal(true);
                    }}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Réserver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rendez-vous du jour */}
        <div className="space-y-3">
          {rdvJour.length > 0 ? (
            rdvJour
              .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
              .map((rdv) => (
                <div key={rdv.id} className={`border rounded-lg p-4 ${TYPE_COLORS[rdv.type]}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(rdv.statut)}
                        <h4 className="font-medium text-gray-900">{rdv.titre}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${PRIORITE_COLORS[rdv.priorite]}`}>
                          {PRIORITE_LABELS[rdv.priorite]}
                        </span>
                        {rdv.rappel?.actif && <Bell className="w-4 h-4 text-blue-500" />}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(rdv.dateDebut)} - {formatTime(rdv.dateFin)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{rdv.client.nom}</span>
                        </div>
                        {rdv.lieu && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{rdv.lieu}</span>
                          </div>
                        )}
                      </div>
                      
                      {rdv.description && (
                        <p className="text-sm text-gray-600 mt-2">{rdv.description}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {rdv.statut === 'planifie' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(rdv, 'confirme')}
                            className="text-green-600 hover:text-green-800"
                            title="Confirmer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(rdv, 'reporte')}
                            className="text-orange-600 hover:text-orange-800"
                            title="Reporter"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(rdv, 'annule')}
                            className="text-red-600 hover:text-red-800"
                            title="Annuler"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {!rdv.id.startsWith('echeance-') && (
                        <>
                          <button 
                            onClick={() => handleEditRdv(rdv)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRdv(rdv.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun rendez-vous prévu pour cette journée</p>
              <button
                onClick={() => handleCreateRdv(currentDate)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Planifier un rendez-vous
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const rdvJour = getRdvForDate(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={index} className={`border rounded-lg p-3 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </h4>
                <button
                  onClick={() => handleCreateRdv(day)}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {rdvJour.slice(0, 3).map((rdv) => (
                  <div 
                    key={rdv.id} 
                    className={`p-2 rounded text-xs cursor-pointer ${TYPE_COLORS[rdv.type]}`}
                    onClick={() => handleEditRdv(rdv)}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(rdv.statut)}
                      <span className="font-medium truncate">{rdv.titre}</span>
                    </div>
                    <div className="text-gray-600 mt-1">
                      {formatTime(rdv.dateDebut)}
                    </div>
                  </div>
                ))}
                
                {rdvJour.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{rdvJour.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays(currentDate);
    const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Lundi = 0
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const calendarDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const prevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
      calendarDays.push({ date: prevDay, isCurrentMonth: false });
    }
    
    // Ajouter les jours du mois actuel
    monthDays.forEach(day => {
      calendarDays.push({ date: day, isCurrentMonth: true });
    });
    
    // Compléter avec les jours du mois suivant
    const remainingCells = 42 - calendarDays.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingCells; i++) {
      const nextDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
      calendarDays.push({ date: nextDay, isCurrentMonth: false });
    }

    return (
      <div>
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            const rdvJour = getRdvForDate(dayInfo.date);
            const isToday = isSameDay(dayInfo.date, new Date());
            
            return (
              <div 
                key={index} 
                className={`min-h-[100px] border rounded p-1 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-blue-50 border-blue-200' : 
                  dayInfo.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                }`}
                onClick={() => handleCreateRdv(dayInfo.date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-900' : 
                  dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {dayInfo.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {rdvJour.slice(0, 2).map((rdv) => (
                    <div 
                      key={rdv.id}
                      className={`text-xs p-1 rounded truncate ${TYPE_COLORS[rdv.type]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRdv(rdv);
                      }}
                    >
                      {rdv.titre}
                    </div>
                  ))}
                  
                  {rdvJour.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{rdvJour.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning & Calendrier</h1>
          <p className="text-gray-600">Gérez vos rendez-vous et votre planning</p>
        </div>
        <button 
          onClick={() => handleCreateRdv()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau rendez-vous</span>
        </button>
      </div>

      {/* Filtres et contrôles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtres */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterPriorite}
              onChange={(e) => setFilterPriorite(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes priorités</option>
              {Object.entries(PRIORITE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowCreneauxLibres(!showCreneauxLibres)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                showCreneauxLibres 
                  ? 'bg-green-100 text-green-800 border-green-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation et vues */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {viewMode === 'month' && currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              {viewMode === 'week' && `Semaine du ${getWeekDays(currentDate)[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
              {viewMode === 'day' && currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
            >
              Aujourd'hui
            </button>
          </div>

          {/* Sélecteur de vue */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mois
            </button>
          </div>
        </div>

        {/* Contenu du calendrier */}
        <div className="p-4">
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Aujourd'hui</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {getRdvForDate(new Date()).length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Cette semaine</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {getWeekDays(new Date()).reduce((total, day) => total + getRdvForDate(day).length, 0)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Confirmés</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {rendezVous.filter(rdv => rdv.statut === 'confirme').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">En attente</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {rendezVous.filter(rdv => rdv.statut === 'planifie').length}
          </p>
        </div>
      </div>

      {/* Modal */}
      <RendezVousModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRdv(null);
          setSelectedDate(null);
        }}
        rendezVous={editingRdv}
        selectedDate={selectedDate || undefined}
        onSave={handleRdvSaved}
      />
    </div>
  );
};

export default Planning;