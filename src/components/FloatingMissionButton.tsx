import React, { useState } from 'react';
import { Handshake, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingMissionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Ne pas afficher le bouton sur la page des missions
  if (location.pathname === '/missions') {
    return null;
  }

  const handleClick = () => {
    navigate('/missions');
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
          rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
          ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}
          hover:from-blue-700 hover:to-indigo-700
          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        `}
        title="Partage de Missions"
      >
        {/* Bouton principal */}
        <div className={`
          flex items-center space-x-2 px-4 py-3 transition-all duration-300
          ${isHovered ? 'px-6' : 'px-4'}
        `}>
          <div className="relative">
            <Handshake className={`
              w-5 h-5 transition-all duration-300
              ${isHovered ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}
            `} />
            
            {/* Icône plus animée */}
            <Plus className={`
              absolute -top-1 -right-1 w-3 h-3 bg-white text-blue-600 rounded-full
              transition-all duration-300 transform
              ${isHovered ? 'scale-110 rotate-90' : 'scale-100 rotate-0'}
            `} />
          </div>
          
          {/* Texte qui apparaît au hover */}
          <span className={`
            font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
            ${isHovered ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'}
          `}>
            Missions
          </span>
        </div>

        {/* Effet de pulsation */}
        <div className={`
          absolute inset-0 rounded-full bg-blue-400 opacity-20
          animate-ping transition-opacity duration-300
          ${isHovered ? 'opacity-0' : 'opacity-20'}
        `} />

        {/* Cercles d'animation au hover */}
        <div className={`
          absolute inset-0 rounded-full border-2 border-white opacity-0
          transition-all duration-500 transform
          ${isHovered ? 'opacity-30 scale-150' : 'opacity-0 scale-100'}
        `} />
        
        <div className={`
          absolute inset-0 rounded-full border border-white opacity-0
          transition-all duration-700 transform delay-100
          ${isHovered ? 'opacity-20 scale-200' : 'opacity-0 scale-100'}
        `} />
      </button>

      {/* Tooltip */}
      <div className={`
        absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs
        rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 transform
        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}>
        Accéder au partage de missions
        <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
      </div>
    </div>
  );
};

export default FloatingMissionButton;