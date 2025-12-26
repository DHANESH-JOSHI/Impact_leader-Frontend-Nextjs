"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Play,
  Pause,
  Volume2,
  Video,
  FileText,
  Star,
  User,
  Calendar,
  Clock,
  Heart,
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

export default function ResourcesCardView({
  resources,
  onViewResource,
  onEditResource,
  onDeleteResource,
}) {
  const [playingId, setPlayingId] = useState(null);

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "published":
        return { backgroundColor: "#10b981", color: "white" };
      case "draft":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "archived":
        return { backgroundColor: "#6b7280", color: "white" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Volume2 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handlePlay = (resourceId) => {
    setPlayingId(playingId === resourceId ? null : resourceId);
  };

  if (resources.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No resources found
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
      {resources.map((resource) => (
        <motion.div
          key={resource.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col"
          variants={cardVariants}
          whileHover="hover"
        >
          {/* Resource Thumbnail */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            {resource.thumbnail ? (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <div style={{ color: "#2691ce" }}>
                  {getTypeIcon(resource.type)}
                </div>
              </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              {(resource.type === "video" || resource.type === "audio") && (
                <motion.button
                  onClick={() => handlePlay(resource.id)}
                  className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-3 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {playingId === resource.id ? (
                    <Pause className="h-6 w-6" style={{ color: "#2691ce" }} />
                  ) : (
                    <Play className="h-6 w-6" style={{ color: "#2691ce" }} />
                  )}
                </motion.button>
              )}
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={getStatusBadgeStyle(resource.status)}
              >
                {resource.status.charAt(0).toUpperCase() +
                  resource.status.slice(1)}
              </span>
            </div>

            {/* Featured Badge */}
            {resource.featured && (
              <div className="absolute top-3 right-3">
                <motion.div
                  className="bg-yellow-100 rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </motion.div>
              </div>
            )}

            {/* Type and Duration */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                {getTypeIcon(resource.type)}
                <span>{resource.type}</span>
              </div>
              {resource.duration && (
                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(resource.duration)}
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 flex-1 flex flex-col min-h-0">
            <h3
              className="font-semibold text-lg leading-tight mb-2 line-clamp-2 cursor-pointer"
              style={{ color: "#040606" }}
              onClick={() => onViewResource(resource)}
            >
              {resource.title}
            </h3>

            <p
              className="text-sm leading-relaxed mb-3 line-clamp-2"
              style={{ color: "#646464" }}
            >
              {resource.description.length > 100
                ? resource.description.slice(0, 100) + "..."
                : resource.description}
            </p>

            {/* Resource Meta */}
            <div className="space-y-2 mb-3">
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{resource.author}</span>
              </div>
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatDate(resource.createdAt)}</span>
              </div>
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatFileSize(resource.fileSize)}</span>
              </div>
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-between text-xs px-3 py-2 rounded"
              style={{ backgroundColor: "#f8fafc", color: "#646464" }}
            >
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{resource.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{resource.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-3 w-3" />
                <span>{resource.downloads}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 3).map((tag, index) => (
                  <motion.span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full text-white"
                    style={{ backgroundColor: "#2691ce" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{resource.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-3 bg-white border-t border-gray-100 mt-auto">
            <div className="flex items-center justify-between space-x-2">
              <motion.button
                onClick={() => onViewResource(resource)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>

              <motion.button
                onClick={() => onEditResource(resource)}
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
                onClick={() => onDeleteResource(resource.id)}
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
