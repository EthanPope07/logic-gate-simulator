import React from 'react';
import { type Point } from '../engine/types';

interface WireProps {
    start: Point;
    end: Point;
    state: boolean;
    isHigh: boolean;
    style?: 'bezier' | 'orthogonal';
}

export const Wire: React.FC<WireProps> = ({ start, end, state, isHigh, style = 'bezier' }) => {
    const getPath = () => {
        if (style === 'orthogonal') {
            const midX = (start.x + end.x) / 2;
            return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
        } else {
            // Bezier
            const dx = Math.abs(end.x - start.x);
            const cp1 = { x: start.x + dx * 0.5, y: start.y };
            const cp2 = { x: end.x - dx * 0.5, y: end.y };
            return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
        }
    };

    return (
        <g>
            {/* Outer glow/stroke for visibility */}
            <path
                d={getPath()}
                fill="none"
                stroke={isHigh ? 'var(--wire-on)' : 'var(--wire-off)'}
                strokeWidth="4"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Inner core wire */}
            <path
                d={getPath()}
                fill="none"
                stroke={isHigh ? 'var(--wire-on)' : 'var(--wire-off)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.2s' }}
            />
        </g>
    );
};
