import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { writeFileContent } from '../../utils/fileSystem';
import TabBar from './TabBar';

const Editor: React.FC = () => {
  const { activeFile, updateFileContent, theme } = useStore();

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile.path, value);
    }
  };

  const handleSave = React.useCallback(
    async (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (activeFile) {
          try {
            await writeFileContent(activeFile.handle, activeFile.content);
            // We could update isDirty here if the store supported it easily, 
            // but for now let's just save.
          } catch (err) {
            console.error("Save error:", err);
          }
        }
      }
    },
    [activeFile]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleSave);
    return () => window.removeEventListener('keydown', handleSave);
  }, [handleSave]);

  if (!activeFile) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', opacity: 0.3 }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✦</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>NOVA IDE</div>
          <div style={{ fontSize: '13px', marginTop: '10px' }}>Open a folder or select a file to start coding</div>
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
    'md': 'markdown',
    'py': 'python',
    'cpp': 'cpp',
    'rs': 'rust',
    'go': 'go'
  };

  const monacoTheme = theme === 'nova-light' ? 'vs' : 'vs-dark';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabBar />
      <div style={{ flex: 1 }}>
        <MonacoEditor
          height="100%"
          theme={monacoTheme}
          language={languageMap[extension || ''] || 'plaintext'}
          value={activeFile.content}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            padding: { top: 15 },
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
