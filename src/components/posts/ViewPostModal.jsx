"use client";

import React, { useState } from "react";
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
  Save,
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

export default function ViewPostModal({ isOpen, onClose, post, onEdit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Initialize edit form data when entering edit mode
  const handleEditToggle = () => {
    if (!isEditMode && post) {
      setEditFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
        tags: post.tags ? post.tags.join(", ") : "",
        featured: post.featured,
      });
    }
    setIsEditMode(!isEditMode);
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (post) {
      const updatedPost = {
        ...post,
        ...editFormData,
        tags: editFormData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      onEdit(updatedPost);
      setIsEditMode(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setIsEditMode(false);
    setEditFormData({});
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

  if (!post){ return null;}
  else{
    console.log("post:",post)
  }

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
                  {isEditMode ? (
                    <Edit className="h-6 w-6" style={{ color: "#2691ce" }} />
                  ) : (
                    <Eye className="h-6 w-6" style={{ color: "#2691ce" }} />
                  )}
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {isEditMode ? "Edit Post" : "View Post"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    {isEditMode
                      ? "Make changes to your post"
                      : "Post details and content"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!isEditMode && (
                  <motion.button
                    onClick={handleEditToggle}
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
              {isEditMode ? (
                /* Edit Mode Interface */
                <div className="p-6 space-y-6">
                  {/* Post Title Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Post Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-lg font-semibold"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Enter post title..."
                    />
                  </motion.div>

                  {/* Meta Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        <User className="inline h-4 w-4 mr-1" />
                        Author
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={editFormData.author || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="Author name..."
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        <Tag className="inline h-4 w-4 mr-1" />
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={editFormData.category || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="Post category..."
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Status
                      </label>
                      <select
                        name="status"
                        value={editFormData.status || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </motion.div>
                  </div>

                  {/* Featured Post Toggle */}
                  <motion.div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "#f8fafc" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={editFormData.featured || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded focus:ring-2"
                        style={{ color: "#2691ce", focusRingColor: "#2691ce" }}
                      />
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#040606" }}
                        >
                          Mark as Featured Post
                        </span>
                      </div>
                    </label>
                    <p
                      className="text-xs mt-2 ml-8"
                      style={{ color: "#646464" }}
                    >
                      Featured posts appear prominently on your site
                    </p>
                  </motion.div>

                  {/* Post Excerpt */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Post Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      value={editFormData.excerpt || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Write a compelling excerpt that summarizes your post..."
                    />
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      This excerpt will be shown in post previews and search
                      results
                    </p>
                  </motion.div>

                  {/* Full Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Post Content
                    </label>
                    <textarea
                      name="content"
                      value={editFormData.content || ""}
                      onChange={handleInputChange}
                      rows={15}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none font-mono text-sm"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Write your full post content here..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs" style={{ color: "#646464" }}>
                        The main content of your post
                      </p>
                      <span className="text-xs" style={{ color: "#646464" }}>
                        {(editFormData.content || "").length} characters
                      </span>
                    </div>
                  </motion.div>

                  {/* Tags Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={editFormData.tags || ""}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas (e.g., technology, tutorial, react)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Separate multiple tags with commas for better
                      discoverability
                    </p>
                  </motion.div>
                </div>
              ) : (
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
                          {post.featured && (
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
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4" />
                        <span>{post.category}</span>
                      </div>
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
                      className="border-t border-gray-200 pt-6"
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
                </div>
              )}
            </div>

            {/* Modal Footer - Only shows in edit mode */}
            {isEditMode && (
              <div
                className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <motion.button
                  onClick={handleEditToggle}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "#646464" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel Changes
                </motion.button>
                <motion.button
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  style={{ backgroundColor: "#2691ce" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
