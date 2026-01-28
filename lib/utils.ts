import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  const messageDate = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else if (messageDate.getFullYear() === today.getFullYear()) {
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}
