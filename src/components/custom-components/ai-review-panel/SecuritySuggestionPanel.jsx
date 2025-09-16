import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { Button } from '@/components/ui/button';

export function SecuritySuggestionPanel({ securityReview }) {
  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Security Review</CardTitle>
        {/* TODO: This is not good UX/UI. Consider changing it later */}
        <CardDescription>
          Click "Generate Security Review" and view your review here{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Display unformatted security review for now */}
        {securityReview && (
          <div>
            <div>
              <strong>Review Time:</strong> {securityReview.review_time}
            </div>
            {securityReview.files.map((file) => (
              <div key={file.filename} className='mt-3'>
                <h3 className='text-1xl font-bold'>File: {file.filename}</h3>
                {file.issues.length === 0 ? (
                  <div>No issues found.</div>
                ) : (
                  <ul>
                    {file.issues.map((issue, idx) => (
                      <li key={idx}>
                        <div>
                          Line:{issue.line}
                        </div>
                        <div>
                          Feedback:{issue.feedback}
                        </div>
                        <div>
                          Severity:{issue.severity.level}{' '}
                          (Score: {issue.severity.score})
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
