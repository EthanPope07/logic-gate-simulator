import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Controls } from './components/Controls';
import { createCircuit, type CircuitState, removeNode, simulateCircuit, createIC } from './engine';
import { useHistory } from './hooks/useHistory';
import { TruthTable } from './components/TruthTable';
import { ICModal } from './components/ICModal';
import './index.css';

function App() {
  const {
    state: circuit,
    set: setCircuit,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetCircuit
  } = useHistory<CircuitState>(createCircuit());

  const [mode, setMode] = useState<'ALL' | 'BASE3'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showICModal, setShowICModal] = useState(false);
  const [wireStyle, setWireStyle] = useState<'bezier' | 'orthogonal'>('bezier');
  const [clockSpeed, setClockSpeed] = useState(500); // milliseconds between clock ticks

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Clock tick mechanism
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCircuit((prev: CircuitState) => {
        // Toggle all CLOCK nodes
        const updatedNodes = { ...prev.nodes };
        let hasClockNodes = false;

        Object.values(updatedNodes).forEach(node => {
          if (node.type === 'CLOCK') {
            updatedNodes[node.id] = { ...node, state: !node.state };
            hasClockNodes = true;
          }
        });

        if (!hasClockNodes) return prev;

        const newCircuit = {
          ...prev,
          nodes: updatedNodes,
        };

        return simulateCircuit(newCircuit);
      });
    }, clockSpeed);

    return () => clearInterval(interval);
  }, [clockSpeed, isPaused, setCircuit]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the circuit?')) {
      resetCircuit({
        nodes: {},
        wires: {},
        customICs: {}
      });
      setSelectedId(null);
      setSelectedNodeIds(new Set());
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      const newCircuit = removeNode(circuit, selectedId);
      setCircuit(simulateCircuit(newCircuit));
      setSelectedId(null);
    }
    setSelectedNodeIds(new Set());
  };

  const handleSave = () => {
    const data = JSON.stringify(circuit, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loadedCircuit = JSON.parse(content) as CircuitState;
        // Basic validation
        if (loadedCircuit.nodes && loadedCircuit.wires) {
          resetCircuit(loadedCircuit);
          setSelectedId(null);
        } else {
          alert('Invalid circuit file');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load circuit file');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateIC = (name: string) => {
    const newCircuit = createIC(circuit, Array.from(selectedNodeIds), name);
    setCircuit(newCircuit);
    setSelectedNodeIds(new Set());
    setShowICModal(false);
  };

  return (
    <>
      <Layout
        sidebar={
          <Sidebar
            mode={mode}
            customICs={circuit.customICs || {}}
            onDragStart={() => { }}
          />
        }
        canvas={
          <Canvas
            circuit={circuit}
            setCircuit={setCircuit}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedNodeIds={selectedNodeIds}
            setSelectedNodeIds={setSelectedNodeIds}
            isPaused={isPaused}
            wireStyle={wireStyle}
          />
        }
        controls={
          <Controls
            mode={mode}
            setMode={setMode}
            onClear={handleClear}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            onDelete={handleDelete}
            hasSelection={!!selectedId}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onSave={handleSave}
            onLoad={handleLoad}
            onOpenTruthTable={() => setShowTruthTable(true)}
            wireStyle={wireStyle}
            setWireStyle={setWireStyle}
            onCreateIC={() => setShowICModal(true)}
            canCreateIC={selectedNodeIds.size >= 2}
            clockSpeed={clockSpeed}
            setClockSpeed={setClockSpeed}
          />
        }
      />
      {showTruthTable && (
        <TruthTable
          circuit={circuit}
          onClose={() => setShowTruthTable(false)}
        />
      )}
      {showICModal && (
        <ICModal
          circuit={circuit}
          selectedNodeIds={selectedNodeIds}
          onClose={() => setShowICModal(false)}
          onCreate={handleCreateIC}
        />
      )}
    </>
  );
}

export default App;
