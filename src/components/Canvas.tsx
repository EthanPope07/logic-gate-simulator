import React, { useState, useRef, useCallback, useEffect } from 'react';
import { type CircuitState, type GateType, addNode, addWire, removeNode, simulateCircuit } from '../engine';
import { GateNode } from './GateNode';
import { Wire } from './Wire';
import './Components.css';

interface CanvasProps {
    circuit: CircuitState;
    setCircuit: React.Dispatch<React.SetStateAction<CircuitState>>;
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    selectedNodeIds: Set<string>;
    setSelectedNodeIds: (ids: Set<string>) => void;
    isPaused: boolean;
    wireStyle: 'bezier' | 'orthogonal';
}

export const Canvas: React.FC<CanvasProps> = ({ circuit, setCircuit, selectedId, setSelectedId, selectedNodeIds, setSelectedNodeIds, isPaused, wireStyle }) => {
    const [dragState, setDragState] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
    const [wiringState, setWiringState] = useState<{ nodeId: string; pinIndex: number; isInput: boolean } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const GRID_SIZE = 20; // pixels

    // Snap position to grid
    const snapToGrid = (x: number, y: number) => ({
        x: Math.round(x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(y / GRID_SIZE) * GRID_SIZE
    });

    // Handle dropping new gates from sidebar
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('gateType') as GateType;
        if (!type) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const position = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const snappedPosition = snapToGrid(position.x, position.y);

        const icDefinitionId = type === 'IC' ? e.dataTransfer.getData('icDefinitionId') : undefined;

        setCircuit((prev: CircuitState) => {
            const newCircuit = addNode(prev, type, snappedPosition, icDefinitionId);
            return simulateCircuit(newCircuit);
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Handle dragging existing nodes
    const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        // Shift+Click for multi-selection
        if (e.shiftKey) {
            const newSelection = new Set(selectedNodeIds);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            setSelectedNodeIds(newSelection);
            setSelectedId(null); // Clear single selection when multi-selecting
            return;
        }

        // Normal click - single selection and drag
        setSelectedId(id);
        setSelectedNodeIds(new Set()); // Clear multi-selection
        const node = circuit.nodes[id];
        setDragState({
            id,
            offset: {
                x: e.clientX - node.position.x,
                y: e.clientY - node.position.y
            }
        });
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });

        if (dragState) {
            const newX = e.clientX - dragState.offset.x;
            const newY = e.clientY - dragState.offset.y;
            const snappedPos = snapToGrid(newX, newY);

            setCircuit((prev: CircuitState) => ({
                ...prev,
                nodes: {
                    ...prev.nodes,
                    [dragState.id]: {
                        ...prev.nodes[dragState.id],
                        position: snappedPos
                    }
                }
            }));
        }
    }, [dragState, setCircuit]);

    const handleMouseUp = () => {
        setDragState(null);
        if (wiringState) {
            setWiringState(null);
        }
    };

    // Handle Wiring
    const handlePinMouseDown = (nodeId: string, pinIndex: number, isInput: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        setWiringState({ nodeId, pinIndex, isInput });
    };

    const handlePinMouseUp = (nodeId: string, pinIndex: number, isInput: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!wiringState) return;

        if (wiringState.isInput === isInput) {
            setWiringState(null);
            return;
        }

        const source = !wiringState.isInput ? wiringState : { nodeId, pinIndex };
        const target = wiringState.isInput ? wiringState : { nodeId, pinIndex };

        setCircuit((prev: CircuitState) => {
            const newCircuit = addWire(prev, source.nodeId, source.pinIndex, target.nodeId, target.pinIndex);
            return simulateCircuit(newCircuit);
        });
        setWiringState(null);
    };

    // Calculate pin positions for wires
    const getPinPosition = (nodeId: string, pinIndex: number, isInput: boolean) => {
        const node = circuit.nodes[nodeId];
        if (!node) return { x: 0, y: 0 };

        const PIN_OFFSET_Y = 40;
        const PIN_SPACING = 20;

        return {
            x: node.position.x + (isInput ? 0 : 80),
            y: node.position.y + PIN_OFFSET_Y + (pinIndex * PIN_SPACING)
        };
    };

    // Delete on Delete/Backspace
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                setCircuit((prev: CircuitState) => {
                    const newCircuit = removeNode(prev, selectedId);
                    return simulateCircuit(newCircuit);
                });
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, setCircuit, setSelectedId]);

    const toggleNode = (id: string) => {
        setCircuit((prev: CircuitState) => {
            const node = prev.nodes[id];
            if (node.type !== 'INPUT') return prev;

            const newNodes = {
                ...prev.nodes,
                [id]: { ...node, state: !node.state }
            };

            return simulateCircuit({ ...prev, nodes: newNodes });
        });
    };

    return (
        <div
            ref={canvasRef}
            className="canvas-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setSelectedId(null)}
        >
            <svg className="wires-layer">
                {Object.values(circuit.wires).map(wire => {
                    const start = getPinPosition(wire.sourceNodeId, wire.sourcePinIndex, false);
                    const end = getPinPosition(wire.targetNodeId, wire.targetPinIndex, true);
                    return (
                        <Wire
                            key={wire.id}
                            start={start}
                            end={end}
                            state={wire.state}
                            isHigh={isPaused ? false : wire.state}
                            style={wireStyle}
                        />
                    );
                })}
                {wiringState && (
                    <Wire
                        start={getPinPosition(wiringState.nodeId, wiringState.pinIndex, wiringState.isInput)}
                        end={mousePos}
                        state={false}
                        isHigh={false}
                        style={wireStyle}
                    />
                )}
            </svg>


            {Object.values(circuit.nodes).map(node => (
                <GateNode
                    key={node.id}
                    node={node}
                    isSelected={selectedId === node.id || selectedNodeIds.has(node.id)}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onPinMouseDown={handlePinMouseDown}
                    onPinMouseUp={handlePinMouseUp}
                    onToggle={() => toggleNode(node.id)}
                />
            ))}
        </div>
    );
};
