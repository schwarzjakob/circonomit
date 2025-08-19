import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, Building2, Target, CheckCircle, Clock } from 'lucide-react';
import { SimulationTile } from '../../types';

interface SimulationTileCardProps {
  simulation: SimulationTile;
  onClick: () => void;
}

const SimulationTileCard: React.FC<SimulationTileCardProps> = ({ simulation, onClick }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderChart = () => {
    if (simulation.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={simulation.chartData}>
            <XAxis 
              dataKey={simulation.chartData[0]?.month ? 'month' : 'scenario'} 
              tick={false} 
              axisLine={false}
            />
            <YAxis hide />
            {simulation.chartData[0]?.baseline && (
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#9ca3af" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
            {simulation.chartData[0]?.tariff && (
              <Line 
                type="monotone" 
                dataKey="tariff" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
              />
            )}
            {simulation.chartData[0]?.current && (
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={false}
              />
            )}
            {simulation.chartData[0]?.optimized && (
              <Line 
                type="monotone" 
                dataKey="optimized" 
                stroke="#059669" 
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={simulation.chartData}>
            <XAxis 
              dataKey={simulation.chartData[0]?.category ? 'category' : 'scenario'} 
              tick={false} 
              axisLine={false}
            />
            <YAxis hide />
            {simulation.chartData[0]?.value && (
              <Bar dataKey="value" fill="#3b82f6" />
            )}
            {simulation.chartData[0]?.cost && (
              <Bar dataKey="cost" fill="#dc2626" />
            )}
            {simulation.chartData[0]?.risk && (
              <Bar dataKey="risk" fill="#f59e0b" />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const isClickable = simulation.status === 'completed';

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
        isClickable 
          ? 'hover:shadow-md hover:border-primary-300 cursor-pointer' 
          : 'cursor-not-allowed opacity-75'
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              simulation.department === 'Produktion' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              <Building2 className="w-3 h-3 mr-1" />
              {simulation.department}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              simulation.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {simulation.status === 'completed' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Abgeschlossen
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Demo
                </>
              )}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(simulation.createdDate)}
          </span>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {simulation.title}
        </h3>
        
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <Target className="w-3 h-3 mr-1" />
          {simulation.timeframe}
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-2">
        <div className="bg-gray-50 rounded-md p-2">
          {renderChart()}
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 pt-2 border-t border-gray-100">
        <h4 className="text-xs font-medium text-gray-700 mb-1">Zentrale Erkenntnis</h4>
        <p className="text-xs text-gray-600 line-clamp-2">
          {simulation.insight}
        </p>
      </div>

      {/* Footer hint for non-clickable tiles */}
      {!isClickable && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-500 italic">
            Demo-Simulation (nicht implementiert)
          </p>
        </div>
      )}
    </div>
  );
};

export default SimulationTileCard;