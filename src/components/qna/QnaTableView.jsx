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
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
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

export default function QnaTableView({
  qnaData,
  onViewQna,
  onEditQna,
  onDeleteQna,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorted Q&A data
  const sortedQnaData = React.useMemo(() => {
    let sortableQnaData = [...qnaData];
    if (sortConfig.key) {
      sortableQnaData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableQnaData;
  }, [qnaData, sortConfig]);

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
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

  if (qnaData.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No Q&A entries to display
          </h3>
          <p style={{ color: "#646464" }}>
            Your search didn't match any questions. Try different filters.
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
                onClick={() => handleSort("question")}
              >
                <div className="flex items-center space-x-1">
                  <span>Question</span>
                  <SortIcon columnKey="question" />
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
                onClick={() => handleSort("isAnswered")}
              >
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Status</span>
                  <SortIcon columnKey="isAnswered" />
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
            {sortedQnaData.map((qna, index) => (
              <motion.tr
                key={qna.id}
                className="border-b border-gray-100 last:border-b-0"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                {/* Question Column */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3
                          className="font-semibold text-sm leading-snug hover:underline cursor-pointer"
                          style={{ color: "#040606" }}
                          onClick={() => onViewQna(qna)}
                        >
                          {truncateText(qna.question, 70)}
                        </h3>
                        {qna.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>

                      {/* Answer Preview */}
                      {qna.isAnswered && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#646464" }}
                        >
                          {truncateText(qna.answer, 100)}
                        </p>
                      )}

                      <div className="flex items-center space-x-3 mt-2">
                        <div
                          className="flex items-center space-x-1 text-xs"
                          style={{ color: "#646464" }}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{qna.helpful}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {qna.tags && qna.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {qna.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: "#2691ce" }}
                            >
                              {tag}
                            </span>
                          ))}
                          {qna.tags.length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{qna.tags.length - 2}
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
                        {qna.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#040606" }}
                    >
                      {qna.author}
                    </span>
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-6 py-4">
                  <span
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                  >
                    {qna.category}
                  </span>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <span
                      className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                      style={getStatusBadgeStyle(qna.status)}
                    >
                      {qna.status.charAt(0).toUpperCase() + qna.status.slice(1)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {qna.isAnswered ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">
                            Answered
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* Date Column */}
                <td className="px-6 py-4">
                  <div className="text-sm" style={{ color: "#646464" }}>
                    {formatDate(qna.createdAt)}
                  </div>
                  <div className="text-xs" style={{ color: "#646464" }}>
                    {qna.createdAt &&
                      new Date(qna.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </td>

                {/* Views Column */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#040606" }}
                      >
                        {qna.views.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="flex items-center space-x-3 text-xs"
                      style={{ color: "#646464" }}
                    >
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{qna.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-3 w-3" />
                        <span>{qna.notHelpful}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      onClick={() => onViewQna(qna)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#2691ce" }}
                      whileHover={{ backgroundColor: "#eff6ff", scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Q&A"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      onClick={() => onEditQna(qna)}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit Q&A"
                    >
                      <Edit className="h-4 w-4 text-yellow-600" />
                    </motion.button>

                    <motion.button
                      onClick={() => onDeleteQna(qna.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete Q&A"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
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
              Total Questions:{" "}
              <strong style={{ color: "#040606" }}>{qnaData.length}</strong>
            </span>
            <span>
              Answered:{" "}
              <strong style={{ color: "#10b981" }}>
                {qnaData.filter((q) => q.isAnswered).length}
              </strong>
            </span>
            <span>
              Pending:{" "}
              <strong style={{ color: "#f59e0b" }}>
                {qnaData.filter((q) => !q.isAnswered).length}
              </strong>
            </span>
            <span>
              Featured:{" "}
              <strong style={{ color: "#2691ce" }}>
                {qnaData.filter((q) => q.featured).length}
              </strong>
            </span>
          </div>

          <div
            className="flex items-center space-x-2 text-sm"
            style={{ color: "#646464" }}
          >
            <span>Total Views:</span>
            <strong style={{ color: "#040606" }}>
              {qnaData
                .reduce((total, qna) => total + qna.views, 0)
                .toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
