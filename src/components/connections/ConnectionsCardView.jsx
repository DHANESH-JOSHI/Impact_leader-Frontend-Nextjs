"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Users,
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

export default function ConnectionsCardView({
  connections,
  onViewConnection,
  onDeleteConnection,
  onAcceptConnection,
  onRejectConnection,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "accepted":
        return { backgroundColor: "#10b981", color: "white" };
      case "pending":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "rejected":
        return { backgroundColor: "#ef4444", color: "white" };
      case "blocked":
        return { backgroundColor: "#6b7280", color: "white" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  if (connections.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No connections found
        </h3>
        <p style={{ color: "#646464" }}>
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {connections.map((connection) => {
        const user = connection.user || connection.requester || connection.recipient || {};
        const userName = user.name || user.firstName || user.username || user.email || "Unknown User";
        const userEmail = user.email || "";
        const userCompany = user.company || user.organization || "";

        return (
          <motion.div
            key={connection.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col min-h-[320px]"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-lg leading-tight mb-2 line-clamp-2 cursor-pointer"
                    style={{ color: "#040606" }}
                    onClick={() => onViewConnection(connection)}
                  >
                    {userName}
                  </h3>
                  {userEmail && (
                    <p className="text-sm mb-1 truncate" style={{ color: "#646464" }}>
                      {userEmail}
                    </p>
                  )}
                  {userCompany && (
                    <p className="text-xs mb-2 line-clamp-1" style={{ color: "#646464" }}>
                      {userCompany}
                    </p>
                  )}
                </div>
                <div
                  className="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2"
                  style={getStatusBadgeStyle(connection.status)}
                >
                  {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                </div>
              </div>

              {connection.type && (
                <div className="mb-3">
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                  >
                    {connection.type}
                  </span>
                </div>
              )}

              <div className="space-y-2 mt-auto">
                <div
                  className="flex items-center space-x-2 text-xs"
                  style={{ color: "#646464" }}
                >
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Connected: {formatDate(connection.createdAt)}</span>
                </div>
                {connection.mutualConnections > 0 && (
                  <div
                    className="flex items-center space-x-2 text-xs"
                    style={{ color: "#646464" }}
                  >
                    <Users className="h-3 w-3 flex-shrink-0" />
                    <span>{connection.mutualConnections} mutual connections</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-center justify-between space-x-2">
                <motion.button
                  onClick={() => onViewConnection(connection)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </motion.button>

                {connection.status === "pending" && onAcceptConnection && onRejectConnection && (
                  <>
                    <motion.button
                      onClick={() => onAcceptConnection(connection.id)}
                      className="p-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: "#10b981" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Accept"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onRejectConnection(connection.id)}
                      className="p-2 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: "#ef4444" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Reject"
                    >
                      <XCircle className="h-4 w-4" />
                    </motion.button>
                  </>
                )}

                {connection.status !== "pending" && (
                  <motion.button
                    onClick={() => onDeleteConnection(connection.id)}
                    className="p-2 text-gray-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

