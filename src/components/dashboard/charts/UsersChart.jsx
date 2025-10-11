"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, UserPlus } from "lucide-react";

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

// donut chart component - user statistics ke liye
const DonutChart = ({ data }) => {
  const total = data.total;
  const active = data.active;
  const inactive = total - active;

  const activePercentage = (active / total) * 100;
  const inactivePercentage = (inactive / total) * 100;

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const activeStrokeDasharray = `${
    (activePercentage / 100) * circumference
  } ${circumference}`;
  const inactiveStrokeDasharray = `${
    (inactivePercentage / 100) * circumference
  } ${circumference}`;

  return (
    <div className="h-64 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
      {/* animated donut chart */}
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* background circle */}
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />

          {/* active users arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="#2691ce"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={activeStrokeDasharray}
            strokeDashoffset="0"
            initial={{ strokeDasharray: "0 377" }}
            animate={{ strokeDasharray: activeStrokeDasharray }}
            transition={{ duration: 2, ease: "easeInOut" }}
            transform="rotate(-90 100 100)"
          />

          {/* inactive users arc */}
          <motion.circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="#646464"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={inactiveStrokeDasharray}
            strokeDashoffset={`-${(activePercentage / 100) * circumference}`}
            initial={{ strokeDasharray: "0 377" }}
            animate={{ strokeDasharray: inactiveStrokeDasharray }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            transform="rotate(-90 100 100)"
          />
        </svg>

        {/* center total count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "#2691ce" }}>
              {data.total.toLocaleString()}
            </p>
            <p className="text-xs" style={{ color: "#646464" }}>
              Total Users
            </p>
          </div>
        </div>
      </div>

      {/* legend - active/inactive/new users */}
      <div className="ml-8 space-y-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#2691ce" }}
          />
          <span className="text-sm" style={{ color: "#040606" }}>
            Active: {data.active.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#646464" }}
          />
          <span className="text-sm" style={{ color: "#040606" }}>
            Inactive: {inactive.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <UserPlus className="w-3 h-3" style={{ color: "#2691ce" }} />
          <span className="text-sm" style={{ color: "#040606" }}>
            New: {data.new.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function UsersChart({ data }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      <div className="p-6">
        {/* header section */}
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
          <h3 className="text-lg font-semibold" style={{ color: "#040606" }}>
            User Statistics
          </h3>
        </div>

        <DonutChart data={data} />
      </div>
    </motion.div>
  );
}
