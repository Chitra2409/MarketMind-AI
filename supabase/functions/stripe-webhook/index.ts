import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.15.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Get Stripe keys from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    let event

    if (webhookSecret && signature) {
      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return new Response(
          JSON.stringify({ error: 'Webhook signature verification failed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          },
        )
      }
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body)
    }
    
    console.log('Stripe webhook received:', event.type, event.id)
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        // Handle successful payment
        break
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        // Handle failed payment
        break
        
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object.id)
        // Handle new subscription
        break
        
      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id)
        // Handle subscription changes
        break
        
      case 'customer.subscription.deleted':
        console.log('Subscription cancelled:', event.data.object.id)
        // Handle subscription cancellation
        break
        
      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded:', event.data.object.id)
        // Handle successful recurring payment
        break
        
      case 'invoice.payment_failed':
        console.log('Invoice payment failed:', event.data.object.id)
        // Handle failed recurring payment
        break
        
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object.id)
        // Handle successful checkout
        const session = event.data.object
        if (session.mode === 'subscription') {
          console.log('Subscription checkout completed for customer:', session.customer)
        }
        break
        
      default:
        console.log('Unhandled event type:', event.type)
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        received: true,
        eventType: event.type,
        eventId: event.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})