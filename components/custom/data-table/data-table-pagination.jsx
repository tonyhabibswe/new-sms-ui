import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function DataTablePagination({ table }) {
  const selected = table.getFilteredSelectedRowModel().rows.length
  const total = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()

  // One page and nothing selected: nothing worth a footer
  if (pageCount <= 1 && selected === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 md:border-t md:border-border md:px-6 md:py-4">
      <p className="text-sm text-muted-foreground">
        {selected > 0
          ? `${selected} of ${total} selected`
          : `${total} ${total === 1 ? 'row' : 'rows'}`}
      </p>
      {pageCount > 1 && (
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            Rows per page
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}>
              <SelectTrigger
                aria-label="Rows per page"
                className="h-10 w-[84px] rounded-full">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-[18px] w-[18px]" />
          </Button>
          <span className="min-w-[96px] text-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-[18px] w-[18px]" />
          </Button>
        </div>
      )}
    </div>
  )
}
