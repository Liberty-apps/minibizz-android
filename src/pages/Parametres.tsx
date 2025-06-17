import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Building, 
  CreditCard, 
  FileText,
  Save,
  Upload,
  AlertCircle,
  X,
  Image
} from 'lucide-react';
import { getUserSettings, saveUserSettings } from '../utils/storage';
import { UserSettings, ActivityType, PaymentTerms, MODES_PAIEMENT, MODALITES_PAIEMENT } from '../types';

const Parametres: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
    siret: '',
    activite: 'service',
    logo: '',
    rib: {
      iban: '',
      bic: '',
      banque: ''
    },
    cgv: '',
    modalitesPaiementDefaut: {
      delaiPaiement: 30,
      modalitePaiement: 'echeance',
      modesPaiement: ['virement'],
      penalitesRetard: 0,
      escompte: 0
    }
  });
  const [activeTab, setActiveTab] = useState('profil');
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    const userSettings = getUserSettings();
    if (userSettings) {
      setSettings(userSettings);
      if (userSettings.logo) {
        setLogoPreview(userSettings.logo);
      }
    }
  }, []);

  const handleSave = () => {
    saveUserSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRibChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      rib: {
        ...prev.rib!,
        [field]: value
      }
    }));
  };

  const handleModalitesPaiementChange = (field: keyof PaymentTerms, value: any) => {
    setSettings(prev => ({
      ...prev,
      modalitesPaiementDefaut: {
        ...prev.modalitesPaiementDefaut!,
        [field]: value
      }
    }));
  };

  const toggleModePaiementDefaut = (mode: string) => {
    setSettings(prev => ({
      ...prev,
      modalitesPaiementDefaut: {
        ...prev.modalitesPaiementDefaut!,
        modesPaiement: prev.modalitesPaiementDefaut!.modesPaiement.includes(mode)
          ? prev.modalitesPaiementDefaut!.modesPaiement.filter(m => m !== mode)
          : [...prev.modalitesPaiementDefaut!.modesPaiement, mode]
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximum : 10MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setSettings(prev => ({
        ...prev,
        logo: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview('');
    setSettings(prev => ({
      ...prev,
      logo: ''
    }));
  };

  const tabs = [
    { id: 'profil', name: 'Profil', icon: User },
    { id: 'entreprise', name: 'Entreprise', icon: Building },
    { id: 'paiement', name: 'Paiement', icon: CreditCard },
    { id: 'documents', name: 'Documents', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configurez vos informations professionnelles</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer</span>
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700">Paramètres sauvegardés avec succès !</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profil' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={settings.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={settings.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={settings.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={settings.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={settings.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={settings.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'entreprise' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations d'entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SIRET
                  </label>
                  <input
                    type="text"
                    value={settings.siret}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'activité
                  </label>
                  <select
                    value={settings.activite}
                    onChange={(e) => handleInputChange('activite', e.target.value as ActivityType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="vente">Vente de marchandises (12.3%)</option>
                    <option value="service">Prestations de services (21.1%)</option>
                    <option value="liberal">Activité libérale (22%)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Le taux de charges sociales dépend de votre type d'activité
                  </p>
                </div>
              </div>
              
              {/* Logo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de l'entreprise
                </label>
                
                {logoPreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-white p-2"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Changer le logo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Télécharger un logo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF jusqu'à 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'paiement' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Informations bancaires</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IBAN
                  </label>
                  <input
                    type="text"
                    value={settings.rib?.iban || ''}
                    onChange={(e) => handleRibChange('iban', e.target.value)}
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BIC
                  </label>
                  <input
                    type="text"
                    value={settings.rib?.bic || ''}
                    onChange={(e) => handleRibChange('bic', e.target.value)}
                    placeholder="BNPAFRPP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la banque
                  </label>
                  <input
                    type="text"
                    value={settings.rib?.banque || ''}
                    onChange={(e) => handleRibChange('banque', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modalités de paiement par défaut */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Modalités de paiement par défaut</h3>
                
                <div className="space-y-4">
                  {/* Modalité de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modalité de paiement par défaut
                    </label>
                    <div className="space-y-2">
                      {MODALITES_PAIEMENT.map(modalite => (
                        <label key={modalite.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="modalitePaiementDefaut"
                            value={modalite.id}
                            checked={settings.modalitesPaiementDefaut?.modalitePaiement === modalite.id}
                            onChange={(e) => handleModalitesPaiementChange('modalitePaiement', e.target.value)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{modalite.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Délai de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Délai de paiement par défaut (jours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      value={settings.modalitesPaiementDefaut?.delaiPaiement || 30}
                      onChange={(e) => handleModalitesPaiementChange('delaiPaiement', parseInt(e.target.value) || 30)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Modes de paiement par défaut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modes de paiement acceptés par défaut
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {MODES_PAIEMENT.map(mode => (
                        <label key={mode.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={settings.modalitesPaiementDefaut?.modesPaiement.includes(mode.id) || false}
                            onChange={() => toggleModePaiementDefaut(mode.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{mode.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Conditions générales de vente</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGV par défaut
                </label>
                <textarea
                  value={settings.cgv || ''}
                  onChange={(e) => handleInputChange('cgv', e.target.value)}
                  rows={10}
                  placeholder="Saisissez vos conditions générales de vente qui apparaîtront sur vos devis et factures..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ces conditions seront ajoutées en plus des conditions générées automatiquement selon les modalités de paiement
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres;