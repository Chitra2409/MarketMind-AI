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
    const { planId, customerEmail, customerId, successUrl, cancelUrl } = await req.json()
    
    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    // Map plan IDs to Stripe price IDs
    const priceMap = {
      'basic': 'price_basic_monthly',
      'pro': 'price_pro_monthly', 
      'enterprise': 'price_enterprise_monthly'
    }

    const priceId = priceMap[planId as keyof typeof priceMap]
    if (!priceId) {
      throw new Error('Invalid plan ID')
    }

    let customer = customerId

    // Create customer if not provided
    if (!customer && customerEmail) {
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          platform: 'MarketMind AI',
          planId: planId
        }
      })
      customer = newCustomer.id
    }

    if (!customer) {
      throw new Error('Customer ID or email required')
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/dashboard`,
      metadata: {
        planId: planId,
        platform: 'MarketMind AI'
      },
      subscription_data: {
        metadata: {
          planId: planId,
          platform: 'MarketMind AI'
        }
      }
    })

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        customerId: customer,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})