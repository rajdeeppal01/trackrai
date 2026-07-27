import { parseISO, isValid, isThisMonth, isThisWeek, differenceInDays } from 'date-fns'

/**
 * Generates AI-style insights from the applications array.
 * Pure computation — no external API needed.
 */
export function generateInsights(applications) {
 if (!applications || applications.length === 0) {
 return [
 {
 type: 'tip',
 icon: '💡',
 title: 'Get Started',
 body: 'Add your first job application to unlock smart insights about your job search.',
 },
 {
 type: 'tip',
 icon: '📝',
 title: 'Track Everything',
 body: 'Add job links and notes to keep everything organized in one place.',
 },
 {
 type: 'tip',
 icon: '📊',
 title: 'See Your Progress',
 body: 'Once you add applications, you\'ll see charts and stats about your job search journey.',
 },
 ]
 }

 const insights = []
 const total = applications.length

 // ─── This month ───────────────────────────────
 const thisMonth = applications.filter((a) => {
 const d = a.applied_date ? parseISO(a.applied_date) : parseISO(a.created_at)
 return isValid(d) && isThisMonth(d)
 }).length

 if (thisMonth > 0) {
 insights.push({
 type: 'stat',
 icon: '📅',
 title: 'Applications This Month',
 body: `You've applied to ${thisMonth} ${thisMonth === 1 ? 'company' : 'companies'} this month. ${
 thisMonth >= 10
 ? 'Excellent momentum! Keep it up.'
 : thisMonth >= 5
 ? 'Good pace — aim for 10+ to maximize chances.'
 : 'Try to apply to more companies to increase your chances.'
 }`,
 })
 }

 // ─── This week ────────────────────────────────
 const thisWeek = applications.filter((a) => {
 const d = a.applied_date ? parseISO(a.applied_date) : parseISO(a.created_at)
 return isValid(d) && isThisWeek(d, { weekStartsOn: 1 })
 }).length

 if (thisWeek > 0) {
 insights.push({
 type: 'stat',
 icon: '⚡',
 title: 'This Week',
 body: `${thisWeek} application${thisWeek !== 1 ? 's' : ''} added this week. ${
 thisWeek >= 5 ? 'Amazing hustle this week!' : 'Stay consistent — daily applications work best.'
 }`,
 })
 }

 // ─── Missing job links ────────────────────────
 const missingLinks = applications.filter((a) => !a.link || a.link.trim() === '').length
 if (missingLinks > 0) {
 insights.push({
 type: 'warning',
 icon: '🔗',
 title: 'Missing Job Links',
 body: `${missingLinks} application${missingLinks !== 1 ? 's are' : ' is'} missing job links. Add them to quickly revisit postings.`,
 })
 }

 // ─── Missing notes ────────────────────────────
 const missingNotes = applications.filter((a) => !a.notes || a.notes.trim() === '').length
 if (missingNotes > 0 && missingNotes < total) {
 insights.push({
 type: 'tip',
 icon: '📝',
 title: 'Add Notes',
 body: `${missingNotes} application${missingNotes !== 1 ? 's' : ''} without notes. Notes help you remember key details during interviews.`,
 })
 }

 // ─── Offer rate ───────────────────────────────
 const offers = applications.filter((a) => a.status === 'Offer').length
 if (offers > 0) {
 const offerRate = ((offers / total) * 100).toFixed(0)
 insights.push({
 type: 'success',
 icon: '🎉',
 title: `Offer Rate: ${offerRate}%`,
 body: `You've received ${offers} offer${offers !== 1 ? 's' : ''} from ${total} application${total !== 1 ? 's' : ''}. ${
 offerRate >= 10 ? 'Outstanding conversion rate!' : 'Keep applying — offers take time.'
 }`,
 })
 }

 // ─── Response rate ────────────────────────────
 const responded = applications.filter(
 (a) => ['OA', 'Interview', 'HR', 'Offer'].includes(a.status)
 ).length
 if (responded > 0) {
 const responseRate = ((responded / total) * 100).toFixed(0)
 insights.push({
 type: 'stat',
 icon: '📬',
 title: `Response Rate: ${responseRate}%`,
 body: `${responded} out of ${total} applications received a response. ${
 responseRate >= 20 ? 'Great response rate!' : 'Keep optimizing your resume and applications.'
 }`,
 })
 }

 // ─── Interviews in progress ───────────────────
 const interviews = applications.filter((a) =>
 ['Interview', 'HR'].includes(a.status)
 ).length
 if (interviews > 0) {
 insights.push({
 type: 'action',
 icon: '🎯',
 title: 'Active Interviews',
 body: `You have ${interviews} active interview${interviews !== 1 ? 's' : ''}. Prepare thoroughly — you're in the final stages!`,
 })
 }

 // ─── Follow-up reminders ─────────────────────
 const needFollowUp = applications.filter((a) => {
 if (a.status !== 'Applied') return false
 const d = a.applied_date ? parseISO(a.applied_date) : parseISO(a.created_at)
 if (!isValid(d)) return false
 const daysSince = differenceInDays(new Date(), d)
 return daysSince >= 7
 }).length

 if (needFollowUp > 0) {
 insights.push({
 type: 'warning',
 icon: '⏰',
 title: 'Follow-Up Needed',
 body: `${needFollowUp} application${needFollowUp !== 1 ? 's' : ''} in "Applied" status for 7+ days. Consider following up with the recruiter.`,
 })
 }

 // ─── Avg applications per month ──────────────
 if (total >= 5) {
 const dates = applications
 .map((a) => {
 const d = a.applied_date ? parseISO(a.applied_date) : parseISO(a.created_at)
 return isValid(d) ? d : null
 })
 .filter(Boolean)
 .sort((a, b) => a - b)

 if (dates.length >= 2) {
 const spanDays = differenceInDays(dates[dates.length - 1], dates[0]) || 1
 const spanMonths = Math.max(spanDays / 30, 1)
 const avg = (total / spanMonths).toFixed(1)
 insights.push({
 type: 'stat',
 icon: '📈',
 title: `Avg ${avg} applications/month`,
 body: `Over your tracked period. Top candidates typically apply to 15–25 companies per month.`,
 })
 }
 }

 // Limit to 5 insights max for clean UI
 return insights.slice(0, 5)
}

// Type → styling map
export const INSIGHT_STYLES = {
 stat: {
 border: 'border-brand-500/20',
 iconBg: 'bg-brand-500/10',
 badge: 'bg-brand-500/20 text-brand-300',
 badgeLabel: 'Insight',
 },
 tip: {
 border: 'border-yellow-500/20',
 iconBg: 'bg-yellow-500/10',
 badge: 'bg-yellow-500/20 text-yellow-300',
 badgeLabel: 'Tip',
 },
 warning: {
 border: 'border-orange-500/20',
 iconBg: 'bg-orange-500/10',
 badge: 'bg-orange-500/20 text-orange-300',
 badgeLabel: 'Action',
 },
 success: {
 border: 'border-emerald-500/20',
 iconBg: 'bg-emerald-500/10',
 badge: 'bg-emerald-500/20 text-emerald-300',
 badgeLabel: 'Achievement',
 },
 action: {
 border: 'border-purple-500/20',
 iconBg: 'bg-purple-500/10',
 badge: 'bg-purple-500/20 text-purple-300',
 badgeLabel: 'Focus',
 },
}
