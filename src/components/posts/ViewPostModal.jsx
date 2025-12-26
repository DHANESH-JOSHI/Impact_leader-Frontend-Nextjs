"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit,
  Eye,
  Heart,
  Calendar,
  User,
  Tag,
  Star,
  Clock,
  Share2,
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

export default function ViewPostModal({ isOpen, onClose, post, onEdit, themes: themesProp = null }) {
  // Handle modal close
  const handleClose = () => {
    onClose();
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.3)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#eff6ff" }}
                >
                  <Eye className="h-6 w-6" style={{ color: "#2691ce" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    View Post
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    Post details and content
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onEdit && (
                  <motion.button
                    onClick={() => {
                      if (onEdit) {
                        onEdit(post);
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    style={{ backgroundColor: "#2691ce" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Post</span>
                  </motion.button>
                )}

                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" style={{ color: "#646464" }} />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
              {post && (
                /* View Mode Display */
                <div className="p-6">
                  {/* Post Header Section */}
                  <motion.div
                    className="border-b border-gray-200 pb-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h1
                            className="text-3xl font-bold leading-tight"
                            style={{ color: "#040606" }}
                          >
                            {post.title}
                          </h1>
                          {post.isPinned && (
                            <motion.div
                              className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium text-yellow-600">
                                Featured
                              </span>
                            </motion.div>
                          )}
                        </div>

                        <p
                          className="text-lg leading-relaxed mb-4"
                          style={{ color: "#646464" }}
                        >
                          {post.excerpt}
                        </p>
                      </div>

                      <div
                        className="px-3 py-1 text-sm font-medium rounded-full ml-4 flex-shrink-0"
                        style={getStatusBadgeStyle(post.status)}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </div>
                    </div>

                    {/* Post Metadata */}
                    <motion.div
                      className="flex flex-wrap items-center gap-6 text-sm mb-4"
                      style={{ color: "#646464" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>By {post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                      {/* Category removed - Post model doesn't have category field */}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {calculateReadingTime(post.content)} min read
                        </span>
                      </div>
                    </motion.div>

                    {/* Post Statistics */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center space-x-6">
                        <div
                          className="flex items-center space-x-2 text-sm"
                          style={{ color: "#646464" }}
                        >
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()} views</span>
                        </div>
                        <div
                          className="flex items-center space-x-2 text-sm"
                          style={{ color: "#646464" }}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>

                      <motion.button
                        className="flex items-center space-x-2 text-sm px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                        style={{ color: "#646464" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share Post</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Main Content Display */}
                  <motion.div
                    className="prose prose-lg max-w-none mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div
                      className="text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#040606", lineHeight: "1.7" }}
                    >
                      {post.content}
                    </div>
                  </motion.div>

                  {/* Post Tags Section */}
                  {post.tags && post.tags.length > 0 && (
                    <motion.div
                      className="border-t border-gray-200 pt-6 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "#040606" }}
                      >
                        Related Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                            style={{
                              backgroundColor: "#eff6ff",
                              color: "#2691ce",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Themes Section */}
                  {post.themes && post.themes.length > 0 && (
                    <motion.div
                      className="border-t border-gray-200 pt-6 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "#040606" }}
                      >
                        Themes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.themes.map((theme, index) => {
                          const themeName = typeof theme === 'string' ? theme : (theme?.name || String(theme?._id || theme?.id || theme || ''));
                          return (
                            <motion.span
                              key={index}
                              className="px-3 py-1 text-sm rounded-full"
                              style={{
                                backgroundColor: "#fef3c7",
                                color: "#92400e",
                              }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                            >
                              {themeName}
                            </motion.span>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Media Section */}
                  {post.media && post.media.length > 0 && (
                    <motion.div
                      className="border-t border-gray-200 pt-6 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "#040606" }}
                      >
                        Media Attachments ({post.media.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {post.media.map((media, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Tag className="h-4 w-4" style={{ color: "#646464" }} />
                              <span className="text-xs font-medium capitalize" style={{ color: "#646464" }}>
                                {media.type || 'Unknown'}
                              </span>
                            </div>
                            {media.url && (
                              <a
                                href={media.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                                style={{ color: "#2691ce" }}
                              >
                                {media.filename || media.url}
                              </a>
                            )}
                            {media.size && (
                              <p className="text-xs mt-1" style={{ color: "#646464" }}>
                                Size: {(media.size / 1024).toFixed(2)} KB
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Engagement & Settings Section */}
                  <motion.div
                    className="border-t border-gray-200 pt-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "#040606" }}
                    >
                      Engagement & Settings
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs" style={{ color: "#646464" }}>Upvotes</p>
                        <p className="text-lg font-semibold" style={{ color: "#10b981" }}>
                          {Array.isArray(post.upvotes) ? post.upvotes.length : (post.upvotes || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#646464" }}>Downvotes</p>
                        <p className="text-lg font-semibold" style={{ color: "#ef4444" }}>
                          {Array.isArray(post.downvotes) ? post.downvotes.length : (post.downvotes || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#646464" }}>Score</p>
                        <p className="text-lg font-semibold" style={{ color: "#040606" }}>
                          {post.score || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#646464" }}>Comments</p>
                        <p className="text-lg font-semibold" style={{ color: "#040606" }}>
                          {Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs" style={{ color: "#646464" }}>Public:</span>
                        <span className={`text-xs font-medium ${post.isPublic !== false ? 'text-green-600' : 'text-red-600'}`}>
                          {post.isPublic !== false ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs" style={{ color: "#646464" }}>Comments Allowed:</span>
                        <span className={`text-xs font-medium ${post.allowComments !== false ? 'text-green-600' : 'text-red-600'}`}>
                          {post.allowComments !== false ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Author & Timestamps Section */}
                  <motion.div
                    className="border-t border-gray-200 pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h3
                      className="text-sm font-medium mb-4"
                      style={{ color: "#040606" }}
                    >
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.author && typeof post.author === 'object' && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: "#646464" }}>Author Details</p>
                          <p className="text-sm font-medium">{post.author.firstName} {post.author.lastName}</p>
                          {post.author.email && (
                            <p className="text-xs" style={{ color: "#646464" }}>{post.author.email}</p>
                          )}
                        </div>
                      )}
                      {post.createdAt && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: "#646464" }}>Created At</p>
                          <p className="text-sm font-medium">{formatDate(post.createdAt)}</p>
                        </div>
                      )}
                      {post.updatedAt && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: "#646464" }}>Last Updated</p>
                          <p className="text-sm font-medium">{formatDate(post.updatedAt)}</p>
                        </div>
                      )}
                      {post.id && (
                        <div>
                          <p className="text-xs mb-1" style={{ color: "#646464" }}>Post ID</p>
                          <p className="text-xs font-mono" style={{ color: "#646464" }}>{post.id}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
