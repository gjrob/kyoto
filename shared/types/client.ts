export interface ClientConfig {
  slug: string
  name: string
  tagline?: string
  address?: string
  phone?: string
  hours?: Record<string, string>
  logo_url?: string
  primary_color: string
  accent_color: string
  chatbot_name: string
  chatbot_system_prompt?: string
  is_open: boolean
}

export interface MenuItem {
  id: string
  client_slug: string
  category: string
  name: string
  description?: string
  price_cents?: number
  tags?: string[]
  image_url?: string
  available: boolean
  sort_order: number
}

export interface Reservation {
  id?: string
  client_slug: string
  name: string
  email?: string
  phone: string
  party_size: number
  date: string
  time: string
  notes?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
}
