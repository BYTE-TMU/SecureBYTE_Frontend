import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecuritySuggestionPanel } from './SecuritySuggestionPanel';

import TestCasesSuggestionPanel from './TestCasesSuggestionPanel';
import LogicSuggestionPanel from './LogicSuggestionPanel';

export default function ReviewTabs({
  activeFile,
  securityReview,
  projectId,
  isSecReviewLoading,
}) {
  return (
    <Tabs defaultValue="security" className="w-full h-full gap-0">
      <TabsList className="rounded-none w-full h-[32px]">
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logic">Logic</TabsTrigger>
        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="security" className="w-full rounded-none">
        <SecuritySuggestionPanel
          securityReview={securityReview}
          isSecReviewLoading={isSecReviewLoading}
        />
      </TabsContent>
      <TabsContent value="logic" className="w-full h-full">
        <LogicSuggestionPanel activeFile={activeFile} projectId={projectId} />
      </TabsContent>
      <TabsContent value="test-cases" className="w-full">
        <TestCasesSuggestionPanel
          activeFile={activeFile}
          projectId={projectId}
        />
      </TabsContent>
    </Tabs>
  );
}
