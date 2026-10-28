'use client'

import { useEffect } from 'react'
import { PageError } from '@/components/custom/layout/page-error'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Student history error:', error)
  }, [error])

  return (
    <PageError
      message={error.message || 'Failed to load this student. Please try again.'}
      reset={reset}
    />
  )
}
