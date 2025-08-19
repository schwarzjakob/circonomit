import React from 'react';
import { useApp } from '../context/AppContext';
import { Upload, AlertCircle } from 'lucide-react';

const GoalScreen: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleGoalChange = (value: string) => {
    dispatch({ type: 'SET_GOAL', payload: value });
  };

  const handleDepartmentChange = (value: string) => {
    dispatch({ type: 'SET_DEPARTMENT', payload: value as "Finanzen" | "Produktion" });
  };

  const handlePeriodChange = (value: string) => {
    dispatch({ type: 'SET_PERIOD', payload: value as "Q3 2025" | "Q4 2025" });
  };

  const handleDataModeChange = (value: string) => {
    dispatch({ type: 'SET_DATA_MODE', payload: value as "Unternehmenswissen" | "Zusätzliche Angaben" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ziel festlegen</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
              Geschäftsziel beschreiben *
            </label>
            <textarea
              id="goal"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Wir müssen unsere Produktionskosten minimieren, während die Zölle auf Rohstoffe in zwei Monaten voraussichtlich um 20 % steigen werden."
              value={state.goal}
              onChange={(e) => handleGoalChange(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Bereich
              </label>
              <select
                id="department"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={state.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="Finanzen">Finanzen</option>
                <option value="Produktion">Produktion</option>
              </select>
            </div>

            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-2">
                Zeitraum (optional)
              </label>
              <select
                id="period"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={state.period || ''}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option value="Q3 2025">Q3 2025</option>
                <option value="Q4 2025">Q4 2025</option>
              </select>
            </div>
          </div>

          <div>
            <legend className="text-sm font-medium text-gray-700 mb-3">
              Datenbasis
            </legend>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="company-knowledge"
                  name="dataMode"
                  type="radio"
                  value="Unternehmenswissen"
                  checked={state.dataMode === "Unternehmenswissen"}
                  onChange={(e) => handleDataModeChange(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="company-knowledge" className="ml-3 text-sm text-gray-700">
                  Nur vorhandenes Unternehmenswissen nutzen
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="additional-input"
                  name="dataMode"
                  type="radio"
                  value="Zusätzliche Angaben"
                  checked={state.dataMode === "Zusätzliche Angaben"}
                  onChange={(e) => handleDataModeChange(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="additional-input" className="ml-3 text-sm text-gray-700">
                  Zusätzliche Angaben machen
                </label>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              ERP/CRM/OneDrive sind verbunden (Demo)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumente hinzufügen (optional) – Demo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  PDF, Excel, Word Dokumente
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload-Funktion in Demo deaktiviert
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Möchten Sie weitere Informationen hinzufügen oder mit bestehenden Unternehmensdaten arbeiten?
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Diese Demo nutzt vorhandene Unternehmensdaten aus verbundenen Systemen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalScreen;