import React from 'react';

interface ControlsProps {
    mode: 'ALL' | 'BASE3';
    setMode: (mode: 'ALL' | 'BASE3') => void;
    onClear: () => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    onDelete: () => void;
    hasSelection: boolean;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onSave: () => void;
    onLoad: (file: File) => void;
    onOpenTruthTable: () => void;
    wireStyle: 'bezier' | 'orthogonal';
    setWireStyle: (style: 'bezier' | 'orthogonal') => void;
    onCreateIC: () => void;
    canCreateIC: boolean;
    clockSpeed: number;
    setClockSpeed: (speed: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
    mode,
    setMode,
    onClear,
    isPaused,
    setIsPaused,
    onDelete,
    hasSelection,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onSave,
    onLoad,
    onOpenTruthTable,
    wireStyle,
    setWireStyle,
    onCreateIC,
    canCreateIC,
    clockSpeed,
    setClockSpeed
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onLoad(e.target.files[0]);
        }
        if (e.target.value) e.target.value = '';
    };

    return (
        <div className="controls-group" style={{ display: 'flex', gap: '1rem' }}>
            <div className="mode-toggle">
                <button
                    className={`btn ${mode === 'BASE3' ? 'btn-primary' : ''}`}
                    onClick={() => setMode('BASE3')}
                    title="Only AND, OR, NOT"
                >
                    Base 3
                </button>
                <button
                    className={`btn ${mode === 'ALL' ? 'btn-primary' : ''}`}
                    onClick={() => setMode('ALL')}
                    title="All Gates"
                >
                    All Gates
                </button>
            </div>
            <div className="actions-group" style={{ display: 'flex', gap: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                <button
                    className="btn"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    style={{ opacity: canUndo ? 1 : 0.5, cursor: canUndo ? 'pointer' : 'not-allowed' }}
                >
                    Undo
                </button>
                <button
                    className="btn"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                    style={{ opacity: canRedo ? 1 : 0.5, cursor: canRedo ? 'pointer' : 'not-allowed' }}
                >
                    Redo
                </button>
                <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <button
                    className={`btn ${isPaused ? 'btn-warning' : ''}`}
                    onClick={() => setIsPaused(!isPaused)}
                    style={{ minWidth: '80px' }}
                >
                    {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={onDelete}
                    disabled={!hasSelection}
                    style={{ opacity: hasSelection ? 1 : 0.5, cursor: hasSelection ? 'pointer' : 'not-allowed' }}
                >
                    Delete
                </button>
                <button className="btn" onClick={onClear}>
                    Clear
                </button>
                <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <button
                    className="btn"
                    onClick={() => setWireStyle(wireStyle === 'bezier' ? 'orthogonal' : 'bezier')}
                    title="Toggle Wire Style"
                >
                    {wireStyle === 'bezier' ? 'Curved' : 'Angled'}
                </button>
                <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <button className="btn" onClick={onSave} title="Save Circuit">
                    Save
                </button>
                <button className="btn" onClick={() => fileInputRef.current?.click()} title="Load Circuit">
                    Load
                </button>
                <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <button
                    className="btn"
                    onClick={onCreateIC}
                    disabled={!canCreateIC}
                    title="Create Custom IC from selected nodes"
                    style={{ opacity: canCreateIC ? 1 : 0.5, cursor: canCreateIC ? 'pointer' : 'not-allowed' }}
                >
                    Create IC
                </button>
                <button className="btn" onClick={onOpenTruthTable} title="Generate Truth Table">
                    Table
                </button>
                <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Clock Speed:
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={clockSpeed}
                        onChange={(e) => setClockSpeed(Number(e.target.value))}
                        style={{ width: '100px' }}
                        title={`${clockSpeed}ms`}
                    />
                    <span style={{ fontSize: '0.85rem', minWidth: '50px', color: 'var(--text-secondary)' }}>
                        {clockSpeed}ms
                    </span>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
