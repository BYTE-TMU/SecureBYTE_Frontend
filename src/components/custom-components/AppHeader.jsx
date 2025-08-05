import { Separator } from '@radix-ui/react-separator';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';

export default function AppHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 flex h-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear w-full mt-16">
      <div className="flex w-full items-center gap-1 px-4">
        <SidebarTrigger className="-ml-1 border-none active:border-none hover:bg-none" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-secure-blue"
        />
        <p>Future Breadcrumbs can maybe go here</p>
      </div>
    </header>
  );
}
