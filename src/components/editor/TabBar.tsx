import React from 'react';
import { useStore } from '../../store/useStore';

const TabBar: React.FC = () => {
  const { openFiles, activeFile, setActiveFile, closeFile } = useStore();

  if (openFiles.length === 0) return null;

  return (
    <div style={{ 
      height: '35px', 
      background: 'var(--bg-sidebar)', 
      display: 'flex', 
      alignItems: 'center', 
      borderBottom: '1px solid var(--border)',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    }}>
      {openFiles.map((file) => (
        <div 
          key={file.path}
          onClick={() => setActiveFile(file)}
          style={{ 
            height: '100%', 
            padding: '0 15px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            background: activeFile?.path === file.path ? 'var(--bg)' : 'transparent',
            borderRight: '1px solid var(--border)',
            color: activeFile?.path === file.path ? 'var(--primary)' : 'var(--text-dim)',
            position: 'relative'
          }}
        >
          <span>📄</span>
          <span>{file.name}</span>
          {file.isDirty && <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%' }}></span>}
          <span 
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.path);
            }}
            style={{ 
              marginLeft: '5px', 
              fontSize: '14px', 
              opacity: 0.5,
              padding: '2px 5px',
              borderRadius: '3px'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--active-light)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ✕
          </span>
          {activeFile?.path === file.path && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabBar;
