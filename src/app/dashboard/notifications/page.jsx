"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { NotificationsService } from "@/services/notificationsService";
import { Bell, CheckCircle, XCircle, Trash2, Eye } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [pagination.page, filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter === "unread" && { isRead: false }),
        ...(filter === "read" && { isRead: true }),
      };

      const result = await NotificationsService.getNotifications(params);

      if (result.success) {
        const notificationsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        setNotifications(notificationsData);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || notificationsData.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || notificationsData.length) / pagination.limit),
        }));
      } else {
        toast.error(result.message || "Failed to load notifications");
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error(error.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const result = await NotificationsService.getUnreadCount();
      if (result.success) {
        setUnreadCount(result.data || 0);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await NotificationsService.markAsRead(notificationId);
      if (result.success) {
        toast.success("Notification marked as read");
        await loadNotifications();
        await loadUnreadCount();
      } else {
        toast.error(result.message || "Failed to mark as read");
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error(error.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await NotificationsService.markAllAsRead();
      if (result.success) {
        toast.success("All notifications marked as read");
        await loadNotifications();
        await loadUnreadCount();
      } else {
        toast.error(result.message || "Failed to mark all as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error(error.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const result = await NotificationsService.deleteNotification(notificationId);
      if (result.success) {
        toast.success("Notification deleted");
        await loadNotifications();
        await loadUnreadCount();
      } else {
        toast.error(result.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error(error.message || "Failed to delete notification");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <Bell className="h-6 w-6" style={{ color: "#2691ce" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
                Notifications
              </h1>
              <p className="text-sm" style={{ color: "#646464" }}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Mark all as read
            </motion.button>
          )}
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "text-white"
                : "bg-white border border-gray-300"
            }`}
            style={filter === "all" ? { backgroundColor: "#2691ce" } : { color: "#646464" }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "unread"
                ? "text-white"
                : "bg-white border border-gray-300"
            }`}
            style={filter === "unread" ? { backgroundColor: "#2691ce" } : { color: "#646464" }}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "read"
                ? "text-white"
                : "bg-white border border-gray-300"
            }`}
            style={filter === "read" ? { backgroundColor: "#2691ce" } : { color: "#646464" }}
          >
            Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "#2691ce" }}></div>
            <p className="text-lg" style={{ color: "#646464" }}>
              Loading notifications...
            </p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Bell className="h-12 w-12 mx-auto mb-4" style={{ color: "#646464" }} />
          <p className="text-lg" style={{ color: "#646464" }}>
            No notifications found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification._id || notification.id}
              className={`bg-white rounded-lg shadow-sm border p-4 ${
                !notification.isRead ? "border-l-4" : ""
              }`}
              style={!notification.isRead ? { borderLeftColor: "#2691ce" } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold" style={{ color: "#040606" }}>
                      {notification.title || notification.message || "Notification"}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2691ce" }}></span>
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#646464" }}>
                    {notification.message || notification.description || ""}
                  </p>
                  <p className="text-xs" style={{ color: "#646464" }}>
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <motion.button
                      onClick={() => handleMarkAsRead(notification._id || notification.id)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Mark as read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleDelete(notification._id || notification.id)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Previous
          </button>
          <span className="px-4 py-2" style={{ color: "#646464" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

