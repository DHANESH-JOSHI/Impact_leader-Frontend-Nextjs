import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Heart,
  User,
  Clock,
  ChevronUp,
  ChevronDown,
  Tag,
} from "lucide-react";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
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
      duration: 0.3,
    },
  },
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

export default function StoryTable({ stories, onView, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStories = React.useMemo(() => {
    let sortableStories = [...stories];
    if (sortConfig.key) {
      sortableStories.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStories;
  }, [stories, sortConfig]);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4" style={{ color: "#646464" }} />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" style={{ color: "#2691ce" }} />
    ) : (
      <ChevronDown className="w-4 h-4" style={{ color: "#2691ce" }} />
    );
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead style={{ backgroundColor: "#f8fafc" }}>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Story
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#646464" }}
                onClick={() => handleSort("author")}
              >
                <div className="flex items-center gap-1">
                  Author
                  <SortIcon columnKey="author" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#646464" }}
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#646464" }}
                onClick={() => handleSort("views")}
              >
                <div className="flex items-center gap-1">
                  Stats
                  <SortIcon columnKey="views" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ color: "#646464" }}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStories.map((story, index) => (
              <motion.tr
                key={story.id}
                className="hover:bg-gray-50 transition-colors"
                variants={rowVariants}
                transition={{ delay: index * 0.05 }}
              >
                {/* Story Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <motion.img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={story.image}
                        alt={story.title}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium max-w-xs truncate"
                        style={{ color: "#040606" }}
                      >
                        {story.title}
                      </div>
                      <div
                        className="text-sm max-w-xs truncate"
                        style={{ color: "#646464" }}
                      >
                        {story.content}
                      </div>
                      {/* Tags */}
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {story.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: "#2691ce" }}
                            >
                              {tag}
                            </span>
                          ))}
                          {story.tags.length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{story.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Author */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "#040606" }}
                  >
                    <User
                      className="w-4 h-4 mr-2"
                      style={{ color: "#646464" }}
                    />
                    {story.author}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        story.status
                      )}`}
                    >
                      {story.status.charAt(0).toUpperCase() +
                        story.status.slice(1)}
                    </span>
                    {story.isActive && (
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full ml-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </div>
                </td>

                {/* Stats */}
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: "#040606" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Eye
                        className="w-4 h-4 mr-1"
                        style={{ color: "#646464" }}
                      />
                      {story.views}
                    </div>
                    <div className="flex items-center">
                      <Heart
                        className="w-4 h-4 mr-1"
                        style={{ color: "#646464" }}
                      />
                      {story.likes}
                    </div>
                    <div className="flex items-center">
                      <Clock
                        className="w-4 h-4 mr-1"
                        style={{ color: "#646464" }}
                      />
                      {story.duration}h
                    </div>
                  </div>
                </td>

                {/* Created Date */}
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: "#646464" }}
                >
                  {formatTime(story.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      onClick={() => onView(story)}
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
                      onClick={() => onEdit(story)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(story.id)}
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
