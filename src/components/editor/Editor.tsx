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
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'var(--active)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.05, borderRadius: '50%' }}></div>
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ 
            fontSize: '84px', 
            marginBottom: '30px', 
            background: 'linear-gradient(135deg, var(--text) 0%, var(--text-dim) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.2
          }}>✦</div>
          <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '2px', color: 'var(--text)', opacity: 0.4 }}>NOVA IDE</div>
          <div style={{ fontSize: '14px', marginTop: '15px', color: 'var(--text-dim)', opacity: 0.6, fontWeight: '500' }}>
            The world's most powerful browser-based environment
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
             <div style={{ fontSize: '12px', color: 'var(--text-dim)', background: 'var(--active-light)', padding: '6px 15px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                Press <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Ctrl + O</span> to open a folder
             </div>
             <div style={{ fontSize: '11px', color: 'var(--text-dim)', opacity: 0.5 }}>
                No telemetry • Fully local • AI powered
             </div>
          </div>
        </div>
      </div>
    );
  }

  const extension = activeFile.name.split('.').pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'jsx': 'javascript',
    'json': 'json',
    'css': 'css',
    'html': 'html',
    'md': 'markdown',
    'py': 'python',
    'cpp': 'cpp',
    'rs': 'rust',
    'go': 'go',
    'yml': 'yaml',
    'yaml': 'yaml'
  };

  const monacoTheme = theme === 'nova-light' ? 'vs' : 'vs-dark';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabBar />
      <div style={{ flex: 1, position: 'relative' }}>
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
            padding: { top: 20 },
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            fixedOverflowWidgets: true
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
