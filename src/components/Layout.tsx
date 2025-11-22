import React from 'react';
import './Layout.css'; // We'll create this or just use inline/global styles

interface LayoutProps {
    sidebar: React.ReactNode;
    canvas: React.ReactNode;
    controls: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ sidebar, canvas, controls }) => {
    return (
        <div className="app-layout">
            <header className="app-header glass-panel">
                <h1 className="app-title">Logic<span className="text-accent">Sim</span></h1>
                <div className="app-controls">
                    {controls}
                </div>
            </header>
            <div className="app-body">
                <aside className="app-sidebar glass-panel">
                    {sidebar}
                </aside>
                <main className="app-canvas">
                    {canvas}
                </main>
            </div>
        </div>
    );
};
