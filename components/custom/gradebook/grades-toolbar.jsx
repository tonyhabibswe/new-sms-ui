'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Calculator, Search } from 'lucide-react'

export default function GradesToolbar({
  searchQuery,
  onSearchChange,
  hasModifiedGrades,
  isSaving,
  isRecalculating,
  onSave,
  onRecalculate
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onSave}
          disabled={!hasModifiedGrades || isSaving}
          variant={hasModifiedGrades ? 'default' : 'outline'}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? 'Saving...'
            : `Save${hasModifiedGrades ? ` (${hasModifiedGrades})` : ''}`}
        </Button>

        <Button
          onClick={onRecalculate}
          disabled={isRecalculating}
          variant="outline">
          <Calculator className="mr-2 h-4 w-4" />
          {isRecalculating ? 'Calculating...' : 'Recalculate'}
        </Button>
      </div>
    </div>
  )
}
