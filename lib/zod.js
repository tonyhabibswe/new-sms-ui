import * as z from 'zod'

// zod 4 reports a missing value as "Invalid input: expected string, received
// undefined". Keep zod 3's "Required", which the forms show under empty fields.
z.config({
  customError: (issue) =>
    issue.code === 'invalid_type' && issue.input === undefined
      ? 'Required'
      : undefined
})

export * from 'zod'
