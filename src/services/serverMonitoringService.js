import os from 'os';

// Global variables for server metrics history
let cpuHistory = [];
let memoryHistory = [];
let networkHistory = [];
let processHistory = [];

export class ServerMonitoringService {
  // Get comprehensive server metrics
  static async getServerMetrics() {
    try {
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      // Calculate CPU usage
      const cpuUsage = await this.calculateCPUUsage();
      
      // Get load averages
      const loadAvg = os.loadavg();
      
      // Network interfaces
      const networkInterfaces = os.networkInterfaces();
      
      // Process memory usage
      const processMemory = process.memoryUsage();
      
      // Server uptime
      const uptime = os.uptime();
      const processUptime = process.uptime();
      
      // Add to history arrays
      cpuHistory.push(cpuUsage);
      if (cpuHistory.length > 60) cpuHistory = cpuHistory.slice(-60);
      
      const memUsagePercent = (usedMem / totalMem) * 100;
      memoryHistory.push(memUsagePercent);
      if (memoryHistory.length > 60) memoryHistory = memoryHistory.slice(-60);
      
      // Mock network usage (in real app, you'd get actual network stats)
      const networkUsage = Math.random() * 100;
      networkHistory.push(networkUsage);
      if (networkHistory.length > 60) networkHistory = networkHistory.slice(-60);

      return {
        success: true,
        data: {
          // System Information
          system: {
            platform: os.platform(),
            architecture: os.arch(),
            hostname: os.hostname(),
            nodeVersion: process.version,
            uptime: uptime,
            processUptime: processUptime
          },
          
          // CPU Metrics
          cpu: {
            cores: cpus.length,
            usage: cpuUsage,
            model: cpus[0]?.model || 'Unknown',
            speed: cpus[0]?.speed || 0,
            loadAverage: {
              '1min': loadAvg[0],
              '5min': loadAvg[1],
              '15min': loadAvg[2],
            },
            history: cpuHistory.slice()
          },
          
          // Memory Metrics
          memory: {
            total: totalMem,
            used: usedMem,
            free: freeMem,
            usage: memUsagePercent,
            history: memoryHistory.slice(),
            process: {
              rss: processMemory.rss,
              heapTotal: processMemory.heapTotal,
              heapUsed: processMemory.heapUsed,
              external: processMemory.external,
              arrayBuffers: processMemory.arrayBuffers
            }
          },
          
          // Disk Usage (simulated)
          disk: {
            total: 500 * 1024 * 1024 * 1024, // 500GB
            used: Math.random() * 400 * 1024 * 1024 * 1024, // Random usage
            free: 0, // Will be calculated
            usage: 0 // Will be calculated
          },
          
          // Network Information
          network: {
            interfaces: Object.keys(networkInterfaces).length,
            interfaceDetails: networkInterfaces,
            usage: networkUsage,
            history: networkHistory.slice()
          },
          
          // Performance Overview
          performance: {
            cpuEfficiency: cpuUsage < 70 ? 'Good' : cpuUsage < 85 ? 'Fair' : 'Poor',
            memoryEfficiency: memUsagePercent < 70 ? 'Good' : memUsagePercent < 85 ? 'Fair' : 'Poor',
            overallHealth: this.calculateOverallHealth(cpuUsage, memUsagePercent, loadAvg[0])
          },
          
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Server monitoring error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Calculate CPU usage over a short period
  static async calculateCPUUsage() {
    return new Promise((resolve) => {
      const startMeasures = os.cpus().map(cpu => ({
        idle: cpu.times.idle,
        total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
      }));

      setTimeout(() => {
        const endMeasures = os.cpus().map(cpu => ({
          idle: cpu.times.idle,
          total: Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
        }));

        const percentageCPU = startMeasures.map((start, i) => {
          const end = endMeasures[i];
          const idleDiff = end.idle - start.idle;
          const totalDiff = end.total - start.total;
          return 100 - (100 * idleDiff / totalDiff) || 0;
        });

        const avgCPU = percentageCPU.reduce((acc, percent) => acc + percent, 0) / percentageCPU.length;
        resolve(Math.max(0, Math.min(100, avgCPU)));
      }, 100);
    });
  }

  // Calculate overall server health
  static calculateOverallHealth(cpuUsage, memoryUsage, loadAverage) {
    const cpuScore = cpuUsage < 50 ? 100 : cpuUsage < 70 ? 80 : cpuUsage < 85 ? 60 : 30;
    const memScore = memoryUsage < 50 ? 100 : memoryUsage < 70 ? 80 : memoryUsage < 85 ? 60 : 30;
    const loadScore = loadAverage < 1 ? 100 : loadAverage < 2 ? 80 : loadAverage < 3 ? 60 : 30;
    
    const overall = (cpuScore + memScore + loadScore) / 3;
    
    if (overall >= 80) return { status: 'Excellent', score: overall, color: '#10b981' };
    if (overall >= 60) return { status: 'Good', score: overall, color: '#84cc16' };
    if (overall >= 40) return { status: 'Fair', score: overall, color: '#f59e0b' };
    return { status: 'Poor', score: overall, color: '#ef4444' };
  }

  // Get real-time server updates
  static async getRealTimeServerMetrics() {
    try {
      const cpuUsage = await this.calculateCPUUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsagePercent = (usedMem / totalMem) * 100;
      
      return {
        success: true,
        data: {
          cpu: {
            usage: cpuUsage,
            loadAverage: os.loadavg()[0]
          },
          memory: {
            usage: memUsagePercent,
            used: usedMem,
            free: freeMem
          },
          uptime: os.uptime(),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Real-time server metrics error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Format bytes to human readable
  static formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Format uptime to human readable
  static formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
