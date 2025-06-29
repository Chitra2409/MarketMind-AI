import React, { useState, useRef } from 'react';
import { X, Save, RotateCcw, Bell, Shield, Palette, Database, Zap, Globe, Users, Brain, Upload, Download } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSetting, updateSettings, resetSettings, exportSettings, importSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('Saving settings...');
    
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    }, 1000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      resetSettings();
      setSaveMessage('Settings reset to defaults');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const handleExport = () => {
    exportSettings();
    setSaveMessage('Settings exported successfully!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importSettings(file);
        setSaveMessage('Settings imported successfully!');
        setTimeout(() => setSaveMessage(''), 2000);
      } catch (error) {
        setSaveMessage('Failed to import settings');
        setTimeout(() => setSaveMessage(''), 2000);
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'agents', label: 'Agents', icon: Brain },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Dashboard Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Refresh</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically refresh data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoRefresh}
                    onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Refresh Interval: {settings.refreshInterval} seconds
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>10s</span>
                    <span>300s</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default View</label>
                  <select
                    value={settings.defaultView}
                    onChange={(e) => updateSetting('defaultView', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="agents">Agents</option>
                    <option value="insights">Insights</option>
                    <option value="reports">Reports</option>
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
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'insightAlerts', label: 'Insight Alerts', desc: 'Notify when new insights are found' },
                  { key: 'reportNotifications', label: 'Report Notifications', desc: 'Notify when reports are ready' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary email' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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
        
      case 'agents':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Agent Configuration</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Concurrent Agents: {settings.maxConcurrentAgents}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.maxConcurrentAgents}
                    onChange={(e) => updateSetting('maxConcurrentAgents', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agent Timeout: {settings.agentTimeout} seconds
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="600"
                    value={settings.agentTimeout}
                    onChange={(e) => updateSetting('agentTimeout', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>60s</span>
                    <span>600s</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidence Threshold: {settings.confidenceThreshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={settings.confidenceThreshold}
                    onChange={(e) => updateSetting('confidenceThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Retry Failed Tasks</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically retry failed agent tasks</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoRetry}
                    onChange={(e) => updateSetting('autoRetry', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Data Management</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Retention: {settings.dataRetention} days
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="365"
                    value={settings.dataRetention}
                    onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>30 days</span>
                    <span>365 days</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format</label>
                  <select
                    value={settings.exportFormat}
                    onChange={(e) => updateSetting('exportFormat', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Automatic Backup</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically backup your data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.backupEnabled}
                    onChange={(e) => updateSetting('backupEnabled', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Settings Management</h5>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleExport}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Import</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Privacy Settings</h4>
              <div className="space-y-4">
                {[
                  { key: 'analyticsEnabled', label: 'Analytics', desc: 'Help improve the platform with usage analytics' },
                  { key: 'shareUsageData', label: 'Share Usage Data', desc: 'Share anonymized usage data for research' },
                  { key: 'publicProfile', label: 'Public Profile', desc: 'Make your profile visible to other users' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Theme & Display</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSetting('theme', theme)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                          settings.theme === theme
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Collapse Sidebar</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Start with sidebar collapsed</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => updateSetting('sidebarCollapsed', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Animations</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enable smooth animations and transitions</p>
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
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 border-r border-gray-200 dark:border-gray-600 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {renderTabContent()}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
            
            {saveMessage && (
              <span className={`text-sm ${
                saveMessage.includes('success') || saveMessage.includes('exported') || saveMessage.includes('imported') || saveMessage.includes('reset')
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {saveMessage}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}