import React, { useState, useRef, useEffect } from 'react';
import { useStore, ChatMessage } from '../../store/useStore';
import { getAIResponse } from '../../utils/ai';

const AIChat: React.FC = () => {
  const { chatMessages, addChatMessage, clearChat, activeFile } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    addChatMessage(userMsg);
    setInput('');
    setIsLoading(true);

    let prompt = input;
    if (activeFile) {
      prompt = `Context: Current file is "${activeFile.name}".\n\nContent:\n\`\`\`${activeFile.name.split('.').pop()}\n${activeFile.content}\n\`\`\`\n\nUser Question: ${input}`;
    }

    const history = chatMessages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const response = await getAIResponse(prompt, history);
    
    const aiMsg: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    };
    
    addChatMessage(aiMsg);
    setIsLoading(false);
  };

  return (
    <div style={{ height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {chatMessages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '60px', padding: '0 20px' }}>
            <div style={{ fontSize: '42px', marginBottom: '20px', opacity: 0.2 }}>✨</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '10px' }}>How can Nova help today?</div>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: '1.6' }}>I can explain this file, find bugs, or help you architect new features.</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '92%',
            background: msg.role === 'user' ? 'var(--active-light)' : 'var(--bg)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontSize: '13px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <div style={{ 
              fontWeight: '800', 
              fontSize: '9px', 
              marginBottom: '6px', 
              color: msg.role === 'user' ? 'var(--primary)' : 'var(--text-dim)', 
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {msg.role === 'user' ? 'You' : 'Nova AI'}
            </div>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-dim)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px' }}>
            <div className="loading-dots" style={{ display: 'flex', gap: '3px' }}>
               <span style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }}></span>
               <span style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.6 }}></span>
               <span style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.3 }}></span>
            </div>
            Nova AI is composing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '15px', borderTop: '1px solid var(--border)', background: 'var(--bg-sidebar)', zIndex: 5 }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            className="input"
            style={{
              width: '100%',
              height: '90px',
              resize: 'none',
              paddingRight: '10px',
              lineHeight: '1.5',
              borderRadius: 'var(--radius-md)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={clearChat}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer', fontWeight: '600', opacity: 0.6 }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              Clear Chat
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn"
              style={{ padding: '6px 15px' }}
            >
              {isLoading ? 'Wait...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
