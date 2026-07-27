import { format, formatDistanceToNow, parseISO, isValid, startOfMonth, subMonths } from 'date-fns'

// Format a date string or Date object to display format
export function formatDate(dateStr) {
 if (!dateStr) return '—'
 try {
 const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
 if (!isValid(d)) return '—'
 return format(d, 'MMM d, yyyy')
 } catch {
 return '—'
 }
}

// Format datetime to "X ago"
export function timeAgo(dateStr) {
 if (!dateStr) return ''
 try {
 const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
 if (!isValid(d)) return ''
 return formatDistanceToNow(d, { addSuffix: true })
 } catch {
 return ''
 }
}

// Group applications by month for chart
export function groupByMonth(applications, months = 6) {
 const result = []
 const now = new Date()

 for (let i = months - 1; i >= 0; i--) {
 const monthStart = startOfMonth(subMonths(now, i))
 const label = format(monthStart, 'MMM')
 const monthYear = format(monthStart, 'yyyy-MM')

 const count = applications.filter((app) => {
 const appDate = app.applied_date
 ? parseISO(app.applied_date)
 : parseISO(app.created_at)
 if (!isValid(appDate)) return false
 return format(appDate, 'yyyy-MM') === monthYear
 }).length

 result.push({ month: label, count })
 }

 return result
}

// Pluralize helper
export function plural(count, singular, pluralForm) {
 return count === 1 ? singular : (pluralForm || singular + 's')
}

// Capitalize first letter
export function capitalize(str) {
 if (!str) return ''
 return str.charAt(0).toUpperCase() + str.slice(1)
}
