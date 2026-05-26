import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking window.showDirectoryPicker
Object.defineProperty(window, 'showDirectoryPicker', {
  value: vi.fn(),
});

// Mocking ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserver,
});
