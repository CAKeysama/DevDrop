/**
 * Cryptographically secure randomness (Web Crypto). Math.random() is never used for
 * passwords, UUIDs or document numbers.
 */
export type RandomInt = (maxExclusive: number) => number

/** Uniform integer in [0, maxExclusive) using rejection sampling to avoid modulo bias. */
export const secureRandomInt: RandomInt = (maxExclusive) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > 0x1_0000_0000) {
    throw new RangeError('maxExclusive must be an integer between 1 and 2^32')
  }
  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive
  const buffer = new Uint32Array(1)
  for (;;) {
    crypto.getRandomValues(buffer)
    if (buffer[0] < limit) return buffer[0] % maxExclusive
  }
}

/** In-place Fisher–Yates shuffle. */
export function shuffle<T>(items: T[], randomInt: RandomInt = secureRandomInt): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}
