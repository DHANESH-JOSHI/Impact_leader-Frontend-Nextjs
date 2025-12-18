"use client";

import { useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

/**
 * ApiClientProvider - Initializes apiClient with token getter
 * This component should be rendered once in the app to setup automatic token injection
 */
export default function ApiClientProvider({ children }) {
  useEffect(() => {
    // Setup token getter function that reads from cookie
    apiClient.setTokenGetter(() => {
      if (typeof document !== 'undefined') {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('authToken='))
          ?.split('=')[1];
        return token || null;
      }
      return null;
    });

    console.log('[ApiClientProvider] Token getter initialized');
  }, []);

  return <>{children}</>;
}
