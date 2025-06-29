import React from 'react';
import { DivideIcon as LucideIcon, Power, Settings, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  insights: number;
  color: string;
  isEnabled: boolean;
  processingTask?: string;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
}

export function AgentCard({ 
  id, 
  name, 
  description, 
  icon: Icon, 
  status, 
  lastActivity, 
  insights, 
  color, 
  isEnabled,
  processingTask,
  onToggle,
  onConfigure
}: AgentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          dot: 'bg-green-500',
          label: 'Active',
          icon: CheckCircle
        };
      case 'processing': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          dot: 'bg-blue-500 animate-pulse',
          label: 'Processing',
          icon: Activity
        };
      case 'error':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          dot: 'bg-red-500',
          label: 'Error',
          icon: AlertCircle
        };
      default: 
        return { 
          color: 'bg-gray-100 text-gray-600 border-gray-200', 
          dot: 'bg-gray-400',
          label: 'Idle',
          icon: Activity
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const handleToggle = () => {
    onToggle(id);
  };

  const handleConfigure = () => {
    onConfigure(id);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg ${
      !isEnabled ? 'opacity-60' : 'hover:scale-[1.02]'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} ${!isEnabled ? 'grayscale' : ''} transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center space-x-1`}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusConfig.label}</span>
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
      
      {processingTask && status === 'processing' && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-800 font-medium">Current Task:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">{processingTask}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="text-gray-500">
          Last: {lastActivity}
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-medium text-gray-900">{insights}</span>
          <span className="text-gray-500">insights</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isEnabled 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105' 
              : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isEnabled ? 'Disable' : 'Enable'}</span>
        </button>
        
        <button
          onClick={handleConfigure}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
          <span>Configure</span>
        </button>
      </div>
    </div>
  );
}