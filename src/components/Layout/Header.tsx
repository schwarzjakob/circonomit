import React from 'react';

interface HeaderProps {
  currentStep: number;
}

const Header: React.FC<HeaderProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Ziel', label: 'Ziel festlegen' },
    { number: 2, title: 'Auftrag', label: 'Simulationsauftrag' },
    { number: 3, title: 'Modell', label: 'Modellierung' },
    { number: 4, title: 'Insights', label: 'Erkenntnisse' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Circonomit</h1>
          </div>
          
          <nav className="flex items-center space-x-8">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep === step.number
                    ? 'bg-primary-600 text-white'
                    : currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.number ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;