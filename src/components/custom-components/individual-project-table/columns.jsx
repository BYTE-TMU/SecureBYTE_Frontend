import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal } from 'lucide-react';
import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';
import EditSubmissionSheet from '../EditSubmissionSheet';

export const columns = [
  {
    accessorKey: 'filename',
    header: 'File Name',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ row }) => {
      const date = row.getValue('updated_at');
      return new Date(date).toLocaleString();
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('created_at');
      return new Date(date).toLocaleString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              //TODO: add delete submission
              onClick={() => navigator.clipboard.writeText(submission.id)}
            >
              Delete Submission
            </DropdownMenuItem>
            <DeleteSubmissionAlert submission={submission} />
            <DropdownMenuSeparator />
            <EditSubmissionSheet submission={submission} />
            <DropdownMenuItem>Edit Submission</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
