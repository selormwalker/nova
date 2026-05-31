import { create } from 'zustand';

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
  path: string;
}

export interface OpenFile {
  name: string;
  content: string;
  handle: FileSystemFileHandle;
  path: string;
  isDirty?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface NovaState {
  rootHandle: FileSystemDirectoryHandle | null;
  fileTree: FileNode[];
  activeFile: OpenFile | null;
  openFiles: OpenFile[];
  theme: 'nova-dark' | 'nova-light' | 'cyberpunk' | 'oled';
  chatMessages: ChatMessage[];
  
  setRootHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setFileTree: (tree: FileNode[]) => void;
  setActiveFile: (file: OpenFile | null) => void;
  addOpenFile: (file: OpenFile) => void;
  closeFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  setTheme: (theme: NovaState['theme']) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

export const useStore = create<NovaState>((set) => ({
  rootHandle: null,
  fileTree: [],
  activeFile: null,
  openFiles: [],
  theme: 'nova-dark',
  chatMessages: [],
  
  setRootHandle: (handle) => set({ rootHandle: handle }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setActiveFile: (file) => {
    set((state) => {
      // If the file is already open, make it active. If not, add it.
      if (!file) return { activeFile: null };
      const existing = state.openFiles.find(f => f.path === file.path);
      if (!existing) {
        return { 
          openFiles: [...state.openFiles, file],
          activeFile: file 
        };
      }
      return { activeFile: existing };
    });
  },
  addOpenFile: (file) => set((state) => {
    if (state.openFiles.find(f => f.path === file.path)) return state;
    return { openFiles: [...state.openFiles, file] };
  }),
  closeFile: (path) => set((state) => {
    const newOpenFiles = state.openFiles.filter(f => f.path !== path);
    let newActiveFile = state.activeFile;
    if (state.activeFile?.path === path) {
      newActiveFile = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
    }
    return { openFiles: newOpenFiles, activeFile: newActiveFile };
  }),
  updateFileContent: (path, content) => set((state) => ({
    openFiles: state.openFiles.map(f => f.path === path ? { ...f, content, isDirty: true } : f),
    activeFile: state.activeFile?.path === path ? { ...state.activeFile, content, isDirty: true } : state.activeFile
  })),
  setTheme: (theme) => set({ theme }),
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
}));
