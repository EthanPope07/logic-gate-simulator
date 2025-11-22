import React from 'react';
import { type GateType, type ICDefinition, GATE_CONFIG } from '../engine/types';

interface SidebarProps {
    onDragStart: (type: GateType) => void;
    mode: 'ALL' | 'BASE3';
    customICs: Record<string, ICDefinition>;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart, mode, customICs }) => {
    const availableGates: GateType[] = mode === 'BASE3'
        ? ['AND', 'OR', 'NOT', 'INPUT', 'OUTPUT']
        : Object.keys(GATE_CONFIG).filter(k => k !== 'IC') as GateType[];

    return (
        <div className="sidebar-content">
            <h2 className="sidebar-title">Components</h2>
            <div className="gate-palette">
                {availableGates.map(type => (
                    <div
                        key={type}
                        className={`gate-item gate-${type.toLowerCase()}`}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('gateType', type);
                            onDragStart(type);
                        }}
                    >
                        <div className="gate-icon">
                            {GATE_CONFIG[type].label}
                        </div>
                        <span className="gate-label">{GATE_CONFIG[type].label}</span>
                    </div>
                ))}
            </div>

            {Object.keys(customICs).length > 0 && (
                <>
                    <h2 className="sidebar-title" style={{ marginTop: '1.5rem' }}>Custom ICs</h2>
                    <div className="gate-palette">
                        {Object.values(customICs).map(ic => (
                            <div
                                key={ic.id}
                                className="gate-item gate-ic"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('gateType', 'IC');
                                    e.dataTransfer.setData('icDefinitionId', ic.id);
                                    onDragStart('IC');
                                }}
                            >
                                <div className="gate-icon">
                                    {ic.name}
                                </div>
                                <span className="gate-label">{ic.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
