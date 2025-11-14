import React from 'react';
import CodeEditor from '../custom-components/code-editor/CodeEditor';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Save } from 'lucide-react';

const TAB_HEIGHT = '32px';
const TAB_MAX_WIDTH = '200px';
const TAB_MIN_WIDTH = '80px';

function FileTabBar({
  openFiles,
  activeFile,
  onCloseFile,
  onSwitchTab,
  onReorderTabs,
  unsavedFiles = new Set(),
  onSaveAll,
  style,
  className,
  ...props
}) {
  const [dragOverIndex, setDragOverIndex] = React.useState(null);
  const [isDraggingOverEmpty, setIsDraggingOverEmpty] = React.useState(false);

  // Handle dropping in empty space to move to end
  const handleEmptyAreaDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOverEmpty(true);
    setDragOverIndex(null);
  };

  const handleEmptyAreaDragLeave = () => {
    setIsDraggingOverEmpty(false);
  };

  const handleEmptyAreaDrop = (e) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (
      !isNaN(dragIndex) &&
      dragIndex !== openFiles.length - 1 &&
      onReorderTabs
    ) {
      onReorderTabs(dragIndex, openFiles.length - 1);
    }
    setIsDraggingOverEmpty(false);
  };

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
        'flex h-8 w-full bg-accent/10 border border-border',
        className,
      )}
      onDragOver={handleEmptyAreaDragOver}
      onDragLeave={handleEmptyAreaDragLeave}
      onDrop={handleEmptyAreaDrop}
      {...props}
    >
      <div className="flex items-center  overflow-x-auto overflow-y-hidden no-scrollbar ">
        {openFiles.map((file, index) => (
          <FileTab
            key={file.name}
            id={file.name}
            fileId={file.id}
            fileName={file.path.split('/').pop()}
            isActive={file.name === activeFile?.name}
            isUnsaved={unsavedFiles.has(file.id)}
            onSelect={() => onSwitchTab(file)}
            handleCloseFile={() => onCloseFile(file.name)}
            index={index}
            onReorder={onReorderTabs}
            dragOverIndex={dragOverIndex}
            setDragOverIndex={setDragOverIndex}
            setIsDraggingOverEmpty={setIsDraggingOverEmpty}
          />
        ))}

        {/* Visual indicator for dropping at the end */}
        {isDraggingOverEmpty && openFiles.length > 0 && (
          <div className="w-0.5 h-full bg-blue-500 animate-pulse ml-1" />
        )}
      </div>
      {/* Save Files Button */}
      {onSaveAll && openFiles.length > 0 && (
        <div className="ml-auto flex items-center pr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAll}
            disabled={unsavedFiles.size === 0}
            className="h-7 text-xs gap-1.5 border-border hover:bg-accent disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            Save Files
            {unsavedFiles.size > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                {unsavedFiles.size}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function FileTab({
  id,
  fileId,
  fileName,
  isActive,
  isUnsaved = false,
  onSelect,
  className,
  handleCloseFile,
  index,
  onReorder,
  dragOverIndex,
  setDragOverIndex,
  setIsDraggingOverEmpty,
  ...props
}) {
  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevent triggering event handlers in the parent component
    handleCloseFile();
  };

  // Drag and drop handlers
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());

    // Open the file being dragged (like VS Code)
    if (!isActive && onSelect) {
      onSelect();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
    setIsDraggingOverEmpty(false);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const dropIndex = index;

    setDragOverIndex(null);

    if (dragIndex !== dropIndex && onReorder) {
      onReorder(dragIndex, dropIndex);
    }
  };

  const showLeftIndicator = dragOverIndex === index;

  return (
    <div className="relative flex items-center">
      <button
        data-slot="file-tab"
        data-active={isActive}
        onClick={onSelect}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
          'min-w-[var(--tab-min-width)] max-w-[var(--tab-max-width)] h-[var(--tab-height)]',
          'border-r border-border bg-muted/50 text-muted-foreground',
          'hover:bg-muted hover:text-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'cursor-move',
          isActive &&
            'bg-background text-secure-blue border-b-5 border-b-primary',
          showLeftIndicator && 'border-l border-l-secure-blue',
          className,
        )}
        {...props}
      >
        {/* Unsaved indicator dot */}
        {isUnsaved && (
          <span
            className="w-2 h-2 rounded-full border-2 border-blue-500 flex-shrink-0"
            aria-label="Unsaved changes"
          />
        )}

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
    </div>
  );
}

// TODO: Display the file content according to the current active file.
function FileTabContent({
  activeFile,
  isDarkTheme,
  className,
  onEditorChange,
  ...props
}) {
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
