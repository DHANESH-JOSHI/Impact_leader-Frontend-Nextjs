"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Users,
  Bell,
  Archive,
  FolderOpen,
  TrendingUp,
  Activity,
} from "lucide-react";

// item animation variants - cards ke liye
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

// individual stats card component
const StatsCard = ({ icon: Icon, title, subtitle, color }) => {
  return (
    <motion.div
      className="bg-white rounded-xl border-0 shadow-sm p-6"
      variants={itemVariants}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px rgba(38, 145, 206, 0.15)",
        transition: { duration: 0.3 },
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          {/* card title */}
          <p className="text-sm font-medium" style={{ color: "#646464" }}>
            {title}
          </p>
          {/* card subtitle/value */}
          <p
            className="text-lg font-semibold mt-2"
            style={{ color: "#040606" }}
          >
            {subtitle}
          </p>
          {/* active status indicator */}
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium ml-1 text-green-600">
              Active
            </span>
          </div>
        </div>
        {/* icon container with hover animation */}
        <motion.div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
          whileHover={{
            scale: 1.1,
            backgroundColor: `${color}30`,
            transition: { duration: 0.2 },
          }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function StatsOverview({ data }) {
  // stats cards ka data - title, subtitle, icon aur color
  const statsCards = [
    {
      title: "Content Posts",
      subtitle: "All Posts & Recent",
      icon: FileText,
      color: "#2691ce",
    },
    {
      title: "Stories",
      subtitle: "Published Stories",
      icon: BookOpen,
      color: "#2691ce",
    },
    {
      title: "Users",
      subtitle: "System Users",
      icon: Users,
      color: "#2691ce",
    },
    {
      title: "Notifications",
      subtitle: "System Alerts",
      icon: Bell,
      color: "#646464",
    },
    {
      title: "Archive",
      subtitle: "Archived Content",
      icon: Archive,
      color: "#646464",
    },
    {
      title: "Resources",
      subtitle: "Media & Documents",
      icon: FolderOpen,
      color: "#646464",
    },
  ];

  return (
    // responsive grid - mobile me 1 column, large screens me 6 columns
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* stats cards ko map krke render krna hai */}
      {statsCards.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </motion.div>
  );
}
