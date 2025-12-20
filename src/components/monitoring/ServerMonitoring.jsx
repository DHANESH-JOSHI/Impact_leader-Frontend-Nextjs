"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  HardDrive,
  Network,
  Activity,
  Zap,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Globe,
  BarChart3,
  Database,
  MonitorSpeaker,
} from "lucide-react";

// Brand colors
const PRIMARY = "#2490CE";
const ACCENT = "#A5C93D";

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  percentage, 
  status = 'normal',
  trend = null,
  color = PRIMARY 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'good': return ACCENT;
      default: return color;
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
      whileHover={{ scale: 1.02, y: -2 }}
      layout
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${statusColor}, transparent)` }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-gray-900">{value}</span>
                {unit && <span className="text-sm text-gray-500">{unit}</span>}
              </div>
            </div>
          </div>
          {trend && (
            <div className={`text-sm font-medium ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        {percentage !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Usage</span>
              <span>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all duration-500"
                style={{ backgroundColor: statusColor }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RealTimeChart = ({ data, title, color = PRIMARY, unit = "" }) => {
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 100 });

  useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.getBoundingClientRect();
      setDimensions({ width, height: 100 });
    }
  }, []);

  const points = data.slice(-20); // Show last 20 data points
  const max = Math.max(...points) || 100;
  const min = Math.min(...points) || 0;
  const range = max - min || 1;

  const pathData = points.map((point, index) => {
    const x = (index / (points.length - 1)) * dimensions.width;
    const y = dimensions.height - ((point - min) / range) * dimensions.height;
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>
            {points[points.length - 1]?.toFixed(1) || 0}{unit}
          </div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
      </div>
      
      <div ref={chartRef} className="h-24 relative">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          
          {points.length > 1 && (
            <>
              <path
                d={`${pathData} L ${dimensions.width},${dimensions.height} L 0,${dimensions.height} Z`}
                fill={`url(#gradient-${title})`}
              />
              <path
                d={pathData}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
          
          {/* Data points */}
          {points.map((point, index) => {
            const x = (index / (points.length - 1)) * dimensions.width;
            const y = dimensions.height - ((point - min) / range) * dimensions.height;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index === points.length - 1 ? 4 : 2}
                fill={color}
                opacity={index === points.length - 1 ? 1 : 0.6}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const APIMetricsDisplay = ({ apiMetrics }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
          >
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">API Performance</h2>
            <p className="text-sm text-gray-600">Real-time API monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {apiMetrics.hitsPerSecond}
          </div>
          <div className="text-sm text-blue-800 font-medium">Hits/sec</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {apiMetrics.totalRequests?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-green-800 font-medium">Total Requests</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {apiMetrics.activeConnections}
          </div>
          <div className="text-sm text-purple-800 font-medium">Active Connections</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {apiMetrics.averageResponseTime}ms
          </div>
          <div className="text-sm text-orange-800 font-medium">Avg Response</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServerMonitoring() {
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [apiMetrics, setApiMetrics] = useState({
    hitsPerSecond: 0,
    totalRequests: 0,
    activeConnections: 0,
    averageResponseTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [apiHitsHistory, setApiHitsHistory] = useState([]);

  // Fetch initial system metrics
  const fetchSystemMetrics = async () => {
    try {
      const { SystemMonitoringService } = await import('@/services/systemMonitoringService');
      const result = await SystemMonitoringService.getAPIAnalytics();

      if (result.success) {
        setSystemMetrics(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch system metrics');
      console.error('System metrics error:', err);
    }
  };

  // Fetch real-time metrics
  const fetchRealTimeMetrics = async () => {
    try {
      const { SystemMonitoringService } = await import('@/services/systemMonitoringService');
      const result = await SystemMonitoringService.getRealTimeMetrics();

      if (result.success) {
        setRealTimeMetrics(result.data);

        if (result.data.api) {
          setCpuHistory(prev => [...prev.slice(-19), result.data.cpu?.usage || 0]);
          setMemoryHistory(prev => [...prev.slice(-19), result.data.memory?.usage || 0]);
          setApiHitsHistory(prev => [...prev.slice(-19), result.data.api.hitsPerSecond || 0]);
        }
      }
    } catch (err) {
      console.error('Real-time metrics error:', err);
    }
  };

  // Fetch API metrics
  const fetchAPIMetrics = async () => {
    try {
      const { SystemMonitoringService } = await import('@/services/systemMonitoringService');
      const result = SystemMonitoringService.getAPIMetrics();

      if (result.success) {
        setApiMetrics(result.data);
      }
    } catch (err) {
      console.error('API metrics error:', err);
    }
  };

  useEffect(() => {
    // Initial load
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSystemMetrics(),
        fetchRealTimeMetrics(),
        fetchAPIMetrics()
      ]);
      setIsLoading(false);
    };

    loadInitialData();

    // Set up real-time updates
    const realTimeInterval = setInterval(() => {
      fetchRealTimeMetrics();
      fetchAPIMetrics();
    }, 1000); // Update every second

    // Set up system metrics updates (less frequent)
    const systemInterval = setInterval(fetchSystemMetrics, 30000); // Update every 30 seconds

    return () => {
      clearInterval(realTimeInterval);
      clearInterval(systemInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-gray-600">Loading server metrics...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Metrics</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getSystemStatus = () => {
    if (!realTimeMetrics) return 'unknown';
    
    const cpuUsage = realTimeMetrics.cpu.usage;
    const memoryUsage = realTimeMetrics.memory.usage;
    
    if (cpuUsage > 80 || memoryUsage > 90) return 'critical';
    if (cpuUsage > 60 || memoryUsage > 70) return 'warning';
    return 'good';
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
          >
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Server Monitoring</h1>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                getSystemStatus() === 'good' ? 'bg-green-500' :
                getSystemStatus() === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                System Status: <span className="font-medium capitalize">{getSystemStatus()}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Server Uptime</div>
          <div className="text-lg font-semibold text-gray-900">
            {systemMetrics ? Math.floor(systemMetrics.system.uptime / 3600) : 0}h {
              systemMetrics ? Math.floor((systemMetrics.system.uptime % 3600) / 60) : 0
            }m
          </div>
        </div>
      </div>

      {/* API Performance */}
      <APIMetricsDisplay apiMetrics={apiMetrics} />

      {/* Real-time Metrics Grid */}
      {realTimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Cpu}
            title="CPU Usage"
            value={realTimeMetrics.cpu.usage.toFixed(1)}
            unit="%"
            percentage={realTimeMetrics.cpu.usage}
            status={realTimeMetrics.cpu.usage > 80 ? 'critical' : realTimeMetrics.cpu.usage > 60 ? 'warning' : 'good'}
            color={PRIMARY}
          />
          
          <MetricCard
            icon={Database}
            title="Memory Usage"
            value={(realTimeMetrics.memory.used / 1024 / 1024 / 1024).toFixed(1)}
            unit="GB"
            percentage={realTimeMetrics.memory.usage}
            status={realTimeMetrics.memory.usage > 90 ? 'critical' : realTimeMetrics.memory.usage > 70 ? 'warning' : 'good'}
            color={ACCENT}
          />
          
          <MetricCard
            icon={Activity}
            title="Load Average"
            value={realTimeMetrics.cpu.loadAverage.toFixed(2)}
            status={realTimeMetrics.cpu.loadAverage > 2 ? 'warning' : 'good'}
            color="#f59e0b"
          />
          
          <MetricCard
            icon={Clock}
            title="Uptime"
            value={Math.floor(realTimeMetrics.uptime / 3600)}
            unit="hours"
            color="#10b981"
          />
        </div>
      )}

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RealTimeChart
          data={cpuHistory}
          title="CPU Usage"
          color={PRIMARY}
          unit="%"
        />
        
        <RealTimeChart
          data={memoryHistory}
          title="Memory Usage"
          color={ACCENT}
          unit="%"
        />
        
        <RealTimeChart
          data={apiHitsHistory}
          title="API Hits/sec"
          color="#f59e0b"
          unit="/s"
        />
      </div>

      {/* System Information */}
      {systemMetrics && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Server Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hostname:</span>
                  <span className="font-medium">{systemMetrics.system.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-medium">{systemMetrics.system.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span className="font-medium">{systemMetrics.system.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Node.js:</span>
                  <span className="font-medium">{systemMetrics.system.nodeVersion}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Hardware</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">CPU Cores:</span>
                  <span className="font-medium">{systemMetrics.cpu.cores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CPU Speed:</span>
                  <span className="font-medium">{systemMetrics.cpu.speed} MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Memory:</span>
                  <span className="font-medium">{(systemMetrics.memory.total / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free Memory:</span>
                  <span className="font-medium">{(systemMetrics.memory.free / 1024 / 1024 / 1024).toFixed(1)} GB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Load (1min):</span>
                  <span className="font-medium">{systemMetrics.cpu.loadAverage['1min'].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Load (5min):</span>
                  <span className="font-medium">{systemMetrics.cpu.loadAverage['5min'].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Load (15min):</span>
                  <span className="font-medium">{systemMetrics.cpu.loadAverage['15min'].toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disk Usage:</span>
                  <span className="font-medium">{systemMetrics.disk.usage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
