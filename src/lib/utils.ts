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

/**
 * Format relative time for notifications (e.g., "5 minutes ago")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Unknown'
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Unknown'
    
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSeconds < 60) {
      return 'Just now'
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      return dateObj.toLocaleDateString()
    }
  } catch {
    return 'Unknown'
  }
}
