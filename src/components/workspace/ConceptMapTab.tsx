import React, { useState } from 'react';
import { ConceptNode, WorkspaceTab } from '../../types';
import {
  Network,
  Info,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface ConceptMapTabProps {
  conceptMap: {
    centralNode: string;
    centralDescription: string;
    nodes: ConceptNode[];
  };
  onNavigateTab?: (tab: WorkspaceTab) => void;
}

export const ConceptMapTab: React.FC<ConceptMapTabProps> = ({
  conceptMap,
  onNavigateTab,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(
    conceptMap.nodes[0] || null
  );

  return (
    <div id="concept-map-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Concept Map</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Relational Graph
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual relationship network between concepts. Click any node to inspect its mental model.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Click any node to explore dependencies</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Graph (SVG Canvas) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 sm:p-8 relative min-h-[460px] flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Center is at 50% 50% */}
            {conceptMap.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g key={`line-${node.id}`}>
                  {/* Line from center (50%, 50%) to node (node.x%, node.y%) */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={isSelected ? '#60a5fa' : '#334155'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Root Node */}
          <div
            onClick={() => setSelectedNode(null)}
            className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center text-center p-2 shadow-xl shadow-blue-500/30 border-4 border-blue-400/40 cursor-pointer hover:scale-105 transition-transform"
          >
            <Network className="w-5 h-5 mb-1" />
            <span className="font-extrabold text-sm tracking-tight leading-tight">
              {conceptMap.centralNode}
            </span>
            <span className="text-[10px] text-blue-100 font-medium mt-0.5">
              Root Model
            </span>
          </div>

          {/* Surrounding Connected Nodes */}
          {conceptMap.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                id={`concept-node-${node.id}`}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 px-3.5 py-2 rounded-2xl cursor-pointer transition-all duration-200 select-none shadow-md ${
                  isSelected
                    ? 'bg-white text-slate-900 ring-4 ring-blue-500/50 scale-110'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      node.difficulty === 'Easy'
                        ? 'bg-emerald-400'
                        : node.difficulty === 'Medium'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span className="text-xs font-bold whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Concept Inspection Card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            {selectedNode ? (
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      {selectedNode.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedNode.difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : selectedNode.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {selectedNode.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedNode.label}
                  </h3>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {selectedNode.description}
                </div>

                {/* Code or Formula Snippet */}
                {selectedNode.codeOrFormula && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Mathematical Syntax / Code</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                      <code>{selectedNode.codeOrFormula}</code>
                    </pre>
                  </div>
                )}

                {/* Practical Use Case */}
                {selectedNode.practicalUse && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-700 block">
                      Practical Applications:
                    </span>
                    <p className="text-slate-600 leading-normal">
                      {selectedNode.practicalUse}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {conceptMap.centralNode} (Root Topic)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {conceptMap.centralDescription}
                </p>
                <div className="p-3.5 rounded-xl bg-blue-50/70 text-xs text-blue-900">
                  Select any connected node on the map to inspect its operations, algorithmic complexity, and formulas.
                </div>
              </div>
            )}

            {/* Quick action buttons */}
            {onNavigateTab && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateTab('flashcards')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Flashcards</span>
                </button>
                <button
                  onClick={() => onNavigateTab('quiz')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Test in Quiz</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
