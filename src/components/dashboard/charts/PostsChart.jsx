"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, FileText, Clock } from "lucide-react";

// item animation variants - chart components ke liye
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

// bar chart component - posts data dikhane ke liye
const BarChart = ({ data }) => {
  const chartData = [
    { label: "Published", value: data.published, color: "#2691ce" },
    { label: "Draft", value: data.draft, color: "#646464" },
    { label: "Archived", value: data.archived, color: "#040606" },
  ];

  const maxValue = Math.max(...chartData.map((item) => item.value));

  return (
    <div className="h-64 flex items-end justify-center space-x-8 p-6 bg-gray-50 rounded-lg">
      {chartData.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* animated bar - height value ke hisab se */}
          <motion.div
            className="w-16 rounded-t-lg"
            style={{ backgroundColor: item.color }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 200}px` }}
            transition={{ duration: 1, delay: index * 0.2 }}
          />
          {/* bar label aur value */}
          <div className="mt-2 text-center">
            <p className="text-xs font-medium" style={{ color: "#040606" }}>
              {item.label}
            </p>
            <p className="text-lg font-bold" style={{ color: item.color }}>
              {item.value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function PostsChart({ data }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        {/* header section - title aur total posts */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
            <h3 className="text-lg font-semibold" style={{ color: "#040606" }}>
              Posts Overview
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "#2691ce" }}>
              {data.total.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "#646464" }}>
              Total Posts
            </p>
          </div>
        </div>

        <BarChart data={data} />

        {/* recent activity indicator */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" style={{ color: "#2691ce" }} />
            <span className="text-sm font-medium" style={{ color: "#2691ce" }}>
              Last 72 Hours: {data.last72Hours} new posts
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
