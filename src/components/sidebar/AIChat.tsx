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

    // Prepare context
    let prompt = input;
    if (activeFile) {
      prompt = `Context: Current file is "${activeFile.name}".\n\nContent:\n\`\`\`${activeFile.name.split('.').pop()}\n${activeFile.content}\n\`\`\`\n\nUser Question: ${input}`;
    }

    // Convert history for Gemini
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
    <div style={{ height: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {chatMessages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🤖</div>
            <p>I can help you with your code, explain logic, or suggest improvements.</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
            background: msg.role === 'user' ? 'var(--active-light)' : 'var(--bg)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontSize: '13px',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '4px', color: 'var(--primary)', opacity: 0.7 }}>
              {msg.role === 'user' ? 'YOU' : 'NOVA AI'}
            </div>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-dim)', fontSize: '12px' }}>
            Nova AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '15px', borderTop: '1px solid var(--border)', background: 'var(--bg-sidebar)' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Nova AI..."
            style={{
              width: '100%',
              height: '80px',
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '13px',
              resize: 'none',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              background: 'var(--active)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            Send
          </button>
        </div>
        <button 
          onClick={clearChat}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '11px', cursor: 'pointer', marginTop: '10px' }}
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default AIChat;
