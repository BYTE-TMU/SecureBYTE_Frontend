import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/auth/AuthContext';
import { toast } from 'sonner';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getTestCases } from '@/api';
import { useUpdateFiles } from '@/hooks/useUpdateFiles';
import { useProject } from '@/hooks/project/ProjectContext';
import LoadingView from '@/components/ui/loading-view';

// TODO: Save the currently active file to backend first, then generate the review.

export default function TestCasesSuggestionPanel({ activeFile, projectId }) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [testCases, setTestCases] = useState({});
  const [testAvailable, setTestAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getUpdatedFiles, clearAllUpdates } = useUpdateFiles();
  const { saveProjectToBackend } = useProject();

  const formatActiveFile = (activeFile) => {
    return {
      fileid: activeFile.id,
      filename: activeFile.name,
      code: activeFile.content,
    };
  };

  const handleGenerateTestCases = async () => {
    // Check if there's any file open in the code editor
    if (!activeFile) {
      toast.error('File Not Open', {
        description: `Please open a file in the Code Editor to generate test cases.`,
      });
      return;
    }

    // STEP 1: Save project to backend
    const updatedFiles = getUpdatedFiles();
    console.log('TEST CASES: Files sent to backend', updatedFiles); // Debug log

    if (updatedFiles && updatedFiles.length > 0) {
      console.log('TEST CASES: Saving project to backend...');
      try {
        await saveProjectToBackend({
          projectId: projectId,
          updatedFilesArr: updatedFiles,
        });
        setError('');

        clearAllUpdates(); // Clear updates in sessionStorage
        console.log('Clear sessionStorage', sessionStorage);
      } catch (err) {
        toast.error('Save Failed', {
          description: `Failed to save file(s) to database.`,
        });
        setError(err.response?.data?.error || err.message);
        console.error(
          `Failed to save file(s) to database: ${err.response?.data?.error || err.message}`,
        );
      }
    }

    console.log('TEST CASES: Start generating test cases...');

    try {
      setLoading(true);
      // Generate test cases with active test file
      console.log('TEST CASES: About to call backend');
      const formattedActiveFile = formatActiveFile(activeFile);

      const response = await getTestCases(
        user.uid,
        activeFile.id,
        formattedActiveFile,
      );

      console.log('TEST CASES: Successfully calling backend');

      // TODO: Format test cases with Prettier before displaying it

      console.log('TEST CASES:', response.data.response.files);
      setTestCases(response.data.response.files);

      // Display test cases
      setTestAvailable(true);
      setError(false);
    } catch (err) {
      // Show error toast for failed generation of test cases.
      toast.error('Failed to generate test cases', {
        description: `Failed to generate test cases. Please try again later.`,
      });
      setError(err.response?.data?.error || err.message);
      console.error(
        `Error generating test cases ${err.response?.data?.error || err.message}`,
      );
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  const handleRunTestCases = async () => {
    console.log('Start running test cases...');
  };

  if (loading) {
    return <LoadingView message="Generating test cases..." variant="full" />;
  }

  return (
    <Card className="h-full rounded-none border-none shadow-none overflow-hidden">
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
        <CardDescription>
          {!testAvailable
            ? activeFile
              ? `Click below to generate test cases for ${activeFile['name']}`
              : `Open a file in the code editor to generate test cases`
            : 'View your logic analysis below'}
        </CardDescription>
        {!testAvailable && (
          <Button variant="default" onClick={handleGenerateTestCases}>
            Generate Test Cases
          </Button>
        )}
      </CardHeader>
      <CardContent className="w-full h-full overflow-hidden">
        {testAvailable && (
          <div className="space-y-6 h-100 overflow-y-auto w-full overflow-x-hidden">
            {Object.entries(testCases).map(([testKey, testObj], fileIndex) => (
              <div key={testKey}>
                {/* Separator between files */}
                {fileIndex > 0 && <Separator className="my-6" />}

                <CardTitle className="mb-4">{testKey}</CardTitle>
                {testObj['test_cases'].map((test, index) => (
                  <div key={index} className="h-full">
                    {/* Separator between test cases */}
                    {index > 0 && <Separator className="my-4" />}

                    <div className="space-y-2">
                      {test['input'] && (
                        <CardTitle className="text-sm font-semibold">
                          Input:{' '}
                          <span className="font-mono text-primary">
                            {JSON.stringify(test['input'], null, 2)}
                          </span>
                        </CardTitle>
                      )}
                      {test['expected_output'] && (
                        <CardTitle className="text-sm font-semibold">
                          Expected Output:{' '}
                          <span className="font-mono text-primary">
                            {test['expected_output']}
                          </span>
                        </CardTitle>
                      )}
                      <CardDescription className="leading-relaxed pl-4 border-l-2 border-muted">
                        {test['notes']}
                      </CardDescription>
                    </div>
                    <CardContent className="p-0">
                      <SyntaxHighlighter
                        key={test.id}
                        language="javascript"
                        style={atomDark}
                        wrapLines={true}
                        wrapLongLines={true}
                        customStyle={{
                          maxWidth: '100%',
                          width: '300px',
                          height: 'auto',
                          minHeight: 'fit-content',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          lineHeight: '1.5rem',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                        }}
                        className="m-0 mt-3"
                        showLineNumbers={true}
                      >
                        {test.description}
                      </SyntaxHighlighter>
                    </CardContent>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {testAvailable && (
        <CardFooter className="pb-15">
          <Button variant="default" onClick={handleRunTestCases}>
            Run All Tests
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
