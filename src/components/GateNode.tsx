import React from 'react';
import { type Node, GATE_CONFIG } from '../engine/types';

interface GateNodeProps {
    node: Node;
    isSelected: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onPinMouseDown: (nodeId: string, pinIndex: number, isInput: boolean, e: React.MouseEvent) => void;
    onPinMouseUp: (nodeId: string, pinIndex: number, isInput: boolean, e: React.MouseEvent) => void;
    onToggle: () => void;
}

export const GateNode: React.FC<GateNodeProps> = ({
    node,
    isSelected,
    onMouseDown,
    onPinMouseDown,
    onPinMouseUp,
    onToggle
}) => {
    const config = GATE_CONFIG[node.type];

    // For IC nodes, use the actual pin counts from the node, not the config
    const inputCount = node.type === 'IC' ? node.inputs.length : config.inputs;
    const outputCount = node.type === 'IC' ? node.outputs.length : config.outputs;
    const displayLabel = node.type === 'IC' && node.label ? node.label : config.label;

    // Dynamic styling based on gate type
    const getGateColor = () => {
        switch (node.type) {
            case 'AND': return 'var(--gate-and)';
            case 'OR': return 'var(--gate-or)';
            case 'NOT': return 'var(--gate-not)';
            case 'XOR': return 'var(--gate-xor)';
            case 'IC': return 'var(--accent-primary)';
            case 'CLOCK': return 'var(--accent-warning)';
            default: return 'var(--bg-panel)';
        }
    };

    return (
        <div
            className={`gate-node ${isSelected ? 'selected' : ''}`}
            style={{
                left: node.position.x,
                top: node.position.y,
                borderColor: isSelected ? 'var(--accent-warning)' : 'var(--border-color)'
            }}
            onMouseDown={onMouseDown}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="gate-header" style={{ backgroundColor: getGateColor() }}>
                {displayLabel}
            </div>

            <div className="gate-body">
                <div className="gate-inputs">
                    {Array(inputCount).fill(0).map((_, i) => (
                        <div
                            key={`in-${i}`}
                            className="pin input-pin"
                            onMouseDown={(e) => onPinMouseDown(node.id, i, true, e)}
                            onMouseUp={(e) => onPinMouseUp(node.id, i, true, e)}
                            title={`Input ${i}`}
                        />
                    ))}
                </div>

                <div className="gate-content">
                    {/* Optional: Show state for debugging or for I/O nodes */}
                    {(node.type === 'INPUT' || node.type === 'OUTPUT' || node.type === 'CLOCK') && (
                        <div
                            className={`status-indicator ${node.state ? 'on' : 'off'}`}
                            onClick={(e) => {
                                if (node.type === 'INPUT') {
                                    e.stopPropagation();
                                    onToggle();
                                }
                            }}
                            style={{ cursor: node.type === 'INPUT' ? 'pointer' : 'default' }}
                        />
                    )}
                </div>

                <div className="gate-outputs">
                    {Array(outputCount).fill(0).map((_, i) => (
                        <div
                            key={`out-${i}`}
                            className="pin output-pin"
                            onMouseDown={(e) => onPinMouseDown(node.id, i, false, e)}
                            onMouseUp={(e) => onPinMouseUp(node.id, i, false, e)}
                            title={`Output ${i}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
