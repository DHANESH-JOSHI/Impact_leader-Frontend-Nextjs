"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    backgroundColor: "#f8fafc",
    transition: {
      duration: 0.2,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

export default function ConnectionsTableView({
  connections,
  onViewConnection,
  onDeleteConnection,
  onAcceptConnection,
  onRejectConnection,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedConnections = React.useMemo(() => {
    let sortable = [...connections];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [connections, sortConfig]);

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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="h-4 w-4 opacity-40" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" style={{ color: "#2691ce" }} />
    ) : (
      <ChevronDown className="h-4 w-4" style={{ color: "#2691ce" }} />
    );
  };

  if (connections.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No connections to display
          </h3>
          <p style={{ color: "#646464" }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: "#f8fafc" }}>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <SortIcon columnKey="type" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "#646464" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedConnections.map((connection) => {
              const user = connection.user || connection.requester || connection.recipient || {};
              const userName = user.name || user.firstName || user.username || user.email || "Unknown User";
              const userEmail = user.email || "";

              return (
                <motion.tr
                  key={connection.id}
                  variants={rowVariants}
                  whileHover="hover"
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#040606" }}>
                        {userName}
                      </div>
                      {userEmail && (
                        <div className="text-sm" style={{ color: "#646464" }}>
                          {userEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                    >
                      {connection.type || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={getStatusBadgeStyle(connection.status)}
                    >
                      {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "#646464" }}>
                    {formatDate(connection.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <motion.button
                        onClick={() => onViewConnection(connection)}
                        className="p-2 text-gray-600 hover:text-white hover:bg-blue-500 rounded-lg transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
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
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

