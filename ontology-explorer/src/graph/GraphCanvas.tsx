'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeProps,
  Handle,
  Position,
  MarkerType,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOntologyStore } from '../store';
import { LayoutColumn } from '../types';

// Custom node component
const BlockNode: React.FC<NodeProps> = ({ data, id }) => {
  const { 
    selectedBlock, 
    highlightedNodes, 
    selection, 
    setSelectedBlock,
    toggleBlockSelection 
  } = useOntologyStore();

  const isSelected = selectedBlock === id;
  const isHighlighted = highlightedNodes.has(id);
  const isInSelection = selection.blocks.has(id);

  const handleClick = useCallback(() => {
    setSelectedBlock(id);
  }, [id, setSelectedBlock]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    toggleBlockSelection(id);
  }, [id, toggleBlockSelection]);

  return (
    <div
      className={`
        px-4 py-3 shadow-lg rounded-lg border-2 cursor-pointer min-w-[120px] text-center
        transition-all duration-200 hover:shadow-xl
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : isHighlighted 
          ? 'border-yellow-400 bg-yellow-50 shadow-yellow-200' 
          : 'border-gray-300 bg-white'
        }
        ${isInSelection ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
      `}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      title={(data.description as string) || (data.label as string)}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      
      <div className="text-sm font-semibold text-gray-800">
        {data.label as string}
      </div>
      
      {(data.description as string) && (
        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
          {data.description as string}
        </div>
      )}
      
      {isInSelection && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
      )}
    </div>
  );
};

const nodeTypes = {
  blockNode: BlockNode,
};

// Layout configuration
const LAYOUT_COLUMNS: Record<LayoutColumn, { x: number; label: string }> = {
  supplier: { x: 100, label: 'Supplier' },
  material: { x: 300, label: 'Material' },
  process: { x: 500, label: 'Process' },
  facility: { x: 700, label: 'Facility' },
  product: { x: 900, label: 'Product' },
  order: { x: 1100, label: 'Order' },
  shipment: { x: 1300, label: 'Shipment' },
  inventory: { x: 1500, label: 'Inventory' },
  market: { x: 1700, label: 'Market' },
};

const getLayoutColumn = (blockId: string): LayoutColumn => {
  const id = blockId.toLowerCase();
  if (id.includes('supplier')) return 'supplier';
  if (id.includes('material')) return 'material';
  if (id.includes('process')) return 'process';
  if (id.includes('facility')) return 'facility';
  if (id.includes('product')) return 'product';
  if (id.includes('order')) return 'order';
  if (id.includes('shipment')) return 'shipment';
  if (id.includes('inventory')) return 'inventory';
  if (id.includes('market')) return 'market';
  return 'process'; // default
};

interface GraphCanvasProps {
  className?: string;
}

export default function GraphCanvas({ className }: GraphCanvasProps) {
  const { ontology, highlightedEdges, selection } = useOntologyStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: 'temp', position: { x: 0, y: 0 }, data: { label: 'Loading...' } }
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'temp-edge', source: 'temp', target: 'temp', label: 'Loading...' }
  ]);

  // Convert ontology data to React Flow format
  const reactFlowNodes = useMemo(() => {
    if (!ontology) return [];

    return ontology.blocks.map((block, index) => {
      const column = getLayoutColumn(block.id);
      const columnConfig = LAYOUT_COLUMNS[column];
      
      return {
        id: block.id,
        type: 'blockNode',
        position: { 
          x: columnConfig.x, 
          y: 150 + (index % 3) * 120 // Distribute vertically within column
        },
        data: {
          label: block.label,
          description: block.description,
        },
      };
    });
  }, [ontology]);

  const reactFlowEdges = useMemo(() => {
    if (!ontology) return [];

    return ontology.edges.map((edge) => {
      const isHighlighted = highlightedEdges.has(edge.key);
      const isInSelection = selection.edges.has(edge.key);
      
      return {
        id: edge.key,
        source: edge.from,
        target: edge.to,
        label: edge.label,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isHighlighted ? '#facc15' : isInSelection ? '#10b981' : '#6b7280',
        },
        style: {
          stroke: isHighlighted ? '#facc15' : isInSelection ? '#10b981' : '#6b7280',
          strokeWidth: isHighlighted || isInSelection ? 3 : 1,
        },
        labelStyle: {
          fill: isHighlighted ? '#a16207' : isInSelection ? '#047857' : '#374151',
          fontSize: 12,
          fontWeight: isHighlighted || isInSelection ? 'bold' : 'normal',
        },
      };
    });
  }, [ontology, highlightedEdges, selection.edges]);

  // Update React Flow when data changes
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (!ontology) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-gray-500">Loading ontology...</div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className}`} id="graph-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        className="bg-gray-50"
      >
        <Controls className="bg-white border border-gray-300" />
        <Background color="#e5e7eb" gap={20} size={1} />
      </ReactFlow>
      
      {/* Column Headers */}
      <div className="absolute top-4 left-0 right-0 pointer-events-none">
        <div className="flex justify-between px-4 text-xs text-gray-500 font-medium">
          {Object.entries(LAYOUT_COLUMNS).map(([key, config]) => (
            <div key={key} style={{ marginLeft: `${config.x - 50}px` }}>
              {config.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}