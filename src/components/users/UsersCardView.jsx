"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  User,
  Mail,
  Building,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function UsersCardView({
  users,
  onViewUser,
  onDeleteUser,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (isActive) => {
    if (isActive) {
      return { backgroundColor: "#10b981", color: "white" };
    }
    return { backgroundColor: "#ef4444", color: "white" };
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return { backgroundColor: "#8b5cf6", color: "white" };
      case "moderator":
        return { backgroundColor: "#3b82f6", color: "white" };
      case "user":
        return { backgroundColor: "#6b7280", color: "white" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  if (users.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No users found
        </h3>
        <p style={{ color: "#646464" }}>
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {users.map((user) => (
        <motion.div
          key={user.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: "#2691ce" }}
              >
                {user.firstName?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: "#040606" }}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.name || user.email || "Unknown User"}
                </h3>
                <p className="text-sm" style={{ color: "#646464" }}>
                  {user.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {user.companyName && (
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4" style={{ color: "#646464" }} />
                <span style={{ color: "#646464" }}>{user.companyName}</span>
              </div>
            )}
            {user.designation && (
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" style={{ color: "#646464" }} />
                <span style={{ color: "#646464" }}>{user.designation}</span>
              </div>
            )}
            {user.organizationType && (
              <div className="flex items-center space-x-2 text-sm">
                <Building className="h-4 w-4" style={{ color: "#646464" }} />
                <span style={{ color: "#646464" }} className="capitalize">
                  {user.organizationType}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4" style={{ color: "#646464" }} />
              <span style={{ color: "#646464" }}>
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="px-2 py-1 rounded-md text-xs font-medium"
              style={getStatusBadgeStyle(user.isActive !== false)}
            >
              {user.isActive !== false ? "Active" : "Inactive"}
            </span>
            {user.role && (
              <span
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={getRoleBadgeStyle(user.role)}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
            <motion.button
              onClick={() => onViewUser(user)}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </motion.button>
            <motion.button
              onClick={() => onDeleteUser(user)}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

