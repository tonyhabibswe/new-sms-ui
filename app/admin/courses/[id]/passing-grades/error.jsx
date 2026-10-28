'use client'

import { useEffect } from 'react'
import { PageError } from '@/components/custom/layout/page-error'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Course passing grades error:', error)
  }, [error])

  return (
    <PageError
      message={
        error.message ||
        'Failed to load course passing grades. Please try again.'
      }
      reset={reset}
    />
  )
}
