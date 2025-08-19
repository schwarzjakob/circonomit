import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentStep: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentStep }) => {
  const navigate = useNavigate();

  const getPathFromStep = (step: number): string => {
    switch (step) {
      case 1: return '/simulation/goal';
      case 2: return '/simulation/task';
      case 3: return '/simulation/model';
      case 4: return '/simulation/insights';
      default: return '/simulation/goal';
    }
  };

  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < 4;

  const handleBack = () => {
    if (canGoBack) {
      navigate(getPathFromStep(currentStep - 1));
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      navigate(getPathFromStep(currentStep + 1));
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              canGoBack
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              canGoForward
                ? 'text-white bg-primary-600 border border-transparent hover:bg-primary-700'
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            }`}
          >
            Weiter
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Navigation;