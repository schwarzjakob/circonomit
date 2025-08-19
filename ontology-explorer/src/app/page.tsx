'use client';

import React, { useEffect, useState } from 'react';
import { useOntologyStore } from '../store';
import { Ontology } from '../types';
import ChatPanel from '../chat/ChatPanel';
import GraphCanvas from '../graph/GraphCanvas';
import AttributesDrawer from '../components/AttributesDrawer';

export default function Home() {
  const { loadOntology, attributesDrawerOpen } = useOntologyStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load ontology on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/ontology.min.json');
        if (!response.ok) {
          throw new Error(`Failed to load ontology: ${response.statusText}`);
        }
        const data: Ontology = await response.json();
        loadOntology(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ontology');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadOntology]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ontology explorer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Chat Panel - 1/3 width */}
      <ChatPanel className="w-1/3 min-w-[400px]" />
      
      {/* Main Content - 2/3 width */}
      <div className="flex-1 flex">
        {/* Graph Canvas */}
        <div className={`flex-1 ${attributesDrawerOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <GraphCanvas />
        </div>
        
        {/* Attributes Drawer */}
        {attributesDrawerOpen && (
          <AttributesDrawer className="w-1/3 min-w-[300px]" />
        )}
      </div>
    </div>
  );
}