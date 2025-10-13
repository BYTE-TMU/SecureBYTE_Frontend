import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

import { MoreHorizontal } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router';
import EditProjectSheet from '../EditProjectSheet';
import { DeleteProjectAlert } from '../DeleteProjectAlert';

export const getProjectsMasterTableColumns = (
  openDropdowns,
  setOpenDropdowns,
) => [
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
        <Link to={`/projects/${id}`} state={{ projectName: name}}>
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
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;
      const isOpen = openDropdowns[project.projectid] || false;
      const setOpen = (open) => {
        setOpenDropdowns((prev) => {
          const newState = {
            ...prev,
            [project.projectid]: open,
          };
          console.log('New dropdown state:', newState); // Debug
          return newState;
        });
      };
      return (
        //TODO: change to just icons
        <DropdownMenu open={isOpen} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem

              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="text-destructive hover:text-destructive"
            >
              Delete Project
            </DropdownMenuItem> */}
            <DeleteProjectAlert
              project={project}
              closeDropdown={() => {
                setOpen(false);
              }}
            />
            <DropdownMenuSeparator />
            <EditProjectSheet project={project} />
            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

