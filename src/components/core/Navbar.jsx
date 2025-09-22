"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Mail,
  HelpCircle,
} from "lucide-react";

export default function Navbar({ sidebarCollapsed, setSidebarCollapsed }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get user info from localStorage
  useEffect(() => {
    try {
      const authData = localStorage.getItem('impactLeadersAuth');
      if (authData) {
        const parsedData = JSON.parse(authData);
        setCurrentUser(parsedData.user);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1234 has been placed",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Product Updated",
      message: "iPhone 15 Pro stock updated",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Customer Review",
      message: "New 5-star review received",
      time: "3 hours ago",
      unread: false,
    },
  ];

  return (
    <header
      className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm"
      style={{ marginLeft: sidebarCollapsed ? "4rem" : "16rem" }}
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            style={{ color: "#646464" }}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
              style={{ color: "#646464" }}
            />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
              style={{ focusRingColor: "#2691ce" }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              style={{ color: "#646464" }}
            >
              <Bell className="h-5 w-5" />
              <span
                className="absolute -top-1 -right-1 h-4 w-4 text-xs font-bold text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#2691ce" }}
              >
                2
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#040606" }}
                  >
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className="text-sm font-medium"
                            style={{ color: "#040606" }}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className="text-sm mt-1"
                            style={{ color: "#646464" }}
                          >
                            {notification.message}
                          </p>
                          <p
                            className="text-xs mt-2"
                            style={{ color: "#646464" }}
                          >
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "#2691ce" }}
                          ></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#2691ce" }}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: "#646464" }}
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: "#2691ce" }}
              >
                {currentUser ? 
                  `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() || 
                  currentUser.email?.[0]?.toUpperCase() || 'A'
                  : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium" style={{ color: "#040606" }}>
                  {currentUser ? 
                    `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 
                    currentUser.email || 'Admin User'
                    : 'Admin User'}
                </p>
                <p className="text-xs" style={{ color: "#646464" }}>
                  {currentUser?.role === 'super-admin' ? 'Super Administrator' : 
                   currentUser?.role === 'admin' ? 'Administrator' : 'Admin'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: "#646464" }} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <a
                    href="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </a>
                  <a
                    href="/dashboard/messages"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Mail className="mr-3 h-4 w-4" />
                    Messages
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={async () => {
                      try {
                        // Call Impact Leaders logout API
                        await fetch('/api/auth/impact-leaders/logout', { method: 'POST' });
                        
                        // Clear local storage
                        localStorage.removeItem('impactLeadersAuth');
                        
                        // Clear cookies
                        document.cookie = 'impactLeadersToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        
                        // Redirect to login
                        window.location.href = '/?message=logged_out';
                      } catch (error) {
                        console.error('Logout error:', error);
                        // Still clear local data and redirect even if API fails
                        localStorage.removeItem('impactLeadersAuth');
                        document.cookie = 'impactLeadersToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        window.location.href = '/?message=logged_out';
                      }
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
