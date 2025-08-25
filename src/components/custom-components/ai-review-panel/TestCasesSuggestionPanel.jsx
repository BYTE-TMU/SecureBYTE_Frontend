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
import { useAuth } from '@/hooks/auth/AuthContext';
import { toast } from 'sonner';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TestCasesSuggestionPanel() {
  const { user } = useAuth();
  const [testFile, setTestFile] = useState();
  const [error, setError] = useState('');
  const [testCases, setTestCases] = useState(new Set([]));
  const [testAvailable, setTestAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // TODO: Connect the currently active file to Test Cases review tab, and pass that file to backend for AI-generated review

  const handleGenerateTestCases = async () => {
    // if (!user || !testFile) return;

    try {
      setLoading(true);
      // Generate test cases with active test file 
      // const testCases = await generateTestCases(testFile);

      // TODO: Format the code (from backend) with Prettier before displaying it
      const sampleTestCases = { 
        'Integration test': new Set([
          `test('should successfully authenticate user with valid credentials and return user profile with token', async () => {
    // Arrange
    const testUser = {
      username: 'testuser@example.com',
      password: 'ComplexPassword123!',
      role: 'user',
      lastLogin: new Date('2025-08-21T10:00:00Z')
    };
});`,
          `test('testing now...', () => {
    console.log('Testing in progress');
    expect(true).toBe(true);
});`,
        ]),
        'Performance test': new Set([
          "test('should partial full error flow', () => {});",
          "test('should complete full error flow', () => {});",
        ]),
        'End-to-end test': new Set([
          "test('should test full error flow', () => {});",
          "test('should complete full error flow', () => {});",
        ]),
        'Database test': new Set([
          "test('should complete full error flow', () => {});",
          "test('should completely test full error flow', () => {});",
        ]),
        'Other tests': new Set([
          "test('should complete full error flow', () => {});",
          "test('should complete now full error flow', () => {});",
        ]),
      }; // Sample test cases (Data structure: {key: Set})

      setTestCases(sampleTestCases);

      // Display test cases, and 'Run All Tests" button
      setTestAvailable(true);
      setError(false); 
    } catch (err) {
      // Show error toast for failed generation of test cases.
      toast.error('Generate Test Cases Failed', {
        description:
          'Failed to generate test cases for [file_name]. Please try again later. ',
      });
      setError(err.response?.data?.error || err.message);
      console.error(`Error generating test cases ${error}`);
    } finally {
      // Set loading state to false
      setLoading(false); 
    }
  };

  const handleRunTestCases = async () => {
    console.log('Start running test cases...');
  };

  if (loading) {
    return <div>Loading...</div>; // Temporary loading view
  }

  return (
    <Card
      className="w-full h-[90%] rounded-md shadow-none overflow-hidden"
    >
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
        <CardDescription>
          {!testAvailable
            ? 'Click below to generate test cases for [file_name]'
            : 'View your test cases below'}
        </CardDescription>
        {!testAvailable && (
          <Button variant="default" onClick={handleGenerateTestCases}>
            Generate Test Cases
          </Button>
        )}
      </CardHeader>
      <CardContent className="w-full h-full overflow-hidden">
        {testAvailable && (
          <div className="space-y-4 h-100 overflow-y-auto w-full overflow-x-hidden">
            {Object.entries(testCases).map(([testType, tests]) => (
              <Card key={testType} className="border shadow-sm gap-0 w-full">
                <CardHeader>
                  <CardTitle className="text-lg">{testType}</CardTitle>
                </CardHeader>
                <CardContent className="w-full max-w-full">
                  {Array.from(tests).map(
                    (test, index) =>
                      test && (
                        <div key={index} className="w-full">
                          <SyntaxHighlighter
                            key={index}
                            language="javascript"
                            style={atomDark}
                            wrapLines={true}
                            wrapLongLines={true}
                            customStyle={{
                              maxWidth: '100%',
                              width: '300px', // Enforce a fixed width to avoid overflowing
                              height: 'auto',
                              minHeight: 'fit-content',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              lineHeight: '1.5rem',
                              padding: '1rem'                              
                            }}
                            className="m-3"
                            showLineNumbers={true}
                          >
                            {test}
                          </SyntaxHighlighter>
                        </div>
                      ),
                  )}
                </CardContent>
              </Card>
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
