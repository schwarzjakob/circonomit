import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Target } from 'lucide-react';
import { SimulationTile, OKR } from '../types';
import SimulationTileCard from '../components/Library/SimulationTileCard';
import mockData from '../data/mockData.json';

const LibraryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [selectedOKR, setSelectedOKR] = useState<string>('');

  const simulations = mockData.library.simulations as SimulationTile[];
  const okrs = mockData.library.okrs as OKR[];

  // Get unique values for filter options
  const departments = useMemo(() => 
    Array.from(new Set(simulations.map(sim => sim.department))).sort(),
    [simulations]
  );

  const years = useMemo(() => 
    Array.from(new Set(simulations.map(sim => sim.year))).sort().reverse(),
    [simulations]
  );

  const quarters = useMemo(() => 
    ['Q1', 'Q2', 'Q3', 'Q4'],
    []
  );

  // Filter OKRs based on selected department and time
  const filteredOKRs = useMemo(() => {
    return okrs.filter(okr => {
      if (selectedDepartment && okr.department !== selectedDepartment) return false;
      if (selectedYear && okr.year !== selectedYear) return false;
      if (selectedQuarter && okr.quarter !== selectedQuarter) return false;
      return true;
    });
  }, [okrs, selectedDepartment, selectedYear, selectedQuarter]);

  // Filter simulations based on all criteria
  const filteredSimulations = useMemo(() => {
    return simulations.filter(sim => {
      // Search term
      if (searchTerm && !sim.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (selectedDepartment && sim.department !== selectedDepartment) {
        return false;
      }
      
      // Year filter
      if (selectedYear && sim.year !== selectedYear) {
        return false;
      }
      
      // Quarter filter
      if (selectedQuarter && sim.quarter !== selectedQuarter) {
        return false;
      }
      
      // OKR filter
      if (selectedOKR && !sim.okrs.includes(selectedOKR)) {
        return false;
      }
      
      return true;
    });
  }, [simulations, searchTerm, selectedDepartment, selectedYear, selectedQuarter, selectedOKR]);

  const handleSimulationClick = (simulation: SimulationTile) => {
    if (simulation.id === 'sim1') {
      // Navigate to our existing insights for the production cost simulation
      navigate('/simulation/insights');
    } else {
      // Show mock alert for other simulations
      alert(`${simulation.title} - Demo-Simulation (nicht implementiert)`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedYear('');
    setSelectedQuarter('');
    setSelectedOKR('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulationsbibliothek</h1>
        <p className="text-gray-600">
          Durchsuchen Sie alle abgeschlossenen Simulationen und Analysen
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter & Suche
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Alle Filter zurücksetzen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Simulationen durchsuchen..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bereich
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Alle Bereiche</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jahr
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Alle Jahre</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Quarter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartal
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
            >
              <option value="">Alle Quartale</option>
              {quarters.map(quarter => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </select>
          </div>

          {/* OKRs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OKR
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedOKR}
              onChange={(e) => setSelectedOKR(e.target.value)}
            >
              <option value="">Alle OKRs</option>
              {filteredOKRs.map(okr => (
                <option key={okr.id} value={okr.id}>
                  {okr.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters display */}
        {(selectedDepartment || selectedYear || selectedQuarter || selectedOKR || searchTerm) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Suche: "{searchTerm}"
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedDepartment}
              </span>
            )}
            {selectedYear && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {selectedYear}
              </span>
            )}
            {selectedQuarter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {selectedQuarter}
              </span>
            )}
            {selectedOKR && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {filteredOKRs.find(okr => okr.id === selectedOKR)?.title}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredSimulations.length} Simulation{filteredSimulations.length !== 1 ? 'en' : ''} gefunden
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Sortiert nach Erstellungsdatum</span>
        </div>
      </div>

      {/* Simulation Grid */}
      {filteredSimulations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((simulation) => (
            <SimulationTileCard
              key={simulation.id}
              simulation={simulation}
              onClick={() => handleSimulationClick(simulation)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Simulationen gefunden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Passen Sie Ihre Filter an oder starten Sie eine neue Simulation.
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryScreen;