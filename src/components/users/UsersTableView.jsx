"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  Mail,
  Building,
  Shield,
  ChevronUp,
  ChevronDown,
  User,
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

export default function UsersTableView({
  users,
  onViewUser,
  onDeleteUser,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortable = [...users];
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
  }, [users, sortConfig]);

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

  if (users.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No users to display
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
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  <SortIcon columnKey="firstName" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <SortIcon columnKey="email" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("companyName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Company</span>
                  <SortIcon columnKey="companyName" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Role
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Status
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Joined</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <motion.tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors"
                variants={rowVariants}
                whileHover="hover"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: "#2691ce" }}
                    >
                      {user.firstName?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: "#040606" }}>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.name || "Unknown User"}
                      </div>
                      {user.designation && (
                        <div className="text-sm" style={{ color: "#646464" }}>
                          {user.designation}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" style={{ color: "#646464" }} />
                    <span style={{ color: "#646464" }}>{user.email || "N/A"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" style={{ color: "#646464" }} />
                    <span style={{ color: "#646464" }}>
                      {user.companyName || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role && (
                    <span
                      className="px-2 py-1 rounded-md text-xs font-medium"
                      style={getRoleBadgeStyle(user.role)}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 py-1 rounded-md text-xs font-medium"
                    style={getStatusBadgeStyle(user.isActive !== false)}
                  >
                    {user.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" style={{ color: "#646464" }} />
                    <span style={{ color: "#646464" }}>
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      onClick={() => onViewUser(user)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onDeleteUser(user)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

