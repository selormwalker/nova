export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
}

export async function readDirectory(dirHandle: FileSystemDirectoryHandle): Promise<FileNode[]> {
  const children: FileNode[] = [];
  
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'directory') {
      children.push({
        name: entry.name,
        kind: 'directory',
        handle: entry,
        children: await readDirectory(entry as FileSystemDirectoryHandle),
      });
    } else {
      children.push({
        name: entry.name,
        kind: 'file',
        handle: entry,
      });
    }
  }
  
  // Sort: Directories first, then alphabetically
  return children.sort((a, b) => {
    if (a.kind === b.kind) return a.name.localeCompare(b.name);
    return a.kind === 'directory' ? -1 : 1;
  });
}

export async function readFileContent(fileHandle: FileSystemFileHandle): Promise<string> {
  const file = await fileHandle.getFile();
  return await file.text();
}

export async function writeFileContent(fileHandle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}
