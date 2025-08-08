import { Button } from '@/components/ui/button';

import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router';

export const projectsMasterTableColumns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'project_name',
    header: 'Project Name',
    cell: ({ row }) => {
      const project = row.original;
      const name = project.project_name;
      const id = project.projectid;
      return (
        <Link to={`/projects/${id}`}>
          <span>{name}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'project_desc',
    header: 'Project Description',
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('updated_at');
      return new Date(date).toLocaleTimeString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
];
