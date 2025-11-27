import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CirclePlus } from 'lucide-react';
import { NewProjectDialog } from '../NewProjectDialog';
import { useProject } from '@/hooks/project/ProjectContext';
import { toast } from 'sonner';
import { ClimbingBoxLoader } from 'react-spinners';

export default function ProjectsMasterTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const { loading, deleteProjectInBulk, deleteMultipleProjects } = useProject();
  console.log(data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Check if any rows are selected by users
  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  // Handle bulk selection function
  // TODO: Integrate properly with backend
  const handleBulkDelete2 = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const projectsToDelete = selectedRows.map((row) => row.original);
    console.log(projectsToDelete);
    try {
      const result = await deleteMultipleProjects({ projectsToDelete });
      console.log('Bulk delete result:', result); // Debug
    } catch (error) {
      toast.error(`Failed to delete projects: ${error.message}`);
    }
  };
  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const projectsToDelete = selectedRows.map((row) => row.original);
    console.log(projectsToDelete);
    console.log('Projects to delete:', projectsToDelete); // Debug

    try {
      const result = await deleteProjectInBulk({ projectsToDelete });

      if (result?.successful?.length === projectsToDelete.length) {
        toast.success('Delete Successful', {
          description: `Successfully deleted ${result.successful.length} project(s)`,
        });
      }

      if (result?.successful?.length === 0 && projectsToDelete.length > 0) {
        toast.error('All Delete Failed', {
          description: `Failed to delete ${projectsToDelete.length} projects. Please try again later`,
        });
      }

      if (result?.successful?.length > 0 && result?.failed?.length > 0) {
        const failedDelete = result.failed.map((r) => r.reason);

        console.error('Failed to partially delete projects', failedDelete); // Debug

        toast.error('Delete Failed', {
          description: `Failed to delete ${failedDelete.length} projects. Please try again later`,
        });
      }
    } catch (err) {
      console.error(
        `Error deleting projects in bulk:" ${
          err.response?.data?.error || err.message
        }`,
      );
      toast.error('Delete Failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      table.resetRowSelection(); // Clear all selected rows
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClimbingBoxLoader color="#003092" />
      </div>
    ); // Temporary loading view
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NewProjectDialog />
          <Input
            placeholder="Filter projects..."
            value={table.getColumn('project_name')?.getFilterValue() ?? ''}
            onChange={(event) =>
              table
                .getColumn('project_name')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {hasSelectedRows && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete selected ({table.getFilteredSelectedRowModel().rows.length}
              )
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
