import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../ui/resizable';
import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import { FileTab } from '../../ui/filetab';

export default function ResizableCodeEditor() {
  return (
    <ResizablePanelGroup direction="horizontal" className="border rounded-lg">
      <ResizablePanel defaultSize={20}>
        <FileTree />{' '}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <FileTab className="border w-full border-none rounded-none" />

        <CodeEditor />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
