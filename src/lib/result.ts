/**
 * Result of a tool operation, in the same spirit as lib/formatters and lib/codecs:
 * `result` holds the output; on failure it is null, `error` says what went wrong and
 * `hint` how to fix it.
 */
export interface ToolResult<T = string> {
  result: T | null
  error?: string
  hint?: string
}

export const ok = <T>(result: T): ToolResult<T> => ({ result })

export const fail = <T = never>(error: string, extra: { hint?: string } = {}): ToolResult<T> => ({
  result: null,
  error,
  ...extra,
})
