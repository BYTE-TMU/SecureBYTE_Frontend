import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LogicSuggestionPanel,
  SecuritySuggestionPanel,
} from './SuggestionPanel';

export default function ReviewTabs() {
  return (
    <Tabs defaultValue="security">
      <TabsList>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logic">Logic</TabsTrigger>
      </TabsList>
      <TabsContent value="security">
        <SecuritySuggestionPanel />
      </TabsContent>
      <TabsContent value="logic">
        <LogicSuggestionPanel />
      </TabsContent>
    </Tabs>
  );
}
