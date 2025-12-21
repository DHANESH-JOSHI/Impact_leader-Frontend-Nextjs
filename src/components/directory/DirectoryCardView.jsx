"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  Globe,
  Tag,
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

export default function DirectoryCardView({
  entries,
  onViewEntry,
  onDeleteEntry,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getESGCSRBadgeStyle = (isESG, isCSR) => {
    if (isESG) {
      return { backgroundColor: "#10b981", color: "white" };
    }
    if (isCSR) {
      return { backgroundColor: "#3b82f6", color: "white" };
    }
    return { backgroundColor: "#e5e7eb", color: "#374151" };
  };

  const getOrganizationTypeBadgeStyle = (type) => {
    const styles = {
      startup: { backgroundColor: "#f59e0b", color: "white" },
      corporate: { backgroundColor: "#8b5cf6", color: "white" },
      nonprofit: { backgroundColor: "#10b981", color: "white" },
      government: { backgroundColor: "#3b82f6", color: "white" },
      freelance: { backgroundColor: "#6b7280", color: "white" },
      other: { backgroundColor: "#e5e7eb", color: "#374151" },
    };
    return styles[type] || styles.other;
  };

  if (entries.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: "#040606" }}>
          No directory entries found
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
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {entry.logo ? (
                <img
                  src={entry.logo}
                  alt={entry.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: "#2691ce" }}
                >
                  <Building2 className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate" style={{ color: "#040606" }}>
                  {entry.title || "Untitled Entry"}
                </h3>
                {entry.category && (
                  <p className="text-sm truncate" style={{ color: "#646464" }}>
                    {entry.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {entry.description && (
            <p className="text-sm mb-4 line-clamp-2" style={{ color: "#646464" }}>
              {entry.description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            {entry.location && (entry.location.city || entry.location.country) && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: "#646464" }} />
                <span className="truncate" style={{ color: "#646464" }}>
                  {[entry.location.city, entry.location.state, entry.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {entry.website && (
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="h-4 w-4" style={{ color: "#646464" }} />
                <a
                  href={entry.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                  style={{ color: "#2691ce" }}
                >
                  {entry.website}
                </a>
              </div>
            )}
            {entry.organizationType && (
              <div className="flex items-center space-x-2 text-sm">
                <Building2 className="h-4 w-4" style={{ color: "#646464" }} />
                <span className="capitalize" style={{ color: "#646464" }}>
                  {entry.organizationType}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4" style={{ color: "#646464" }} />
              <span style={{ color: "#646464" }}>
                Created {formatDate(entry.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(entry.isESG || entry.isCSR) && (
              <span
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={getESGCSRBadgeStyle(entry.isESG, entry.isCSR)}
              >
                {entry.isESG ? "ESG" : "CSR"}
              </span>
            )}
            {entry.organizationType && (
              <span
                className="px-2 py-1 rounded-md text-xs font-medium capitalize"
                style={getOrganizationTypeBadgeStyle(entry.organizationType)}
              >
                {entry.organizationType}
              </span>
            )}
            {entry.themes && entry.themes.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="h-3 w-3" style={{ color: "#646464" }} />
                <span className="text-xs" style={{ color: "#646464" }}>
                  {entry.themes.length} theme{entry.themes.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
            <motion.button
              onClick={() => onViewEntry(entry)}
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
              onClick={() => onDeleteEntry(entry)}
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
        </motion.div>
      ))}
    </motion.div>
  );
}

