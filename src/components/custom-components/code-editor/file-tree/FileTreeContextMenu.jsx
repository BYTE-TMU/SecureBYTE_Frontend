import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog } from '@/components/ui/dialog';

export default function FileTreeContextMenu({ children }) {
  const [isRenaming, setIsRenaming] = useState(false);

  return (
    //TODO: need to move this to filetree.jsx - [JOHAN]
    <ContextMenu>
      {isRenaming && <Dialog></Dialog>}
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={(prev) => setIsRenaming(!prev)}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
        {/* <ContextMenuItem>New File</ContextMenuItem> */}
      </ContextMenuContent>
    </ContextMenu>
  );
}
