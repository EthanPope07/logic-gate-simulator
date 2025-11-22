export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR' | 'INPUT' | 'OUTPUT' | 'IC' | 'CLOCK';

export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: GateType;
  position: Point;
  label?: string;
  inputs: string[]; // IDs of input pins
  outputs: string[]; // IDs of output pins
  state: boolean; // Current logic level (for output)
  icDefinitionId?: string; // For IC nodes, references the IC definition
}

export interface Wire {
  id: string;
  sourceNodeId: string;
  sourcePinIndex: number;
  targetNodeId: string;
  targetPinIndex: number;
  state: boolean; // High or Low
}

export interface ICDefinition {
  id: string;
  name: string;
  internalCircuit: CircuitState;
  inputMapping: { pinIndex: number; internalNodeId: string }[];
  outputMapping: { pinIndex: number; internalNodeId: string }[];
  inputCount: number;
  outputCount: number;
}

export interface CircuitState {
  nodes: Record<string, Node>;
  wires: Record<string, Wire>;
  customICs?: Record<string, ICDefinition>;
}

export const GATE_CONFIG: Record<GateType, { inputs: number; outputs: number; label: string }> = {
  AND: { inputs: 2, outputs: 1, label: 'AND' },
  OR: { inputs: 2, outputs: 1, label: 'OR' },
  NOT: { inputs: 1, outputs: 1, label: 'NOT' },
  XOR: { inputs: 2, outputs: 1, label: 'XOR' },
  NAND: { inputs: 2, outputs: 1, label: 'NAND' },
  NOR: { inputs: 2, outputs: 1, label: 'NOR' },
  XNOR: { inputs: 2, outputs: 1, label: 'XNOR' },
  INPUT: { inputs: 0, outputs: 1, label: 'IN' },
  OUTPUT: { inputs: 1, outputs: 0, label: 'OUT' },
  IC: { inputs: 0, outputs: 0, label: 'IC' }, // Dynamic based on definition
  CLOCK: { inputs: 0, outputs: 1, label: 'CLK' },
};
