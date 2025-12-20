import { ExternalApiService } from "./externalApiService";

export class SystemHealthService {

  // Health check endpoint
  static async healthCheck() {
    try {
      const response = await ExternalApiService.healthCheck();

      return {
        success: response.success,
        data: response.data,
        message: response.message || (response.success ? 'System is healthy' : 'System health check failed'),
        status: response.status
      };
    } catch (error) {
      console.error('Health check error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // API status endpoint
  static async getApiStatus() {
    try {
      const response = await ExternalApiService.get('/status');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get API status error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Test endpoint
  static async testEndpoint() {
    try {
      const response = await ExternalApiService.get('/test');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Test endpoint error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Advanced system diagnostics
  static async getSystemDiagnostics() {
    try {
      const response = await ExternalApiService.get('/admin/system/diagnostics');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get system diagnostics error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Database health check
  static async getDatabaseHealth() {
    try {
      const response = await ExternalApiService.get('/admin/system/database/health');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get database health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Redis health check
  static async getRedisHealth() {
    try {
      const response = await ExternalApiService.get('/admin/system/redis/health');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get Redis health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Email service health check
  static async getEmailServiceHealth() {
    try {
      const response = await ExternalApiService.get('/admin/system/email/health');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get email service health error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // File storage health check
  static async getStorageHealth() {
    try {
      const response = await ExternalApiService.get('/admin/system/storage/health');

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get storage health error:', error);
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

      let queryParams = new URLSearchParams({
        timeframe,
        metrics
      });

      const endpoint = `/admin/system/metrics?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get system metrics error:', error);
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

      let queryParams = new URLSearchParams({
        timeframe,
        sortBy
      });

      const endpoint = `/admin/system/api-stats?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get API endpoint stats error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Clear system cache
  static async clearSystemCache(cacheType = 'all') {
    try {
      const response = await ExternalApiService.post('/admin/system/cache/clear', {
        cacheType
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Clear system cache error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Restart system service
  static async restartSystemService(serviceName) {
    try {
      const response = await ExternalApiService.post('/admin/system/service/restart', {
        serviceName
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Restart system service error:', error);
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

      let queryParams = new URLSearchParams({
        level,
        limit: limit.toString(),
        service
      });

      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const endpoint = `/admin/system/logs?${queryParams.toString()}`;
      const response = await ExternalApiService.get(endpoint);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Get system logs error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Run system health check suite
  static async runHealthCheckSuite() {
    try {
      // Run all health checks in parallel
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

      // Determine overall health
      results.overall = Object.values(results.checks).every(check => check.success);

      return {
        success: true,
        data: results,
        message: results.overall ? 'All systems operational' : 'Some systems have issues'
      };
    } catch (error) {
      console.error('Run health check suite error:', error);
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


  // Performance test endpoint
  static async performanceTest(params = {}) {
    try {
      const { duration = 30, concurrency = 10, endpoint = '/health' } = params;

      const response = await ExternalApiService.post('/admin/system/performance-test', {
        duration,
        concurrency,
        endpoint
      });

      return {
        success: response.success,
        data: response.data,
        message: response.message,
        status: response.status
      };
    } catch (error) {
      console.error('Performance test error:', error);
      return {
        success: false,
        message: error.message,
        status: 500
      };
    }
  }


  // Static helper methods
  static getHealthStatusColor(isHealthy) {
    return isHealthy ? '#10b981' : '#ef4444'; // green-500 : red-500
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