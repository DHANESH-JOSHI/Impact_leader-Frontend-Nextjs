"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Users,
  FolderOpen,
  Settings,
  BarChart3,
  Plus,
  Eye,
} from "lucide-react";

// item animation variants - individual buttons ke liye
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

// container animation variants - grid ke liye
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function QuickActions() {
  // quick actions ka data - icons, labels aur colors ke sath
  const actions = [
    { icon: FileText, label: "Add Post", color: "#2691ce" },
    { icon: BookOpen, label: "Create Story", color: "#2691ce" },
    { icon: FolderOpen, label: "Upload Resource", color: "#646464" },
    { icon: Users, label: "Manage Users", color: "#646464" },
    { icon: BarChart3, label: "Analytics", color: "#646464" },
    { icon: Settings, label: "Settings", color: "#646464" },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6" style={{ color: "#040606" }}>
          Quick Actions
        </h3>

        {/* actions grid - 2 columns md me 3 columns */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  backgroundColor: "#f1f5f9",
                  boxShadow: "0 10px 20px rgba(38, 145, 206, 0.1)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* icon with rotation animation on hover */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    className="h-8 w-8 mb-2"
                    style={{ color: action.color }}
                  />
                </motion.div>
                {/* action label */}
                <span
                  className="text-sm font-medium"
                  style={{ color: "#040606" }}
                >
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
