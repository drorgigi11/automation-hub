'use client'

import { useEffect, useRef, useState } from 'react'

export interface SelectedAddress {
  address: string
  lat: number
  lng: number
}

interface AddressAutocompleteProps {
  defaultValue?: string
  onSelect: (addr: SelectedAddress) => void
  placeholder?: string
}

// Sets up the Google Maps JS API once per page using Google's official inline
// bootstrap loader pattern, which defines google.maps.importLibrary. A plain
// <script> tag does NOT reliably define importLibrary, which is why the new
// Places element previously failed to initialise.
let mapsBootstrapped = false

function bootstrapGoogleMaps(apiKey: string): void {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.google?.maps?.importLibrary || mapsBootstrapped) return
  mapsBootstrapped = true

  // language/region force US English predictions regardless of visitor locale.
  const params: Record<string, string> = { key: apiKey, v: 'weekly', language: 'en', region: 'US' }
  const CALLBACK = '__ib__'
  const google = w.google || (w.google = {})
  const maps = google.maps || (google.maps = {})
  const libraries = new Set<string>()
  let loadPromise: Promise<void> | null = null

  const loadScript = (): Promise<void> => {
    if (loadPromise) return loadPromise
    loadPromise = new Promise<void>((resolve, reject) => {
      const search = new URLSearchParams()
      search.set('libraries', Array.from(libraries).join(','))
      for (const key of Object.keys(params)) {
        const snake = key.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase())
        search.set(snake, params[key])
      }
      search.set('callback', 'google.maps.' + CALLBACK)
      const script = document.createElement('script')
      script.src = 'https://maps.googleapis.com/maps/api/js?' + search.toString()
      maps[CALLBACK] = resolve
      script.onerror = () => reject(new Error('The Google Maps JavaScript API could not load.'))
      script.nonce = (document.querySelector('script[nonce]') as HTMLScriptElement)?.nonce || ''
      document.head.append(script)
    })
    return loadPromise
  }

  if (!maps.importLibrary) {
    maps.importLibrary = (name: string, ...rest: unknown[]) => {
      libraries.add(name)
      // After the script loads, maps.importLibrary is replaced by the real one.
      return loadScript().then(() => maps.importLibrary(name, ...rest))
    }
  }
}

/**
 * Uses the modern PlaceAutocompleteElement (backed by Places API New). The
 * legacy google.maps.places.Autocomplete widget no longer returns predictions
 * for API keys created in 2025+, so the new web component is required.
 */
export default function AddressAutocomplete({
  onSelect,
  placeholder = 'Start typing your home address…',
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loadError, setLoadError] = useState(false)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) {
      console.error('AddressAutocomplete: NEXT_PUBLIC_GOOGLE_MAPS_KEY missing')
      setLoadError(true)
      return
    }

    let cancelled = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let el: any = null

    ;(async () => {
      try {
        bootstrapGoogleMaps(apiKey)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const g = (window as any).google
        const { PlaceAutocompleteElement } = await g.maps.importLibrary('places')
        if (cancelled || !containerRef.current) return

        el = new PlaceAutocompleteElement({ includedRegionCodes: ['us'] })
        el.setAttribute('placeholder', placeholder)
        el.style.width = '100%'
        containerRef.current.appendChild(el)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSelect = async (event: any) => {
          try {
            // GA event is `gmp-select` carrying `placePrediction`; older builds
            // fired `gmp-placeselect` carrying `place`. Support both.
            const prediction = event.placePrediction
            const place = prediction?.toPlace ? prediction.toPlace() : event.place
            if (!place) return
            await place.fetchFields({ fields: ['formattedAddress', 'location'] })
            const loc = place.location
            if (!loc) return
            onSelectRef.current({
              address: place.formattedAddress ?? '',
              lat: typeof loc.lat === 'function' ? loc.lat() : loc.lat,
              lng: typeof loc.lng === 'function' ? loc.lng() : loc.lng,
            })
          } catch (e) {
            console.error('AddressAutocomplete: place select failed', e)
          }
        }
        el.addEventListener('gmp-select', handleSelect)
        el.addEventListener('gmp-placeselect', handleSelect)
      } catch (err) {
        console.error('AddressAutocomplete: failed to init Places', err)
        if (!cancelled) setLoadError(true)
      }
    })()

    return () => {
      cancelled = true
      if (el && typeof el.remove === 'function') el.remove()
    }
  }, [placeholder])

  if (loadError) {
    // Graceful degradation: plain text input. LeadForm still lets them proceed
    // via the manual size-band fallback if no coordinates are captured.
    return (
      <input
        className="pb-input"
        placeholder="Enter your home address"
        autoFocus
      />
    )
  }

  return <div ref={containerRef} className="pb-place-ac" />
}
