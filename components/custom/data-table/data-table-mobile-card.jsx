'use client'

import { flexRender } from '@tanstack/react-table'

const titleOf = (column) => {
  const { label, header } = column.columnDef
  return label || (typeof header === 'string' ? header : column.id)
}

// How a table row reads on a phone: its first column as the title, the row's
// menu beside it, the other columns as labelled fields underneath
export function DataTableMobileCard({ row }) {
  const cells = row.getVisibleCells().filter((cell) => cell.column.id !== 'select')
  const actions = cells.find((cell) => cell.column.id === 'actions')
  const [primary, ...fields] = cells.filter((cell) => cell.column.id !== 'actions')
  const render = (cell) => flexRender(cell.column.columnDef.cell, cell.getContext())

  return (
    <article className="flex flex-col gap-3 rounded-card-sm border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        {primary && (
          <div className="min-w-0 pt-2 font-display text-[17px] font-bold leading-6 [&>*]:min-w-0">
            {render(primary)}
          </div>
        )}
        {actions && <div className="-mr-1 shrink-0">{render(actions)}</div>}
      </div>
      {fields.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {fields.map((cell) => (
            <div key={cell.id} className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[1.2px] text-faint">
                {titleOf(cell.column)}
              </dt>
              <dd className="mt-0.5 text-sm text-foreground [&>*]:min-w-0">
                {render(cell)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}
