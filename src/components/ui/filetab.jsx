import React, { useState } from 'react';
import CodeEditor from '../custom-components/code-editor/CodeEditor';
import { cn } from '@/lib/utils';

const TAB_HEIGHT = '32px';
const TAB_MAX_WIDTH = '200px';
const TAB_MIN_WIDTH = '80px';

const TabContext = React.createContext();

// File utilities
const createFile = (id, filePath, content) => ({
  id,
  filePath,
  content,
});

function TabProvider({
  openFilesArr = [],
  children,
  className,
  style,
  ...props
}) {
  const [openFiles, setOpenFiles] = useState(openFilesArr);
  const [activeFileId, setActiveFileId] = useState(null);

  const openNewFile = (fileId, filePath, fileContent) => {
    // Check if the file is already open
    const existingFile = openFiles.find((file) => file.id === fileId);

    // If yes, switch that file to active
    if (existingFile) {
      setActiveFileId(fileId);

      // Else, create a new file and switch it to active
    } else {
      const newFile = createFile(fileId, filePath, fileContent);
      setOpenFiles((prevFiles) => [...prevFiles, newFile]);
      setActiveFileId(fileId);
    }
  };

  const closeFile = (fileId) => {
    const existingFile = openFiles.find((file) => file.id === fileId);

    if (existingFile) {
      // Remove the file from the array of open fi
      setOpenFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId),
      );

      if (activeFileId === fileId) {
        const remainingFiles = openFiles.filter((file) => file.id !== fileId);

        if (remainingFiles.length > 0) {
          setActiveFileId(remainingFiles[remainingFiles.length - 1].id);
        } else {
          setActiveFileId(null);
        }
      }
    }
  };

  const switchToTab = (fileId) => {
    const existingFile = openFiles.find((file) => file.id === fileId);

    if (existingFile) {
      setActiveFileId(fileId);
    }
  };

  const updateFileContent = (fileId, newContent) => {
    const existingFile = openFiles.find((file) => file.id === fileId);

    if (existingFile) {
      setOpenFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, content: newContent } : file,
        ),
      );
    }
  };

  return (
    <TabContext.Provider
      value={{
        openFiles,
        activeFileId,
        openNewFile,
        closeFile,
        switchToTab,
        updateFileContent,
      }}
    >
      <div
        data-slot="tab-provider"
        data-state={openFiles.length > 0 ? 'has-files' : 'empty'}
        style={{
          '--tab-height': TAB_HEIGHT,
          '--tab-max-width': TAB_MAX_WIDTH,
          '--tab-min-width': TAB_MIN_WIDTH,
          ...style,
        }}
        className={cn(
          'tab-provider-wrapper flex flex-col w-full h-full bg-background',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabContext.Provider>
  );
}

function TabBar({ className, ...props }) {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within Tab Provider');
  }

  const { openFiles, activeFileId, switchToTab, closeFile } = context;

  return (
    <div
      data-slot="tab-bar"
      className={cn(
        'flex h-8 w-full bg-accent/10 border border-border overflow-x-auto',
        'rounded-t-lg p-0.5',
        className,
      )}
      {...props}
    >
      {openFiles.map((file) => (
        <FileTab
          key={file.id}
          id={file.id}
          fileName={file.filePath.split('/').pop()}
          isActive={file.id === activeFileId}
          onSelect={() => switchToTab(file.id)}
          handleCloseFile={() => closeFile(file.id)}
        />
      ))}
    </div>
  );
}

function FileTab({
  id,
  fileName,
  fileContent,
  isActive,
  onSelect,
  className,
  handleCloseFile,
  ...props
}) {
  const handleCloseClick = (e) => {
    e.stopPropagation();
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
        isActive && 'bg-background text-foreground border-b-2 border-b-primary',
        className,
      )}
      {...props}
    >
      <span className="truncate flex-1">{fileName}</span>
      <button
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
      </button>
    </button>
  );
}

function TabContent({ isDarkTheme, className, ...props }) {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error('TabContent must be used within Tab Provider');
  }

  const { openFiles, activeFileId } = context;
  const activeFile = openFiles.find((file) => file.id === activeFileId);

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
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>Upload or create a new file to start analyze your code</p>
        </div>
      )}
    </div>
  );
}

export { TabProvider, TabBar, FileTab, TabContent };
