"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Activity } from "lucide-react";

// item animation variants - chart ke liye
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

// line chart component - stories analytics ke liye
const LineChart = ({ data }) => {
  // sample points for line chart
  const points = [
    { x: 20, y: 180 },
    { x: 80, y: 120 },
    { x: 140, y: 100 },
    { x: 200, y: 80 },
    { x: 260, y: 60 },
    { x: 320, y: 40 },
  ];

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="h-64 bg-gray-50 rounded-lg p-6">
      <svg width="100%" height="100%" viewBox="0 0 360 200">
        {/* gradient definition */}
        <defs>
          <linearGradient
            id="storiesGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2691ce" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2691ce" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* animated line path */}
        <motion.path
          d={pathData}
          stroke="#2691ce"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* area fill under line */}
        <motion.path
          d={`${pathData} L 320 200 L 20 200 Z`}
          fill="url(#storiesGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#2691ce"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
          />
        ))}
      </svg>

      {/* stats below chart */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: "#2691ce" }}>
            {data.active.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#646464" }}>
            Active
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: "#646464" }}>
            {data.archived.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#646464" }}>
            Archived
          </p>
        </div>
      </div>
    </div>
  );
};

export default function StoriesChart({ data }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        {/* header section - title aur total count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
            <h3 className="text-lg font-semibold" style={{ color: "#040606" }}>
              Stories Analytics
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "#2691ce" }}>
              {data.total.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "#646464" }}>
              Total Stories
            </p>
          </div>
        </div>

        <LineChart data={data} />
      </div>
    </motion.div>
  );
}
