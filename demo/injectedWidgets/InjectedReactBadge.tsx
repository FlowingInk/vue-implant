import React from 'react';

export function InjectedReactBadge({ label, color }: { label?: string; color?: string }) {
    return React.createElement('span', {
        style: {
            background: color ?? '#f43f5e',
            color: '#fff',
            borderRadius: '999px',
            padding: '2px 10px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,.18)',
            marginLeft: '6px',
            display: 'inline-block',
        },
    }, label ?? '⚛️ React injection successful');
}
