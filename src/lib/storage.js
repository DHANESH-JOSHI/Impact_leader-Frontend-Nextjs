/**
 * Centralized Storage Utility
 * Handles localStorage, sessionStorage with error handling and type safety
 */

class StorageManager {
  constructor(storageType = 'localStorage') {
    this.storage = typeof window !== 'undefined'
      ? window[storageType]
      : null;
    this.storageType = storageType;
  }

  /**
   * Check if storage is available
   */
  isAvailable() {
    if (!this.storage) return false;

    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @param {Object} options - Additional options
   * @param {number} options.expiresIn - Expiration time in milliseconds
   */
  set(key, value, options = {}) {
    if (!this.isAvailable()) {
      console.warn(`[Storage] ${this.storageType} not available`);
      return false;
    }

    try {
      const data = {
        value,
        timestamp: Date.now(),
        ...(options.expiresIn && { expiresAt: Date.now() + options.expiresIn }),
      };

      this.storage.setItem(key, JSON.stringify(data));
      console.log(`[Storage] Set: ${key}`);
      return true;
    } catch (error) {
      console.error(`[Storage] Error setting ${key}:`, error);
      return false;
    }
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable()) {
      console.warn(`[Storage] ${this.storageType} not available`);
      return defaultValue;
    }

    try {
      const item = this.storage.getItem(key);

      if (!item) {
        return defaultValue;
      }

      const data = JSON.parse(item);

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        console.log(`[Storage] Expired: ${key}`);
        this.remove(key);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error(`[Storage] Error getting ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key) {
    if (!this.isAvailable()) {
      console.warn(`[Storage] ${this.storageType} not available`);
      return false;
    }

    try {
      this.storage.removeItem(key);
      console.log(`[Storage] Removed: ${key}`);
      return true;
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  clear() {
    if (!this.isAvailable()) {
      console.warn(`[Storage] ${this.storageType} not available`);
      return false;
    }

    try {
      this.storage.clear();
      console.log(`[Storage] Cleared all items`);
      return true;
    } catch (error) {
      console.error(`[Storage] Error clearing:`, error);
      return false;
    }
  }

  /**
   * Get all keys from storage
   */
  keys() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error(`[Storage] Error getting keys:`, error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  has(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      console.error(`[Storage] Error checking key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get multiple items at once
   */
  getMultiple(keys, defaultValue = null) {
    return keys.reduce((acc, key) => {
      acc[key] = this.get(key, defaultValue);
      return acc;
    }, {});
  }

  /**
   * Set multiple items at once
   */
  setMultiple(items, options = {}) {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value, options);
    });
  }

  /**
   * Remove multiple items at once
   */
  removeMultiple(keys) {
    keys.forEach(key => this.remove(key));
  }
}

// Storage Keys Constants
export const STORAGE_KEYS = {
  // Auth related
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  IMPACT_LEADERS_AUTH: 'impactLeadersAuth',

  // App settings
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  SIDEBAR_STATE: 'sidebar_collapsed',

  // User preferences
  USER_PREFERENCES: 'user_preferences',
  DASHBOARD_LAYOUT: 'dashboard_layout',

  // Cache
  CACHE_PREFIX: 'cache_',
};

// Create singleton instances
export const localStorage = new StorageManager('localStorage');
export const sessionStorage = new StorageManager('sessionStorage');

// Export class for creating custom instances
export { StorageManager };

// Helper functions for auth token management
export const authStorage = {
  /**
   * Save auth tokens
   */
  saveTokens(tokens) {
    localStorage.set(STORAGE_KEYS.IMPACT_LEADERS_AUTH, tokens);
  },

  /**
   * Get auth tokens
   */
  getTokens() {
    return localStorage.get(STORAGE_KEYS.IMPACT_LEADERS_AUTH, {
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  /**
   * Clear auth tokens
   */
  clearTokens() {
    localStorage.remove(STORAGE_KEYS.IMPACT_LEADERS_AUTH);
  },

  /**
   * Get access token only
   */
  getAccessToken() {
    try {
    const tokens = this.getTokens();
      const token = tokens?.accessToken || tokens?.token || null;
      if (!token) {
        console.warn('[AuthStorage] No access token found in storage');
      }
      return token;
    } catch (error) {
      console.error('[AuthStorage] Error getting access token:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const tokens = this.getTokens();
    return !!tokens.accessToken;
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    const tokens = this.getTokens();
    return tokens.user;
  },
};

// Helper functions for cache management
export const cacheStorage = {
  /**
   * Set cache with expiration
   */
  set(key, value, expiresIn = 5 * 60 * 1000) { // Default 5 minutes
    localStorage.set(`${STORAGE_KEYS.CACHE_PREFIX}${key}`, value, { expiresIn });
  },

  /**
   * Get cached value
   */
  get(key, defaultValue = null) {
    return localStorage.get(`${STORAGE_KEYS.CACHE_PREFIX}${key}`, defaultValue);
  },

  /**
   * Remove cached value
   */
  remove(key) {
    localStorage.remove(`${STORAGE_KEYS.CACHE_PREFIX}${key}`);
  },

  /**
   * Clear all cache
   */
  clearAll() {
    const keys = localStorage.keys();
    const cacheKeys = keys.filter(key => key.startsWith(STORAGE_KEYS.CACHE_PREFIX));
    localStorage.removeMultiple(cacheKeys);
  },
};
