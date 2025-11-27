import { Separator } from '@radix-ui/react-separator';
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import Breadcrumbs from './Breadcrumbs';

export default function AppHeader() {
  return (
    <header className="w-full flex h-10 items-center gap-2 border-b">
      <div className="flex items-center gap-1 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 "
        />
        {/* <Breadcrumbs /> */}
      </div>
    </header>
  );
}
