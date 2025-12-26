"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Tag,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { SupportService } from "@/services/supportService";
import toast from "react-hot-toast";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ViewTicketModal({ isOpen, onClose, ticket, onSuccess }) {
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState(ticket?.status || "open");

  const statuses = SupportService.getStatusOptions();
  const priorities = SupportService.getPriorityLevels();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeStyle = (status) => {
    const statusOption = statuses.find((s) => s.value === status);
    const colorMap = {
      blue: { backgroundColor: "#dbeafe", color: "#1e40af" },
      yellow: { backgroundColor: "#fef3c7", color: "#d97706" },
      purple: { backgroundColor: "#ede9fe", color: "#7c3aed" },
      green: { backgroundColor: "#dcfce7", color: "#16a34a" },
      gray: { backgroundColor: "#f3f4f6", color: "#6b7280" },
    };
    return colorMap[statusOption?.color] || colorMap.gray;
  };

  const getPriorityStyle = (priority) => {
    const priorityOption = priorities.find((p) => p.value === priority);
    const colorMap = {
      red: { backgroundColor: "#fee2e2", color: "#dc2626" },
      orange: { backgroundColor: "#fed7aa", color: "#ea580c" },
      yellow: { backgroundColor: "#fef3c7", color: "#d97706" },
      green: { backgroundColor: "#dcfce7", color: "#16a34a" },
    };
    return colorMap[priorityOption?.color] || colorMap.green;
  };

  const handleStatusChange = async (newStatusValue) => {
    if (newStatusValue === newStatus) return; // No change needed
    
    setIsSubmitting(true);
    setError("");

    try {
      const ticketId = ticket.id || ticket._id;
      const result = await SupportService.updateStatus(ticketId, newStatusValue);

      if (result.success) {
        setNewStatus(newStatusValue);
        toast.success("Ticket status updated successfully");
        if (onSuccess) {
          onSuccess(); // Refresh ticket list
        }
      } else {
        setError(result.message || "Failed to update status");
        toast.error(result.message || "Failed to update status");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while updating status";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const ticketId = ticket.id || ticket._id;
      const result = await SupportService.addReply(ticketId, { message: reply.trim() });

      if (result.success) {
        setReply("");
        toast.success("Reply added successfully");
        if (onSuccess) {
          onSuccess(); // Refresh ticket list
        }
      } else {
        setError(result.message || "Failed to add reply");
        toast.error(result.message || "Failed to add reply");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while adding reply";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#040606" }}>
                Ticket Details
              </h2>
              <p className="text-sm font-mono" style={{ color: "#2691ce" }}>
                {ticket.ticketNumber || "#TK-00000"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" style={{ color: "#646464" }} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Ticket Information */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              {/* Title */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: "#646464" }}
                >
                  Subject
                </h3>
                <p className="text-lg font-semibold" style={{ color: "#040606" }}>
                  {ticket.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3
                  className="text-sm font-medium mb-2"
                  style={{ color: "#646464" }}
                >
                  Description
                </h3>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "#040606" }}>
                  {ticket.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Status */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "#646464" }}>
                    Status
                  </p>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={getStatusBadgeStyle(newStatus)}
                  >
                    {newStatus === "in-progress"
                      ? "In Progress"
                      : newStatus?.charAt(0).toUpperCase() + newStatus?.slice(1)}
                  </span>
                </div>

                {/* Priority */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "#646464" }}>
                    Priority
                  </p>
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    style={getPriorityStyle(ticket.priority)}
                  >
                    {ticket.priority?.toUpperCase()}
                  </span>
                </div>

                {/* Category */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "#646464" }}>
                    Category
                  </p>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" style={{ color: "#646464" }} />
                    <span className="text-sm" style={{ color: "#040606" }}>
                      {ticket.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "#646464" }}>
                    Created
                  </p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" style={{ color: "#646464" }} />
                    <span className="text-xs" style={{ color: "#040606" }}>
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requester Information */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-medium mb-2" style={{ color: "#646464" }}>
                  Requester
                </p>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: "#2691ce" }}
                  >
                    {ticket.requester?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#040606" }}>
                      {ticket.requester?.name || "Unknown User"}
                    </p>
                    <p className="text-xs" style={{ color: "#646464" }}>
                      {ticket.requester?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Status Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <label
                htmlFor="status-select"
                className="block text-sm font-medium mb-2"
                style={{ color: "#040606" }}
              >
                Change Status
              </label>
              <select
                id="status-select"
                value={newStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ focusRingColor: "#2691ce" }}
                disabled={isSubmitting}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Replies Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "#040606" }}>
                Replies ({ticket.replies?.length || 0})
              </h3>

              {/* Replies List */}
              <div className="space-y-4 mb-4">
                {ticket.replies && ticket.replies.length > 0 ? (
                  ticket.replies.map((replyItem, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" style={{ color: "#646464" }} />
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#040606" }}
                          >
                            {replyItem.author?.name || "Admin"}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                          >
                            {replyItem.author?.role || "support"}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: "#646464" }}>
                          {formatDate(replyItem.createdAt || new Date())}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "#040606" }}>
                        {replyItem.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm py-8" style={{ color: "#646464" }}>
                    No replies yet
                  </p>
                )}
              </div>

              {/* Add Reply Form */}
              <form onSubmit={handleSubmitReply} className="space-y-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                  style={{ focusRingColor: "#2691ce" }}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#2691ce" }}
                    disabled={isSubmitting || !reply.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
