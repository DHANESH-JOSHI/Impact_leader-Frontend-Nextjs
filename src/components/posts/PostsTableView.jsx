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

export default function PostsTableView({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost,
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

  // Sorted posts
  const sortedPosts = React.useMemo(() => {
    let sortableStories = [...posts];
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
  }, [posts, sortConfig]);

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

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
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

  if (posts.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No posts to display
          </h3>
          <p style={{ color: "#646464" }}>
            Your search didn't match any posts. Try different filters.
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
                  <span>Title</span>
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
              {/* Category column removed - Post model doesn't have category field */}
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
                onClick={() => handleSort("publishDate")}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                  <SortIcon columnKey="publishDate" />
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
            {sortedPosts.map((post, index) => (
              <motion.tr
                key={post.id}
                className="border-b border-gray-100 last:border-b-0"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                {/* Title Column */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className="font-semibold text-sm leading-snug hover:underline cursor-pointer"
                          style={{ color: "#040606" }}
                          onClick={() => onViewPost(post)}
                        >
                          {truncateText(post.title, 50)}
                        </h3>
                        {post.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: "#646464" }}>
                        {truncateText(post.excerpt, 80)}
                      </p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div
                          className="flex items-center space-x-1 text-xs"
                          style={{ color: "#646464" }}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            {calculateReadingTime(post.content)} min read
                          </span>
                        </div>
                        <div
                          className="flex items-center space-x-1 text-xs"
                          style={{ color: "#646464" }}
                        >
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full text-white"
                              style={{ backgroundColor: "#2691ce" }}
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{post.tags.length - 2}
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
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#040606" }}
                    >
                      {post.author}
                    </span>
                  </div>
                </td>

                {/* Category column removed - Post model doesn't have category field */}

                {/* Status Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span
                      className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                      style={getStatusBadgeStyle(post.status)}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                    {post.isActive && (
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full ml-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </div>
                </td>


                {/* Date Column */}
                <td className="px-6 py-4">
                  <div className="text-sm" style={{ color: "#646464" }}>
                    {formatDate(post.publishDate)}
                  </div>
                  <div className="text-xs" style={{ color: "#646464" }}>
                    {post.publishDate &&
                      new Date(post.publishDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </div>
                </td>

                {/* Views Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#040606" }}
                    >
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      onClick={() => onViewPost(post)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "#2691ce" }}
                      whileHover={{ backgroundColor: "#eff6ff", scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Post"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      onClick={() => onEditPost(post)}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit Post"
                    >
                      <Edit className="h-4 w-4 text-yellow-600" />
                    </motion.button>

                    <motion.button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete Post"
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
              Total Posts:{" "}
              <strong style={{ color: "#040606" }}>{posts.length}</strong>
            </span>
            <span>
              Published:{" "}
              <strong style={{ color: "#10b981" }}>
                {posts.filter((p) => p.status === "published").length}
              </strong>
            </span>
            <span>
              Drafts:{" "}
              <strong style={{ color: "#f59e0b" }}>
                {posts.filter((p) => p.status === "draft").length}
              </strong>
            </span>
            <span>
              Featured:{" "}
              <strong style={{ color: "#2691ce" }}>
                {posts.filter((p) => p.featured).length}
              </strong>
            </span>
          </div>

          <div
            className="flex items-center space-x-2 text-sm"
            style={{ color: "#646464" }}
          >
            <span>Total Views:</span>
            <strong style={{ color: "#040606" }}>
              {posts
                .reduce((total, post) => total + post.views, 0)
                .toLocaleString()}
            </strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
