import React, { useMemo } from 'react';
import { type CircuitState, simulateCircuit } from '../engine';

interface TruthTableProps {
    circuit: CircuitState;
    onClose: () => void;
}

export const TruthTable: React.FC<TruthTableProps> = ({ circuit, onClose }) => {
    const tableData = useMemo(() => {
        const inputs = Object.values(circuit.nodes)
            .filter(n => n.type === 'INPUT')
            .sort((a, b) => a.position.y - b.position.y); // Sort by Y position for consistency

        const outputs = Object.values(circuit.nodes)
            .filter(n => n.type === 'OUTPUT')
            .sort((a, b) => a.position.y - b.position.y);

        if (inputs.length === 0) return null;

        const combinations = 1 << inputs.length;
        const rows = [];

        for (let i = 0; i < combinations; i++) {
            // Create a temporary circuit state for simulation
            let tempNodes = { ...circuit.nodes };

            // Set input states based on current combination
            inputs.forEach((input, index) => {
                const bit = (i >> (inputs.length - 1 - index)) & 1;
                tempNodes[input.id] = { ...input, state: !!bit };
            });

            // Run simulation
            const tempCircuit = simulateCircuit({ ...circuit, nodes: tempNodes });

            // Capture output states
            const rowOutputs = outputs.map(out => tempCircuit.nodes[out.id].state);

            rows.push({
                inputs: inputs.map((_, idx) => (i >> (inputs.length - 1 - idx)) & 1),
                outputs: rowOutputs
            });
        }

        return { inputs, outputs, rows };
    }, [circuit]);

    if (!tableData) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Truth Table</h3>
                    <p>No inputs found in the circuit.</p>
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ minWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Truth Table</h3>
                    <button className="btn-icon" onClick={onClose}>×</button>
                </div>

                <div className="table-container">
                    <table className="truth-table">
                        <thead>
                            <tr>
                                <th colSpan={tableData.inputs.length} className="group-header input-group">Inputs</th>
                                <th className="separator-header"></th>
                                <th colSpan={tableData.outputs.length} className="group-header output-group">Outputs</th>
                            </tr>
                            <tr>
                                {tableData.inputs.map((input, i) => (
                                    <th key={input.id} className="col-header">In {i}</th>
                                ))}
                                <th className="separator"></th>
                                {tableData.outputs.map((output, i) => (
                                    <th key={output.id} className="col-header">Out {i}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.rows.map((row, i) => (
                                <tr key={i}>
                                    {row.inputs.map((val, j) => (
                                        <td key={j} className={`val-${val}`}>{val}</td>
                                    ))}
                                    <td className="separator"></td>
                                    {row.outputs.map((val, j) => (
                                        <td key={j} className={`val-${val ? 1 : 0}`}>{val ? 1 : 0}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};
