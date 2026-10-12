import { Analytics } from '@vercel/analytics/react'
import { redactEvent } from '../../lib/analytics'

/**
 * Vercel Web Analytics: anonymous page views, no cookies (see /privacidade). Only in the
 * production deploy, so local runs and previews don't count as visits.
 */
export function SiteAnalytics() {
  if (!__ANALYTICS__) return null
  return <Analytics beforeSend={redactEvent} />
}
