import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/AuthContext';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getLogicReview } from '@/api';

export default function LogicAnalysisPanel({ activeFile }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisAvailable, setAnalysisAvailable] = useState(false);
  const [logicAnalysis, setLogicAnalysis] = useState();

  // TODO: Save the currently active file to backend first, then generate the review. 

  const handleGenerateLogicAnalysis = async () => {
    //TODO: Save project to backend first, then generate review (2 calls in a row)
    
    console.log('Start generate logic analysis...');

    // If no users or active file, return
    // if (!user || !activeFile) return;

    setLoading(true); 

    try {
      // Send test file to backend for logic review
      console.log("LOGIC REVIEW: About to call backend..."); 
      const response = await getLogicReview(user.uid, activeFile.id);

      console.log("LOGIC REVIEW: Receive data from backend"); 

      // Sample JSON response
      // const sampleJSONResponse = {
      //   status: 'success',
      //   timestamp: '2025-08-23T10:30:45Z',
      //   analysisId: 'la_8f72ae34',
      //   data: {
      //     summary: {
      //       complexity: 'Medium',
      //       maintainabilityScore: 85,
      //       issuesCount: {
      //         high: 1,
      //         medium: 1,
      //         low: 2,
      //       },
      //       suggestionsCount: 3,
      //     },
      //     findings: [
      //       {
      //         id: 'CF001',
      //         type: 'CONTROL_FLOW',
      //         title: 'Async/Await Pattern Review',
      //         severity: 'low',
      //         location: {
      //           startLine: 12,
      //           endLine: 25,
      //           function: 'handleGenerateLogicAnalysis',
      //         },
      //         analysis:
      //           'Function uses proper async/await patterns with try-catch error handling',
      //         suggestion:
      //           'Consider adding finally block to ensure loading state is always reset',
      //         codeContext: {
      //           current:
      //             'try {\n  setLoading(true);\n  // ... async operations\n} catch (err) {\n  // error handling\n}',
      //           suggested:
      //             'try {\n  setLoading(true);\n  // ... async operations\n} catch (err) {\n  // error handling\n} finally {\n  setLoading(false);\n}',
      //         },
      //       },
      //       {
      //         id: 'SM001',
      //         type: 'STATE_MANAGEMENT',
      //         title: 'State Hook Usage',
      //         severity: 'medium',
      //         location: {
      //           startLine: 7,
      //           endLine: 10,
      //           scope: 'component',
      //         },
      //         analysis:
      //           'Component uses multiple useState hooks for managing related states',
      //         suggestion:
      //           'Consider consolidating related states into a single useReducer',
      //         codeContext: {
      //           current:
      //             "const [testFile, setTestFile] = useState();\nconst [loading, setLoading] = useState('false');\nconst [error, setError] = useState('');",
      //           suggested:
      //             "const [state, dispatch] = useReducer(reducer, {\n  testFile: null,\n  loading: false,\n  error: ''\n});",
      //         },
      //       },
      //       {
      //         id: 'EH001',
      //         type: 'ERROR_HANDLING',
      //         title: 'Empty Error Handler',
      //         severity: 'high',
      //         location: {
      //           startLine: 20,
      //           endLine: 22,
      //           function: 'handleGenerateLogicAnalysis',
      //         },
      //         analysis: 'Empty catch block detected in async function',
      //         suggestion: 'Implement proper error handling and user feedback',
      //         codeContext: {
      //           current: 'catch (err) {\n\n}',
      //           suggested:
      //             "catch (err) {\n  setError(err.message);\n  toast.error('Failed to generate analysis');\n}",
      //         },
      //       },
      //       {
      //         id: 'CO001',
      //         type: 'CODE_ORGANIZATION',
      //         title: 'Component Structure',
      //         severity: 'low',
      //         analysis:
      //           'Component has clear separation of state, handlers, and render logic',
      //         suggestion:
      //           'Consider extracting card components into separate UI components',
      //         codeContext: {
      //           current: '<Card className="h-full rounded-md shadow-none">',
      //           suggested: 'Extract to: components/ui/AnalysisCard.jsx',
      //         },
      //       },
      //     ],
      //     recommendations: [
      //       {
      //         id: 'REC001',
      //         title: 'Add Loading State Feedback',
      //         priority: 'high',
      //         description:
      //           'Show loading indicator while analysis is being generated',
      //         implementation:
      //           '{loading && (\n  <LoadingSpinner className="m-4" />\n)}',
      //         benefits: [
      //           'Better user experience',
      //           'Clear feedback on process status',
      //         ],
      //       },
      //       {
      //         id: 'REC002',
      //         title: 'Input Validation',
      //         priority: 'medium',
      //         description:
      //           'Add file type and size validation before processing',
      //         implementation:
      //           "const validateFile = (file) => {\n  if (!file) return 'No file selected';\n  if (file.size > 5000000) return 'File too large';\n  return null;\n}",
      //         benefits: [
      //           'Prevent invalid file submissions',
      //           'Better error handling',
      //         ],
      //       },
      //       {
      //         id: 'REC003',
      //         title: 'Error Boundary Implementation',
      //         priority: 'medium',
      //         description:
      //           'Implement error boundary to gracefully handle rendering errors',
      //         benefits: [
      //           'Graceful error handling',
      //           'Better user experience during failures',
      //         ],
      //       },
      //     ],
      //     actionItems: [
      //       {
      //         id: 'ACT001',
      //         title: 'Add loading state indicator',
      //         priority: 'high',
      //         status: 'pending',
      //       },
      //       {
      //         id: 'ACT002',
      //         title: 'Implement file validation',
      //         priority: 'medium',
      //         status: 'pending',
      //       },
      //       {
      //         id: 'ACT003',
      //         title: 'Add error handling in catch block',
      //         priority: 'high',
      //         status: 'pending',
      //       },
      //       {
      //         id: 'ACT004',
      //         title: 'Consolidate state management',
      //         priority: 'medium',
      //         status: 'pending',
      //       },
      //       {
      //         id: 'ACT005',
      //         title: 'Extract reusable components',
      //         priority: 'low',
      //         status: 'pending',
      //       },
      //     ],
      //   },
      // };

      setLogicAnalysis(response.data);
      // TODO: Display JSON data in a more readable text (with paragraphs and bullet points)

      setAnalysisAvailable(true);
    } catch (err) {
      toast.error('Failed to generate logic analysis', {
        description:
          `Failed to generate logic analysis. Please try again later.`,
      });
      setError(err.response?.data?.error || error.message);
      console.error(`Error generating logic analysis: ${error}`);
    
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAnalysis = async () => {
    console.log("Start accepting logic analysis..."); 
  }

  const handleRejectAnalysis = async () => {
    console.log("Start rejecting logic analysis..."); 
  }

  if (loading) {
    return <div>Loading...</div>; // Display temporary view
  }

  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Logic Analysis</CardTitle>
        <CardDescription>
          {!analysisAvailable
            ? activeFile
              ? `Click below to generate AI-powered logic analysis for ${activeFile['name']}`
              : `Open a file in the code editor to generate a logic review`
            : 'View your logic analysis below'}
        </CardDescription>
        {!analysisAvailable && (
          <Button variant="default" onClick={handleGenerateLogicAnalysis}>
            Generate Logic Review
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {/* Display the logic analysis when it is available */}
        {analysisAvailable && (
          <div className="overflow-y-auto h-100 border-2 rounded-lg">
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                width: '100%',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
              }}
            >
              {JSON.stringify(logicAnalysis, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      {analysisAvailable && (
        <CardFooter className="gap-2">
          <Button variant="default" onClick={handleAcceptAnalysis}>
            Accept Analysis
          </Button>
          <Button variant="outline" onClick={handleRejectAnalysis}>
            Reject Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
