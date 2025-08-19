import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, BookOpen } from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSimulationActive = location.pathname.startsWith('/simulation');
  const isLibraryActive = location.pathname.startsWith('/library');

  const navItems = [
    {
      id: 'simulation',
      label: 'Simulation',
      icon: Play,
      path: '/simulation/goal',
      active: isSimulationActive
    },
    {
      id: 'library',
      label: 'Bibliothek',
      icon: BookOpen,
      path: '/library',
      active: isLibraryActive
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  item.active
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;