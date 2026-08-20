import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { Network, AlertTriangle, RefreshCw, Upload, Layers, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const KnowledgeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [graphElements, setGraphElements] = useState<any[]>([]);

  const [neo4jState, setNeo4jState] = useState<{
    connected: boolean;
    status: string;
    loading: boolean;
    hasData: boolean;
  }>({
    connected: false,
    status: 'checking',
    loading: true,
    hasData: false
  });

  const checkGraphHealthAndData = async () => {
    if (!user?.token) return;
    setNeo4jState((prev) => ({ ...prev, loading: true }));
    try {
      // 1. Check Neo4j service health
      const healthRes = await fetch('http://localhost:8000/api/v1/health/neo4j');
      const healthData = await healthRes.json();

      // 2. Fetch live graph visualization data from API Gateway (Neo4j or Knowledge Graph Engine)
      const graphRes = await fetch('http://localhost:8000/api/v1/graph/visualization', {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      let nodes: any[] = [];
      let edges: any[] = [];

      if (graphRes.ok) {
        const graphData = await graphRes.json();
        nodes = graphData.nodes || [];
        edges = graphData.edges || [];
      }

      const hasNodes = nodes.length > 0;
      setGraphElements([...nodes, ...edges]);

      setNeo4jState({
        connected: !!healthData.connected,
        status: healthData.status || (healthData.connected ? 'healthy' : 'unavailable'),
        loading: false,
        hasData: hasNodes
      });
    } catch (e) {
      setNeo4jState({ connected: false, status: 'unavailable', loading: false, hasData: false });
    }
  };

  useEffect(() => {
    checkGraphHealthAndData();
  }, [user]);

  useEffect(() => {
    if (!containerRef.current || graphElements.length === 0) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: graphElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#475569',
            'label': 'data(label)',
            'color': '#0F172A',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'width': '36px',
            'height': '36px'
          }
        },
        {
          selector: 'node[type="DOCUMENT"]',
          style: {
            'background-color': '#2563EB',
            'width': '46px',
            'height': '46px'
          }
        },
        {
          selector: 'node[type="DEPARTMENT"]',
          style: {
            'background-color': '#7C3AED',
            'width': '40px',
            'height': '40px'
          }
        },
        {
          selector: 'node[type="CATEGORY"]',
          style: {
            'background-color': '#059669',
            'width': '38px',
            'height': '38px'
          }
        },
        {
          selector: 'node[type="CLAUSE"]',
          style: {
            'background-color': '#D97706',
            'width': '34px',
            'height': '34px'
          }
        },
        {
          selector: 'node[type="ENTITY"]',
          style: {
            'background-color': '#0891B2',
            'width': '34px',
            'height': '34px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': '#94A3B8',
            'target-arrow-color': '#94A3B8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#475569',
            'text-background-opacity': 1,
            'text-background-color': '#FFFFFF',
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 45
      }
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode(node.data());
    });

    return () => {
      cy.destroy();
    };
  }, [graphElements]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-7xl mx-auto space-y-4">
      {/* GRAPH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Kerala Finance Knowledge Graph Engine</h2>
            <p className="text-[11px] text-slate-500 font-semibold">
              Interactive Lineage Traversal • Documents • Departments • Clauses • Entities
            </p>
          </div>
        </div>

        {/* NEO4J REAL STATUS & REFRESH */}
        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                neo4jState.loading
                  ? 'bg-amber-400 animate-spin'
                  : neo4jState.connected
                  ? 'bg-emerald-500'
                  : neo4jState.status === 'not_configured'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span className="font-bold">
              {neo4jState.loading
                ? 'Checking Neo4j...'
                : neo4jState.connected
                ? 'Neo4j Connected'
                : neo4jState.status === 'not_configured'
                ? 'Neo4j Not Configured'
                : 'Neo4j Offline'}
            </span>
          </div>

          <button
            onClick={checkGraphHealthAndData}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-bold flex items-center gap-1 cursor-pointer"
            title="Refresh Knowledge Graph"
          >
            <RefreshCw className={`w-4 h-4 ${neo4jState.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* GRAPH CANVAS OR EMPTY KNOWLEDGE BASE STATE */}
      {!neo4jState.hasData ? (
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center border border-purple-100">
            <Network className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">Knowledge Graph Empty</h3>
            <p className="text-xs text-slate-500">
              No nodes or relationships exist yet. Upload your first PDF document to generate interactive document, department, clause, and entity graph nodes.
            </p>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow inline-flex items-center space-x-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Go to Documents & Upload PDF</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* CYTOSCAPE GRAPH CANVAS */}
          <div className="lg:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner relative overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />

            {/* COLOR LEGEND OVERLAY */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-[10px] text-white space-y-1.5">
              <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">
                Node Legend
              </span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                <span>Document</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
                <span>Department</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                <span>Category</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
                <span>Clause</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block"></span>
                <span>Entity</span>
              </div>
            </div>
          </div>

          {/* SELECTED NODE SIDE DETAILS PANEL */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs overflow-y-auto">
            <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" /> Node Properties
            </h3>

            {selectedNode ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">LABEL / NAME</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">{selectedNode.label}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px]">NODE TYPE</span>
                  <span className="font-extrabold text-blue-600 block mt-0.5">{selectedNode.type}</span>
                </div>

                {selectedNode.status && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px]">STATUS</span>
                    <span className="font-extrabold text-emerald-600 block mt-0.5">{selectedNode.status}</span>
                  </div>
                )}

                {selectedNode.title && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px]">TITLE</span>
                    <span className="font-medium text-slate-700 block mt-0.5">{selectedNode.title}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px] italic text-center py-10">
                Click any graph node to inspect properties and relationship links.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
