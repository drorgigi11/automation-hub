import { createClient } from '@supabase/supabase-js'

// Client-side only (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type LeadSource = 'facebook' | 'elementor' | 'lovable'

export interface Lead {
  id: string
  source: LeadSource
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  raw_data: Record<string, unknown>
  synced_to_sheets: boolean
  sheet_id: string | null
  created_at: string
}

export interface SheetConnection {
  id: string
  name: string
  sheet_id: string
  sheet_tab: string
  sources: LeadSource[]
  created_at: string
}
