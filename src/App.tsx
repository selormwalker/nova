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
      <div style={{ height: 'var(--topbar-height)', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 15px', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--active)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px' }}>✦</div>
          <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px' }}>NOVA <span style={{ color: 'var(--primary)' }}>IDE</span></span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as any)}
            className="select"
          >
            <option value="nova-dark">Nova Dark</option>
            <option value="nova-light">Nova Light</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="oled">OLED</option>
          </select>
          
          <button 
            onClick={() => setShowAI(!showAI)}
            className={`btn ${!showAI ? 'btn-outline' : ''}`}
            style={{ height: '24px' }}
          >
            AI Assistant
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={18} minSize={10}>
            <div style={{ height: '100%', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
              <Sidebar />
            </div>
          </Panel>
          
          <PanelResizeHandle style={{ width: '1px', background: 'var(--border)', cursor: 'col-resize' }} />
          
          <Panel defaultSize={showAI ? 60 : 82}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <div style={{ height: '100%', background: 'var(--bg)' }}>
                  <Editor />
                </div>
              </Panel>
              
              <PanelResizeHandle style={{ height: '1px', background: 'var(--border)', cursor: 'row-resize' }} />
              
              <Panel defaultSize={30}>
                <div style={{ height: '100%' }}>
                  <Terminal />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>

          {showAI && (
            <>
              <PanelResizeHandle style={{ width: '1px', background: 'var(--border)', cursor: 'col-resize' }} />
              <Panel defaultSize={22} minSize={15}>
                <div style={{ height: '100%', background: 'var(--bg-sidebar)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '12px 15px', fontWeight: '700', fontSize: '11px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-dim)', letterSpacing: '1px' }}>
                    <span>AI ASSISTANT</span>
                    <button onClick={() => setShowAI(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                  <AIChat />
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <div style={{ height: 'var(--statusbar-height)', background: 'var(--active)', color: 'white', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '11px', justifyContent: 'space-between', fontWeight: '500' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>●</span>
            <span>Connected</span>
          </div>
          <span>v1.0.4</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>UTF-8</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px' }}>⌥</span>
            <span>TypeScript</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px' }}></span>
            <span>main*</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
