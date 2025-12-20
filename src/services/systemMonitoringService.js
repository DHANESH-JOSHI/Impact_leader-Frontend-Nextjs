import { apiClient } from '@/lib/apiClient';

// Global variables to track API metrics
let apiHitCount = 0;
let apiHitsPerSecond = 0;
let lastSecondTimestamp = Date.now();
let totalRequests = 0;
let activeConnections = 0;
let responseTimeHistory = [];

// API Categories tracking
let apiCategoryHits = {
  authentication: { hits: 0, routes: [], lastHit: null },
  otp: { hits: 0, routes: [], lastHit: null },
  meetings: { hits: 0, routes: [], lastHit: null },
  users: { hits: 0, routes: [], lastHit: null },
  posts: { hits: 0, routes: [], lastHit: null },
  stories: { hits: 0, routes: [], lastHit: null },
  connections: { hits: 0, routes: [], lastHit: null },
  notifications: { hits: 0, routes: [], lastHit: null },
  qa: { hits: 0, routes: [], lastHit: null },
  resources: { hits: 0, routes: [], lastHit: null },
  directory: { hits: 0, routes: [], lastHit: null },
  messages: { hits: 0, routes: [], lastHit: null },
  admin: { hits: 0, routes: [], lastHit: null },
  system: { hits: 0, routes: [], lastHit: null },
  monitoring: { hits: 0, routes: [], lastHit: null }
};

// Real-time API hits (last 60 seconds)
let recentAPIHits = [];

export class SystemMonitoringService {
  // Categorize API route
  static categorizeRoute(route) {
    if (route.includes('/api/v1/auth/otp')) return 'otp';
    if (route.includes('/api/v1/auth')) return 'authentication';
    if (route.includes('/api/v1/meetings')) return 'meetings';
    if (route.includes('/api/v1/users')) return 'users';
    if (route.includes('/api/v1/posts')) return 'posts';
    if (route.includes('/api/v1/stories')) return 'stories';
    if (route.includes('/api/v1/connections')) return 'connections';
    if (route.includes('/api/v1/notifications')) return 'notifications';
    if (route.includes('/api/v1/qa')) return 'qa';
    if (route.includes('/api/v1/resources')) return 'resources';
    if (route.includes('/api/v1/directory')) return 'directory';
    if (route.includes('/api/v1/messages')) return 'messages';
    if (route.includes('/api/v1/admin')) return 'admin';
    if (route.includes('/api/monitoring')) return 'monitoring';
    if (route.includes('/health') || route.includes('/api/v1/status') || route.includes('/api/v1/test')) return 'system';
    return 'other';
  }


  // Track API hits with route information
  static trackAPIHit(responseTime = null, route = '', method = 'GET') {
    const now = Date.now();
    apiHitCount++;
    totalRequests++;
    
    // Categorize and track route
    const category = this.categorizeRoute(route);
    if (apiCategoryHits[category]) {
      apiCategoryHits[category].hits++;
      apiCategoryHits[category].lastHit = now;
      
      // Track unique routes
      const routeInfo = `${method} ${route}`;
      if (!apiCategoryHits[category].routes.find(r => r.route === routeInfo)) {
        apiCategoryHits[category].routes.push({
          route: routeInfo,
          hits: 1,
          lastHit: now
        });
      } else {
        const existingRoute = apiCategoryHits[category].routes.find(r => r.route === routeInfo);
        existingRoute.hits++;
        existingRoute.lastHit = now;
      }
    }
    
    // Add to recent hits
    recentAPIHits.push({
      timestamp: now,
      route,
      method,
      category,
      responseTime
    });
    
    // Keep only last 60 seconds
    recentAPIHits = recentAPIHits.filter(hit => now - hit.timestamp < 60000);
    
    // Reset counter every second
    if (now - lastSecondTimestamp >= 1000) {
      apiHitsPerSecond = apiHitCount;
      apiHitCount = 0;
      lastSecondTimestamp = now;
    }
    
    // Track response times
    if (responseTime) {
      responseTimeHistory.push(responseTime);
      if (responseTimeHistory.length > 100) {
        responseTimeHistory = responseTimeHistory.slice(-100);
      }
    }
  }


  // Increment active connections
  static incrementConnections() {
    activeConnections++;
  }


  // Decrement active connections
  static decrementConnections() {
    activeConnections--;
    if (activeConnections < 0) activeConnections = 0;
  }

  static async getAPIAnalytics() {
    try {
      // Calculate average response time
      const avgResponseTime = responseTimeHistory.length > 0 
        ? responseTimeHistory.reduce((a, b) => a + b, 0) / responseTimeHistory.length 
        : 0;

      // Get top APIs by hits
      const topAPIs = Object.entries(apiCategoryHits)
        .map(([category, data]) => ({
          category,
          ...data,
          routes: data.routes.sort((a, b) => b.hits - a.hits).slice(0, 5)
        }))
        .sort((a, b) => b.hits - a.hits);

      // Recent activity (last 60 seconds)
      const recentActivity = recentAPIHits.slice(-20).reverse();

      return {
        success: true,
        data: {
          // Summary
          summary: {
            totalRequests,
            hitsPerSecond: apiHitsPerSecond,
            averageResponseTime: Math.round(avgResponseTime),
            activeConnections,
            categoriesActive: Object.keys(apiCategoryHits).filter(cat => apiCategoryHits[cat].hits > 0).length
          },
          
          // Categories breakdown
          categories: topAPIs,
          
          // Recent API hits
          recentActivity,
          
          // Performance
          performance: {
            responseTimeHistory: responseTimeHistory.slice(-20),
            hitsPerSecondHistory: [] // Will be populated in real-time endpoint
          },
          
          // Timestamp
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('API analytics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Calculate CPU usage
  static async calculateCPUUsage() {
    return new Promise((resolve) => {
      const startMeasures = os.cpus().map(cpu => ({
        idle: cpu.times.idle,
        total: Object.values(cpu.times).reduce((a, b) => a + b, 0)
      }));

      setTimeout(() => {
        const endMeasures = os.cpus().map(cpu => ({
          idle: cpu.times.idle,
          total: Object.values(cpu.times).reduce((a, b) => a + b, 0)
        }));

        const usage = startMeasures.map((start, i) => {
          const end = endMeasures[i];
          const idleDiff = end.idle - start.idle;
          const totalDiff = end.total - start.total;
          return 100 - (100 * idleDiff / totalDiff);
        });

        const avgUsage = usage.reduce((a, b) => a + b, 0) / usage.length;
        resolve(Math.round(avgUsage * 100) / 100);
      }, 100);
    });
  }


  // Mock disk usage - in production, use a proper disk usage library
  static getDiskUsage() {
    // Simulate disk usage
    const total = 500 * 1024 * 1024 * 1024; // 500GB
    const used = Math.random() * total * 0.7; // Random usage up to 70%
    const free = total - used;

    return {
      total,
      used,
      free,
      usage: (used / total) * 100,
    };
  }

  static async getRealTimeMetrics() {
    try {
      const now = Date.now();
      
      // Ensure we have current API hits per second
      if (now - lastSecondTimestamp >= 1000) {
        apiHitsPerSecond = apiHitCount;
        apiHitCount = 0;
        lastSecondTimestamp = now;
      }

      return {
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          api: {
            hitsPerSecond: apiHitsPerSecond,
            totalRequests,
            activeConnections,
          },
          recentHits: recentAPIHits.slice(-10),
        }
      };
    } catch (error) {
      console.error('Real-time API metrics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static getAPIMetrics() {
    try {
      return {
        success: true,
        data: {
          hitsPerSecond: apiHitsPerSecond,
          totalRequests,
          activeConnections,
          averageResponseTime: responseTimeHistory.length > 0 
            ? Math.round(responseTimeHistory.reduce((a, b) => a + b, 0) / responseTimeHistory.length)
            : 0,
          responseTimeHistory: responseTimeHistory.slice(-50),
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('API metrics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSystemMonitoringFromAPI() {
    try {
      console.log('🔧 SystemMonitoring: Making API call (token will be automatically injected by ExternalApiService)');

      const response = await apiClient.get(MONITORING.SYSTEM.HEALTH || '/admin/monitoring/system');
      const backendResponse = response.data || {};
      
      console.log('🔧 SystemMonitoring: API Response:', {
        success: response.success,
        status: response.status,
        message: response.message
      });
      
      if (!response.success) {
        return {
          success: false,
          message: backendResponse.message || response.message || 'Failed to get system monitoring data'
        };
      }

      return {
        success: true,
        data: backendResponse.data || backendResponse
      };
    } catch (error) {
      console.error('System monitoring API error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAPIAnalyticsFromAPI() {
    try {

      const response = await apiClient.get(MONITORING.API.ANALYTICS || '/admin/monitoring/api-analytics');
      const backendResponse = response.data || {};
      
      if (!response.success) {
        return {
          success: false,
          message: backendResponse.message || response.message || 'Failed to get API analytics data'
        };
      }

      return {
        success: true,
        data: backendResponse.data || backendResponse
      };
    } catch (error) {
      console.error('API analytics API error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getCombinedMonitoringData() {
    try {
      // Get local analytics
      const localAnalytics = await this.getAPIAnalytics();
      
      // Get API monitoring data
      const systemData = await this.getSystemMonitoringFromAPI();
      const apiData = await this.getAPIAnalyticsFromAPI();

      return {
        success: true,
        data: {
          local: localAnalytics.success ? localAnalytics.data : null,
          external: {
            system: systemData.success ? systemData.data : null,
            api: apiData.success ? apiData.data : null
          },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Combined monitoring data error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }


  // Test method to verify token and API connectivity
  static async testAPIConnection() {
    try {
      console.log('🔧 Testing API Connection (ExternalApiService will handle authentication automatically)...');

      // Test a simple endpoint first
      const response = await apiClient.get(AUTH.ME);
      const backendResponse = response.data || {};
      
      return {
        success: response.success,
        message: response.success ? 'API connection successful' : backendResponse.message || response.message,
        debug: {
          hasToken: true,
          apiResponse: {
            success: response.success,
            status: response.status,
            message: backendResponse.message || response.message
          }
        }
      };
    } catch (error) {
      console.error('API connection test error:', error);
      return {
        success: false,
        message: error.message,
        debug: {
          error: error.message
        }
      };
    }
  }

}
