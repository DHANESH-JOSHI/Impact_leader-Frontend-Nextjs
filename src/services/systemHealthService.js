import { apiClient } from '@/lib/apiClient';
import { HEALTH, ADMIN } from '@/constants/apiEndpoints';

export class SystemHealthService {
  static async healthCheck() {
    try {
      const response = await apiClient.get(HEALTH.CHECK, { skipAuth: true });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || (response.success ? 'System is healthy' : 'System health check failed'),
        status: response.status || (response.success ? 200 : 500)
      };
    } catch (error) {
      console.error('[SystemHealth] Health check error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getApiStatus() {
    try {
      const response = await apiClient.get(HEALTH.STATUS, { skipAuth: true });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get API status error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async testEndpoint() {
    try {
      const response = await apiClient.get(HEALTH.PING, { skipAuth: true });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Test endpoint error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getSystemDiagnostics() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_DIAGNOSTICS);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get system diagnostics error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getDatabaseHealth() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_DATABASE_HEALTH);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get database health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getRedisHealth() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_REDIS_HEALTH);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get Redis health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getEmailServiceHealth() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_EMAIL_HEALTH);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get email service health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getStorageHealth() {
    try {
      const response = await apiClient.get(ADMIN.SYSTEM_STORAGE_HEALTH);
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get storage health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getSystemMetrics(params = {}) {
    try {
      const { timeframe = '1h', metrics = 'all' } = params;

      const response = await apiClient.get(ADMIN.SYSTEM_METRICS, {
        params: { timeframe, metrics }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get system metrics error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getApiEndpointStats(params = {}) {
    try {
      const { timeframe = '24h', sortBy = 'requests' } = params;

      const response = await apiClient.get(ADMIN.SYSTEM_API_STATS, {
        params: { timeframe, sortBy }
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get API endpoint stats error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async clearSystemCache(cacheType = 'all') {
    try {
      const response = await apiClient.post(ADMIN.SYSTEM_CACHE_CLEAR, {
        cacheType
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Clear system cache error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async restartSystemService(serviceName) {
    try {
      const response = await apiClient.post(ADMIN.SYSTEM_SERVICE_RESTART, {
        serviceName
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Restart system service error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async getSystemLogs(params = {}) {
    try {
      const {
        level = 'all',
        limit = 100,
        startDate,
        endDate,
        service = 'all'
      } = params;

      const queryParams = {
        level,
        limit: limit.toString(),
        service
      };

      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;

      const response = await apiClient.get(ADMIN.SYSTEM_LOGS, {
        params: queryParams
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Get system logs error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static async runHealthCheckSuite() {
    try {
      const [
        healthCheck,
        apiStatus,
        databaseHealth,
        redisHealth,
        emailHealth,
        storageHealth
      ] = await Promise.allSettled([
        this.healthCheck(),
        this.getApiStatus(),
        this.getDatabaseHealth(),
        this.getRedisHealth(),
        this.getEmailServiceHealth(),
        this.getStorageHealth()
      ]);

      const results = {
        overall: true,
        checks: {
          api: healthCheck.status === 'fulfilled' ? healthCheck.value : { success: false, message: 'Health check failed' },
          status: apiStatus.status === 'fulfilled' ? apiStatus.value : { success: false, message: 'API status check failed' },
          database: databaseHealth.status === 'fulfilled' ? databaseHealth.value : { success: false, message: 'Database check failed' },
          redis: redisHealth.status === 'fulfilled' ? redisHealth.value : { success: false, message: 'Redis check failed' },
          email: emailHealth.status === 'fulfilled' ? emailHealth.value : { success: false, message: 'Email service check failed' },
          storage: storageHealth.status === 'fulfilled' ? storageHealth.value : { success: false, message: 'Storage check failed' }
        },
        timestamp: new Date().toISOString()
      };

      results.overall = Object.values(results.checks).every(check => check.success);

      return {
        success: true,
        data: results,
        message: results.overall ? 'All systems operational' : 'Some systems have issues'
      };
    } catch (error) {
      console.error('[SystemHealth] Run health check suite error:', error);
      return {
        success: false,
        message: error.message,
        data: {
          overall: false,
          checks: {},
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  static async performanceTest(params = {}) {
    try {
      const { duration = 30, concurrency = 10, endpoint = '/health' } = params;

      const response = await apiClient.post(ADMIN.SYSTEM_PERFORMANCE_TEST, {
        duration,
        concurrency,
        endpoint
      });
      const backendResponse = response.data || {};

      return {
        success: response.success,
        data: backendResponse.data || backendResponse,
        message: backendResponse.message || response.message,
        status: response.status
      };
    } catch (error) {
      console.error('[SystemHealth] Performance test error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }

  static getHealthStatusColor(isHealthy) {
    return isHealthy ? '#10b981' : '#ef4444';
  }

  static getHealthStatusBadge(isHealthy) {
    return {
      text: isHealthy ? 'Healthy' : 'Issues',
      color: this.getHealthStatusColor(isHealthy),
      icon: isHealthy ? '✅' : '❌'
    };
  }

  static getLogLevels() {
    return [
      { value: 'all', label: 'All Levels' },
      { value: 'error', label: 'Error' },
      { value: 'warn', label: 'Warning' },
      { value: 'info', label: 'Info' },
      { value: 'debug', label: 'Debug' }
    ];
  }

  static getSystemServices() {
    return [
      { value: 'all', label: 'All Services' },
      { value: 'api', label: 'API Server' },
      { value: 'database', label: 'Database' },
      { value: 'redis', label: 'Redis Cache' },
      { value: 'email', label: 'Email Service' },
      { value: 'storage', label: 'File Storage' },
      { value: 'scheduler', label: 'Task Scheduler' }
    ];
  }

  static getCacheTypes() {
    return [
      { value: 'all', label: 'All Caches' },
      { value: 'user', label: 'User Data' },
      { value: 'posts', label: 'Posts Cache' },
      { value: 'resources', label: 'Resources Cache' },
      { value: 'session', label: 'Session Cache' },
      { value: 'analytics', label: 'Analytics Cache' }
    ];
  }

  static getMetricTypes() {
    return [
      { value: 'all', label: 'All Metrics' },
      { value: 'cpu', label: 'CPU Usage' },
      { value: 'memory', label: 'Memory Usage' },
      { value: 'disk', label: 'Disk Usage' },
      { value: 'network', label: 'Network I/O' },
      { value: 'database', label: 'Database Metrics' },
      { value: 'api', label: 'API Metrics' }
    ];
  }

  static getTimeframeOptions() {
    return [
      { value: '5m', label: 'Last 5 minutes' },
      { value: '15m', label: 'Last 15 minutes' },
      { value: '1h', label: 'Last hour' },
      { value: '6h', label: 'Last 6 hours' },
      { value: '24h', label: 'Last 24 hours' },
      { value: '7d', label: 'Last 7 days' }
    ];
  }
}
