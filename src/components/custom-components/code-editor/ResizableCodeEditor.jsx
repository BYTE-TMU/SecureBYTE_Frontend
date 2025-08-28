import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';
import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import { FileTab } from '../../ui/filetab';

export default function ResizableCodeEditor({ tree }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="border rounded-lg w-full"
    >
      <ResizablePanel defaultSize={20}>
        <FileTree tree={tree} />{' '}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-screen">
        <FileTab className="border w-full border-none rounded-none" />
        <CodeEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
