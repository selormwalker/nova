import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from './components/sidebar/Sidebar';
import Editor from './components/editor/Editor';
import Terminal from './components/terminal/Terminal';
import './styles/index.css';

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ height: '35px', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 15px', fontSize: '12px', fontWeight: 'bold', gap: '8px' }}>
        <span style={{ color: 'var(--primary)', fontSize: '18px' }}>✦</span>
        <span>NOVA IDE</span>
      </div>

      <div style={{ flex: 1 }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15}>
            <div style={{ height: '100%', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
              <Sidebar />
            </div>
          </Panel>
          
          <PanelResizeHandle style={{ width: '2px', background: 'var(--border)' }} />
          
          <Panel defaultSize={80}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70}>
                <div style={{ height: '100%', background: 'var(--bg)' }}>
                  <Editor />
                </div>
              </Panel>
              
              <PanelResizeHandle style={{ height: '2px', background: 'var(--border)' }} />
              
              <Panel defaultSize={30}>
                <div style={{ height: '100%' }}>
                  <Terminal />
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
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
