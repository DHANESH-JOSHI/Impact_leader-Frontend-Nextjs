import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Heart,
  Clock,
  User,
  Tag,
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function StoryCard({ stories, onView, onEdit, onDelete }) {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          {/* Story Image */}
          <div className="relative">
            <motion.img
              src={story.image}
              alt={story.title}
              className="w-full h-48 object-cover rounded-t-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <motion.span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  story.status
                )}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
              </motion.span>
            </div>
            {/* Active Indicator */}
            {story.isActive && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </div>

          {/* Story Content */}
          <div className="p-4 flex-1 flex flex-col min-h-0">
            {/* Title */}
            <h3
              className="font-semibold mb-2 line-clamp-1"
              style={{ color: "#040606" }}
            >
              {story.title}
            </h3>

            {/* Content Preview */}
            <p
              className="text-sm mb-3 line-clamp-2"
              style={{ color: "#646464" }}
            >
              {story.content}
            </p>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {story.tags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full text-white"
                    style={{ backgroundColor: "#2691ce" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + tagIndex * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
                {story.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    +{story.tags.length - 3}
                  </span>
                )}
              </motion.div>
            )}

            {/* Themes */}
            {story.themes && story.themes.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {story.themes.slice(0, 3).map((theme, themeIndex) => {
                  const themeName = typeof theme === 'string' ? theme : (theme.name || theme);
                  return (
                    <motion.span
                      key={themeName}
                      className="px-2 py-1 text-xs rounded-full text-white"
                      style={{ backgroundColor: "#10b981" }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + themeIndex * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {themeName}
                    </motion.span>
                  );
                })}
                {story.themes.length > 3 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    +{story.themes.length - 3}
                  </span>
                )}
              </motion.div>
            )}

            {/* Author Info */}
            <div
              className="flex items-center text-sm mb-3"
              style={{ color: "#646464" }}
            >
              <User className="w-4 h-4 mr-1" />
              <span>{story.author}</span>
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-between text-sm mb-4"
              style={{ color: "#646464" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{story.views || 0}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{story.likes || 0}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{story.duration || 24}h</span>
              </div>
            </div>

            {/* Created Date */}
            <p className="text-xs mb-4" style={{ color: "#646464" }}>
              Created: {formatTime(story.createdAt)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="p-3 bg-white border-t border-gray-100 mt-auto">
            <div className="flex items-center justify-end space-x-2">
              <motion.button
                onClick={() => onView(story)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>
              <motion.button
                onClick={() => onEdit(story)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              <motion.button
                onClick={() => onDelete(story.id)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
