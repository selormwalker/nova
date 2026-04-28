import { create } from 'zustand';

interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
}

interface NovaState {
  rootHandle: FileSystemDirectoryHandle | null;
  fileTree: FileNode[];
  activeFile: { name: string; content: string; handle: FileSystemFileHandle } | null;
  openFiles: string[];
  
  setRootHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setFileTree: (tree: FileNode[]) => void;
  setActiveFile: (file: { name: string; content: string; handle: FileSystemFileHandle } | null) => void;
}

export const useStore = create<NovaState>((set) => ({
  rootHandle: null,
  fileTree: [],
  activeFile: null,
  openFiles: [],
  
  setRootHandle: (handle) => set({ rootHandle: handle }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setActiveFile: (file) => set({ activeFile: file }),
}));
