"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  Palette,
  CheckCircle,
  XCircle,
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

export default function ThemesCardView({
  themes,
  onViewTheme,
  onDeleteTheme,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (themes.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No themes found
        </h3>
        <p style={{ color: "#646464" }}>
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {themes.map((theme) => (
        <motion.div
          key={theme.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group flex flex-col min-h-[320px]"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#eff6ff" }}
                >
                  <Palette className="h-6 w-6" style={{ color: "#2691ce" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-1" style={{ color: "#040606" }}>
                    {theme.name || "Untitled Theme"}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                        theme.isActive !== false
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {theme.isActive !== false ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Inactive</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {theme.description && (
              <p className="text-sm mb-4 line-clamp-2" style={{ color: "#646464" }}>
                {theme.description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: "#646464" }} />
                <span className="truncate" style={{ color: "#646464" }}>
                  Created {formatDate(theme.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center justify-end space-x-2">
              <motion.button
                onClick={() => onViewTheme(theme)}
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
                onClick={() => onDeleteTheme(theme)}
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
    </motion.div>
  );
}

