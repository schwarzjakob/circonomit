import React, { useRef, useEffect, useCallback } from 'react';
import { ModelNode as ModelNodeType } from '../../types';
import ModelNode from './ModelNode';

interface WhiteboardCanvasProps {
  nodes: ModelNodeType[];
  edges: [string, string][];
  onNodeUpdate: (nodeId: string, fields: Record<string, any>) => void;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ nodes, edges, onNodeUpdate }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return node.position;
  };

  const drawConnections = useCallback(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    svg.innerHTML = '';

    edges.forEach(([fromId, toId]) => {
      const fromPos = getNodePosition(fromId);
      const toPos = getNodePosition(toId);
      
      // Calculate connection points (right side of source to left side of target)
      const startX = fromPos.x + 200; // Assuming node width of ~200px
      const startY = fromPos.y + 60; // Middle of node height
      const endX = toPos.x;
      const endY = toPos.y + 60;

      // Create curved path
      const midX = startX + (endX - startX) / 2;
      const path = `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} Q ${midX} ${endY} ${endX} ${endY}`;

      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('stroke', '#9CA3AF');
      pathElement.setAttribute('stroke-width', '2');
      pathElement.setAttribute('fill', 'none');
      pathElement.setAttribute('marker-end', 'url(#arrowhead)');

      svg.appendChild(pathElement);
    });
  }, [edges, nodes, getNodePosition]);

  useEffect(() => {
    drawConnections();
  }, [drawConnections]);

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f3f4f6 1px, transparent 1px),
            linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* SVG for connections */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#9CA3AF"
            />
          </marker>
        </defs>
      </svg>

      {/* Canvas content */}
      <div ref={canvasRef} className="relative w-full h-full overflow-auto z-20">
        <div className="relative" style={{ width: '1200px', height: '800px' }}>
          {nodes.map((node) => (
            <ModelNode
              key={node.id}
              node={node}
              onUpdate={(fields) => onNodeUpdate(node.id, fields)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCanvas;