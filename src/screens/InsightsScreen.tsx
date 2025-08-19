import React from 'react';
import { Download, BarChart3, Play, AlertCircle } from 'lucide-react';
import { Recommendation } from '../types';
import KPICard from '../components/Charts/KPICard';
import CostChart from '../components/Charts/CostChart';
import InventoryChart from '../components/Charts/InventoryChart';
import RecommendationCard from '../components/Recommendations/RecommendationCard';
import mockData from '../data/mockData.json';

const InsightsScreen: React.FC = () => {
  const { kpis, series_costs, series_inventory, recommendations, disclaimer } = mockData.insights;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExport = () => {
    alert('Export (PDF/Excel) - Demo-Funktion');
  };

  const handleStartRelatedSimulation = () => {
    alert('Weitere Simulation starten? - Demo-Funktion');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Erkenntnisse & Empfehlungen</h1>
            <p className="text-gray-600 mt-2">
              Analyse der Produktionskosten-Simulation mit Handlungsempfehlungen
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export (PDF/Excel)
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Gesamtkosten Q4 (Szenario)"
            value={formatCurrency(kpis.total_costs_q4_scenario_eur)}
            trend="up"
            change={6.25}
            subtitle="Mit Zollerhöhung"
          />
          <KPICard
            title="Mehrkosten durch Zölle"
            value={formatCurrency(kpis.incremental_tariff_costs_eur)}
            trend="down"
            subtitle="Zusätzliche Belastung"
          />
          <KPICard
            title="Einsparung bei Vorproduktion"
            value={formatCurrency(kpis.savings_preproduction_net_eur)}
            trend="up"
            change={3.25}
            subtitle="Netto nach Lagerkosten"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CostChart data={series_costs} />
          <InventoryChart data={series_inventory} />
        </div>

        {/* Key Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                Zentrale Erkenntnis
              </h3>
              <p className="text-blue-800">
                {kpis.message}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Handlungsempfehlungen</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                recommendation={rec as Recommendation}
                priority={index === 0 ? 'high' : 'medium'}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Wichtiger Hinweis
              </h3>
              <p className="text-sm text-gray-700">
                {disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Related Simulation CTA */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-1">
                Weitere Analyse gewünscht?
              </h3>
              <p className="text-primary-700">
                Maschineneffizienz-Analyse starten, um langfristige Optimierungspotentiale zu identifizieren.
              </p>
            </div>
            <button
              onClick={handleStartRelatedSimulation}
              className="flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 flex-shrink-0 ml-4"
            >
              <Play className="w-4 h-4 mr-2" />
              Simulation starten?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsScreen;