import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Crown, Zap, Users, Shield, Star, ExternalLink, AlertCircle } from 'lucide-react';
import { subscriptionPlans, StripeService, formatPrice } from '../services/stripe';
import { useUser } from '@clerk/clerk-react';
import { useSubscription } from '../hooks/useSubscription';

interface StripePaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripePayment({ isOpen, onClose }: StripePaymentProps) {
  const { user } = useUser();
  const { subscription, loading: subscriptionLoading, hasActiveSubscription, fetchSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeService, setStripeService] = useState<StripeService | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      const service = new StripeService(publishableKey);
      setStripeService(service);
      setIsTestMode(service.isTestMode());
    }
  }, []);

  // Handle successful subscription from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const subscriptionStatus = urlParams.get('subscription');
    
    if (sessionId || subscriptionStatus === 'success') {
      // Refresh subscription data after successful payment
      fetchSubscription();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success message
      if (subscriptionStatus === 'success') {
        alert('Subscription activated successfully! Welcome to MarketMind AI Pro.');
      }
    }
  }, [fetchSubscription]);

  if (!isOpen) return null;

  const handleSubscribe = async (planId: string) => {
    if (!stripeService || !user?.primaryEmailAddress?.emailAddress) {
      alert('Please ensure you are logged in and Stripe is configured.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await stripeService.createSubscription(
        planId,
        user.primaryEmailAddress.emailAddress,
        undefined // Let Stripe create a new customer
      );

      if (result.url) {
        // Redirect to Stripe Checkout (or demo page in test mode)
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!stripeService) {
      alert('Stripe service not available.');
      return;
    }

    setIsLoading(true);
    try {
      const customerId = subscription?.stripe_customer_id || `cus_test_${Date.now()}`;
      const portalUrl = await stripeService.getCustomerPortalUrl(customerId);
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error accessing customer portal:', error);
      alert('Failed to access billing portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="w-8 h-8" />;
      case 'pro':
        return <Crown className="w-8 h-8" />;
      case 'enterprise':
        return <Shield className="w-8 h-8" />;
      default:
        return <Star className="w-8 h-8" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'enterprise':
        return 'from-gray-700 to-gray-800';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const currentPlan = subscription ? subscriptionPlans.find(p => p.id === subscription.plan_id) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Billing & Subscription
            </h3>
            {isTestMode && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                TEST MODE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Test Mode Notice */}
          {isTestMode && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Demo Mode Active</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This is a demonstration of the payment flow. No real charges will be made. 
                In production, this would redirect to actual Stripe Checkout pages.
              </p>
            </div>
          )}

          {/* Current Subscription Status */}
          {hasActiveSubscription && currentPlan && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                    {getPlanIcon(currentPlan.id)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Current Plan: {currentPlan.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscription.status === 'active' ? 'Active subscription' : `Status: ${subscription.status}`} • 
                      Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(currentPlan.price)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">per {currentPlan.interval}</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={handleManageBilling}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Manage Billing</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  <span>Active Subscription</span>
                </div>
              </div>
            </div>
          )}

          {/* No Subscription State */}
          {!subscriptionLoading && !hasActiveSubscription && (
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-gray-600 to-blue-600 rounded-lg text-white inline-flex mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Active Subscription
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Choose a plan below to unlock the full power of MarketMind AI
                </p>
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {hasActiveSubscription ? 'Upgrade or Change Plan' : 'Choose Your Plan'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => {
                const isCurrentPlan = subscription?.plan_id === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                      plan.popular
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : isCurrentPlan
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    {plan.popular && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${getPlanColor(plan.id)} text-white mb-4`}>
                        {getPlanIcon(plan.id)}
                      </div>
                      <h5 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {plan.name}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {formatPrice(plan.price)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/{plan.interval}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading || isCurrentPlan}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
                        isCurrentPlan
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                      }`}
                    >
                      {isLoading ? 'Processing...' : 
                       isCurrentPlan ? 'Current Plan' : 
                       hasActiveSubscription ? 'Switch to This Plan' : 
                       isTestMode ? 'Try Demo Checkout' : 'Choose Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage & Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Current Usage
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AI Queries</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveSubscription ? '247 / Unlimited' : '5 / 10 (Free)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reports Generated</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveSubscription ? '12 / Unlimited' : '2 / 3 (Free)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Agents</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveSubscription ? '5 / 5' : '2 / 2 (Free)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Data Storage</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {hasActiveSubscription ? '2.4 GB / 50 GB' : '0.1 GB / 1 GB (Free)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {hasActiveSubscription ? 'Billing History' : 'Subscription Benefits'}
              </h5>
              {hasActiveSubscription ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Jan 27, 2025</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{currentPlan?.name} Plan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {currentPlan ? formatPrice(currentPlan.price) : '$99.00'}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {isTestMode ? 'Demo' : 'Paid'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="w-full mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    View Full History
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unlimited AI-powered insights</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Advanced analytics & reporting</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Custom integrations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Team collaboration features</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
              <Shield className="w-5 h-5" />
              <span className="font-medium">
                {isTestMode ? 'Demo Payment Processing' : 'Secure Payment Processing'}
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {isTestMode 
                ? 'This is a demonstration of the payment flow. No real payments will be processed in test mode.'
                : 'All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers. Cancel anytime with no hidden fees.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}