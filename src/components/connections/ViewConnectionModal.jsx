"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Building,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ViewConnectionModal({
  isOpen,
  onClose,
  connection,
}) {
  if (!connection) return null;

  const user = connection.user || connection.requester || connection.recipient || {};
  const userName = user.name || user.firstName || user.username || user.email || "Unknown User";
  const userEmail = user.email || "";
  const userCompany = user.company || user.organization || "";
  const userBio = user.bio || user.description || "";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.4)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  Connection Details
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  View connection information
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: "#2691ce" }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "#040606" }}>
                      {userName}
                    </h3>
                    {userEmail && (
                      <p className="text-sm mb-1" style={{ color: "#646464" }}>
                        <Mail className="h-4 w-4 inline mr-1" />
                        {userEmail}
                      </p>
                    )}
                    {userCompany && (
                      <p className="text-sm" style={{ color: "#646464" }}>
                        <Building className="h-4 w-4 inline mr-1" />
                        {userCompany}
                      </p>
                    )}
                  </div>
                  <div
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={getStatusBadgeStyle(connection.status)}
                  >
                    {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                  </div>
                </div>

                {userBio && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      About
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {userBio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Connection Type
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {connection.type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Mutual Connections
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {connection.mutualConnections || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Connected Date
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {formatDate(connection.createdAt)}
                    </p>
                  </div>
                  {connection.updatedAt && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                        <Clock className="h-4 w-4 inline mr-1" />
                        Last Updated
                      </h4>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {formatDate(connection.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {connection.message && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Connection Message
                    </h4>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {connection.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: "#646464" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

