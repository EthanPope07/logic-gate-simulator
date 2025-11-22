import { type CircuitState, type GateType, type Node, type Wire, type ICDefinition } from './types';

const evaluateGate = (type: GateType, inputs: boolean[]): boolean => {
    switch (type) {
        case 'AND': return inputs.every(i => i);
        case 'OR': return inputs.some(i => i);
        case 'NOT': return !inputs[0];
        case 'XOR': return inputs.reduce((a, b) => a !== b, false);
        case 'NAND': return !inputs.every(i => i);
        case 'NOR': return !inputs.some(i => i);
        case 'XNOR': return inputs.reduce((a, b) => a === b, true);
        case 'INPUT': return inputs[0] || false;
        case 'OUTPUT': return inputs[0] || false;
        case 'CLOCK': return inputs[0] || false; // CLOCK state is set externally
        case 'IC': return false; // IC nodes are handled separately
        default: return false;
    }
};

// Evaluate an IC node by simulating its internal circuit
const evaluateIC = (icDef: ICDefinition, inputValues: boolean[]): boolean[] => {
    // Create a copy of the internal circuit
    let internalCircuit: CircuitState = {
        nodes: { ...icDef.internalCircuit.nodes },
        wires: { ...icDef.internalCircuit.wires },
    };

    // Set the INPUT node states based on the IC's input values
    icDef.inputMapping.forEach((mapping, index) => {
        const inputNode = internalCircuit.nodes[mapping.internalNodeId];
        if (inputNode && inputNode.type === 'INPUT') {
            internalCircuit.nodes[mapping.internalNodeId] = {
                ...inputNode,
                state: inputValues[index] || false
            };
        }
    });

    // Simulate the internal circuit
    internalCircuit = simulateCircuit(internalCircuit);

    // Extract output values from OUTPUT nodes
    const outputValues = icDef.outputMapping.map(mapping => {
        const outputNode = internalCircuit.nodes[mapping.internalNodeId];
        return outputNode ? outputNode.state : false;
    });

    return outputValues;
};

export const simulateCircuit = (circuit: CircuitState): CircuitState => {
    let nextNodes = { ...circuit.nodes };
    let nextWires = { ...circuit.wires };
    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 100;

    while (changed && iterations < MAX_ITERATIONS) {
        changed = false;
        iterations++;

        // Update Wires based on Source Nodes
        Object.values(nextWires).forEach(wire => {
            const sourceNode = nextNodes[wire.sourceNodeId];
            if (sourceNode) {
                const newValue = sourceNode.state;
                if (wire.state !== newValue) {
                    nextWires[wire.id] = { ...wire, state: newValue };
                    changed = true;
                }
            }
        });

        // Update Nodes based on Input Wires
        Object.values(nextNodes).forEach(node => {
            if (node.type === 'INPUT' || node.type === 'CLOCK') return; // These are manually controlled

            // Find all wires connected to this node's inputs
            const inputValues = node.inputs.map((_, index) => {
                const connectedWire = Object.values(nextWires).find(
                    w => w.targetNodeId === node.id && w.targetPinIndex === index
                );
                return connectedWire ? connectedWire.state : false;
            });

            let newState: boolean;

            // Handle IC nodes specially
            if (node.type === 'IC' && node.icDefinitionId && circuit.customICs?.[node.icDefinitionId]) {
                const icDef = circuit.customICs[node.icDefinitionId];
                const outputValues = evaluateIC(icDef, inputValues);
                // For now, use the first output as the node state
                // In a more complete implementation, we'd handle multiple outputs
                newState = outputValues[0] || false;
            } else {
                newState = evaluateGate(node.type, inputValues);
            }

            if (node.state !== newState) {
                nextNodes[node.id] = { ...node, state: newState };
                changed = true;
            }
        });
    }

    return {
        nodes: nextNodes,
        wires: nextWires,
        customICs: circuit.customICs,
    };
};
