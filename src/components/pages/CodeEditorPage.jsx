import React from 'react';
import ResizableCodeEditor from '../custom-components/code-editor/ResizableCodeEditor';
import ReviewModal from '../custom-components/ai-review-panel/ReviewModal';

export default function CodeEditorPage() {
  return (
    <main className="w-full min-h-screen flex flex-col p-5">
      <h2 className="font-bold text-4xl text-secure-blue">Code Editor</h2>
      <div className="flex flex-row h-screen w-full mt-5 gap-2">
        <ResizableCodeEditor />
        <ReviewModal />
      </div>
    </main>
  );
}
