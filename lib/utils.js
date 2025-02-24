import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function convertDateToISO(dateString) {
  var date = new Date(dateString)
  var year = date.getFullYear()
  var month = ('0' + (date.getMonth() + 1)).slice(-2) // months are 0-based, add 1 and pad with leading 0 if necessary
  var day = ('0' + date.getDate()).slice(-2) // pad with leading 0 if necessary

  return year + '-' + month + '-' + day // concatenate the components in YYYY-MM-DD format
}
