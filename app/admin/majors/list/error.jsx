'use client'

import { useEffect } from 'react'
import { PageError } from '@/components/custom/layout/page-error'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Majors list error:', error)
  }, [error])

  return (
    <PageError
      message={error.message || 'Failed to load majors. Please try again.'}
      reset={reset}
    />
  )
}
