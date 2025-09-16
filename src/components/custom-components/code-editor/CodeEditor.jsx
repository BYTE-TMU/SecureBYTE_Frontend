import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';

export default function CodeEditor({
  isDarkTheme,
  value = '#Type your code here...',
  language = 'python', // Current default language is Python
  // TODO: Add dynamic language later
  onChange,
  activeFile
}) {
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Editor
      className="w-full"
      theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
      language={language}
      value={value}
      onChange={(value) => onChange({ targetFile: activeFile, newContent: value})}
      onMount={onMount}
      options={{
        minimap: { enabled: false },
        fontSize: 12,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
