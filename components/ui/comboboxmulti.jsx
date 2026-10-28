'use client'

import { CheckIcon, PlusCircleIcon } from 'lucide-react'
import React from 'react'

import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
export default function ComboBoxMulti({
  name,
  options,
  form,
  formItemProps = {},
  formLabelProps = {},
  formLabel = '',
  formControlProps = {},
  buttonProps = {}
}) {
  const [selectedValues, setSelectedValues] = React.useState(
    new Set(form.getValues()?.[name] ?? [])
  )

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem {...formItemProps}>
          <FormLabel {...formLabelProps}>{formLabel}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl {...formControlProps}>
                <Button
                  variant="field"
                  className={`h-auto min-h-[44px] w-full justify-start py-2 ${buttonProps.className}`}>
                  <PlusCircleIcon className="h-4 w-4 text-muted-foreground" />
                  {selectedValues?.size == 0 && (
                    <span className="font-normal text-faint">
                      {buttonProps.placeholder}
                    </span>
                  )}
                  {selectedValues?.size > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal lg:hidden">
                        {selectedValues.size}
                      </Badge>
                      <div className="flex space-x-1">
                        {selectedValues.size > 4 ? (
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal">
                            {selectedValues.size} selected
                          </Badge>
                        ) : (
                          options
                            .filter((option) =>
                              selectedValues.has(option.value)
                            )
                            .map((option) => (
                              <Badge
                                variant="secondary"
                                key={option.value}
                                className="rounded-sm px-1 font-normal">
                                {option.label}
                              </Badge>
                            ))
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search Day..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No result found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option, index) => {
                      const isSelected = selectedValues.has(option.value)
                      return (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            if (isSelected) {
                              setSelectedValues((prev) => {
                                prev.delete(option.value)
                                return prev
                              })
                              // selectedValues.delete(option.value)
                            } else {
                              setSelectedValues((prev) => {
                                prev.add(option.value)
                                return prev
                              })
                              // selectedValues.add(option.value)
                            }
                            const filterValues = Array.from(selectedValues)
                            form.setValue(name, filterValues)
                          }}>
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50 [&_svg]:invisible'
                            )}>
                            <CheckIcon className={cn('h-4 w-4')} />
                          </div>
                          <span>{option.label}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
