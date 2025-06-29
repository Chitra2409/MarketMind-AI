import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Competition Alert',
      message: 'Slack has announced new AI features that may impact our market position.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Report Generated',
      message: 'Weekly Competitive Analysis report is ready for download.',
      timestamp: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'New Trend Detected',
      message: 'Rising interest in AI-powered productivity tools detected.',
      timestamp: '6 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const colors = getColors(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${colors}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}