import { Separator } from '@radix-ui/react-separator';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';

export default function AppHeader() {
  return (
    <header className="w-full flex h-10 items-center gap-2 border-b mt-16">
      <div className="flex items-center gap-1 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 "
        />
        <p>Future Breadcrumbs can maybe go here</p>
      </div>
    </header>
  );
}
