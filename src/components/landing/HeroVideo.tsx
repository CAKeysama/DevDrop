import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4'

/**
 * Decorative background video. It sits in an absolute layer, so loading or failing
 * never moves the layout: on error the layer is simply removed and the white hero remains.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduceMotion) video.pause()
    else video.play().catch(() => undefined) // autoplay may be blocked; the first frame stays
  }, [reduceMotion])

  if (failed) return null

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <video
        ref={ref}
        src={VIDEO_URL}
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        onError={() => setFailed(true)}
        // The footage is light; in dark mode invert it and turn the hue back, so the white
        // tiles go dark while the blue stays blue.
        className="w-full h-full object-cover scale-105 dark:invert dark:hue-rotate-180"
      />
    </div>
  )
}
