import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely format a date with error handling
 */
export function safeFormatDate(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    
    return dateObj.toLocaleDateString(undefined, options)
  } catch {
    return 'Invalid date'
  }
}

/**
 * Safely format time with error handling
 */
export function safeFormatTime(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-- : -- : --'
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return '-- : -- : --'
    
    return dateObj.toLocaleTimeString(undefined, options || { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch {
    return '-- : -- : --'
  }
}

/**
 * Safely format date and time with error handling
 */
export function safeFormatDateTime(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'Never'
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid date'
    
    return dateObj.toLocaleString(undefined, options)
  } catch {
    return 'Invalid date'
  }
}
