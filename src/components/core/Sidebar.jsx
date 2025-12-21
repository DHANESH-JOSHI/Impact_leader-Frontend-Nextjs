"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Folder,
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Store,
  Upload,
  Bell,
  Database,
  User2Icon,
  X,
  Headphones,
  Users,
  Calendar,
  Building2,
} from "lucide-react";

// main menu items ka data - dashboard, stories, posts etc.
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    title: "Directory",
    icon: Building2,
    href: "/dashboard/directory",
  },
  {
    title: "Stories",
    icon: BookOpen,
    href: "/dashboard/stories",
  },
  {
    title: "Posts",
    icon: FileText,
    href: "/dashboard/posts",
  },
  {
    title: "Resources",
    icon: Folder,
    href: "/dashboard/resources",
  },
  {
    title: "Q&A",
    icon: HelpCircle,
    href: "/dashboard/qna",
  },
  {
    title: "Connections",
    icon: User2Icon,
    href: "/dashboard/connections",
  },
  {
    title: "Meetings",
    icon: Calendar,
    href: "/dashboard/meetings",
  },
  {
    title: "Support",
    icon: Headphones,
    href: "/dashboard/support",
  },
];

// settings submenu items ka data - message, file import etc.
const settingsItems = [
  {
    title: "Request Approvals",
    icon: Database,
    href: "/dashboard/settings/approvals",
  },
  {
    title: "File Import",
    icon: Upload,
    href: "/dashboard/settings/file-import",
  },
  {
    title: "Notification Settings",
    icon: Bell,
    href: "/dashboard/settings/notifications",
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      width: 64,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    collapsed: {
      rotate: 0,
      scale: 1,
    },
    expanded: {
      rotate: 0,
      scale: 1,
    },
  };

  return (
    <div 
      className="relative" 
      style={{ 
        width: collapsed ? 64 : 256, 
        overflow: "visible",
        minWidth: collapsed ? 64 : 256,
        maxWidth: collapsed ? 64 : 256
      }}
    >
      <div className="absolute -right-3 top-6 z-50" style={{ right: "-12px" }}>
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
          style={{ color: "#646464", width: "24px", height: "24px" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            variants={iconVariants}
            animate={collapsed ? "collapsed" : "expanded"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </motion.div>
        </motion.button>
      </div>
      <motion.div
        className="bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm relative"
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        initial={false}
        style={{ 
          width: collapsed ? 64 : 256, 
          minWidth: collapsed ? 64 : 256,
          maxWidth: collapsed ? 64 : 256,
          overflowY: "auto", 
          overflowX: "hidden" 
        }}
      >

      <div className={`p-4 border-b border-gray-200 ${collapsed ? "px-2" : ""}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
          <motion.div className={`flex items-center ${collapsed ? "" : "space-x-2"}`} layout>
            <Store
              className="h-8 w-8 flex-shrink-0"
              style={{ color: "#2691ce" }}
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="text-xl font-bold whitespace-nowrap"
                  style={{ color: "#040606" }}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4" style={{ overflowX: "hidden" }}>
        <div className={`space-y-1 w-full ${collapsed ? "px-1" : "px-2"}`}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors relative group w-full ${
                    collapsed ? "px-2 justify-center" : "px-3"
                  } ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: "#2691ce" } : {}}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      collapsed ? "" : "mr-3"
                    }`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="whitespace-nowrap"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.title}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
          >
            <motion.button
              onClick={() =>
                !collapsed && setSettingsExpanded(!settingsExpanded)
              }
              className={`w-full flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors relative group ${
                collapsed ? "justify-center px-2" : "justify-between px-3"
              } ${
                isSettingsActive
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={isSettingsActive ? { backgroundColor: "#2691ce" } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`flex items-center ${collapsed ? "" : ""}`}>
                <Settings
                  className={`h-5 w-5 flex-shrink-0 ${collapsed ? "" : "mr-3"}`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="whitespace-nowrap"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    className="ml-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <motion.div
                      animate={{ rotate: settingsExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  Settings
                </div>
              )}
            </motion.button>

            <AnimatePresence>
              {!collapsed && settingsExpanded && (
                <motion.div
                  className="mt-1 ml-6 space-y-1 overflow-hidden"
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {settingsItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? "text-white shadow-sm"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                          style={isActive ? { backgroundColor: "#2691ce" } : {}}
                        >
                          <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {item.title}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </nav>

      <div className={`border-t border-gray-200 ${collapsed ? "p-1" : "p-2"}`}>
        <motion.button
          onClick={async () => {
            try {
              const { AuthService } = await import('@/services/authService');
              await AuthService.logout();
              document.cookie =
                "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            } catch (error) {
              console.error("Logout error:", error);
              document.cookie =
                "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            }
          }}
          className={`w-full flex items-center py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors relative group ${
            collapsed ? "justify-center px-2" : "px-3"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut
            className={`h-5 w-5 flex-shrink-0 ${collapsed ? "" : "mr-3"}`}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Logout
            </div>
          )}
        </motion.button>
      </div>
      </motion.div>
    </div>
  );
}
