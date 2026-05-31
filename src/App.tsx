import React, { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from './components/sidebar/Sidebar';
import Editor from './components/editor/Editor';
import Terminal from './components/terminal/Terminal';
import AIChat from './components/sidebar/AIChat';
import { useStore } from './store/useStore';
import './styles/index.css';

const App: React.FC = () => {
  const { theme, setTheme } = useStore();
  const [showAI, setShowAI] = React.useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Bar */}
      <div style={{ height: '35px', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 15px', fontSize: '12px', fontWeight: 'bold', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--primary)', fontSize: '18px' }}>✦</span>
          <span>NOVA IDE</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as any)}
            style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '11px', padding: '2px 5px', outline: 'none', borderRadius: '3px' }}
          >
            <option value="nova-dark">Nova Dark</option>
            <option value="nova-light">Nova Light</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="oled">OLED</option>
          </select>
          
          <button 
            onClick={() => setShowAI(!showAI)}
            style={{ background: showAI ? 'var(--active)' : 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '11px', padding: '2px 8px', cursor: 'pointer', borderRadius: '3px' }}
          >
            AI Assistant
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15}>
            <div style={{ height: '100%', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
              <Sidebar />
            </div>
          </Panel>
          
          <PanelResizeHandle style={{ width: '2px', background: 'var(--border)', cursor: 'col-resize' }} />
          
          <Panel defaultSize={showAI ? 60 : 80}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <div style={{ height: '100%', background: 'var(--bg)' }}>
                  <Editor />
                </div>
              </Panel>
              
              <PanelResizeHandle style={{ height: '2px', background: 'var(--border)', cursor: 'row-resize' }} />
              
              <Panel defaultSize={30}>
                <div style={{ height: '100%' }}>
                  <Terminal />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {showAI && (
            <>
              <PanelResizeHandle style={{ width: '2px', background: 'var(--border)', cursor: 'col-resize' }} />
              <Panel defaultSize={20} minSize={15}>
                <div style={{ height: '100%', background: 'var(--bg-sidebar)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '15px', fontWeight: 'bold', fontSize: '13px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>AI ASSISTANT</span>
                    <button onClick={() => setShowAI(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                  </div>
                  <AIChat />
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <div style={{ height: '25px', background: 'var(--active)', color: 'white', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '11px', justifyContent: 'space-between' }}>
        <div>Ready</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span>UTF-8</span>
          <span>TypeScript</span>
          <span>main*</span>
        </div>
      </div>
    </div>
  );
};

export default App;
