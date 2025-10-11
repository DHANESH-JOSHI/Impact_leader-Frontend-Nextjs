"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Bell,
  BellOff,
  Mail,
  Users,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function MessageSettingsPage() {
  // sabhi settings ka state management yhn hai
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [directMessages, setDirectMessages] = useState(true);
  const [groupMessages, setGroupMessages] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  // animation variants - page aur cards ke liye
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* page header - left aligned */}
      <motion.div className="mb-8" variants={cardVariants}>
        <div className="flex items-center space-x-3 mb-2">
          <MessageSquare className="h-6 w-6" style={{ color: "#2691ce" }} />
          <h1 className="text-2xl font-semibold" style={{ color: "#040606" }}>
            Message Settings
          </h1>
        </div>
        <p className="text-sm" style={{ color: "#646464" }}>
          Manage your message preferences and notifications
        </p>
      </motion.div>

      <div className="space-y-6 max-w-2xl">
        {/* main toggle card - messages enable/disable */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          variants={cardVariants}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {messagesEnabled ? (
                  <Bell className="h-5 w-5" style={{ color: "#2691ce" }} />
                ) : (
                  <BellOff className="h-5 w-5" style={{ color: "#646464" }} />
                )}
              </div>
              <div>
                <h3
                  className="text-base font-medium mb-1"
                  style={{ color: "#040606" }}
                >
                  Enable Messages
                </h3>
                <p className="text-sm" style={{ color: "#646464" }}>
                  Receive messages and notifications from users
                </p>
              </div>
            </div>

            {/* shadcn switch component */}
            <Switch
              checked={messagesEnabled}
              onCheckedChange={setMessagesEnabled}
            />
          </div>

          {/* status indicator - enabled/disabled */}
          <motion.div
            className="mt-4 pt-4 border-t border-gray-100"
            animate={{ opacity: messagesEnabled ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  messagesEnabled ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm" style={{ color: "#646464" }}>
                Messages are{" "}
                <span
                  className="font-medium"
                  style={{
                    color: messagesEnabled ? "#059669" : "#6b7280",
                  }}
                >
                  {messagesEnabled ? "enabled" : "disabled"}
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* email preferences card */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          variants={cardVariants}
        >
          <h3
            className="text-base font-medium mb-4"
            style={{ color: "#040606" }}
          >
            Email Preferences
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "#040606" }}>
                Email Notifications
              </p>
              <p className="text-xs" style={{ color: "#646464" }}>
                Get notified via email for important messages
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </motion.div>

        {/* settings save krne ka button */}
        <motion.div className="flex justify-start" variants={cardVariants}>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
            onClick={() => {
              // settings save krne ka logic yhn hoga
              console.log("Settings saved:", {
                messagesEnabled,
                directMessages,
                groupMessages,
                systemNotifications,
                emailNotifications,
              });
            }}
          >
            Save Settings
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
