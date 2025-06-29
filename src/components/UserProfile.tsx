import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, Settings, LogOut, Bell, Shield, Palette, HelpCircle, X, Crown, Activity, Download, History, CreditCard, ArrowLeft, Check, AlertCircle, Mail, Phone, Calendar, MapPin, Building, Globe } from 'lucide-react';
import { useQueryHistory } from '../hooks/useQueryHistory';
import { QueryHistoryModal } from './QueryHistoryModal';
import { useSettings } from '../hooks/useSettings';
import { useSubscription } from '../hooks/useSubscription';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onRerunQuery?: (query: string) => void;
}

export function UserProfile({ isOpen, onClose, onRerunQuery }: UserProfileProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { getRecentQueries, getQueryStats, exportHistory } = useQueryHistory();
  const { settings, updateSetting, exportSettings } = useSettings();
  const { subscription, hasActiveSubscription } = useSubscription();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showQueryHistory, setShowQueryHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      onClose();
      // Redirect will be handled by Clerk automatically
    } catch (error) {
      console.error('Error signing out:', error);
      showMessage('Failed to sign out. Please try again.', true);
    } finally {
      setIsLoading(false);
      setShowSignOutConfirm(false);
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };

  const handleEditProfile = () => {
    openUserProfile();
    onClose();
  };

  const recentQueries = getRecentQueries(5);
  const queryStats = getQueryStats();

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Export query history
      exportHistory();
      
      // Export settings
      exportSettings();
      
      showMessage('Data exported successfully!');
    } catch (error) {
      showMessage('Failed to export data', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (type: string, enabled: boolean) => {
    updateSetting(type as keyof typeof settings, enabled);
    showMessage(`${type.replace(/([A-Z])/g, ' $1').toLowerCase()} ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleThemeChange = (theme: string) => {
    updateSetting('theme', theme);
    showMessage(`Theme changed to ${theme}`);
  };

  const menuItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Edit Profile',
      action: handleEditProfile,
      description: 'Update your personal information'
    },
    {
      id: 'queries',
      icon: History,
      label: 'Query History',
      description: 'View and manage your research queries'
    },
    {
      id: 'billing',
      icon: CreditCard,
      label: 'Billing & Subscription',
      description: 'Manage your subscription and billing'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your notification preferences'
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Manage your account security settings'
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Appearance',
      description: 'Customize your dashboard theme'
    },
    {
      id: 'activity',
      icon: Activity,
      label: 'Activity Log',
      description: 'View your recent activity'
    },
    {
      id: 'export',
      icon: Download,
      label: 'Export Data',
      description: 'Download your research data'
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support'
    }
  ];

  const handleRerunQuery = (query: string) => {
    if (onRerunQuery) {
      onRerunQuery(query);
      onClose();
    }
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'queries':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Query Statistics</h4>
              <button
                onClick={() => setShowQueryHistory(true)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                View All History
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">{queryStats.total}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Queries</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="text-lg font-semibold text-green-900 dark:text-green-100">{queryStats.successRate}%</div>
                <div className="text-sm text-green-700 dark:text-green-300">Success Rate</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="text-lg font-semibold text-purple-900 dark:text-purple-100">{queryStats.totalInsights}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Insights Generated</div>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <div className="text-lg font-semibold text-orange-900 dark:text-orange-100">{queryStats.avgExecutionTime}ms</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Avg Response Time</div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Recent Queries</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentQueries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No queries yet</p>
                ) : (
                  recentQueries.map((query) => (
                    <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          "{query.query}"
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(query.timestamp).toLocaleDateString()}
                          </span>
                          {query.agent && (
                            <span className="text-xs text-purple-600 dark:text-purple-400">{query.agent}</span>
                          )}
                          {query.insightCount && (
                            <span className="text-xs text-green-600 dark:text-green-400">{query.insightCount} insights</span>
                          )}
                        </div>
                      </div>
                      {onRerunQuery && (
                        <button
                          onClick={() => handleRerunQuery(query.query)}
                          className="ml-2 p-1 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          title="Rerun query"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Subscription & Billing</h4>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-3 mb-3">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h5 className="font-semibold text-purple-900 dark:text-purple-100">
                    {hasActiveSubscription ? 'Premium Plan' : 'Free Plan'}
                  </h5>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {hasActiveSubscription ? '$99/month • Unlimited everything' : 'Limited features • Upgrade for more'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-700 dark:text-purple-300">Status:</span>
                  <span className={`font-medium ml-1 ${hasActiveSubscription ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {hasActiveSubscription ? 'Active' : 'Free'}
                  </span>
                </div>
                <div>
                  <span className="text-purple-700 dark:text-purple-300">Usage:</span>
                  <span className="font-medium text-purple-900 dark:text-purple-100 ml-1">
                    {hasActiveSubscription ? 'Unlimited' : '5/10 queries'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => window.open('/billing', '_blank')}
                className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">Manage Subscription</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Change plan, update payment method</div>
              </button>
              <button 
                onClick={() => window.open('/billing/history', '_blank')}
                className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">Billing History</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">View past invoices and payments</div>
              </button>
              <button 
                onClick={() => window.open('/usage', '_blank')}
                className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">Usage Analytics</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Monitor your API usage and limits</div>
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Notification Preferences</h4>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Get notified via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'insightAlerts', label: 'Insight Alerts', description: 'Notify when new insights are found' },
                { key: 'reportNotifications', label: 'Report Notifications', description: 'Notify when reports are ready' },
                { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary email' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={(e) => handleNotificationToggle(item.key, e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Privacy & Security</h4>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">Account Security</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Your account is secured with Clerk authentication. Manage your security settings below.
                </p>
                <button
                  onClick={handleEditProfile}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Manage Security Settings
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { key: 'analyticsEnabled', label: 'Analytics', description: 'Help improve the platform with usage analytics' },
                  { key: 'shareUsageData', label: 'Share Usage Data', description: 'Share anonymized usage data for research' },
                  { key: 'publicProfile', label: 'Public Profile', description: 'Make your profile visible to other users' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onChange={(e) => updateSetting(item.key as keyof typeof settings, e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Theme Settings</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Light', value: 'light' },
                { name: 'Dark', value: 'dark' },
                { name: 'Auto', value: 'auto' },
                { name: 'High Contrast', value: 'high-contrast' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.theme === theme.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing and padding</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => updateSetting('compactMode', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Animations</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enable smooth animations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.animations}
                  onChange={(e) => updateSetting('animations', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Recent Activity</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[
                { action: 'Generated Market Analysis Report', time: '2 hours ago', type: 'report' },
                { action: 'Configured Trend Analyst Agent', time: '4 hours ago', type: 'config' },
                { action: 'Queried competitor insights', time: '6 hours ago', type: 'query' },
                { action: 'Downloaded Weekly Report', time: '1 day ago', type: 'download' },
                { action: 'Updated notification settings', time: '2 days ago', type: 'settings' }
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'report' ? 'bg-blue-500' :
                      activity.type === 'config' ? 'bg-purple-500' :
                      activity.type === 'query' ? 'bg-green-500' :
                      activity.type === 'download' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Export Your Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download your research data, query history, and settings for backup or migration purposes.
            </p>
            
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What's included:</h5>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Query history and results</li>
                  <li>• Generated insights and reports</li>
                  <li>• Agent configurations</li>
                  <li>• Application settings</li>
                  <li>• Usage statistics</li>
                </ul>
              </div>
              
              <button
                onClick={handleExportData}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isLoading ? 'Exporting...' : 'Export All Data'}</span>
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Data will be exported as JSON files to your Downloads folder
              </p>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Help & Support</h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-900 dark:text-green-100">Need Help?</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Our support team is here to help you get the most out of MarketMind AI.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => window.open('mailto:support@marketmind.ai', '_blank')}
                  className="flex items-center space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Email Support</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">support@marketmind.ai</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/docs', '_blank')}
                  className="flex items-center space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Documentation</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">User guides and tutorials</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/community', '_blank')}
                  className="flex items-center space-x-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Community Forum</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Connect with other users</div>
                  </div>
                </button>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Version:</strong> 2.1.0<br />
                  <strong>Last Updated:</strong> January 27, 2025
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-sm">Select an option from the menu</div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Profile</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-600 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  {user.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {user.fullName || user.firstName || 'User'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => item.action ? item.action() : setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                        activeSection === item.id 
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Enhanced Sign Out Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleSignOutClick}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400 disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </span>
                </button>
                
                {/* Quick Sign Out Button */}
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Signed in as {user.primaryEmailAddress?.emailAddress}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Member since {new Date(user.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeSection ? (
                <div>
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to menu</span>
                  </button>
                  {renderSectionContent(activeSection)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {user.fullName || user.firstName || 'Welcome!'}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span>{hasActiveSubscription ? 'Premium Member' : 'Free Member'}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                    Member since {new Date(user.createdAt!).toLocaleDateString()}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{queryStats.total}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Queries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{queryStats.totalInsights}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Insights Generated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{queryStats.successRate}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>

                  {/* Quick Sign Out Button in Main View */}
                  <button
                    onClick={handleSignOutClick}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
              
              {/* Message Display */}
              {message && (
                <div className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg ${
                  message.includes('Failed') || message.includes('error') 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {message.includes('Failed') || message.includes('error') ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sign Out</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to sign out?</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You'll need to sign in again to access your MarketMind AI dashboard and research data.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QueryHistoryModal
        isOpen={showQueryHistory}
        onClose={() => setShowQueryHistory(false)}
        onRerunQuery={onRerunQuery}
      />
    </>
  );
}