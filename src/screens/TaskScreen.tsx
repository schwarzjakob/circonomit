import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Edit3, CheckCircle } from 'lucide-react';

const TaskScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(state.task);

  const handleTaskEdit = () => {
    if (isEditing) {
      dispatch({ type: 'SET_TASK', payload: editableTask });
    }
    setIsEditing(!isEditing);
  };

  const handleParamChange = (key: string, value: any) => {
    dispatch({ 
      type: 'UPDATE_PARAMS', 
      payload: { [key]: value }
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Simulationsauftrag</h1>
        
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Automatisch generierter Simulationsauftrag
                </h3>
                <div className="relative">
                  {isEditing ? (
                    <textarea
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      value={editableTask}
                      onChange={(e) => setEditableTask(e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-green-700 whitespace-pre-wrap">
                      {state.task}
                    </p>
                  )}
                  <button
                    onClick={handleTaskEdit}
                    className="absolute top-2 right-2 p-1 text-green-600 hover:text-green-800"
                    title={isEditing ? "Speichern" : "Bearbeiten"}
                  >
                    {isEditing ? <CheckCircle className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Simulationsparameter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zollerhöhung (%)
                </label>
                <input
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.tariff_increase_pct}
                  onChange={(e) => handleParamChange('tariff_increase_pct', parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zollstart-Datum
                </label>
                <input
                  type="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.tariff_start_date}
                  onChange={(e) => handleParamChange('tariff_start_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geplante Grundkosten (€)
                </label>
                <input
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.baseline_planned_costs_eur}
                  onChange={(e) => handleParamChange('baseline_planned_costs_eur', parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzahl Maschinen
                </label>
                <input
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.machines_count}
                  onChange={(e) => handleParamChange('machines_count', parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ausfallwahrscheinlichkeit Maschinen
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.machine_failure_prob}
                  onChange={(e) => handleParamChange('machine_failure_prob', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reparaturkosten pro Maschine/Tag (€)
                </label>
                <input
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={state.params.repair_cost_per_machine_day_eur}
                  onChange={(e) => handleParamChange('repair_cost_per_machine_day_eur', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Aktuelle Parameter-Übersicht
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Zollerhöhung:</span>
                  <div className="font-medium">{formatPercentage(state.params.tariff_increase_pct)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Grundkosten:</span>
                  <div className="font-medium">{formatCurrency(state.params.baseline_planned_costs_eur)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Maschinen:</span>
                  <div className="font-medium">{state.params.machines_count} Stück</div>
                </div>
                <div>
                  <span className="text-gray-600">Ausfallrate:</span>
                  <div className="font-medium">{(state.params.machine_failure_prob * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Reparaturkosten:</span>
                  <div className="font-medium">{formatCurrency(state.params.repair_cost_per_machine_day_eur)}/Tag</div>
                </div>
                <div>
                  <span className="text-gray-600">Zeitraum:</span>
                  <div className="font-medium">{state.params.period}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dokumente hinzufügen (PDF/Excel) – Demo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Zusätzliche Dokumente für die Simulation
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload-Funktion in Demo deaktiviert
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskScreen;