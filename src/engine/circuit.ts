import { type CircuitState, type Node, type Wire, type GateType, type ICDefinition, GATE_CONFIG, type Point } from './types';
import { v4 as uuidv4 } from 'uuid';

export const createCircuit = (): CircuitState => ({
    nodes: {},
    wires: {},
    customICs: {},
});

export const addNode = (circuit: CircuitState, type: GateType, position: { x: number; y: number }, icDefinitionId?: string): CircuitState => {
    const id = uuidv4();
    let config = GATE_CONFIG[type];

    // For IC nodes, get config from the IC definition
    if (type === 'IC' && icDefinitionId && circuit.customICs?.[icDefinitionId]) {
        const icDef = circuit.customICs[icDefinitionId];
        config = {
            inputs: icDef.inputCount,
            outputs: icDef.outputCount,
            label: icDef.name
        };
    }

    const newNode: Node = {
        id,
        type,
        position,
        inputs: Array(config.inputs).fill('').map(() => uuidv4()),
        outputs: Array(config.outputs).fill('').map(() => uuidv4()),
        state: false,
        icDefinitionId,
        label: type === 'IC' ? config.label : undefined,
    };

    return {
        ...circuit,
        nodes: { ...circuit.nodes, [id]: newNode },
        customICs: circuit.customICs, // Preserve customICs
    };
};

export const removeNode = (circuit: CircuitState, nodeId: string): CircuitState => {
    const { [nodeId]: _, ...remainingNodes } = circuit.nodes;

    // Remove wires connected to this node
    const remainingWires = Object.fromEntries(
        Object.entries(circuit.wires).filter(([, wire]) =>
            wire.sourceNodeId !== nodeId && wire.targetNodeId !== nodeId
        )
    );

    return {
        ...circuit,
        nodes: remainingNodes,
        wires: remainingWires,
        customICs: circuit.customICs,
    };
};

export const addWire = (
    circuit: CircuitState,
    sourceNodeId: string,
    sourcePinIndex: number,
    targetNodeId: string,
    targetPinIndex: number
): CircuitState => {
    const id = uuidv4();
    const newWire: Wire = {
        id,
        sourceNodeId,
        sourcePinIndex,
        targetNodeId,
        targetPinIndex,
        state: false,
    };

    return {
        ...circuit,
        wires: { ...circuit.wires, [id]: newWire },
    };
};

export const removeWire = (circuit: CircuitState, wireId: string): CircuitState => {
    const { [wireId]: _, ...remainingWires } = circuit.wires;
    return {
        ...circuit,
        wires: remainingWires,
    };
};

export const createIC = (circuit: CircuitState, selectedNodeIds: string[], name: string): CircuitState => {
    const id = uuidv4();

    // Get selected nodes
    const selectedNodes = selectedNodeIds.map(id => circuit.nodes[id]).filter(Boolean);

    // Find INPUT and OUTPUT nodes to determine IC pins
    const inputNodes = selectedNodes.filter(n => n.type === 'INPUT');
    const outputNodes = selectedNodes.filter(n => n.type === 'OUTPUT');

    // Create internal circuit (copy of selected nodes and their wires)
    const internalNodes: Record<string, Node> = {};
    selectedNodes.forEach(node => {
        internalNodes[node.id] = { ...node };
    });

    const internalWires: Record<string, Wire> = {};
    Object.values(circuit.wires).forEach(wire => {
        if (selectedNodeIds.includes(wire.sourceNodeId) && selectedNodeIds.includes(wire.targetNodeId)) {
            internalWires[wire.id] = { ...wire };
        }
    });

    // Create mappings
    const inputMapping = inputNodes.map((node, index) => ({
        pinIndex: index,
        internalNodeId: node.id
    }));

    const outputMapping = outputNodes.map((node, index) => ({
        pinIndex: index,
        internalNodeId: node.id
    }));

    const icDefinition: ICDefinition = {
        id,
        name,
        internalCircuit: {
            nodes: internalNodes,
            wires: internalWires,
        },
        inputMapping,
        outputMapping,
        inputCount: inputNodes.length,
        outputCount: outputNodes.length,
    };

    return {
        ...circuit,
        customICs: {
            ...circuit.customICs,
            [id]: icDefinition,
        },
    };
};
