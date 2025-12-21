"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/core/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("impactLeadersAuth");
        if (authData) {
          const parsed = JSON.parse(authData);
          const token = parsed?.value?.accessToken || parsed?.accessToken;
          if (token) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }
        // No valid token, redirect to login
        setIsLoading(false);
        router.replace("/?error=login_required");
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false);
        router.replace("/?error=login_required");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with collapsed sidebar visible
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#2691ce" }}></div>
          <p style={{ color: "#646464" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile hamburger button - only show when sidebar is hidden on mobile */}
      {isMobile && sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ zIndex: 40 }}
        >
          <Menu className="h-5 w-5" style={{ color: "#2691ce" }} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out ${
          isMobile && !sidebarCollapsed
            ? "translate-x-0"
            : isMobile && sidebarCollapsed
            ? "translate-x-0"
            : "translate-x-0"
        }`}
        style={{
          width: isMobile && sidebarCollapsed ? "64px" : "auto",
        }}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Mobile overlay - only when sidebar is expanded on mobile */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out w-full"
        style={{
          marginLeft: isMobile
            ? sidebarCollapsed
              ? "4rem"
              : "0"
            : sidebarCollapsed
            ? "4rem"
            : "16rem",
        }}
      >
        <main className="p-4 md:p-6 min-h-screen w-full">{children}</main>
      </div>
    </div>
  );
}
