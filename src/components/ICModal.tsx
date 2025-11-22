import React, { useState } from 'react';
import { type CircuitState } from '../engine';

interface ICModalProps {
    circuit: CircuitState;
    selectedNodeIds: Set<string>;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export const ICModal: React.FC<ICModalProps> = ({ circuit, selectedNodeIds, onClose, onCreate }) => {
    const [icName, setIcName] = useState('');

    const selectedNodes = Array.from(selectedNodeIds).map(id => circuit.nodes[id]).filter(Boolean);
    const inputCount = selectedNodes.filter(n => n.type === 'INPUT').length;
    const outputCount = selectedNodes.filter(n => n.type === 'OUTPUT').length;

    const handleCreate = () => {
        if (icName.trim()) {
            onCreate(icName.trim());
            onClose();
        }
    };

    const canCreate = icName.trim() && inputCount > 0 && outputCount > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ minWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create Custom IC</h2>
                    <button className="btn-icon" onClick={onClose}>✕</button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        IC Name
                    </label>
                    <input
                        type="text"
                        value={icName}
                        onChange={(e) => setIcName(e.target.value)}
                        placeholder="Enter IC name..."
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && canCreate) {
                                handleCreate();
                            }
                        }}
                    />
                </div>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '1rem',
                    borderRadius: '4px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Selected:</strong> {selectedNodeIds.size} node{selectedNodeIds.size !== 1 ? 's' : ''}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Inputs:</strong> {inputCount}
                    </div>
                    <div>
                        <strong>Outputs:</strong> {outputCount}
                    </div>
                </div>

                {(!inputCount || !outputCount) && (
                    <div style={{
                        background: 'rgba(255, 165, 0, 0.1)',
                        border: '1px solid rgba(255, 165, 0, 0.3)',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        color: 'var(--text-secondary)'
                    }}>
                        ⚠️ IC must have at least one INPUT and one OUTPUT node
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleCreate}
                        disabled={!canCreate}
                        style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}
                    >
                        Create IC
                    </button>
                </div>
            </div>
        </div>
    );
};
