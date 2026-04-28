import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { writeFileContent } from '../../utils/fileSystem';

const Editor: React.FC = () => {
  const { activeFile, setActiveFile } = useStore();

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      setActiveFile({ ...activeFile, content: value });
    }
  };

  const handleSave = async (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (activeFile) {
        try {
          await writeFileContent(activeFile.handle, activeFile.content);
          console.log('File saved successfully');
        } catch (err) {
          console.error('Failed to save file:', err);
        }
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleSave);
    return () => window.removeEventListener('keydown', handleSave);
  }, [activeFile]);

  if (!activeFile) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✦</div>
          <div>No file open</div>
        </div>
      </div>
    );
  }

  const extension = activeFile.name.split('.').pop();
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'json': 'json',
    'css': 'css',
    'html': 'html',
    'md': 'markdown'
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '35px', background: 'var(--bg-sidebar)', display: 'flex', alignItems: 'center', padding: '0 15px', fontSize: '12px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--primary)' }}>📄</span>
        <span style={{ marginLeft: '8px' }}>{activeFile.name}</span>
      </div>
      <div style={{ flex: 1 }}>
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={languageMap[extension || ''] || 'plaintext'}
          value={activeFile.content}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            padding: { top: 15 }
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
