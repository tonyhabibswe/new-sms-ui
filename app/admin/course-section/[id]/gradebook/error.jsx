'use client'

import { PageError } from '@/components/custom/layout/page-error'

export default function GradebookError({ error, reset }) {
  return (
    <PageError message={error.message || 'Failed to load gradebook'} reset={reset} />
  )
}
