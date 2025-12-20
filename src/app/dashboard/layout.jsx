"use client";

import React, { useState } from "react";
import Sidebar from "@/components/core/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? "4rem" : "16rem" }}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
