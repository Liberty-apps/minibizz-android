import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface FloatingMenuButtonProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<any>;
  }>;
  onLogout: () => void;
}

const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({ navigation, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Button */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            group relative bg-gradient-to-r from-gray-700 to-gray-800 text-white 
            rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
            ${isOpen ? 'scale-110 shadow-2xl' : 'scale-100'}
            hover:from-gray-800 hover:to-gray-900
            focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50
            w-14 h-14 flex items-center justify-center
          `}
          title="Menu"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>

          {/* Effet de pulsation */}
          <div className={`
            absolute inset-0 rounded-full bg-gray-400 opacity-20
            animate-ping transition-opacity duration-300
            ${isOpen ? 'opacity-0' : 'opacity-20'}
          `} />
        </button>

        {/* Menu Panel */}
        <div className={`
          absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200
          transform transition-all duration-300 ease-in-out origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMenuButton;