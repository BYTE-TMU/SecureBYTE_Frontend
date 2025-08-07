import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';

export default function CodeEditor({
  isDarkTheme,
  value = '#Type your code here...',
  language = 'python',
  onChange,
}) {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        width="100%"
        theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
        language={language}
        value={value}
        onChange={onChange}
        onMount={onMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        className="border border-border"
      />
    </div>
  );
}
