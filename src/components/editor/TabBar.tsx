import React from 'react';
import { useStore } from '../../store/useStore';

const TabBar: React.FC = () => {
  const { openFiles, activeFile, setActiveFile, closeFile } = useStore();

  if (openFiles.length === 0) return null;

  return (
    <div style={{ 
      height: 'var(--tab-height)', 
      background: 'var(--bg-sidebar)', 
      display: 'flex', 
      alignItems: 'center', 
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      zIndex: 5
    }}>
      {openFiles.map((file) => {
        const isActive = activeFile?.path === file.path;
        return (
          <div 
            key={file.path}
            onClick={() => setActiveFile(file)}
            style={{ 
              height: '100%', 
              padding: '0 15px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontSize: '12px',
              cursor: 'pointer',
              background: isActive ? 'var(--bg)' : 'transparent',
              borderRight: '1px solid var(--border)',
              color: isActive ? 'var(--text)' : 'var(--text-dim)',
              position: 'relative',
              fontWeight: isActive ? '600' : '400',
              transition: 'background 0.2s, color 0.2s'
            }}
            onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '14px', opacity: isActive ? 1 : 0.6 }}>📄</span>
            <span style={{ letterSpacing: '0.2px' }}>{file.name}</span>
            {file.isDirty && <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', marginLeft: '2px' }}></div>}
            <span 
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.path);
              }}
              style={{ 
                marginLeft: '8px', 
                fontSize: '12px', 
                opacity: 0.4,
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.background = 'var(--active-light)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '0.4';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ✕
            </span>
            {isActive && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
