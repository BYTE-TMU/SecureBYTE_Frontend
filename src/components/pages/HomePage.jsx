import React from 'react';
import NavigationBar from '../custom-components/NavigationBar';
import { TabProvider, TabBar, TabContent } from '../ui/file-tab';

export default function HomePage({ isSignedIn }) {
  // Sample files for demonstration
  const sampleFiles = [
    {
      id: 'file1',
      filePath: '/src/main.py',
      content: `# Welcome to SecureBYTE Code Editor
import os
import sys

def hello_world():
    print("Hello, SecureBYTE!")
    return "Welcome to secure coding analysis"

if __name__ == "__main__":
    hello_world()
`,
    },
    {
      id: 'file2',
      filePath: '/src/utils.js',
      content: `// JavaScript utility functions
const utils = {
  formatCode: (code) => {
    return code.trim();
  },
  
  analyzeVulnerabilities: (code) => {
    // Security analysis logic here
    return {
      vulnerabilities: [],
      score: 95
    };
  }
};

export default utils;
`,
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-background">
      <div className="flex justify-center items-start pt-8 h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl mx-auto px-4">
          <TabProvider openFilesArr={sampleFiles}>
            <TabBar />
            <div className="h-[70vh]">
              <TabContent isDarkTheme={false} />
            </div>
          </TabProvider>
        </div>
      </div>
    </div>
  );
}
