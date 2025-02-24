'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export function Combobox({
  items,
  placeholder = 'Select an option...',
  onValueChange,
  value: controlledValue,
  buttonClassName,
  // New props to map keys from your item objects.
  valueKey = 'value',
  displayKey = 'label',
  searchKey = 'label'
}) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  console.log('items', items)
  // Use the controlled value if provided; otherwise, fall back to internal state.
  const value = controlledValue !== undefined ? controlledValue : internalValue

  // Called when an item is selected.
  const handleSelect = (selectedValue) => {
    const newValue = selectedValue === value ? '' : selectedValue
    if (onValueChange) {
      onValueChange(newValue)
    }
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    // Clear the search term and close the popover.
    setSearchTerm('')
    setOpen(false)
  }

  // Find the selected item to display its text.
  const selectedItem = items.find((item) => item[valueKey] === value)
  const selectedLabel = selectedItem ? selectedItem[displayKey] : null

  // Filter items based on the search term using the provided searchKey.
  const filteredItems = searchTerm
    ? items.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        // Optionally, reset the search when opening/closing the popover.
        setSearchTerm('')
      }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between', buttonClassName)}>
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item[valueKey]}
                  value={item[valueKey]}
                  onSelect={() => handleSelect(item[valueKey])}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item[valueKey] ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item[displayKey]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
