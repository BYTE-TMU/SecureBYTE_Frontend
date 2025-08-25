import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SecuritySuggestionPanel,
} from './SuggestionPanel';

import TestCasesSuggestionPanel from './TestCasesSuggestionPanel';
import LogicSuggestionPanel from './LogicSuggestionPanel'; 

export default function ReviewTabs() {
  return (
    <Tabs defaultValue="security" className="w-full">
      <TabsList>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logic">Logic</TabsTrigger>
        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="security" className="w-full">
        <SecuritySuggestionPanel />
      </TabsContent>
      <TabsContent value="logic" className="w-full">
        <LogicSuggestionPanel />
      </TabsContent>
      <TabsContent value="test-cases" className="w-full">
        <TestCasesSuggestionPanel />
      </TabsContent>
    </Tabs>
  );
}
