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
      // Tune physics engine for Obsidian-like sprawling web
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(80);
      
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
          nodeRelSize={6}
          linkColor={() => 'rgba(255, 255, 255, 0.2)'}
          linkWidth={1.5}
          // Obsidian-style particle flow
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={onNodeClick}
          backgroundColor="transparent"
          // Smooth pan/zoom
          minZoom={0.5}
          maxZoom={4}
          // Custom render for uniform glowing nodes & crisp labels
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isRoot = node.id === 'root';
            const label = node.name;
            const fontSize = isRoot ? 14 / globalScale : 11 / globalScale;
            const nodeRadius = isRoot ? 8 : 4.5;
            
            // 1. Draw Glow Effect
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius * 2.5, 0, 2 * Math.PI, false);
            ctx.fillStyle = isRoot ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.08)';
            ctx.fill();

            // 2. Draw Solid Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = isRoot ? '#818cf8' : 'rgba(255, 255, 255, 0.95)';
            ctx.fill();
            
            // 3. Draw Label (Only if zoomed in enough, and NOT the root node)
            if (!isRoot && globalScale >= 1.2) {
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const textOffset = 10;
              const yPos = node.y + textOffset + (fontSize/2);

              // Draw solid background pill behind text for readability
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4); // padding

              ctx.fillStyle = 'rgba(5, 5, 16, 0.7)'; // Dark bg matching canvas
              ctx.beginPath();
              ctx.roundRect(
                node.x - bckgDimensions[0] / 2, 
                yPos - bckgDimensions[1] / 2, 
                bckgDimensions[0], 
                bckgDimensions[1], 
                4 / globalScale
              );
              ctx.fill();

              // Draw text
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillText(label, node.x, yPos);
            }
          }}
        />
      )}
    </div>
  );
}
