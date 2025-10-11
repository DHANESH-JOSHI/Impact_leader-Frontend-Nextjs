import { SystemMonitoringService } from '@/services/systemMonitoringService';

// Middleware to track API hits and response times
export function createAPITrackingMiddleware() {
  return function trackAPI(req, res, next) {
    const startTime = Date.now();
    
    // Increment active connections
    SystemMonitoringService.incrementConnections();
    
    // Track when response finishes
    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Track the API hit with response time
      SystemMonitoringService.trackAPIHit(responseTime);
      
      // Decrement active connections
      SystemMonitoringService.decrementConnections();
    });
    
    // Handle connection close (e.g., client disconnects)
    res.on('close', () => {
      SystemMonitoringService.decrementConnections();
    });
    
    if (next) {
      next();
    }
  };
}

// Next.js API route wrapper for tracking
export function withAPITracking(handler) {
  return async function trackedHandler(req, res) {
    const startTime = Date.now();
    const route = req.url || '';
    const method = req.method || 'GET';
    
    // Increment active connections
    SystemMonitoringService.incrementConnections();
    
    try {
      // Execute the actual API handler
      const result = await handler(req, res);
      
      // Track successful API hit with route info
      const responseTime = Date.now() - startTime;
      SystemMonitoringService.trackAPIHit(responseTime, route, method);
      
      return result;
    } catch (error) {
      // Track failed API hit with route info
      const responseTime = Date.now() - startTime;
      SystemMonitoringService.trackAPIHit(responseTime, route, method);
      throw error;
    } finally {
      // Decrement active connections
      SystemMonitoringService.decrementConnections();
    }
  };
}
