import React, { useState } from 'react';
import { useStore, FileNode, OpenFile } from '../../store/useStore';
import { readDirectory, readFileContent } from '../../utils/fileSystem';

const FileItem: React.FC<{ node: FileNode; depth: number }> = ({ node, depth }) => {
  const { setActiveFile, activeFile } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = activeFile?.path === node.path;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.kind === 'directory') {
      setIsOpen(!isOpen);
    } else {
      const content = await readFileContent(node.handle as FileSystemFileHandle);
      const openFile: OpenFile = {
        name: node.name,
        content,
        handle: node.handle as FileSystemFileHandle,
        path: node.path
      };
      setActiveFile(openFile);
    }
  };

  const getIcon = () => {
    if (node.kind === 'directory') {
      return isOpen ? '📂' : '📁';
    }
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx': return '🔷';
      case 'js':
      case 'jsx': return '🟨';
      case 'css': return '🎨';
      case 'html': return '🌐';
      case 'json': return '⚙️';
      case 'md': return '📝';
      case 'py': return '🐍';
      case 'cpp': return '🛡️';
      case 'rs': return '⚙️';
      default: return '📄';
    }
  };

  return (
    <div>
      <div 
        onClick={handleClick}
        style={{ 
          padding: '6px 12px', 
          paddingLeft: `${depth * 12 + 15}px`,
          cursor: 'pointer', 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          color: isActive ? 'var(--primary)' : 'var(--text)',
          background: isActive ? 'var(--active-light)' : 'transparent',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'background 0.1s',
          fontWeight: isActive ? '600' : '400'
        }}
        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ 
          fontSize: '9px', 
          opacity: 0.5, 
          transform: isOpen ? 'rotate(90deg)' : 'none', 
          transition: 'transform 0.1s', 
          display: node.kind === 'directory' ? 'inline-block' : 'none',
          width: '10px'
        }}>▶</span>
        {!isOpen && node.kind === 'directory' && <span style={{ width: '10px', display: 'none' }}></span>}
        <span style={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>{getIcon()}</span>
        <span style={{ opacity: isActive ? 1 : 0.85 }}>{node.name}</span>
      </div>
      {node.kind === 'directory' && isOpen && node.children && (
        <div style={{ marginLeft: '1px' }}>
          {node.children.map(child => (
            <FileItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { setRootHandle, setFileTree, fileTree } = useStore();

  const handleOpenFolder = async () => {
    try {
      // @ts-expect-error - showDirectoryPicker is not yet in the standard Window interface
      const handle = await window.showDirectoryPicker();
      setRootHandle(handle);
      const tree = await readDirectory(handle);
      setFileTree(tree);
    } catch (err) {
      console.error("Folder picker error:", err);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-dim)', letterSpacing: '1.2px', opacity: 0.7 }}>EXPLORER</div>
        <button 
          onClick={handleOpenFolder}
          className="btn"
          style={{ width: '100%', height: '28px' }}
        >
          OPEN FOLDER
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {fileTree.length > 0 ? (
          fileTree.map(node => (
            <FileItem key={node.path} node={node} depth={0} />
          ))
        ) : (
          <div style={{ padding: '30px 20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.6' }}>
            No folder workspace<br/>currently active
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
