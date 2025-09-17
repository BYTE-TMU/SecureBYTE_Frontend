import React from 'react';
import CodeEditor from '../custom-components/code-editor/CodeEditor';
import { cn } from '@/lib/utils';

const TAB_HEIGHT = '32px';
const TAB_MAX_WIDTH = '200px';
const TAB_MIN_WIDTH = '80px';

function FileTabBar({
  openFiles,
  activeFile,
  onCloseFile,
  onSwitchTab,
  style,
  className,
  ...props
}) {
  return (
    <div
      data-slot="file-tab-bar"
      data-state={openFiles.length > 0 ? 'has-files' : 'empty'}
      style={{
        '--tab-height': TAB_HEIGHT,
        '--tab-max-width': TAB_MAX_WIDTH,
        '--tab-min-width': TAB_MIN_WIDTH,
        ...style,
      }}
      className={cn(
        'flex h-8 w-full bg-accent/10 border border-border overflow-x-auto overflow-y-hidden',
        'rounded-t-lg p-0.5',
        className,
      )}
      {...props}
    >
      {openFiles.map((file) => (
        <FileTab
          key={file.name}
          id={file.name}
          fileName={file.path.split('/').pop()}
          isActive={file.name === activeFile.name}
          onSelect={() => onSwitchTab(file)}
          handleCloseFile={() => onCloseFile(file.name)}
        />
      ))}
    </div>
  );
}

function FileTab({
  id,
  fileName,
  isActive,
  onSelect,
  className,
  handleCloseFile,
  ...props
}) {
  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevent triggering event handlers in the parent component
    handleCloseFile();
  };

  return (
    <button
      data-slot="file-tab"
      data-active={isActive}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
        'min-w-[var(--tab-min-width)] max-w-[var(--tab-max-width)] h-[var(--tab-height)]',
        'border-r border-border bg-muted/50 text-muted-foreground',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'rounded-t-lg',
        isActive && 'bg-background text-secure-blue border-b-5 border-b-primary',
        className,
      )}
      {...props}
    >
      <span className="truncate flex-1">{fileName}</span>

      <span
        role="button"
        tabIndex={0}
        onClick={handleCloseClick}
        className={cn(
          'flex items-center justify-center w-4 h-4 rounded-sm',
          'hover:bg-muted-foreground/20 transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        )}
        aria-label={`Close ${fileName}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </span>
    </button>
  );
}

// TODO: Display the file content according to the current active file. 
function FileTabContent({
  activeFile,
  isDarkTheme, 
  className, 
  onEditorChange,
  ...props }) {

  return (
    <div
      data-slot="tab-content"
      data-state={activeFile ? 'has-active-file' : 'no-active-file'}
      className={cn(
        'flex-1 w-full h-full bg-background overflow-hidden',
        'rounded-b-lg border border-t-0 border-border mt-1',
        className,
      )}
      {...props}
    >
      {activeFile ? (
        <CodeEditor
          isDarkTheme={isDarkTheme}
          value={activeFile.content}
          language="python"
          onChange={onEditorChange}
          activeFile={activeFile}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Open or upload a new file to start analyzing your code</p>
        </div>
      )}
    </div>
  );
}

export { FileTabBar, FileTab, FileTabContent };
