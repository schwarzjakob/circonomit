import React, { useState } from 'react';
import { ModelNode as ModelNodeType } from '../../types';
import { Settings, Calculator, AlertTriangle, Plus } from 'lucide-react';

interface ModelNodeProps {
  node: ModelNodeType;
  onUpdate: (fields: Record<string, any>) => void;
}

const ModelNode: React.FC<ModelNodeProps> = ({ node, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>(node.fields);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'calc':
        return <Calculator className="h-4 w-4" />;
      case 'scenario':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'calc':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'scenario':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const formatValue = (key: string, value: any) => {
    if (typeof value === 'number') {
      if (key.includes('prob') || key.includes('pct')) {
        return key.includes('pct') ? `${value}%` : `${(value * 100).toFixed(1)}%`;
      }
      if (key.includes('eur') || key.includes('cost')) {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      }
      if (key.includes('day') && !key.includes('eur')) {
        return `${value} d`;
      }
      return value.toString();
    }
    return value;
  };

  const handleEdit = (key: string) => {
    setIsEditing(key);
  };

  const handleSave = (key: string) => {
    const newFields = { ...node.fields, [key]: editValues[key] };
    onUpdate(newFields);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setEditValues(node.fields);
    setIsEditing(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    if (e.key === 'Enter') {
      handleSave(key);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={`absolute rounded-lg border-2 shadow-sm p-4 min-w-48 max-w-64 ${getNodeColor(node.type)}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {getNodeIcon(node.type)}
          <h3 className="text-sm font-semibold ml-2">{node.title}</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(node.fields).map(([key, value]) => {
          const isCurrentlyEditing = isEditing === key;
          const isReadOnly = node.type === 'calc';

          return (
            <div key={key} className="text-xs">
              <div className="text-gray-600 capitalize mb-1">
                {key.replace(/_/g, ' ').replace(/eur/g, '(€)').replace(/pct/g, '(%)')}
              </div>
              {isCurrentlyEditing && !isReadOnly ? (
                <input
                  type={typeof value === 'number' ? 'number' : 'text'}
                  step={key.includes('prob') ? '0.01' : '1'}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={editValues[key]}
                  onChange={(e) => setEditValues({ ...editValues, [key]: typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value })}
                  onBlur={() => handleSave(key)}
                  onKeyPress={(e) => handleKeyPress(e, key)}
                  autoFocus
                />
              ) : (
                <div 
                  className={`font-medium ${!isReadOnly ? 'cursor-pointer hover:bg-white hover:bg-opacity-50 rounded px-1 py-0.5' : ''}`}
                  onClick={!isReadOnly ? () => handleEdit(key) : undefined}
                  title={!isReadOnly ? 'Klicken zum Bearbeiten' : 'Berechneter Wert (schreibgeschützt)'}
                >
                  {formatValue(key, value)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {node.type === 'calc' && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Berechneter Wert
        </div>
      )}
    </div>
  );
};

export default ModelNode;