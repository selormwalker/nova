import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor">Mock Editor</div>,
}));

// Mock Terminal component
vi.mock('./components/terminal/Terminal', () => ({
  default: () => <div data-testid="terminal">Mock Terminal</div>,
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('NOVA IDE')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('contains the editor and terminal', () => {
    render(<App />);
    expect(screen.getByTestId('terminal')).toBeInTheDocument();
    // Since no file is open by default, Editor might show "No file open"
    expect(screen.getByText('No file open')).toBeInTheDocument();
  });
});
