import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  permissions: string[];
}

export function useAuth() {
  const { user, isLoaded } = useUser();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    permissions: []
  });

  useEffect(() => {
    if (isLoaded) {
      setAuthState({
        isAuthenticated: !!user,
        isLoading: false,
        user: user,
        permissions: user?.publicMetadata?.permissions as string[] || []
      });
    }
  }, [user, isLoaded]);

  const hasPermission = (permission: string) => {
    return authState.permissions.includes(permission) || authState.permissions.includes('admin');
  };

  const logout = async () => {
    // Clerk handles logout
    window.location.href = '/';
  };

  return {
    ...authState,
    hasPermission,
    logout
  };
}