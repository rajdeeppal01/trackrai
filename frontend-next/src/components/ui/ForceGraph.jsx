"use client";

import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ForceGraph({ data, onNodeClick }) {
  const fgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    // Initial dimensions
    updateDimensions();

    // Reheat graph layout if nodes change
    if (fgRef.current) {
      fgRef.current.d3ReheatSimulation();
    }

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: '600px' }}>
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data}
          nodeLabel="" // We use custom painting for labels
          nodeColor={() => '#e0e7ff'}
          nodeRelSize={6}
          linkColor={() => 'rgba(255, 255, 255, 0.15)'}
          linkWidth={1.5}
          onNodeClick={onNodeClick}
          backgroundColor="transparent"
          // Custom render for uniform nodes (no color coding for accept/reject)
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isRoot = node.id === 'root';
            const label = node.name;
            const fontSize = isRoot ? 16 / globalScale : 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, isRoot ? 8 : 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = isRoot ? '#818cf8' : 'rgba(255,255,255,0.9)'; // Root is indigo, others are white/glowy
            ctx.fill();
            
            // Draw label
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isRoot ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(label, node.x, node.y + (isRoot ? 14 : 10));
          }}
        />
      )}
    </div>
  );
}
