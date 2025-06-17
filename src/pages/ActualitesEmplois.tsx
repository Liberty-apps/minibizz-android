import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Briefcase, 
  Search, 
  Filter,
  ExternalLink,
  MapPin,
  Calendar,
  Euro,
  Clock,
  TrendingUp,
  Users,
  Building,
  Sparkles
} from 'lucide-react';
import { getUserSettings } from '../utils/storage';
import { UserSettings } from '../types';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: string;
  url: string;
  relevance: number;
}

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedDate: string;
  url: string;
  relevance: number;
}

const ActualitesEmplois: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actualites' | 'emplois'>('actualites');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);

  useEffect(() => {
    const userSettings = getUserSettings();
    setSettings(userSettings);
    generateContent(userSettings);
  }, []);

  const generateContent = (userSettings: UserSettings | null) => {
    setLoading(true);
    
    // Simuler un délai de chargement pour l'effet IA
    setTimeout(() => {
      const activityType = userSettings?.activite || 'service';
      setNews(generateNewsForActivity(activityType));
      setJobs(generateJobsForActivity(activityType));
      setLoading(false);
    }, 2000);
  };

  const generateNewsForActivity = (activityType: string): NewsItem[] => {
    const baseNews = [
      {
        id: '1',
        title: 'Nouvelles mesures fiscales pour les auto-entrepreneurs 2025',
        summary: 'Le gouvernement annonce des changements importants dans le régime fiscal des micro-entreprises, avec des seuils de chiffre d\'affaires revalorisés.',
        source: 'Service Public',
        date: '2025-01-15',
        category: 'fiscal',
        url: '#',
        relevance: 95
      },
      {
        id: '2',
        title: 'Digitalisation : Les outils indispensables pour les entrepreneurs',
        summary: 'Tour d\'horizon des solutions numériques qui révolutionnent la gestion d\'entreprise en 2025.',
        source: 'BPI France',
        date: '2025-01-14',
        category: 'digital',
        url: '#',
        relevance: 88
      }
    ];

    const activitySpecificNews = {
      service: [
        {
          id: '3',
          title: 'Boom des services à domicile : opportunités et défis',
          summary: 'Le marché des services à la personne connaît une croissance exceptionnelle. Analyse des secteurs porteurs.',
          source: 'Les Echos',
          date: '2025-01-13',
          category: 'marché',
          url: '#',
          relevance: 92
        },
        {
          id: '4',
          title: 'Formation professionnelle : nouvelles aides pour les consultants',
          summary: 'CPF, OPCO... découvrez les dispositifs de financement pour développer vos compétences.',
          source: 'Pôle Emploi',
          date: '2025-01-12',
          category: 'formation',
          url: '#',
          relevance: 85
        }
      ],
      vente: [
        {
          id: '3',
          title: 'E-commerce : les tendances qui domineront 2025',
          summary: 'Intelligence artificielle, réalité augmentée, commerce social... les innovations qui transforment la vente en ligne.',
          source: 'E-commerce Mag',
          date: '2025-01-13',
          category: 'ecommerce',
          url: '#',
          relevance: 90
        },
        {
          id: '4',
          title: 'TVA intracommunautaire : simplification des démarches',
          summary: 'Nouvelles procédures pour les vendeurs réalisant des transactions dans l\'UE.',
          source: 'Douanes France',
          date: '2025-01-11',
          category: 'fiscal',
          url: '#',
          relevance: 87
        }
      ],
      liberal: [
        {
          id: '3',
          title: 'Professions libérales : évolution de la réglementation',
          summary: 'Point sur les dernières modifications réglementaires affectant les professions libérales.',
          source: 'UNAPL',
          date: '2025-01-13',
          category: 'réglementation',
          url: '#',
          relevance: 94
        },
        {
          id: '4',
          title: 'Téléconsultation et services dématérialisés : cadre juridique',
          summary: 'Guide pratique pour exercer à distance en respectant les obligations professionnelles.',
          source: 'Ordre des Experts',
          date: '2025-01-10',
          category: 'digital',
          url: '#',
          relevance: 89
        }
      ]
    };

    return [...baseNews, ...(activitySpecificNews[activityType as keyof typeof activitySpecificNews] || activitySpecificNews.service)];
  };

  const generateJobsForActivity = (activityType: string): JobOffer[] => {
    const baseJobs = [
      {
        id: '1',
        title: 'Consultant en transformation digitale',
        company: 'TechConseil',
        location: 'Paris / Remote',
        salary: '400-600€/jour',
        type: 'Mission',
        description: 'Accompagnement d\'entreprises dans leur transformation numérique. Expertise en gestion de projet et conduite du changement requise.',
        requirements: ['5+ ans d\'expérience', 'Certification PMP appréciée', 'Anglais courant'],
        postedDate: '2025-01-14',
        url: '#',
        relevance: 88
      }
    ];

    const activitySpecificJobs = {
      service: [
        {
          id: '2',
          title: 'Formateur indépendant en développement personnel',
          company: 'Centre de Formation Pro',
          location: 'Lyon',
          salary: '300-450€/jour',
          type: 'Vacation',
          description: 'Animation de formations en développement personnel et management pour entreprises.',
          requirements: ['Certification coaching', 'Expérience formation adultes', 'Pédagogie active'],
          postedDate: '2025-01-13',
          url: '#',
          relevance: 92
        },
        {
          id: '3',
          title: 'Expert-comptable en mission temporaire',
          company: 'Cabinet Expertise',
          location: 'Marseille',
          salary: '500-700€/jour',
          type: 'Mission',
          description: 'Missions d\'expertise comptable et d\'audit pour PME. Période de forte activité.',
          requirements: ['DEC ou Master CCA', '3+ ans cabinet', 'Maîtrise logiciels comptables'],
          postedDate: '2025-01-12',
          url: '#',
          relevance: 85
        }
      ],
      vente: [
        {
          id: '2',
          title: 'Commercial indépendant - Secteur BtoB',
          company: 'SalesForce Pro',
          location: 'Région Parisienne',
          salary: 'Commission attractive',
          type: 'Partenariat',
          description: 'Développement commercial en BtoB pour solutions logicielles. Portefeuille clients à développer.',
          requirements: ['Expérience vente BtoB', 'Réseau professionnel', 'Autonomie'],
          postedDate: '2025-01-13',
          url: '#',
          relevance: 90
        },
        {
          id: '3',
          title: 'Responsable e-commerce freelance',
          company: 'Fashion Brand',
          location: 'Remote',
          salary: '3000-4500€/mois',
          type: 'Contrat',
          description: 'Gestion complète de boutique en ligne : marketing, logistique, relation client.',
          requirements: ['Shopify/WooCommerce', 'Marketing digital', 'Analytics'],
          postedDate: '2025-01-11',
          url: '#',
          relevance: 87
        }
      ],
      liberal: [
        {
          id: '2',
          title: 'Avocat en droit des affaires - Missions ponctuelles',
          company: 'Cabinet Juridique',
          location: 'Bordeaux',
          salary: '150-250€/heure',
          type: 'Mission',
          description: 'Conseil juridique et rédaction d\'actes pour entreprises. Spécialisation droit commercial.',
          requirements: ['CAPA', 'Spécialisation droit affaires', 'Rédaction juridique'],
          postedDate: '2025-01-13',
          url: '#',
          relevance: 94
        },
        {
          id: '3',
          title: 'Architecte indépendant - Projets résidentiels',
          company: 'Promoteur Immobilier',
          location: 'Nice',
          salary: 'Selon projet',
          type: 'Mission',
          description: 'Conception architecturale de programmes résidentiels haut de gamme.',
          requirements: ['HMONP', 'Portfolio résidentiel', 'Logiciels CAO/DAO'],
          postedDate: '2025-01-10',
          url: '#',
          relevance: 89
        }
      ]
    };

    return [...baseJobs, ...(activitySpecificJobs[activityType as keyof typeof activitySpecificJobs] || activitySpecificJobs.service)];
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const filteredJobs = jobs.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.type.toLowerCase() === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'service': return 'Prestations de services';
      case 'vente': return 'Vente de marchandises';
      case 'liberal': return 'Activité libérale';
      default: return 'Activité professionnelle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Actualités & Emplois</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <p>Contenu personnalisé pour votre activité : {settings ? getActivityLabel(settings.activite) : 'Chargement...'}</p>
          </div>
        </div>
      </div>

      {/* AI Loading */}
      {loading && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-medium text-gray-900">IA en cours d'analyse...</p>
              <p className="text-sm text-gray-600">Génération de contenu personnalisé basé sur votre profil</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('actualites')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'actualites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                <span>Actualités ({news.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('emplois')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'emplois'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Offres d'emploi ({jobs.length})</span>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'actualites' ? 'Rechercher dans les actualités...' : 'Rechercher des offres...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes catégories</option>
                {activeTab === 'actualites' ? (
                  <>
                    <option value="fiscal">Fiscal</option>
                    <option value="digital">Digital</option>
                    <option value="marché">Marché</option>
                    <option value="formation">Formation</option>
                    <option value="réglementation">Réglementation</option>
                  </>
                ) : (
                  <>
                    <option value="mission">Mission</option>
                    <option value="contrat">Contrat</option>
                    <option value="vacation">Vacation</option>
                    <option value="partenariat">Partenariat</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'actualites' ? (
              <div className="grid gap-6">
                {filteredNews.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">{article.relevance}% pertinent</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-3">{article.summary}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{article.source}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {job.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">{job.relevance}% compatible</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-3">{job.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Euro className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Compétences requises :</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <span>Postuler</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActualitesEmplois;