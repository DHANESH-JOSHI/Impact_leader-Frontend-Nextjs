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
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  TrendingUp,
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

export default function ViewQnaModal({ isOpen, onClose, qna, onEdit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Initialize edit form data when entering edit mode
  const handleEditToggle = () => {
    if (!isEditMode && qna) {
      setEditFormData({
        question: qna.question,
        answer: qna.answer,
        author: qna.author,
        category: qna.category,
        status: qna.status,
        priority: qna.priority,
        difficulty: qna.difficulty,
        tags: qna.tags ? qna.tags.join(", ") : "",
        featured: qna.featured,
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
    if (qna) {
      const updatedQna = {
        ...qna,
        ...editFormData,
        tags: editFormData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      onEdit(updatedQna);
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      case "medium":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "low":
        return { backgroundColor: "#dcfce7", color: "#16a34a" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "hard":
        return { backgroundColor: "#fee2e2", color: "#dc2626" };
      case "medium":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "easy":
        return { backgroundColor: "#dcfce7", color: "#16a34a" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  if (!qna) return null;

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
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
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
                    <HelpCircle
                      className="h-6 w-6"
                      style={{ color: "#2691ce" }}
                    />
                  )}
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {isEditMode ? "Edit Q&A" : "View Q&A"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    {isEditMode
                      ? "Make changes to this Q&A"
                      : "Question and answer details"}
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
                    <span>Edit Q&A</span>
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
                  {/* Question Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Question
                    </label>
                    <textarea
                      name="question"
                      value={editFormData.question || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none text-lg font-semibold"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Enter the question..."
                    />
                  </motion.div>

                  {/* Answer Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Answer
                    </label>
                    <textarea
                      name="answer"
                      value={editFormData.answer || ""}
                      onChange={handleInputChange}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Provide a comprehensive answer..."
                    />
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Leave empty if this question is not answered yet
                    </p>
                  </motion.div>

                  {/* Meta Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
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
                      transition={{ delay: 0.4 }}
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
                        placeholder="Question category..."
                      />
                    </motion.div>
                  </div>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={editFormData.priority || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={editFormData.difficulty || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
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

                    <motion.div
                      className="flex items-end"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg w-full">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={editFormData.featured || false}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{
                            color: "#2691ce",
                            focusRingColor: "#2691ce",
                          }}
                        />
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm" style={{ color: "#646464" }}>
                          Featured
                        </span>
                      </label>
                    </motion.div>
                  </div>

                  {/* Tags Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
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
                      placeholder="Enter tags separated by commas"
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Main Content Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Question Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h1
                              className="text-2xl font-bold leading-tight"
                              style={{ color: "#040606" }}
                            >
                              {qna.question}
                            </h1>
                            {qna.featured && (
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

                          {/* Badges Row */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={getStatusBadgeStyle(qna.status)}
                            >
                              {qna.status.charAt(0).toUpperCase() +
                                qna.status.slice(1)}
                            </span>
                            <span
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={getPriorityStyle(qna.priority)}
                            >
                              {qna.priority.charAt(0).toUpperCase() +
                                qna.priority.slice(1)}{" "}
                              Priority
                            </span>
                            <span
                              className="px-3 py-1 text-sm font-medium rounded-full"
                              style={getDifficultyStyle(qna.difficulty)}
                            >
                              {qna.difficulty.charAt(0).toUpperCase() +
                                qna.difficulty.slice(1)}
                            </span>
                          </div>

                          {/* Question Metadata */}
                          <div
                            className="flex flex-wrap items-center gap-6 text-sm mb-4"
                            style={{ color: "#646464" }}
                          >
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>By {qna.author}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(qna.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4" />
                              <span>{qna.category}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Updated {formatDate(qna.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Answer Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                          {qna.isAnswered ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <h3
                                className="text-lg font-semibold"
                                style={{ color: "#040606" }}
                              >
                                Answer
                              </h3>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-orange-500" />
                              <h3
                                className="text-lg font-semibold"
                                style={{ color: "#040606" }}
                              >
                                Pending Answer
                              </h3>
                            </>
                          )}
                        </div>

                        {qna.isAnswered ? (
                          <div
                            className="prose prose-lg max-w-none"
                            style={{ color: "#040606", lineHeight: "1.7" }}
                          >
                            {qna.answer.split("\n").map((paragraph, index) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-orange-800">
                              This question is still waiting for an answer.
                              Click "Edit Q&A" to add an answer.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Tags Section */}
                    {qna.tags && qna.tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="border-t border-gray-200 pt-6">
                          <h3
                            className="text-lg font-semibold mb-4"
                            style={{ color: "#040606" }}
                          >
                            Related Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {qna.tags.map((tag, index) => (
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
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                #{tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Statistics Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-6">
                      {/* Quick Stats */}
                      <motion.div
                        className="rounded-lg p-4"
                        style={{ backgroundColor: "#f8fafc" }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4
                          className="font-semibold mb-4"
                          style={{ color: "#040606" }}
                        >
                          Statistics
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Eye
                                className="h-4 w-4"
                                style={{ color: "#2691ce" }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: "#646464" }}
                              >
                                Views
                              </span>
                            </div>
                            <span
                              className="font-medium"
                              style={{ color: "#040606" }}
                            >
                              {qna.views.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span
                                className="text-sm"
                                style={{ color: "#646464" }}
                              >
                                Likes
                              </span>
                            </div>
                            <span
                              className="font-medium"
                              style={{ color: "#040606" }}
                            >
                              {qna.likes}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                              <span
                                className="text-sm"
                                style={{ color: "#646464" }}
                              >
                                Helpful
                              </span>
                            </div>
                            <span
                              className="font-medium"
                              style={{ color: "#040606" }}
                            >
                              {qna.helpful}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ThumbsDown className="h-4 w-4 text-red-500" />
                              <span
                                className="text-sm"
                                style={{ color: "#646464" }}
                              >
                                Not Helpful
                              </span>
                            </div>
                            <span
                              className="font-medium"
                              style={{ color: "#040606" }}
                            >
                              {qna.notHelpful}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Helpfulness Rating */}
                      <motion.div
                        className="rounded-lg p-4"
                        style={{ backgroundColor: "#f8fafc" }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4
                          className="font-semibold mb-4"
                          style={{ color: "#040606" }}
                        >
                          Helpfulness Rating
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: "#646464" }}>
                                Helpful ({qna.helpful})
                              </span>
                              <span style={{ color: "#646464" }}>
                                {Math.round(
                                  (qna.helpful /
                                    (qna.helpful + qna.notHelpful)) *
                                    100
                                ) || 0}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (qna.helpful /
                                      (qna.helpful + qna.notHelpful)) *
                                      100 || 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span style={{ color: "#646464" }}>
                                Not Helpful ({qna.notHelpful})
                              </span>
                              <span style={{ color: "#646464" }}>
                                {Math.round(
                                  (qna.notHelpful /
                                    (qna.helpful + qna.notHelpful)) *
                                    100
                                ) || 0}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (qna.notHelpful /
                                      (qna.helpful + qna.notHelpful)) *
                                      100 || 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Quick Actions */}
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.button
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share Q&A</span>
                        </motion.button>

                        <motion.button
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <TrendingUp className="h-4 w-4" />
                          <span>View Analytics</span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
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
