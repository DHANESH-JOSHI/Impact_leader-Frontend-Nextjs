"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  RefreshCw,
  Server,
  Zap,
  Globe,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import our services for testing
import { apiClient } from "@/lib/apiClient";
import { authStorage } from "@/lib/storage";

export default function APIStatusPage() {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({});
  const [lastChecked, setLastChecked] = useState(null);

  // API endpoints to monitor
  const apiEndpoints = [
    {
      id: "health",
      name: "Health Check",
      description: "Basic server health status",
      endpoint: "/health",
      service: "ExternalApiService",
      category: "Core",
    },
    {
      id: "auth",
      name: "Authentication",
      description: "User login and authentication",
      endpoint: "/auth/login",
      service: "AuthService",
      category: "Authentication",
    },
    {
      id: "users",
      name: "User Management",
      description: "User profiles and management",
      endpoint: "/users",
      service: "UsersService",
      category: "User Management",
    },
    {
      id: "posts",
      name: "Posts & Social",
      description: "Posts, comments, and social features",
      endpoint: "/posts",
      service: "PostsService",
      category: "Content",
    },
    {
      id: "stories",
      name: "Stories",
      description: "Story creation and management",
      endpoint: "/stories/feed",
      service: "StoriesService",
      category: "Content",
    },
    {
      id: "resources",
      name: "Resources",
      description: "Resource library and uploads",
      endpoint: "/resources",
      service: "ResourcesService",
      category: "Content",
    },
    {
      id: "qna",
      name: "Q&A Forum",
      description: "Questions and answers",
      endpoint: "/qa/questions",
      service: "QnAService",
      category: "Community",
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "Push notifications and alerts",
      endpoint: "/notifications",
      service: "NotificationsService",
      category: "Communication",
    },
  ];

  useEffect(() => {
    checkAllEndpoints();
  }, []);

  const checkAllEndpoints = async () => {
    setLoading(true);
    const newStatus = {};

    // First check basic health
    try {
      const startTime = performance.now();
      const healthResult = await apiClient.healthCheck();
      const endTime = performance.now();
      newStatus["health"] = {
        status: healthResult.success ? "online" : "offline",
        responseTime: endTime - startTime,
        message: healthResult.success
          ? "Server is healthy"
          : healthResult.message,
        lastChecked: new Date(),
      };
    } catch (error) {
      newStatus["health"] = {
        status: "error",
        responseTime: null,
        message: error.message,
        lastChecked: new Date(),
      };
    }

    // Check authentication endpoint
    try {
      const startTime = performance.now();
      // We can't actually test login without credentials, so we'll test the endpoint availability
      // Use proxied URL in browser, full URL on server
      const backendUrl = typeof window !== 'undefined' 
        ? '' // Browser uses relative URL (proxied)
        : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");
      const apiUrl = typeof window !== 'undefined' ? '/api/v1' : `${backendUrl}/api/v1`;
      const authResult = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@test.com", password: "test" }), // This will fail but tells us the endpoint exists
        }
      );
      const endTime = performance.now();

      newStatus["auth"] = {
        status: "online", // Even if it returns 401, the endpoint is accessible
        responseTime: endTime - startTime,
        message: "Authentication endpoint accessible",
        lastChecked: new Date(),
      };
    } catch (error) {
      newStatus["auth"] = {
        status: "offline",
        responseTime: null,
        message: "Cannot reach authentication endpoint",
        lastChecked: new Date(),
      };
    }

    // Check other endpoints (these will likely fail without auth, but we can check if they're reachable)
    const token = authStorage.getAccessToken();

    for (const endpoint of apiEndpoints.slice(2)) {
      // Skip health and auth since we already checked them
      try {
        const startTime = performance.now();
        const result = await apiClient.get(endpoint.endpoint, { token });
        const endTime = performance.now();

        newStatus[endpoint.id] = {
          status: result.success
            ? "online"
            : result.status === 401
            ? "auth_required"
            : "error",
          responseTime: endTime - startTime,
          message: result.success
            ? "Endpoint accessible"
            : result.status === 401
            ? "Authentication required"
            : result.message,
          lastChecked: new Date(),
        };
      } catch (error) {
        newStatus[endpoint.id] = {
          status: "offline",
          responseTime: null,
          message: error.message,
          lastChecked: new Date(),
        };
      }
    }

    setApiStatus(newStatus);
    setLastChecked(new Date());
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "offline":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "auth_required":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="default" className="bg-green-500">
            Online
          </Badge>
        );
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "auth_required":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            Auth Required
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Core":
        return <Server className="h-4 w-4" />;
      case "Authentication":
        return <Zap className="h-4 w-4" />;
      case "User Management":
        return <Database className="h-4 w-4" />;
      case "Content":
        return <Globe className="h-4 w-4" />;
      case "Community":
        return <Activity className="h-4 w-4" />;
      case "Communication":
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const groupedEndpoints = apiEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {});

  const onlineCount = Object.values(apiStatus).filter(
    (status) => status.status === "online"
  ).length;
  const totalCount = apiEndpoints.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Status Monitor</h1>
          <p className="text-gray-600 mt-2">
            Monitor the health and status of Impact Leaders API endpoints
          </p>
          {lastChecked && (
            <p className="text-sm text-gray-500 mt-1">
              Last checked: {lastChecked.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button onClick={checkAllEndpoints} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Checking..." : "Refresh All"}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Overall System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {onlineCount} / {totalCount} Services Online
              </p>
              <p className="text-gray-600">
                {((onlineCount / totalCount) * 100).toFixed(1)}% operational
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onlineCount === totalCount ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <span className="text-green-600 font-semibold">
                    All Systems Operational
                  </span>
                </>
              ) : (
                <>
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <span className="text-yellow-600 font-semibold">
                    Some Issues Detected
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints by Category */}
      {Object.entries(groupedEndpoints).map(([category, endpoints]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </CardTitle>
            <CardDescription>
              {endpoints.length} endpoint{endpoints.length > 1 ? "s" : ""} in
              this category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint) => {
                const status = apiStatus[endpoint.id];
                return (
                  <div
                    key={endpoint.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(status?.status)}
                      <div>
                        <h3 className="font-medium">{endpoint.name}</h3>
                        <p className="text-sm text-gray-600">
                          {endpoint.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {endpoint.endpoint} • {endpoint.service}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {status ? (
                        getStatusBadge(status.status)
                      ) : (
                        <Badge variant="outline">Not checked</Badge>
                      )}
                      {status?.responseTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round(status.responseTime)}ms
                        </p>
                      )}
                      {status?.message && (
                        <p className="text-xs text-gray-500 mt-1 max-w-48 truncate">
                          {status.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Current API configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Base URL</p>
              <p className="text-sm text-gray-600">
                {typeof window !== 'undefined' 
                  ? '/api/v1 (proxied)' 
                  : (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000")}
              </p>
            </div>
            <div>
              <p className="font-medium">Environment</p>
              <p className="text-sm text-gray-600">
                {process.env.NODE_ENV || "development"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
