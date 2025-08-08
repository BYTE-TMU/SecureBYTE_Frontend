import React from 'react';
import CodeEditor from '../custom-components/CodeEditor';
import { FileTab } from '../ui/filetab';
import FileTree from '../custom-components/FileTree';
import { SidebarProvider } from '../ui/sidebar';
import ResizableCodeEditor from '../custom-components/ResizableCodeEditor';

export default function CodeEditorPage() {
  return (
    <main className="w-full h-screen flex flex-col p-5">
      <h2 className="font-bold text-4xl text-secure-blue">Code Editor</h2>
      <div className="flex flex-col h-screen mt-5">
        <ResizableCodeEditor />
      </div>
    </main>
  );
}
