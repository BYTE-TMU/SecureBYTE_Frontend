import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { Button } from '@/components/ui/button';

export function SecuritySuggestionPanel({
  securityReview,
  isSecReviewLoading,
}) {
  if (isSecReviewLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Security Review</CardTitle>
        <CardDescription>
          Click "Generate Security Review" and view your review here{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Display unformatted security review for now */}
        {securityReview && (
          <div>
            {securityReview.files.map((file) => (
              <Card key={file.filename} className='p-5 mt-3'>
                  <CardTitle>File: {file.filename}</CardTitle>
                  {file.issues.length === 0 ? (
                    <CardDescription>No issues found</CardDescription>
                  ) : (
                    <CardContent className='p-0'>
                      {file.issues.map((issue, index) => (
                        <Card key={index} className='p-5 mb-5 gap-4'>
                          <CardTitle>Line:{issue.line}</CardTitle>
                          <CardTitle>Severity: {issue.severity.level.charAt(0).toUpperCase() + issue.severity.level.slice(1) } (Score:{' '}{issue.severity.score})</CardTitle>
                          <CardDescription className="text-black-[1rem]">AI Feedback: {issue.feedback}</CardDescription>
                        </Card>
                      ))}
                    </CardContent>
                  )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
