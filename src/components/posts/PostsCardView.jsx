"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  Heart,
  Star,
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

export default function PostsCardView({
  posts,
  onViewPost,
  onEditPost,
  onDeletePost,
}) {
  // console.log("posts:",posts)
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

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (posts.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No posts found
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
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col min-h-[320px]"
          variants={cardVariants}
          whileHover="hover"
        >
          {/* Card Header */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-lg leading-tight mb-2 line-clamp-2 cursor-pointer"
                  style={{ color: "#040606" }}
                  onClick={() => onViewPost(post)}
                >
                  {post.title}
                </h3>
                {post.featured && (
                  <motion.div
                    className="flex items-center space-x-1 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-yellow-600">
                      Featured
                    </span>
                  </motion.div>
                )}
              </div>
              <div
                className="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2"
                style={getStatusBadgeStyle(post.status)}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-4 line-clamp-2"
              style={{ color: "#646464" }}
            >
              {truncateText(post.excerpt)}
            </p>

            {/* Post Meta */}
            <div className="space-y-2 mb-3">
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{post.author}</span>
              </div>
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatDate(post.publishDate)}</span>
              </div>
              <div
                className="flex items-center space-x-2 text-xs"
                style={{ color: "#646464" }}
              >
                <Tag className="h-3 w-3 flex-shrink-0" />
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                >
                  {post.category}
                </span>
              </div>
            </div>

            {/* Card Stats */}
            <div
              className="px-3 py-2 rounded mt-auto"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <div
                className="flex items-center justify-between text-xs"
                style={{ color: "#646464" }}
              >
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center justify-between space-x-2">
              <motion.button
                onClick={() => onViewPost(post)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </motion.button>

              <motion.button
                onClick={() => onEditPost(post)}
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
                onClick={() => onDeletePost(post.id)}
                className="p-2 text-gray-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, index) => (
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
                {post.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
