import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CostSeriesData } from '../../types';

interface CostChartProps {
  data: CostSeriesData[];
}

const CostChart: React.FC<CostChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Kostenverlauf Vergleich (Q4 2025)
      </h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="baseline" 
              stroke="#9ca3af" 
              strokeWidth={2}
              name="Basis-Szenario"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="tariff" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Mit Zollerhöhung"
            />
            <Line 
              type="monotone" 
              dataKey="preproduce" 
              stroke="#059669" 
              strokeWidth={2}
              name="Vorproduktion"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Vergleich der monatlichen Produktionskosten unter verschiedenen Szenarien.
      </div>
    </div>
  );
};

export default CostChart;