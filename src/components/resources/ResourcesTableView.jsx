"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Heart,
  Star,
  ChevronUp,
  ChevronDown,
  Tag,
  Clock,
  Download,
  Play,
  Pause,
  Video,
  Volume2,
  FileText,
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

export default function ResourcesTableView({
  resources,
  onViewResource,
  onEditResource,
  onDeleteResource,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [playingId, setPlayingId] = useState(null);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorted resources
  const sortedResources = React.useMemo(() => {
    let sortableResources = [...resources];
    if (sortConfig.key) {
      sortableResources.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableResources;
  }, [resources, sortConfig]);

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

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handlePlay = (resourceId) => {
    setPlayingId(playingId === resourceId ? null : resourceId);
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

  if (resources.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No resources to display
          </h3>
          <p style={{ color: "#646464" }}>
            Your search didn't match any resources. Try different filters.
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
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-1">
                  <span>Resource</span>
                  <SortIcon columnKey="title" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("author")}
              >
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Author</span>
                  <SortIcon columnKey="author" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <SortIcon columnKey="type" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                  <SortIcon columnKey="category" />
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
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#040606" }}
                onClick={() => handleSort("views")}
              >
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Views</span>
                  <SortIcon columnKey="views" />
                </div>
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
            {sortedResources.map((resource, index) => (
              <motion.tr
                key={resource.id}
                className="border-b border-gray-100 last:border-b-0"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                {/* Resource Column */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
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

                      {/* Play button overlay for media */}
                      {(resource.type === "video" ||
                        resource.type === "audio") && (
                        <motion.button
                          onClick={() => handlePlay(resource.id)}
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {playingId === resource.id ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white" />
                          )}
                        </motion.button>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3
                          className="font-semibold text-sm leading-snug hover:underline cursor-pointer"
                          style={{ color: "#040606" }}
                          onClick={() => onViewResource(resource)}
                        >
                          {truncateText(resource.title, 50)}
                        </h3>
                        {resource.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#646464" }}>
                        {truncateText(resource.description, 80)}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div
                          className="flex items-center space-x-1 text-xs"
                          style={{ color: "#646464" }}
                        >
                          <span>{formatFileSize(resource.fileSize)}</span>
                        </div>
                        {resource.duration && (
                          <div
                            className="flex items-center space-x-1 text-xs"
                            style={{ color: "#646464" }}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(resource.duration)}</span>
                          </div>
                        )}
                        <div
                          className="flex items-center space-x-1 text-xs"
                          style={{ color: "#646464" }}
                        >
                          <Download className="h-3 w-3" />
                          <span>{resource.downloads}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: "#2691ce" }}
                            >
                              {tag}
                            </span>
                          ))}
                          {resource.tags.length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{resource.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Author Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#eff6ff" }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#2691ce" }}
                      >
                        {resource.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#040606" }}
                    >
                      {resource.author}
                    </span>
                  </div>
                </td>

                {/* Type Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div style={{ color: "#2691ce" }}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <span
                      className="text-sm font-medium capitalize"
                      style={{ color: "#040606" }}
                    >
                      {resource.type}
                    </span>
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                  >
                    {resource.category}
                  </span>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={getStatusBadgeStyle(resource.status)}
                  >
                    {resource.status.charAt(0).toUpperCase() +
                      resource.status.slice(1)}
                  </span>
                </td>

                {/* Date Column */}
                <td className="px-6 py-4">
                  <div className="text-sm" style={{ color: "#646464" }}>
                    {formatDate(resource.createdAt)}
                  </div>
                  <div className="text-xs" style={{ color: "#646464" }}>
                    {resource.createdAt &&
                      new Date(resource.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </td>

                {/* Views Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#040606" }}
                      >
                        {resource.views.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="flex items-center space-x-1 text-xs"
                      style={{ color: "#646464" }}
                    >
                      <Heart className="h-3 w-3" />
                      <span>{resource.likes}</span>
                    </div>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      onClick={() => onViewResource(resource)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="View Resource"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onEditResource(resource)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit Resource"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onDeleteResource(resource.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete Resource"
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

      {/* Table Footer with Summary */}
      <div
        className="border-t border-gray-200 px-6 py-4"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-6 text-sm"
            style={{ color: "#646464" }}
          >
            <span>
              Total Resources:{" "}
              <strong style={{ color: "#040606" }}>{resources.length}</strong>
            </span>
            <span>
              Videos:{" "}
              <strong style={{ color: "#2691ce" }}>
                {resources.filter((r) => r.type === "video").length}
              </strong>
            </span>
            <span>
              Audio:{" "}
              <strong style={{ color: "#10b981" }}>
                {resources.filter((r) => r.type === "audio").length}
              </strong>
            </span>
            <span>
              Documents:{" "}
              <strong style={{ color: "#f59e0b" }}>
                {resources.filter((r) => r.type === "document").length}
              </strong>
            </span>
            <span>
              Featured:{" "}
              <strong style={{ color: "#8b5cf6" }}>
                {resources.filter((r) => r.featured).length}
              </strong>
            </span>
          </div>

          <div
            className="flex items-center space-x-2 text-sm"
            style={{ color: "#646464" }}
          >
            <span>Total Views:</span>
            <strong style={{ color: "#040606" }}>
              {resources
                .reduce((total, resource) => total + resource.views, 0)
                .toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
