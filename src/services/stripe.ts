import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = (publishableKey?: string) => {
  if (!stripePromise) {
    const key = publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Stripe publishable key not found');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  priceId?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals and small teams',
    price: 29,
    currency: 'usd',
    interval: 'month',
    priceId: 'price_basic_monthly',
    features: [
      '3 AI Agents',
      '100 Queries/month',
      '10 Reports/month',
      'Email Support',
      'Basic Analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: 99,
    currency: 'usd',
    interval: 'month',
    popular: true,
    priceId: 'price_pro_monthly',
    features: [
      '5 AI Agents',
      'Unlimited Queries',
      'Unlimited Reports',
      'Priority Support',
      'Advanced Analytics',
      'Custom Integrations',
      'Team Collaboration'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 299,
    currency: 'usd',
    interval: 'month',
    priceId: 'price_enterprise_monthly',
    features: [
      'Unlimited AI Agents',
      'Unlimited Everything',
      'Dedicated Support',
      'Custom AI Models',
      'White-label Options',
      'SLA Guarantee',
      'On-premise Deployment'
    ]
  }
];

// Check if we're in test mode
const isTestMode = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  return !key || key.includes('test') || key.includes('pk_test');
};

export class StripeService {
  private stripe: Stripe | null = null;
  private publishableKey: string;
  private baseUrl: string;

  constructor(publishableKey: string, baseUrl?: string) {
    this.publishableKey = publishableKey;
    this.baseUrl = baseUrl || window.location.origin;
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await getStripe(this.publishableKey);
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>): Promise<PaymentIntent> {
    try {
      // In test mode, create a mock payment intent for demonstration
      if (isTestMode()) {
        return {
          id: `pi_test_${Date.now()}`,
          amount: amount * 100,
          currency,
          status: 'requires_payment_method',
          client_secret: `pi_test_${Date.now()}_secret_test`
        };
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency,
          metadata: {
            platform: 'MarketMind AI',
            ...metadata
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(clientSecret: string, paymentMethod: any) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });
  }

  async createSubscription(planId: string, customerEmail?: string, customerId?: string) {
    try {
      // In test mode, redirect to a demo Stripe Checkout page
      if (isTestMode()) {
        const plan = subscriptionPlans.find(p => p.id === planId);
        if (!plan) {
          throw new Error('Invalid plan selected');
        }

        // Create a demo Stripe Checkout session URL
        const demoCheckoutUrl = this.createDemoCheckoutUrl(plan, customerEmail);
        
        return {
          sessionId: `cs_test_${Date.now()}`,
          url: demoCheckoutUrl,
          customerId: customerId || `cus_test_${Date.now()}`
        };
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          planId,
          customerEmail,
          customerId,
          successUrl: `${this.baseUrl}/dashboard?subscription=success`,
          cancelUrl: `${this.baseUrl}/dashboard?subscription=cancelled`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  private createDemoCheckoutUrl(plan: SubscriptionPlan, customerEmail?: string): string {
    // Create a demo Stripe Checkout URL for testing
    const params = new URLSearchParams({
      'prefilled_email': customerEmail || '',
      'client_reference_id': `demo_${Date.now()}`,
      'success_url': `${this.baseUrl}/dashboard?subscription=success&session_id=cs_test_demo`,
      'cancel_url': `${this.baseUrl}/dashboard?subscription=cancelled`,
      'mode': 'subscription',
      'line_items[0][price]': plan.priceId || 'price_demo',
      'line_items[0][quantity]': '1'
    });

    // Use Stripe's demo checkout page for testing
    return `https://checkout.stripe.com/c/pay/cs_test_demo#${params.toString()}`;
  }

  async getCustomerPortalUrl(customerId: string) {
    try {
      // In test mode, return a demo portal URL
      if (isTestMode()) {
        return `https://billing.stripe.com/p/login/test_demo?return_url=${encodeURIComponent(this.baseUrl + '/dashboard')}`;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-customer-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${this.baseUrl}/dashboard`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get customer portal URL');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      throw error;
    }
  }

  async retrieveSubscription(subscriptionId: string) {
    try {
      // In test mode, return mock subscription data
      if (isTestMode()) {
        return {
          id: subscriptionId,
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
          customer: `cus_test_${Date.now()}`,
          items: [{
            id: `si_test_${Date.now()}`,
            price: {
              id: 'price_test',
              unit_amount: 9900,
              currency: 'usd',
              recurring: { interval: 'month' }
            }
          }]
        };
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-get-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retrieve subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      // In test mode, return mock cancellation response
      if (isTestMode()) {
        return {
          id: subscriptionId,
          status: 'canceled',
          cancel_at_period_end: true,
          canceled_at: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
        };
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Check if we're in test mode
  isTestMode(): boolean {
    return isTestMode();
  }
}

// Utility functions
export const formatPrice = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === planId);
};