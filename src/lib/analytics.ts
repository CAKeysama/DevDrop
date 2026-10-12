import type { BeforeSendEvent } from '@vercel/analytics/react'

/**
 * What the catalog search box holds is text the visitor typed, and the privacy policy promises
 * not to collect what people type. The query (`?q=`) is dropped before a page view is sent;
 * the category filter stays, since it is a choice from a fixed list.
 */
export function redactEvent(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url)
  url.searchParams.delete('q')
  return { ...event, url: url.toString() }
}
