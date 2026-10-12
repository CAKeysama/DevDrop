import { useEffect, useState } from 'react'

/** Delay used by the tools that process the input while the user types. */
export const AUTO_PROCESS_DELAY = 300

/**
 * Returns `value` once it has stopped changing for `delay` ms. `flush` skips the wait:
 * pass the new value when it was just set in the same event ("Exemplo", "Colar"), or
 * nothing to use the current one (Ctrl+Enter).
 */
export function useDebouncedValue<T>(value: T, delay = AUTO_PROCESS_DELAY): [T, (next?: T) => void] {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  function flush(next?: T) {
    setDebounced(next === undefined ? value : next)
  }

  return [debounced, flush]
}
