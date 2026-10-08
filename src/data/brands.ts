/** Logos shown in the marquee. SVG sources come from svgl.app and are served locally. */
export interface Brand {
  src: string
  alt: string
  gradient: string
}

export const brands: Brand[] = [
  { src: '/logos/procure.svg', alt: 'Procure', gradient: 'linear-gradient(135deg, #60a5fa, #1d4ed8)' },
  { src: '/logos/shopify.svg', alt: 'Shopify', gradient: 'linear-gradient(135deg, #facc15, #f59e0b)' },
  { src: '/logos/blender.svg', alt: 'Blender', gradient: 'linear-gradient(135deg, #38bdf8, #2563eb)' },
  { src: '/logos/figma.svg', alt: 'Figma', gradient: 'linear-gradient(135deg, #c084fc, #7c3aed)' },
  { src: '/logos/spotify.svg', alt: 'Spotify', gradient: 'linear-gradient(135deg, #f472b6, #ef4444)' },
  { src: '/logos/lottielab.svg', alt: 'Lottielab', gradient: 'linear-gradient(135deg, #facc15, #22c55e)' },
  { src: '/logos/google-cloud.svg', alt: 'Google Cloud', gradient: 'linear-gradient(135deg, #7dd3fc, #38bdf8)' },
  { src: '/logos/bing.svg', alt: 'Bing', gradient: 'linear-gradient(135deg, #22d3ee, #14b8a6)' },
]
