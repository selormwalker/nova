import React from 'react';
import { useStore } from '../../store/useStore';
import { readDirectory, readFileContent, FileNode } from '../../utils/fileSystem';

const FileItem: React.FC<{ node: FileNode; depth: number }> = ({ node, depth }) => {
  const setActiveFile = useStore((state) => state.setActiveFile);

  const handleClick = async () => {
    if (node.kind === 'file') {
      const content = await readFileContent(node.handle as FileSystemFileHandle);
      setActiveFile({
        name: node.name,
        content,
        handle: node.handle as FileSystemFileHandle,
      });
    }
  };

  return (
    <div style={{ paddingLeft: `${depth * 12}px` }}>
      <div 
        onClick={handleClick}
        style={{ 
          padding: '4px 8px', 
          cursor: 'pointer', 
          fontSize: '13px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          color: node.kind === 'directory' ? 'var(--primary)' : 'var(--text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        <span>{node.kind === 'directory' ? '📁' : '📄'}</span>
        {node.name}
      </div>
      {node.children && node.children.map(child => (
        <FileItem key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { setRootHandle, setFileTree, fileTree } = useStore();

  const handleOpenFolder = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      setRootHandle(handle);
      const tree = await readDirectory(handle);
      setFileTree(tree);
    } catch (err) {
      console.error('Failed to open directory:', err);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={handleOpenFolder}
          style={{ 
            width: '100%', 
            padding: '8px', 
            background: 'var(--active)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          Open Folder
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {fileTree.map(node => (
          <FileItem key={node.name} node={node} depth={1} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
