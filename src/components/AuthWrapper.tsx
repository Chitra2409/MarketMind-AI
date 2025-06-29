import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Zap, LogIn, Mail } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                  <Zap className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MarketMind AI</h1>
              <p className="text-gray-600 mb-8">Multi-Agent Research Platform</p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Sign in to access your personalized AI research dashboard
                </p>
                
                <SignInButton mode="modal" forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
                    <Mail className="w-5 h-5" />
                    <span>Sign In with Email</span>
                  </button>
                </SignInButton>
                
                <div className="text-xs text-gray-400">
                  Note: Google OAuth is being configured. Please use email authentication for now.
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5+</div>
                    <div className="text-xs text-gray-500">AI Agents</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-xs text-gray-500">Monitoring</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">Real-time</div>
                    <div className="text-xs text-gray-500">Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        {children}
      </SignedIn>
    </>
  );
}