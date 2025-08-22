import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { Button } from '@/components/ui/button';

export function SecuritySuggestionPanel() {
  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Security Review</CardTitle>
        <CardDescription>Find your security analysis here. </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
export function LogicSuggestionPanel() {
  
  return (
    <Card className="h-full rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Logic Review</CardTitle>
        <CardDescription>Find your logic analysis here. </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
