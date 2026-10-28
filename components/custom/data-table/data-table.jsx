'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableMobileCard } from './data-table-mobile-card'
import { useToast } from '@/components/ui/use-toast'

export function DataTable({
  columns,
  data,
  toolbar: DataTableToolbar,
  error,
  columnVisibilityInitialState = {},
  meta
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState(
    columnVisibilityInitialState
  )
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 30 // Default rows per page set to 30
  })
  const { toast } = useToast()
  React.useEffect(() => {
    let timer
    const handleError = async () => {
      // An empty list is normal; only report a failure the page passed in
      if (data.length === 0 && error) {
        timer = setTimeout(() => {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error
          })
        }, 100)
      }
    }
    handleError()

    return () => {
      clearTimeout(timer)
    }
  }, [data.length, error, toast])

  // eslint-disable-next-line react-hooks/incompatible-library -- only matters for React Compiler, which this app doesn't use
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    meta
  })

  // Desktop: one card holding the toolbar, table and pagination. Phones: the
  // toolbar, then one card per row.
  return (
    <section className="flex flex-col gap-3 md:gap-0 md:overflow-hidden md:rounded-card md:border md:border-border md:bg-card md:shadow-card">
      {DataTableToolbar !== React.Fragment ? (
        <div className="md:px-6 md:py-5">
          <DataTableToolbar table={table} />
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col gap-3 md:hidden">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => <DataTableMobileCard key={row.id} row={row} />)
        ) : (
          <div className="rounded-card-sm border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <div>
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
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </section>
  )
}
