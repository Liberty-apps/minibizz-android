import React, { useState } from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Calculator,
  Settings,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const Aide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment créer mon premier devis ?',
      answer: 'Pour créer un devis, allez dans la section "Devis & Factures", cliquez sur "Nouveau devis", sélectionnez un client, ajoutez vos prestations avec les quantités et prix, puis enregistrez.',
      category: 'devis'
    },
    {
      id: '2',
      question: 'Comment ajouter un nouveau client ?',
      answer: 'Rendez-vous dans la section "Clients", cliquez sur "Nouveau client" et remplissez les informations requises (nom, email, etc.). Vous pourrez ensuite sélectionner ce client lors de la création de devis ou factures.',
      category: 'clients'
    },
    {
      id: '3',
      question: 'Comment transformer un devis en facture ?',
      answer: 'Une fois votre devis accepté par le client, vous pouvez le marquer comme "Accepté" dans la liste des devis. Ensuite, créez une nouvelle facture en reprenant les mêmes éléments.',
      category: 'factures'
    },
    {
      id: '4',
      question: 'Comment configurer mes informations d\'entreprise ?',
      answer: 'Allez dans "Paramètres", puis dans l\'onglet "Entreprise". Renseignez votre SIRET, type d\'activité, et téléchargez votre logo. Ces informations apparaîtront sur vos documents.',
      category: 'parametres'
    },
    {
      id: '5',
      question: 'Quels sont les taux de charges sociales ?',
      answer: 'Les taux dépendent de votre activité : 12,3% pour la vente de marchandises, 21,1% pour les prestations de services, et 22% pour les activités libérales. Ces taux sont utilisés pour calculer vos revenus nets estimés.',
      category: 'calculs'
    },
    {
      id: '6',
      question: 'Comment télécharger mes documents en PDF ?',
      answer: 'Dans la liste des devis ou factures, cliquez sur l\'icône de téléchargement à côté du document souhaité. Le PDF sera généré automatiquement avec vos informations d\'entreprise.',
      category: 'documents'
    },
    {
      id: '7',
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données sont stockées de manière sécurisée avec Firebase. Nous respectons le RGPD et ne partageons jamais vos informations avec des tiers.',
      category: 'securite'
    },
    {
      id: '8',
      question: 'Comment configurer mes informations bancaires ?',
      answer: 'Dans "Paramètres", onglet "Paiement", renseignez votre IBAN, BIC et nom de banque. Ces informations peuvent être incluses sur vos factures pour faciliter les paiements.',
      category: 'paiement'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: Book },
    { id: 'devis', name: 'Devis', icon: FileText },
    { id: 'factures', name: 'Factures', icon: FileText },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'parametres', name: 'Paramètres', icon: Settings },
    { id: 'calculs', name: 'Calculs', icon: Calculator },
    { id: 'paiement', name: 'Paiement', icon: CreditCard },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'securite', name: 'Sécurité', icon: AlertCircle }
  ];

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <HelpCircle className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre d'Aide</h1>
          <p className="text-gray-600">Trouvez rapidement les réponses à vos questions</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Questions Fréquentes ({filteredFAQ.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((item) => (
                  <div key={item.id} className="p-6">
                    <button
                      onClick={() => toggleFAQ(item.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="font-medium text-gray-900 pr-4">{item.question}</h3>
                      {expandedFAQ === item.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFAQ === item.id && (
                      <div className="mt-4 text-gray-600">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Besoin d'aide supplémentaire ?</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous contacter.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">support@minibizz.fr</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Téléphone</p>
              <p className="text-sm text-gray-600">01 23 45 67 89</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conseils Rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-2">💡 Astuce</h3>
            <p className="text-sm text-green-700">
              Configurez d'abord vos paramètres d'entreprise avant de créer vos premiers documents.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">📋 Bonne pratique</h3>
            <p className="text-sm text-blue-700">
              Numérotez vos devis et factures de manière chronologique pour un meilleur suivi.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-900 mb-2">⚠️ Important</h3>
            <p className="text-sm text-yellow-700">
              Sauvegardez régulièrement vos données et vérifiez vos calculs de charges sociales.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-900 mb-2">🔒 Sécurité</h3>
            <p className="text-sm text-purple-700">
              Utilisez un mot de passe fort et ne partagez jamais vos identifiants de connexion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aide;