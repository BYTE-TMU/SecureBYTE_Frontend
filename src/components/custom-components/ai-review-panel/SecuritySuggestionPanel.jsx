import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LoadingView from '@/components/ui/loading-view';

export function SecuritySuggestionPanel({
  securityReview,
  isSecReviewLoading,
}) {
  if (isSecReviewLoading) {
    return <LoadingView message="Generating security review..." variant="full" />;
  }

  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Security Review</CardTitle>
        <CardDescription>
          Click "Generate Security Review" and view your review here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Display security review with improved formatting */}
        {securityReview && (
          <div className="space-y-6">
            {securityReview.files.map((file, fileIndex) => (
              <div key={file.filename}>
                {/* Separator between files */}
                {fileIndex > 0 && <Separator className="my-6" />}
                
                <Card className="p-5">
                  <CardTitle className="mb-4">{file.filename}</CardTitle>
                  {file.issues.length === 0 ? (
                    <CardDescription className="text-muted-foreground italic">
                      No issues found
                    </CardDescription>
                  ) : (
                    <CardContent className="p-0 space-y-4">
                      {file.issues.map((issue, index) => (
                        <div key={index}>
                          {/* Separator between issues */}
                          {index > 0 && <Separator className="my-4" />}
                          
                          <Card className="p-5 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-sm font-semibold whitespace-nowrap">
                                Line {issue.line}
                              </CardTitle>
                              <span className="text-xs text-muted-foreground">•</span>
                              <CardTitle className="text-sm font-semibold whitespace-nowrap">
                                Severity: {issue.severity.level.charAt(0).toUpperCase() + issue.severity.level.slice(1)}
                              </CardTitle>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium whitespace-nowrap">
                                Score: {issue.severity.score}
                              </span>
                            </div>
                            <CardDescription className="leading-relaxed pl-4 border-l-2 border-muted">
                              {issue.feedback}
                            </CardDescription>
                          </Card>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
