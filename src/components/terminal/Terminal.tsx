import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00',
      },
      fontSize: 12,
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;32m✦ NOVA TERMINAL v1.0.0\x1b[0m');
    term.writeln('Ready for commands.');
    term.write('\r\n\x1b[1;34mnova@terminal\x1b[0m:~$ ');

    term.onData(data => {
      const code = data.charCodeAt(0);
      if (code === 13) { // Enter
        term.write('\r\n\x1b[1;34mnova@terminal\x1b[0m:~$ ');
      } else if (code === 127) { // Backspace
        term.write('\b \b');
      } else {
        term.write(data);
      }
    });

    xtermRef.current = term;

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ height: '100%', background: '#000000', padding: '10px' }}>
      <div ref={terminalRef} style={{ height: '100%' }} />
    </div>
  );
};

export default Terminal;
