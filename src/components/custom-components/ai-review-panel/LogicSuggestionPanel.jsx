import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/AuthContext';
import React, { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import LoadingView from '@/components/ui/loading-view';

export default function LogicAnalysisPanel({ activeFile }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewAvailable, setReviewAvailable] = useState(false);
  const [logicFiles, setLogicFiles] = useState();

  useEffect(() => {
    console.log('logicFiles updated:', logicFiles);
    setLoading(false);
  }, [logicFiles]);

  // TODO: Save the currently active file to backend first, then generate the review.

  const handleGenerateLogicAnalysis = async () => {
    // Check if there's any file open in the code editor
    if (!activeFile) {
      toast.error('File Not Open', {
        description: `Please open a file in the Code Editor to generate logic review.`,
      });
      return;
    }

    // TODO: STEP 1: Save updated files to backend
    console.log('Generate logic analysis...');

    // If no users or active file, return
    // if (!user || !activeFile) return;

    setLoading(true);

    try {
      // Send test file to backend for logic review
      console.log('LOGIC REVIEW: Current active file', activeFile);
      const response = await getLogicReview(
        user.uid,
        activeFile.id,
        activeFile,
      );

      console.log('LOGIC REVIEW: Received data from backend');
      // TODO: Retrieve relevant data for logic review (response.data.response.files)
      setLogicFiles(response.data.response.files);
      console.log(response.data.response.files);
      // TODO: Display JSON data in a more readable text (with paragraphs and bullet points)
      setReviewAvailable(true);
    } catch (err) {
      toast.error('Logic Review Failed', {
        description: `Failed to generate logic review. Please try again later.`,
      });
      setError(err.response?.data?.error || err.message);
      console.error(`Error generating logic analysis: ${err}`);
    }
  };

  const handleAcceptAnalysis = async () => {
    console.log('Start accepting logic analysis...');
  };

  const handleRejectAnalysis = async () => {
    console.log('Start rejecting logic analysis...');
  };

  if (loading) {
    return <LoadingView message="Analyzing code logic..." variant="full" />;
  }

  return (
    <Card className="h-full w-[90%] rounded-none border-none shadow-none overflow-x-hidden">
      <CardHeader>
        <CardTitle>Logic Analysis</CardTitle>
        <CardDescription>
          {!reviewAvailable
            ? activeFile
              ? `Click below to generate AI-powered logic review for ${activeFile['name']}`
              : `Open a file in the code editor to generate a logic review`
            : 'View your logic analysis below'}
        </CardDescription>
        {!reviewAvailable && (
          <Button variant="default" onClick={handleGenerateLogicAnalysis}>
            Generate Logic Review
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 h-full">
        {/* Display the logic analysis when it is available */}
        {reviewAvailable && logicFiles && (
          <div className="overflow-y-auto h-full space-y-6">
            {Object.entries(logicFiles).map(
              ([reviewKey, reviewObj], fileIndex) => (
                <div key={reviewKey} className="h-full">
                  {/* Separator between files */}
                  {fileIndex > 0 && <Separator className="my-6" />}

                  <CardTitle className="mb-4">
                    Suggestion {reviewKey + 1}
                  </CardTitle>
                  {reviewObj['logic Errors'].map((review, index) => (
                    <div key={index}>
                      {/* Separator between logic errors */}
                      {index > 0 && <Separator className="my-4" />}

                      {review.function ? (
                        <CardTitle className="text-base font-semibold">
                          Function: {review.function}
                        </CardTitle>
                      ) : (
                        ''
                      )}
                      <CardDescription className="leading-relaxed pl-4 border-l-2 border-muted h-full">
                        {review.feedback}
                      </CardDescription>
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
      {reviewAvailable && (
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
