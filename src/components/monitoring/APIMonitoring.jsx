"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Activity,
  TrendingUp,
  Clock,
  Users,
  MessageSquare,
  FileText,
  Shield,
  Database,
  Settings,
  Bell,
  Search,
  Zap,
  Eye,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

// Brand colors
const PRIMARY = "#2490CE";
const ACCENT = "#A5C93D";

// Category icons mapping
const categoryIcons = {
  authentication: Shield,
  otp: MessageSquare,
  meetings: Users,
  users: Users,
  posts: FileText,
  stories: Eye,
  connections: Activity,
  notifications: Bell,
  qa: MessageSquare,
  resources: Database,
  directory: Search,
  messages: MessageSquare,
  admin: Settings,
  system: Zap,
  monitoring: TrendingUp
};

// Category colors
const categoryColors = {
  authentication: PRIMARY,
  otp: "#8b5cf6",
  meetings: "#06b6d4",
  users: ACCENT,
  posts: "#f59e0b",
  stories: "#ef4444",
  connections: "#10b981",
  notifications: "#f97316",
  qa: "#6366f1",
  resources: "#84cc16",
  directory: "#ec4899",
  messages: "#14b8a6",
  admin: "#dc2626",
  system: "#64748b",
  monitoring: "#3b82f6"
};

const CategoryCard = ({ category, data, isActive }) => {
  const Icon = categoryIcons[category] || Activity;
  const color = categoryColors[category] || PRIMARY;
  
  return (
    <motion.div
      className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all duration-300 ${
        isActive ? 'border-blue-200 shadow-md' : 'border-gray-100 hover:border-gray-200'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      layout
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{category.replace('_', ' ')}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold" style={{ color }}>
                {data.hits}
              </span>
              <span className="text-xs text-gray-500">hits</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {data.routes.length} routes
          </div>
          {data.lastHit && (
            <div className="text-xs text-gray-400">
              {new Date(data.lastHit).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      
      {data.routes.length > 0 && (
        <div className="space-y-1">
          {data.routes.slice(0, 3).map((route, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate flex-1 mr-2">
                {route.route}
              </span>
              <span className="font-medium" style={{ color }}>
                {route.hits}
              </span>
            </div>
          ))}
          {data.routes.length > 3 && (
            <div className="text-xs text-gray-400 text-center">
              +{data.routes.length - 3} more routes
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const RealtimeActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Real-time Activity</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = categoryIcons[activity.category] || Activity;
            const color = categoryColors[activity.category] || PRIMARY;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="p-1.5 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.method}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full capitalize" 
                          style={{ backgroundColor: `${color}15`, color }}>
                      {activity.category}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {activity.route}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-gray-500">
                    {Math.round((Date.now() - activity.timestamp) / 1000)}s ago
                  </div>
                  {activity.responseTime && (
                    <div className="text-xs font-medium text-gray-700">
                      {activity.responseTime}ms
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent API activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricsSummary = ({ summary }) => {
  const metrics = [
    {
      icon: Globe,
      label: "Total Requests",
      value: summary.totalRequests?.toLocaleString() || "0",
      color: PRIMARY
    },
    {
      icon: TrendingUp,
      label: "Hits/Second",
      value: summary.hitsPerSecond || "0",
      color: ACCENT
    },
    {
      icon: Clock,
      label: "Avg Response",
      value: `${summary.averageResponseTime || 0}ms`,
      color: "#f59e0b"
    },
    {
      icon: Activity,
      label: "Active Categories",
      value: summary.categoriesActive || "0",
      color: "#ef4444"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${metric.color}15`, color: metric.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function APIMonitoring() {
  const [apiData, setApiData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch API analytics
  const fetchAPIAnalytics = async () => {
    try {
      const response = await fetch('/api/monitoring/system');
      const data = await response.json();
      
      if (data.success) {
        setApiData(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch API analytics');
      console.error('API analytics error:', err);
    }
  };

  // Fetch real-time data
  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/monitoring/api-metrics');
      const data = await response.json();
      
      if (data.success) {
        setRealtimeData(data.data);
      }
    } catch (err) {
      console.error('Realtime data error:', err);
    }
  };

  useEffect(() => {
    // Initial load
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAPIAnalytics(),
        fetchRealtimeData()
      ]);
      setIsLoading(false);
    };

    loadInitialData();

    // Set up real-time updates
    const realtimeInterval = setInterval(() => {
      fetchRealtimeData();
    }, 1000); // Update every second

    // Set up analytics updates (less frequent)
    const analyticsInterval = setInterval(fetchAPIAnalytics, 5000); // Update every 5 seconds

    return () => {
      clearInterval(realtimeInterval);
      clearInterval(analyticsInterval);
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
          <span className="text-gray-600">Loading API analytics...</span>
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
            <h3 className="text-lg font-semibold text-red-800">Error Loading API Data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Monitoring</h1>
            <p className="text-sm text-gray-600">
              Real-time tracking of Impact Leaders API endpoints
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last Updated</div>
          <div className="text-lg font-semibold text-gray-900">
            {apiData ? new Date(apiData.timestamp).toLocaleTimeString() : '--'}
          </div>
        </div>
      </div>

      {/* Metrics Summary */}
      {apiData && <MetricsSummary summary={apiData.summary} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Categories */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">API Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiData?.categories?.map((categoryData, index) => (
              <CategoryCard
                key={categoryData.category}
                category={categoryData.category}
                data={categoryData}
                isActive={selectedCategory === categoryData.category}
              />
            ))}
          </div>
        </div>

        {/* Real-time Activity */}
        <div>
          <RealtimeActivityFeed activities={apiData?.recentActivity || []} />
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      {apiData?.performance && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Trends</h2>
          
          <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp 
                className="h-16 w-16 mx-auto mb-4" 
                style={{ color: PRIMARY }} 
              />
              <p className="text-gray-600 font-medium">Response time trends</p>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {apiData.summary.averageResponseTime}ms
                  </div>
                  <div className="text-sm text-gray-500">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: ACCENT }}>
                    {apiData.summary.hitsPerSecond}/s
                  </div>
                  <div className="text-sm text-gray-500">Current Rate</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
