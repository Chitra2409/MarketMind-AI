import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.15.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subscriptionId } = await req.json()
    
    if (!subscriptionId) {
      throw new Error('Subscription ID is required')
    }

    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price', 'customer']
    })

    return new Response(
      JSON.stringify({
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        customer: subscription.customer,
        items: subscription.items.data.map(item => ({
          id: item.id,
          price: {
            id: item.price.id,
            unit_amount: item.price.unit_amount,
            currency: item.price.currency,
            recurring: item.price.recurring
          }
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})