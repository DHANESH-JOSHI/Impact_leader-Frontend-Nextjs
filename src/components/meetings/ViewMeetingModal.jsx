"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  MapPin,
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

export default function ViewMeetingModal({
  isOpen,
  onClose,
  meeting,
}) {
  if (!meeting) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "scheduled":
        return { backgroundColor: "#3b82f6", color: "white" };
      case "in-progress":
        return { backgroundColor: "#10b981", color: "white" };
      case "completed":
        return { backgroundColor: "#6b7280", color: "white" };
      case "cancelled":
        return { backgroundColor: "#ef4444", color: "white" };
      case "pending-verification":
        return { backgroundColor: "#f59e0b", color: "white" };
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
                  Meeting Details
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  View meeting information
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
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#040606" }}>
                    {meeting.title}
                  </h3>
                  <div
                    className="px-3 py-1 text-sm font-medium rounded-full inline-block"
                    style={getStatusBadgeStyle(meeting.status)}
                  >
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1).replace("-", " ")}
                  </div>
                </div>

                {meeting.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <FileText className="h-4 w-4 inline mr-1" />
                      Description
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {meeting.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Date
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {formatDate(meeting.startTime)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      Time
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Video className="h-4 w-4 inline mr-1" />
                      Meeting Type
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {meeting.meetingType || "N/A"}
                    </p>
                  </div>
                  {meeting.timezone && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Timezone
                      </h4>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {meeting.timezone}
                      </p>
                    </div>
                  )}
                </div>

                {meeting.organizer && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Organizer
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {meeting.organizer}
                    </p>
                  </div>
                )}

                {meeting.attendees && meeting.attendees.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Users className="h-4 w-4 inline mr-1" />
                      Attendees ({meeting.attendees.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((email, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {meeting.meetingLink && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Meeting Link
                    </h4>
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {meeting.meetingLink}
                    </a>
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

