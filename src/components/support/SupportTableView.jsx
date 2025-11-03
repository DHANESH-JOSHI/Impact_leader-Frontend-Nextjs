"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  ChevronUp,
  ChevronDown,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
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

export default function SupportTableView({
  tickets,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  onUpdateStatus,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorted tickets data
  const sortedTickets = React.useMemo(() => {
    let sortableTickets = [...tickets];
    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTickets;
  }, [tickets, sortConfig]);

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "open":
        return { backgroundColor: "#3b82f6", color: "white" };
      case "in-progress":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "waiting":
        return { backgroundColor: "#8b5cf6", color: "white" };
      case "resolved":
        return { backgroundColor: "#10b981", color: "white" };
      case "closed":
        return { backgroundColor: "#6b7280", color: "white" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "urgent":
        return { backgroundColor: "#fee2e2", color: "#dc2626", fontWeight: "bold" };
      case "high":
        return { backgroundColor: "#fed7aa", color: "#ea580c" };
      case "medium":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "low":
        return { backgroundColor: "#dcfce7", color: "#16a34a" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const getDaysOpen = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  if (tickets.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8" style={{ color: "#646464" }} />
            </div>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No support tickets to display
          </h3>
          <p style={{ color: "#646464" }}>
            Your search didn't match any tickets. Try different filters.
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
          {/* Table Header */}
          <thead>
            <tr
              className="border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("ticketNumber")}
              >
                <div className="flex items-center space-x-1">
                  <span>Ticket #</span>
                  <SortIcon columnKey="ticketNumber" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-1">
                  <span>Subject</span>
                  <SortIcon columnKey="title" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold"
                style={{ color: "#040606" }}
              >
                Requester
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon columnKey="category" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <SortIcon columnKey="priority" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold"
                style={{ color: "#040606" }}
              >
                Days Open
              </th>
              <th
                className="text-center px-6 py-4 text-sm font-semibold"
                style={{ color: "#040606" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedTickets.map((ticket, index) => (
              <motion.tr
                key={ticket._id || ticket.id || index}
                className="border-b border-gray-200 last:border-b-0 cursor-pointer"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => onViewTicket(ticket)}
              >
                {/* Ticket Number */}
                <td className="px-6 py-4">
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: "#2691ce" }}
                  >
                    {ticket.ticketNumber || `#TK-${String(index + 1).padStart(5, '0')}`}
                  </span>
                </td>

                {/* Subject */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#040606" }}
                    >
                      {truncateText(ticket.title, 50)}
                    </p>
                    {ticket.description && (
                      <p className="text-xs" style={{ color: "#646464" }}>
                        {truncateText(ticket.description, 60)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Requester */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: "#2691ce" }}
                    >
                      {ticket.requester?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#040606" }}
                      >
                        {ticket.requester?.name || "Unknown User"}
                      </p>
                      {ticket.requester?.email && (
                        <p className="text-xs" style={{ color: "#646464" }}>
                          {ticket.requester.email}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" style={{ color: "#646464" }} />
                    <span className="text-sm" style={{ color: "#646464" }}>
                      {ticket.category || "General"}
                    </span>
                  </div>
                </td>

                {/* Priority */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={getPriorityStyle(ticket.priority)}
                  >
                    {ticket.priority?.toUpperCase() || "MEDIUM"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={getStatusBadgeStyle(ticket.status)}
                  >
                    {ticket.status === "in-progress"
                      ? "In Progress"
                      : ticket.status?.charAt(0).toUpperCase() +
                        ticket.status?.slice(1) || "Open"}
                  </span>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Calendar
                      className="h-3 w-3"
                      style={{ color: "#646464" }}
                    />
                    <span className="text-sm" style={{ color: "#646464" }}>
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </td>

                {/* Days Open */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" style={{ color: "#646464" }} />
                    <span className="text-sm" style={{ color: "#646464" }}>
                      {getDaysOpen(ticket.createdAt)} days
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div
                    className="flex items-center justify-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTicket(ticket);
                      }}
                      className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="View Ticket"
                    >
                      <Eye className="h-4 w-4" style={{ color: "#2691ce" }} />
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTicket(ticket);
                      }}
                      className="p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit Ticket"
                    >
                      <Edit className="h-4 w-4" style={{ color: "#f59e0b" }} />
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTicket(ticket);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete Ticket"
                    >
                      <Trash2
                        className="h-4 w-4"
                        style={{ color: "#ef4444" }}
                      />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Stats */}
      <div
        className="px-6 py-4 border-t border-gray-200"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#646464" }}>
            Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
