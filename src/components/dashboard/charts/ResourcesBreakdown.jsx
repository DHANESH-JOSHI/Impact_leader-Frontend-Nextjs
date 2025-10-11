"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, Video, FileText, File, Bookmark, Tag } from "lucide-react";

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

// pie chart component - resources breakdown dikhane ke liye
const PieChart = ({ data }) => {
  const chartData = [
    { label: "Videos", value: data.videos, color: "#2691ce", icon: Video },
    { label: "PDFs", value: data.pdfs, color: "#646464", icon: FileText },
    { label: "Articles", value: data.articles, color: "#040606", icon: File },
    {
      label: "Research",
      value: data.researchPapers,
      color: "#10b981",
      icon: Bookmark,
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="h-64 bg-gray-50 rounded-lg p-6 flex items-center">
      {/* animated pie chart */}
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 42 42">
          {chartData.map((segment, index) => {
            const percentage = (segment.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = 25 - cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1.5, delay: index * 0.3 }}
                transform="rotate(-90 21 21)"
              />
            );
          })}
        </svg>

        {/* center total count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold" style={{ color: "#2691ce" }}>
              {data.total}
            </p>
            <p className="text-xs" style={{ color: "#646464" }}>
              Resources
            </p>
          </div>
        </div>
      </div>

      {/* legend with icons aur values */}
      <div className="ml-6 space-y-2">
        {chartData.map((segment, index) => {
          const Icon = segment.icon;
          return (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
            >
              <Icon className="w-4 h-4" style={{ color: segment.color }} />
              <span className="text-sm" style={{ color: "#040606" }}>
                {segment.label}: {segment.value}
              </span>
            </motion.div>
          );
        })}

        {/* tags count */}
        <motion.div
          className="flex items-center space-x-2 pt-2 border-t border-gray-200"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.4 }}
        >
          <Tag className="w-4 h-4" style={{ color: "#2691ce" }} />
          <span className="text-sm" style={{ color: "#040606" }}>
            Tags: {data.tags}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default function ResourcesBreakdown({ data }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        {/* header section */}
        <div className="flex items-center mb-4">
          <FolderOpen className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#040606" }}>
            Resources Breakdown
          </h3>
        </div>

        <PieChart data={data} />
      </div>
    </motion.div>
  );
}
