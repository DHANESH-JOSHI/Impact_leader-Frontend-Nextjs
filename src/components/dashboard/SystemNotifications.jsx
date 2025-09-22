"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

// item animation variants - notification items ke liye
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function SystemNotifications({ data }) {
  // system notifications ka mock data - different types ke sath
  const notifications = [
    {
      type: "urgent",
      icon: AlertTriangle,
      title: "Server Resources Low",
      message: "CPU usage is at 85%. Consider upgrading.",
      time: "2 min ago",
      color: "#ef4444",
    },
    {
      type: "info",
      icon: Info,
      title: "New User Registrations",
      message: "34 new users registered today.",
      time: "1 hour ago",
      color: "#2691ce",
    },
    {
      type: "success",
      icon: CheckCircle,
      title: "Backup Completed",
      message: "Daily backup completed successfully.",
      time: "3 hours ago",
      color: "#10b981",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        {/* header section - title aur stats ke sath */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
            <h3 className="text-lg font-semibold" style={{ color: "#040606" }}>
              System Notifications
            </h3>
          </div>
          {/* notification stats - total, unread, urgent */}
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold" style={{ color: "#2691ce" }}>
              {data.total}
            </span>
            <div className="text-xs" style={{ color: "#646464" }}>
              <p>{data.unread} unread</p>
              <p>{data.urgent} urgent</p>
            </div>
          </div>
        </div>

        {/* notifications list */}
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "#f8fafc" }}
              >
                {/* notification icon - type ke hisab se color */}
                <Icon
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  style={{ color: notification.color }}
                />
                {/* notification content */}
                <div className="flex-1">
                  {/* notification title */}
                  <p
                    className="font-medium text-sm"
                    style={{ color: "#040606" }}
                  >
                    {notification.title}
                  </p>
                  {/* notification message */}
                  <p className="text-sm mt-1" style={{ color: "#646464" }}>
                    {notification.message}
                  </p>
                  {/* notification time */}
                  <p className="text-xs mt-2" style={{ color: "#646464" }}>
                    {notification.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
