import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { MoreHorizontal } from 'lucide-react';
import { DeleteSubmissionAlert } from '../DeleteSubmissionAlert';
import EditSubmissionSheet from '../EditSubmissionSheet';

export const columns = [
  {
    accessorKey: 'filename',
    header: 'File Name',
  },
  {
    accessorKey: 'review_types',
    header: 'Review Types',
    accessorFn: (row) => {
      const types = [];
      if (row.securityrev && row.securityrev.length > 0) types.push('Security');
      if (row.logicrev && row.logicrev.length > 0) types.push('Logic');
      if (row.testcases && row.testcases.length > 0) types.push('Test Cases');
      return types.join(', ');
    },
    cell: ({ row }) => {
      const submission = row.original;
      const reviewTypes = [];

      if (submission.securityrev && submission.securityrev.length > 0) {
        reviewTypes.push(
          <Badge key="security" variant="default" className="mr-1">
            Security
          </Badge>
        );
      }
      if (submission.logicrev && submission.logicrev.length > 0) {
        reviewTypes.push(
          <Badge key="logic" variant="secondary" className="mr-1">
            Logic
          </Badge>
        );
      }
      if (submission.testcases && submission.testcases.length > 0) {
        reviewTypes.push(
          <Badge key="testcases" variant="outline" className="mr-1">
            Test Cases
          </Badge>
        );
      }

      return reviewTypes.length > 0 ? <div className="flex flex-wrap gap-1">{reviewTypes}</div> : <span className="text-muted-foreground">None</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === 'all') return true;

      const submission = row.original;
      if (filterValue === 'security') {
        return submission.securityrev && submission.securityrev.length > 0;
      }
      if (filterValue === 'logic') {
        return submission.logicrev && submission.logicrev.length > 0;
      }
      if (filterValue === 'testcases') {
        return submission.testcases && submission.testcases.length > 0;
      }
      return true;
    },
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
            {/* <DropdownMenuItem
              //TODO: add delete submission
              onClick={() => navigator.clipboard.writeText(submission.id)}
            >
              Delete Submission
            </DropdownMenuItem> */}
            <DeleteSubmissionAlert submission={submission} />
            <DropdownMenuSeparator />
            <EditSubmissionSheet submission={submission} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
