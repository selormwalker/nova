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
    const ext = node.name.split('.').pop();
    switch (ext) {
      case 'ts':
      case 'tsx': return '🔷';
      case 'js':
      case 'jsx': return '🟨';
      case 'css': return '🎨';
      case 'html': return '🌐';
      case 'json': return '⚙️';
      case 'md': return '📝';
      default: return '📄';
    }
  };

  return (
    <div>
      <div 
        onClick={handleClick}
        style={{ 
          padding: '4px 12px', 
          paddingLeft: `${depth * 12 + 12}px`,
          cursor: 'pointer', 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: isActive ? 'var(--primary)' : 'var(--text)',
          background: isActive ? 'var(--active-light)' : 'transparent',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent'
        }}
        onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ fontSize: '10px', opacity: 0.5, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.1s', display: node.kind === 'directory' ? 'inline-block' : 'none' }}>▶</span>
        <span style={{ fontSize: '14px' }}>{getIcon()}</span>
        <span>{node.name}</span>
      </div>
      {node.kind === 'directory' && isOpen && node.children && (
        <div style={{ borderLeft: '1px solid var(--border)', marginLeft: `${depth * 12 + 20}px` }}>
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
      <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-dim)', letterSpacing: '1px' }}>EXPLORER</div>
        <button 
          onClick={handleOpenFolder}
          style={{ 
            width: '100%', 
            padding: '6px', 
            background: 'var(--active)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600'
          }}
        >
          OPEN FOLDER
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {fileTree.length > 0 ? (
          fileTree.map(node => (
            <FileItem key={node.path} node={node} depth={0} />
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)' }}>
            No folder opened
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
