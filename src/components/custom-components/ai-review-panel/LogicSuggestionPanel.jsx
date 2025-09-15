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
  
  const formatActiveFile = (activeFile) => {
    return {
      'fileid': activeFile.id, 
      'filename': activeFile.name, 
      'code': activeFile.content, 
    }
  }

  // TODO: Save the currently active file to backend first, then generate the review. 

  const handleGenerateLogicAnalysis = async () => {
    // STEP 1: Save updated files to backend

    
    console.log('Generate logic analysis...');

    // If no users or active file, return
    // if (!user || !activeFile) return;

    setLoading(true); 

    try {
      // Send test file to backend for logic review
      console.log("LOGIC REVIEW: About to call backend..."); 
      console.log("LOGIC REVIEW: Current active file", activeFile);

      const response = await getLogicReview(user.uid, activeFile.id, activeFile);

      console.log("LOGIC REVIEW: Receive data from backend"); 
      setLogicAnalysis(response.data);
      // TODO: Display JSON data in a more readable text (with paragraphs and bullet points)

      setAnalysisAvailable(true);
    } catch (err) {
      toast.error('Failed to generate logic analysis', {
        description:
          `Failed to generate logic analysis. Please try again later.`,
      });
      setError(err.response?.data?.error || err.message);
      console.error(`Error generating logic analysis: ${err}`);
    
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
