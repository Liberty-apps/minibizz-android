import React from 'react';
import { Scale, FileText, Shield, Eye, AlertCircle } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Scale className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentions Légales</h1>
          <p className="text-gray-600">Informations légales et conditions d'utilisation</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {/* Mentions légales */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Mentions Légales</h2>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Éditeur de l'application</h3>
              <p>MiniBizz - Application de gestion pour auto-entrepreneurs</p>
              <p>Développée avec React et Firebase</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Hébergement</h3>
              <p>Cette application est hébergée sur des services cloud sécurisés.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Propriété intellectuelle</h3>
              <p>Tous les éléments de cette application (textes, images, logos, etc.) sont protégés par le droit d'auteur.</p>
            </div>
          </div>
        </div>

        {/* Politique de confidentialité */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Politique de Confidentialité</h2>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Collecte des données</h3>
              <p>Nous collectons uniquement les données nécessaires au fonctionnement de l'application :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Informations de compte (email, mot de passe)</li>
                <li>Données professionnelles (clients, devis, factures)</li>
                <li>Paramètres de l'application</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Utilisation des données</h3>
              <p>Vos données sont utilisées exclusivement pour :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Le fonctionnement de l'application</li>
                <li>La génération de vos documents (devis, factures)</li>
                <li>La sauvegarde de vos informations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Protection des données</h3>
              <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Vos droits</h3>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la portabilité</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Conditions d'utilisation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Conditions d'Utilisation</h2>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Acceptation des conditions</h3>
              <p>En utilisant cette application, vous acceptez les présentes conditions d'utilisation.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Utilisation autorisée</h3>
              <p>Cette application est destinée à un usage professionnel pour la gestion d'activités d'auto-entrepreneur.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Responsabilités</h3>
              <p>L'utilisateur est responsable de :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>La véracité des informations saisies</li>
                <li>La conformité de son activité avec la réglementation</li>
                <li>La sauvegarde de ses données</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Limitation de responsabilité</h3>
              <p>L'éditeur ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de l'application.</p>
            </div>
          </div>
        </div>

        {/* Avertissement */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Avertissement Important</h3>
              <p className="text-yellow-700 text-sm">
                Cette application est un outil d'aide à la gestion. Il est recommandé de consulter un expert-comptable 
                ou un conseiller juridique pour toute question relative à votre activité professionnelle, 
                vos obligations fiscales et sociales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;