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

export const columns = [
  {
    code: 'code 1 ',
    created_at: '2025-08-08T23:39:56.986751',
    filename: 'sub 2',
    id: '2fdaa928-007f-4cb6-bb3f-0356c576cb4f',
    projectid: '7fb74dcb-69c0-48db-8ad1-76ca566451b3',
    reviewpdf: '',
    updated_at: '2025-08-08T23:39:56.987655',
  },
  {
    accessorKey: 'filename',
    header: 'File Name',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
  {
    accessorKey: 'submissionDate',
    header: 'Submission Date',
  },
  {
    accessorKey: 'submissionType',
    header: 'Submission Type',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Delete Submission
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Submission</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
