"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  ChevronUp,
  ChevronDown,
  Globe,
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

export default function DirectoryTableView({
  entries,
  onViewEntry,
  onEditEntry,
  onDeleteEntry,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = React.useMemo(() => {
    let sortable = [...entries];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [entries, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  if (entries.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-12"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#040606" }}
          >
            No directory entries to display
          </h3>
          <p style={{ color: "#646464" }}>
            Try adjusting your search or filter criteria
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
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <SortIcon columnKey="title" />
                </div>
              </th>
              {/* <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Category
              </th> */}
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("organizationType")}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  <SortIcon columnKey="organizationType" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Themes
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Location
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                style={{ color: "#646464" }}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <SortIcon columnKey="createdAt" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#646464" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEntries.map((entry) => (
              <motion.tr
                key={entry.id}
                variants={rowVariants}
                whileHover="hover"
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {entry.logo ? (
                      <img
                        src={entry.logo}
                        alt={entry.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#eff6ff" }}
                      >
                        <Building2 className="h-5 w-5" style={{ color: "#2691ce" }} />
                      </div>
                    )}
                    <div>
                      <div className="font-medium" style={{ color: "#040606" }}>
                        {entry.title || "Untitled Entry"}
                      </div>
                      {entry.description && (
                        <div className="text-sm truncate max-w-xs" style={{ color: "#646464" }}>
                          {entry.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm" style={{ color: "#646464" }}>
                    {entry.category || "N/A"}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm capitalize" style={{ color: "#646464" }}>
                    {entry.organizationType || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.themes && entry.themes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {entry.themes.slice(0, 2).map((theme, index) => {
                        const themeName = typeof theme === 'string' ? theme : (theme?.name || String(theme?._id || theme?.id || theme || ''));
                        return (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-md text-xs font-medium"
                            style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                          >
                            {themeName}
                          </span>
                        );
                      })}
                      {entry.themes.length > 2 && (
                        <span className="text-xs" style={{ color: "#646464" }}>
                          +{entry.themes.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm" style={{ color: "#646464" }}>N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.location && (entry.location.city || entry.location.country) ? (
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="h-3 w-3" style={{ color: "#646464" }} />
                      <span style={{ color: "#646464" }}>
                        {[entry.location.city, entry.location.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm" style={{ color: "#646464" }}>N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-3 w-3" style={{ color: "#646464" }} />
                    <span style={{ color: "#646464" }}>
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <motion.button
                      onClick={() => onViewEntry(entry)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    {onEditEntry && (
                      <motion.button
                        onClick={() => onEditEntry(entry)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => onDeleteEntry(entry)}
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

