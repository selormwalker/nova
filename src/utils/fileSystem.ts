export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle: FileSystemHandle;
  children?: FileNode[];
  path: string;
}

export async function readDirectory(dirHandle: FileSystemDirectoryHandle, parentPath: string = ''): Promise<FileNode[]> {
  const children: FileNode[] = [];
  const currentPath = parentPath ? `${parentPath}/${dirHandle.name}` : dirHandle.name;
  
  for await (const entry of dirHandle.values()) {
    const entryPath = `${currentPath}/${entry.name}`;
    if (entry.kind === 'directory') {
      children.push({
        name: entry.name,
        kind: 'directory',
        handle: entry,
        path: entryPath,
        children: await readDirectory(entry as FileSystemDirectoryHandle, currentPath),
      });
    } else {
      children.push({
        name: entry.name,
        kind: 'file',
        handle: entry,
        path: entryPath
      });
    }
  }
  
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
  // @ts-expect-error - createWritable might not be in the base FileSystemHandle
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}
