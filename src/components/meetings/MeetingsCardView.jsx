"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Users,
  Video,
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

export default function MeetingsCardView({
  meetings,
  onViewMeeting,
  onEditMeeting,
  onDeleteMeeting,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  if (meetings.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No meetings found
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
      {meetings.map((meeting) => (
        <motion.div
          key={meeting.id}
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
                  onClick={() => onViewMeeting(meeting)}
                >
                  {meeting.title}
                </h3>
                {meeting.description && (
                  <p className="text-sm mb-2 line-clamp-2" style={{ color: "#646464" }}>
                    {meeting.description}
                  </p>
                )}
              </div>
              <div
                className="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2"
                style={getStatusBadgeStyle(meeting.status)}
              >
                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1).replace("-", " ")}
              </div>
            </div>

            {meeting.meetingType && (
              <div className="mb-3">
                <span
                  className="px-2 py-1 text-xs rounded flex items-center space-x-1"
                  style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                >
                  <Video className="h-3 w-3" />
                  <span>{meeting.meetingType}</span>
                </span>
              </div>
            )}

            <div className="space-y-2 mt-auto">
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatDate(meeting.startTime)}</span>
              </div>
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
              </div>
              {meeting.attendeeCount > 0 && (
                <div
                  className="flex items-center space-x-2 text-xs"
                  style={{ color: "#646464" }}
                >
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span>{meeting.attendeeCount} attendees</span>
                </div>
              )}
              {meeting.organizer && (
                <div
                  className="flex items-center space-x-2 text-xs"
                  style={{ color: "#646464" }}
                >
                  <span className="truncate">Organizer: {meeting.organizer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between space-x-2">
              <motion.button
                onClick={() => onViewMeeting(meeting)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>

              <motion.button
                onClick={() => onEditMeeting(meeting)}
                className="p-2 text-gray-600 hover:text-white rounded-lg transition-colors"
                style={{ backgroundColor: "transparent" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2691ce";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#6b7280";
                }}
              >
                <Edit className="h-4 w-4" />
              </motion.button>

              <motion.button
                onClick={() => onDeleteMeeting(meeting.id)}
                className="p-2 text-gray-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

