import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LogicSuggestionPanel,
  SecuritySuggestionPanel,
} from './SuggestionPanel';

import TestCasesSuggestionPanel from './TestCasesSuggestionPanel';

export default function ReviewTabs() {
  return (
    <Tabs defaultValue="security">
      <TabsList>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logic">Logic</TabsTrigger>
        <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="security">
        <SecuritySuggestionPanel />
      </TabsContent>
      <TabsContent value="logic">
        <LogicSuggestionPanel />
      </TabsContent>
      <TabsContent value="test-cases" className='w-full'>
        <TestCasesSuggestionPanel />
      </TabsContent>
    </Tabs>
  );
}
