'use client'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { useState } from 'react'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
const SidebarCollapsibleLink = ({ name, icon, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mt-3 mx-0"
      style={{ marginLeft: 0 }}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between px-2 py-2 hover:bg-muted rounded-lg">
          <div className="flex items-center">
            <span>{icon}</span>
            <span className="mx-3">{name}</span>
          </div>
          {open ? (
            <CaretUpIcon className="w-6 h-6" />
          ) : (
            <CaretDownIcon className="w-6 h-6" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="w-full overflow-hidden transition-[height] duration-300">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SidebarCollapsibleLink
