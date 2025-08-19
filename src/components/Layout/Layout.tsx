import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import MainNavigation from './MainNavigation';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const getStepFromPath = (pathname: string): number => {
    const simulationPaths = {
      '/simulation/goal': 1,
      '/simulation/task': 2,
      '/simulation/model': 3,
      '/simulation/insights': 4
    };
    return simulationPaths[pathname as keyof typeof simulationPaths] || 0;
  };

  const currentStep = getStepFromPath(location.pathname);
  const isSimulation = location.pathname.startsWith('/simulation');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentStep={currentStep} />
      <MainNavigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      {isSimulation && <Navigation currentStep={currentStep} />}
    </div>
  );
};

export default Layout;