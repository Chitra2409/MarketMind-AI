import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface Subscription {
  id: string
  status: string
  plan_id: string
  current_period_start: string
  current_period_end: string
  stripe_customer_id: string
  stripe_subscription_id: string
}

export function useSubscription() {
  const { user } = useUser()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchSubscription()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured - subscription features unavailable')
        setSubscription(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116' && error.code !== 'SUPABASE_NOT_CONFIGURED') {
        throw error
      }

      if (error?.code === 'SUPABASE_NOT_CONFIGURED') {
        console.warn('Supabase not configured - subscription features unavailable')
        setSubscription(null)
        setLoading(false)
        return
      }

      setSubscription(data)
    } catch (err) {
      console.error('Error fetching subscription:', err)
      
      // Provide more specific error messages
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to database. Please check your internet connection or contact support.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
      }
    } finally {
      setLoading(false)
    }
  }

  const createOrUpdateSubscription = async (subscriptionData: Partial<Subscription>) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Database not configured - subscription features unavailable')
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user?.id,
          ...subscriptionData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setSubscription(data)
      return data
    } catch (err) {
      console.error('Error updating subscription:', err)
      throw err
    }
  }

  const cancelSubscription = async () => {
    if (!subscription) return

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Database not configured - subscription features unavailable')
      }

      // Call Stripe to cancel subscription
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      // Update local state
      await fetchSubscription()
    } catch (err) {
      console.error('Error canceling subscription:', err)
      throw err
    }
  }

  return {
    subscription,
    loading,
    error,
    fetchSubscription,
    createOrUpdateSubscription,
    cancelSubscription,
    hasActiveSubscription: subscription?.status === 'active',
    isTrialing: subscription?.status === 'trialing',
    isPastDue: subscription?.status === 'past_due',
    isSupabaseConfigured
  }
}