import { useState, useEffect } from 'react';

export interface AppSettings {
  // General Settings
  autoRefresh: boolean;
  refreshInterval: number;
  defaultView: string;
  compactMode: boolean;
  
  // Notification Settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  insightAlerts: boolean;
  reportNotifications: boolean;
  weeklyDigest: boolean;
  
  // Agent Settings
  maxConcurrentAgents: number;
  agentTimeout: number;
  autoRetry: boolean;
  confidenceThreshold: number;
  
  // Data Settings
  dataRetention: number;
  exportFormat: string;
  backupEnabled: boolean;
  
  // Privacy Settings
  analyticsEnabled: boolean;
  shareUsageData: boolean;
  publicProfile: boolean;
  
  // Appearance
  theme: string;
  fontSize: string;
  sidebarCollapsed: boolean;
  animations: boolean;
}

const defaultSettings: AppSettings = {
  autoRefresh: true,
  refreshInterval: 30,
  defaultView: 'dashboard',
  compactMode: false,
  emailNotifications: true,
  pushNotifications: true,
  insightAlerts: true,
  reportNotifications: true,
  weeklyDigest: true,
  maxConcurrentAgents: 5,
  agentTimeout: 300,
  autoRetry: true,
  confidenceThreshold: 75,
  dataRetention: 90,
  exportFormat: 'pdf',
  backupEnabled: true,
  analyticsEnabled: true,
  shareUsageData: false,
  publicProfile: false,
  theme: 'light', // Default to light theme
  fontSize: 'medium',
  sidebarCollapsed: false,
  animations: true
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('marketmind-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove any existing theme classes
    root.classList.remove('dark');
    body.classList.remove('dark');
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else if (settings.theme === 'auto') {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        body.classList.add('dark');
      }
    }
    // For 'light' theme, we don't add any class (default)

    // Apply font size
    root.style.fontSize = settings.fontSize === 'small' ? '14px' : 
                         settings.fontSize === 'large' ? '18px' : '16px';

    // Apply animations
    if (!settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
    }

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [settings.theme, settings.fontSize, settings.animations, settings.compactMode]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('marketmind-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('marketmind-settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('marketmind-settings', JSON.stringify(defaultSettings));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `marketmind-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSettings = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          updateSettings(imported);
          resolve();
        } catch (error) {
          reject(new Error('Invalid settings file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    settings,
    isLoading,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings
  };
}