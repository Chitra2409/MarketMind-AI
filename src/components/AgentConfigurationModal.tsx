import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';
import { Agent } from '../types';

interface AgentConfigurationModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agentId: string, config: Partial<Agent>) => void;
}

export function AgentConfigurationModal({ agent, isOpen, onClose, onSave }: AgentConfigurationModalProps) {
  const [config, setConfig] = useState({
    name: agent?.name || '',
    description: agent?.description || '',
    isEnabled: agent?.isEnabled || false,
    scanFrequency: 'hourly',
    dataSource: 'all',
    confidenceThreshold: 75,
    alertThreshold: 85
  });

  if (!isOpen || !agent) return null;

  const handleSave = () => {
    onSave(agent.id, {
      name: config.name,
      description: config.description,
      isEnabled: config.isEnabled
    });
    onClose();
  };

  const handleReset = () => {
    setConfig({
      name: agent.name,
      description: agent.description,
      isEnabled: agent.isEnabled,
      scanFrequency: 'hourly',
      dataSource: 'all',
      confidenceThreshold: 75,
      alertThreshold: 85
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Configure {agent.name}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Basic Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Basic Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={config.isEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, isEnabled: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                    Enable this agent
                  </label>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Advanced Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scan Frequency
                  </label>
                  <select
                    value={config.scanFrequency}
                    onChange={(e) => setConfig(prev => ({ ...prev, scanFrequency: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Sources
                  </label>
                  <select
                    value={config.dataSource}
                    onChange={(e) => setConfig(prev => ({ ...prev, dataSource: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Sources</option>
                    <option value="news">News & Blogs</option>
                    <option value="social">Social Media</option>
                    <option value="reports">Industry Reports</option>
                    <option value="competitors">Competitor Sites</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Threshold: {config.confidenceThreshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={config.confidenceThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, confidenceThreshold: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50%</span>
                    <span>95%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Threshold: {config.alertThreshold}%
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={config.alertThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}