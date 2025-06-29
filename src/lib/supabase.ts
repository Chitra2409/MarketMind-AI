import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_supabase_anon_key_here'

if (!isSupabaseConfigured) {
  console.warn('Supabase is not properly configured. Please update your .env.local file with actual Supabase credentials.')
}

// Create a mock client for development when Supabase isn't configured
const createMockSupabaseClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED', message: 'Supabase not configured' } })
      })
    }),
    upsert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: { code: 'SUPABASE_NOT_CONFIGURED', message: 'Supabase not configured' } })
      })
    })
  })
})

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockSupabaseClient()

export { isSupabaseConfigured }

// Database types (you can generate these with `supabase gen types typescript`)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          plan_id: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          status: string
          plan_id: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          status?: string
          plan_id?: string
          current_period_start?: string
          current_period_end?: string
          updated_at?: string
        }
      }
    }
  }
}