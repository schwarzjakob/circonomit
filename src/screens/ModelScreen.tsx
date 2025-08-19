import React, { useState } from 'react';
import { ModelNode } from '../types';
import WhiteboardCanvas from '../components/Whiteboard/WhiteboardCanvas';
import { Play, Save } from 'lucide-react';
import mockData from '../data/mockData.json';

const ModelScreen: React.FC = () => {
  const [nodes, setNodes] = useState<ModelNode[]>(mockData.model_nodes as ModelNode[]);
  const edges = mockData.model_edges as [string, string][];

  const handleNodeUpdate = (nodeId: string, fields: Record<string, any>) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, fields } : node
      )
    );
  };

  const handleRunSimulation = () => {
    // In a real app, this would trigger the simulation
    // For demo, we just show a toast and navigate to insights
    alert('Simulation gestartet! Weiter zu den Erkenntnissen...');
  };

  const handleSaveModel = () => {
    // In a real app, this would save the model state
    alert('Modell gespeichert!');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modellierung</h1>
              <p className="text-gray-600 mt-2">
                Ein Miro das rechnen kann – Interaktive Modellierung mit berechenbaren Komponenten
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveModel}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </button>
              <button
                onClick={handleRunSimulation}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Simulation starten / Bericht erstellen
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Produktionskosten-Simulationsmodell
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Modell-Hinweise
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Klicken Sie auf Werte in den Blöcken, um sie zu bearbeiten</li>
                    <li>• Berechnete Werte (blaue Blöcke) sind schreibgeschützt</li>
                    <li>• Orangene Blöcke zeigen Szenario-Parameter (z.B. Zollerhöhungen)</li>
                    <li>• Verbindungslinien zeigen Datenfluss zwischen Komponenten</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <WhiteboardCanvas
            nodes={nodes}
            edges={edges}
            onNodeUpdate={handleNodeUpdate}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Eingabeparameter</h3>
              <div className="text-xs text-gray-600">
                Graue Blöcke enthalten bearbeitbare Eingabeparameter für die Simulation.
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Berechnungen</h3>
              <div className="text-xs text-blue-700">
                Blaue Blöcke zeigen automatisch berechnete Werte basierend auf den Eingaben.
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-orange-900 mb-2">Szenarien</h3>
              <div className="text-xs text-orange-700">
                Orangene Blöcke repräsentieren externe Faktoren wie Zollerhöhungen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelScreen;