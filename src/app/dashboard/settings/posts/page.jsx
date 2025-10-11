"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, EyeOff, Settings, Globe, Lock } from "lucide-react";

export default function PostSettingsPage() {
  // posts enable/disable aur visibility ke states
  const [postsEnabled, setPostsEnabled] = useState(true);
  const [postsVisible, setPostsVisible] = useState(true);

  // posts toggle krne ka function
  const handlePostsToggle = () => {
    setPostsEnabled(!postsEnabled);
  };

  // visibility toggle krne ka function
  const handleVisibilityToggle = () => {
    setPostsVisible(!postsVisible);
  };

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
      className="min-h-screen bg-gray-50 p-4"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-3xl mx-auto">
        {/* page header section */}
        <motion.div className="mb-6" variants={cardVariants}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Settings className="h-5 w-5" style={{ color: "#2691ce" }} />
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: "#040606" }}>
              Post Settings
            </h1>
          </div>
          <p className="text-sm" style={{ color: "#646464" }}>
            Manage your post preferences and visibility options
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* posts enable krne ka setting */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText
                        className="h-4 w-4"
                        style={{
                          color: postsEnabled ? "#2691ce" : "#646464",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "#040606" }}
                      >
                        Enable Posts
                      </h3>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {postsEnabled
                          ? "Posts can be created and published"
                          : "Post creation is disabled"}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={postsEnabled}
                    onCheckedChange={handlePostsToggle}
                    className="data-[state=checked]:bg-[#2691ce]"
                  />
                </div>

                {/* status indicator - active/disabled */}
                <motion.div
                  className={`mt-4 p-3 rounded-lg border ${
                    postsEnabled
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                  animate={{
                    backgroundColor: postsEnabled ? "#f0fdf4" : "#fef2f2",
                    borderColor: postsEnabled ? "#bbf7d0" : "#fecaca",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        postsEnabled ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        postsEnabled
                          ? "border-green-300 text-green-700"
                          : "border-red-300 text-red-700"
                      }`}
                    >
                      {postsEnabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p
                    className="text-xs mt-2 ml-4"
                    style={{
                      color: postsEnabled ? "#15803d" : "#b91c1c",
                    }}
                  >
                    {postsEnabled
                      ? "All post functionality is active"
                      : "Post creation and editing is blocked"}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* post visibility setting */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {postsVisible ? (
                        <Eye className="h-4 w-4" style={{ color: "#2691ce" }} />
                      ) : (
                        <EyeOff
                          className="h-4 w-4"
                          style={{ color: "#646464" }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-base font-medium mb-1"
                        style={{ color: "#040606" }}
                      >
                        Post Visibility
                      </h3>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {postsVisible
                          ? "Posts are publicly visible"
                          : "Posts are hidden from public view"}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={postsVisible}
                    onCheckedChange={handleVisibilityToggle}
                    className="data-[state=checked]:bg-[#2691ce]"
                  />
                </div>

                {/* visibility status - public/hidden */}
                <motion.div
                  className={`mt-4 p-3 rounded-lg border ${
                    postsVisible
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  animate={{
                    backgroundColor: postsVisible ? "#eff6ff" : "#f9fafb",
                    borderColor: postsVisible ? "#bfdbfe" : "#e5e7eb",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    {postsVisible ? (
                      <Globe className="w-3 h-3" style={{ color: "#2691ce" }} />
                    ) : (
                      <Lock className="w-3 h-3" style={{ color: "#646464" }} />
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        postsVisible
                          ? "border-blue-300 text-blue-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {postsVisible ? "Public" : "Hidden"}
                    </Badge>
                  </div>
                  <p
                    className="text-xs mt-2 ml-5"
                    style={{
                      color: postsVisible ? "#1d4ed8" : "#646464",
                    }}
                  >
                    {postsVisible
                      ? "Published posts can be viewed by all visitors"
                      : "Posts are only visible to administrators"}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
