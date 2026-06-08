/**
 * Roof pricing calculator for the Peak Builders instant-quote flow.
 *
 * Roofing is priced per "square" (= 100 sqft of roof surface). All tunable
 * constants live in PRICING_CONFIG so Peak Builders can adjust pricing in ONE
 * place without touching the form or API code.
 *
 * The $/square numbers are San Diego 2025 mid-range INSTALLED rates, researched
 * from local pricing guides (greatbuildz, roofon, cleanroofing, homeblue,
 * countbricks). Peak Builders should confirm against their own bid sheet.
 */

export type RoofMaterial = 'asphalt' | 'metal' | 'tile'
export type RoofComplexity = 'simple' | 'moderate' | 'complex'
export type HelpType = 'full-replacement' | 'repair' | 'not-sure'

export const PRICING_CONFIG = {
  // Installed price per "square" (100 sqft) by material — San Diego 2025.
  // asphalt ~$5.50/sqft (incl. fire-resistant), metal standing-seam ~$11.50/sqft,
  // concrete/clay tile ~$10/sqft.
  pricePerSquare: {
    asphalt: 550,
    metal: 1150,
    tile: 1000,
  } as Record<RoofMaterial, number>,

  // Roof complexity raises labor/waste. From the "roof complexity" question.
  complexityMultiplier: {
    simple: 1.0,
    moderate: 1.15,
    complex: 1.3,
  } as Record<RoofComplexity, number>,

  // Job type. A repair is a fraction of a full tear-off + replacement.
  // 'not-sure' is treated like a full replacement for the high-end estimate.
  typeMultiplier: {
    'full-replacement': 1.0,
    repair: 0.35,
    'not-sure': 1.0,
  } as Record<HelpType, number>,

  // Show a range (±) around the point estimate to lower commitment and leave
  // room for the in-person quote. Set rangeSpread to 0 for a single number.
  rangeSpread: 0.15,

  // Floor so tiny/garage-only footprints don't produce silly numbers.
  minEstimate: 2500,

  // Default material used when the user isn't asked / doesn't pick one.
  defaultMaterial: 'asphalt' as RoofMaterial,
}

export const SQFT_PER_M2 = 10.7639
export const SQFT_PER_SQUARE = 100

export interface RoofEstimateInput {
  areaMeters2: number
  material?: RoofMaterial
  complexity?: RoofComplexity
  helpType?: HelpType
}

export interface RoofEstimateResult {
  areaMeters2: number
  areaSqft: number
  squares: number
  material: RoofMaterial
  complexity: RoofComplexity
  helpType: HelpType
  /** Point estimate before applying the display range. */
  estimate: number
  /** Low / high bounds shown to the user. */
  estimateLow: number
  estimateHigh: number
}

const round = (n: number, step = 100) => Math.round(n / step) * step

/**
 * Pure function: roof area (m²) + a couple of answers → a price estimate.
 * Safe to run client-side; contains no secrets.
 */
export function calculateRoofEstimate(input: RoofEstimateInput): RoofEstimateResult {
  const {
    areaMeters2,
    material = PRICING_CONFIG.defaultMaterial,
    complexity = 'moderate',
    helpType = 'full-replacement',
  } = input

  const areaSqft = areaMeters2 * SQFT_PER_M2
  const squares = areaSqft / SQFT_PER_SQUARE

  const base = squares * PRICING_CONFIG.pricePerSquare[material]
  const withMultipliers =
    base *
    PRICING_CONFIG.complexityMultiplier[complexity] *
    PRICING_CONFIG.typeMultiplier[helpType]

  const estimate = Math.max(withMultipliers, PRICING_CONFIG.minEstimate)

  const spread = PRICING_CONFIG.rangeSpread
  return {
    areaMeters2,
    areaSqft: Math.round(areaSqft),
    squares: Math.round(squares * 10) / 10,
    material,
    complexity,
    helpType,
    estimate: round(estimate),
    estimateLow: round(estimate * (1 - spread)),
    estimateHigh: round(estimate * (1 + spread)),
  }
}

/** Approximate roof-area bands (m²) for the manual fallback when the Solar API
 *  can't find the building. Mid-points are intentionally conservative. */
export const MANUAL_AREA_BANDS: { value: string; label: string; areaMeters2: number }[] = [
  { value: 'small', label: 'Small home / single story (~1,200 sqft roof)', areaMeters2: 111 },
  { value: 'medium', label: 'Average home (~1,800 sqft roof)', areaMeters2: 167 },
  { value: 'large', label: 'Large home / two story (~2,600 sqft roof)', areaMeters2: 242 },
  { value: 'xlarge', label: 'Very large home (~3,500+ sqft roof)', areaMeters2: 325 },
]

export const formatUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
