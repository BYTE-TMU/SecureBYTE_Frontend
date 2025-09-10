import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SecuritySuggestionPanel,
} from './SecuritySuggestionPanel';

import TestCasesSuggestionPanel from './TestCasesSuggestionPanel';
import LogicSuggestionPanel from './LogicSuggestionPanel'; 

export default function ReviewTabs({ activeFile, securityReview }) {
  return (
    <Tabs defaultValue="security" className="w-full">
      <TabsList>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logic">Logic</TabsTrigger>
        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="security" className="w-full">
        <SecuritySuggestionPanel securityReview={securityReview}/>
      </TabsContent>
      <TabsContent value="logic" className="w-full">
        <LogicSuggestionPanel activeFile={activeFile}/>
      </TabsContent>
      <TabsContent value="test-cases" className="w-full">
        <TestCasesSuggestionPanel activeFile={activeFile}/>
      </TabsContent>
    </Tabs>
  );
}
