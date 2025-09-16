import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetSubmissions } from '@/hooks/useGetSubmissions';
import { useState } from 'react';

export default function FileTreeContextMenu({ children }) {
  const { editSubmissionName } = useGetSubmissions();
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedSubmissionName, setEditedSubmissionName] = useState('');

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
