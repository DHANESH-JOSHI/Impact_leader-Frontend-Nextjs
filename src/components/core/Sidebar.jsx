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
  MessageSquare,
  Upload,
  Bell,
  Database,
  User2Icon,
  Menu,
  X,
  Headphones,
} from "lucide-react";

// main menu items ka data - dashboard, stories, posts etc.
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Directory",
    icon: User2Icon,
    href: "/dashboard/users",
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

  // animation variants - sidebar ke different states ke liye
  const sidebarVariants = {
    expanded: {
      width: 256, // w-64 = 16rem = 256px
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      width: 64, // w-16 = 4rem = 64px
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // text show/hide animation variants
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

  // dropdown animation variants - settings submenu ke liye
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

  // icon animation variants
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
    <motion.div
      className="bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm relative"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* toggle button - hamesha top me visible rahega */}
      <div className="absolute -right-3 top-6 z-10">
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          style={{ color: "#646464" }}
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

      {/* logo aur header section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <motion.div className="flex items-center space-x-2" layout>
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

      {/* navigation menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {/* main menu items render krna hai */}
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
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative group ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  style={isActive ? { backgroundColor: "#2691ce" } : {}}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      collapsed ? "mx-auto" : "mr-3"
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

                  {/* tooltip for collapsed state - hover pe dikhega */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.title}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}

          {/* settings dropdown section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
          >
            <motion.button
              onClick={() =>
                !collapsed && setSettingsExpanded(!settingsExpanded)
              }
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative group ${
                isSettingsActive
                  ? "text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              } ${collapsed ? "justify-center" : "justify-between"}`}
              style={isSettingsActive ? { backgroundColor: "#2691ce" } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
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

              {/* dropdown arrow - expand/collapse indicator */}
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

              {/* tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Settings
                </div>
              )}
            </motion.button>

            {/* settings submenu - expand hone pe dikhega */}
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

      {/* logout button - bottom me fixed */}
      <div className="p-2 border-t border-gray-200">
        <motion.button
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
              document.cookie =
                "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            } catch (error) {
              console.error("Logout error:", error);
              // Still redirect even if API fails
              document.cookie =
                "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/";
            }
          }}
          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors relative group ${
            collapsed ? "justify-center" : ""
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

          {/* tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Logout
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
