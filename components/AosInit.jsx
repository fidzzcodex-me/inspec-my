'use client'

import { useEffect } from 'react'
import Aos from 'aos'

export default function AosInit() {
  useEffect(() => {
    Aos.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      mirror: false
    })

    const handleLoad = () => Aos.refresh()
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return null
}
