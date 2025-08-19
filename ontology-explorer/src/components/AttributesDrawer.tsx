'use client';

import React, { useEffect, useRef } from 'react';
import { X, Pin, PinOff, Database, Hash, DollarSign, Percent, Calendar } from 'lucide-react';
import { useOntologyStore } from '../store';
import { Attribute } from '../types';

interface AttributesDrawerProps {
  className?: string;
}

const getAttributeIcon = (type: Attribute['type']) => {
  switch (type) {
    case 'currency':
      return <DollarSign className="w-4 h-4" />;
    case 'percent':
      return <Percent className="w-4 h-4" />;
    case 'number':
      return <Hash className="w-4 h-4" />;
    case 'date':
      return <Calendar className="w-4 h-4" />;
    default:
      return <Database className="w-4 h-4" />;
  }
};

const getAttributeTypeColor = (type: Attribute['type']) => {
  switch (type) {
    case 'currency':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'percent':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'number':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'date':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export default function AttributesDrawer({ className }: AttributesDrawerProps) {
  const {
    ontology,
    selectedBlock,
    attributesDrawerOpen,
    highlightedAttributes,
    selection,
    setAttributesDrawerOpen,
    toggleAttributeSelection,
  } = useOntologyStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  const selectedBlockData = ontology?.blocks.find(b => b.id === selectedBlock);
  const blockAttributes = ontology?.attributes.filter(attr => attr.blockId === selectedBlock) || [];

  // Auto-scroll to highlighted attributes
  useEffect(() => {
    if (highlightedAttributes.size > 0 && drawerRef.current) {
      const firstHighlighted = Array.from(highlightedAttributes)[0];
      const element = drawerRef.current.querySelector(`[data-attr-key="${firstHighlighted}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash effect
        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 2000);
      }
    }
  }, [highlightedAttributes]);

  if (!attributesDrawerOpen || !selectedBlock || !selectedBlockData) {
    return null;
  }

  return (
    <div className={`bg-white border-l border-gray-300 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedBlockData.label} Attributes
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedBlockData.description || 'Block attributes and properties'}
            </p>
          </div>
          <button
            onClick={() => setAttributesDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Attributes List */}
      <div ref={drawerRef} className="flex-1 overflow-y-auto p-4">
        {blockAttributes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No attributes defined for this block</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockAttributes.map((attr) => {
              const isHighlighted = highlightedAttributes.has(attr.key);
              const isSelected = selection.attributes.has(attr.key);
              
              return (
                <div
                  key={attr.key}
                  data-attr-key={attr.key}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 cursor-pointer
                    ${isHighlighted 
                      ? 'border-yellow-400 bg-yellow-50 shadow-md' 
                      : isSelected
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }
                  `}
                  onClick={() => toggleAttributeSelection(attr.key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAttributeIcon(attr.type)}
                        <span className="font-medium text-gray-800">
                          {attr.label}
                        </span>
                        {isSelected && (
                          <Pin className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded border
                          ${getAttributeTypeColor(attr.type)}
                        `}>
                          {attr.type}
                          {attr.unit && ` (${attr.unit})`}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 font-mono">
                        {attr.key}
                      </div>
                    </div>
                    
                    <button
                      className={`
                        p-1 rounded transition-colors
                        ${isSelected 
                          ? 'text-green-600 hover:text-green-700 bg-green-100' 
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAttributeSelection(attr.key);
                      }}
                      title={isSelected ? 'Unpin attribute' : 'Pin attribute'}
                    >
                      {isSelected ? (
                        <PinOff className="w-4 h-4" />
                      ) : (
                        <Pin className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="mb-1">
            <strong>{blockAttributes.length}</strong> attributes found
          </p>
          <p>
            Click attributes to pin them • Pinned: <strong>{selection.attributes.size}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}