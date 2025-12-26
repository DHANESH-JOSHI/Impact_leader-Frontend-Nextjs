"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Tag,
  Edit,
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

export default function ViewDirectoryModal({
  isOpen,
  onClose,
  entry,
  onUpdate,
}) {
  if (!entry) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.4)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  Directory Entry Details
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  View directory entry information
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  {entry.logo ? (
                    <img
                      src={entry.logo}
                      alt={entry.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#eff6ff" }}
                    >
                      <Building2 className="h-10 w-10" style={{ color: "#2691ce" }} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#040606" }}>
                      {entry.title || "Untitled Entry"}
                    </h3>
                    {entry.category && (
                      <p className="text-sm mb-2" style={{ color: "#646464" }}>
                        {entry.category}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {entry.organizationType && (
                        <span
                          className="px-3 py-1 text-sm font-medium rounded-full capitalize"
                          style={getOrganizationTypeBadgeStyle(entry.organizationType)}
                        >
                          {entry.organizationType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {entry.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Description
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {entry.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entry.website && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </h4>
                      <a
                        href={entry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: "#2691ce" }}
                      >
                        {entry.website}
                      </a>
                    </div>
                  )}

                  {entry.contactInfo?.email && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </h4>
                      <a
                        href={`mailto:${entry.contactInfo.email}`}
                        className="text-sm hover:underline"
                        style={{ color: "#2691ce" }}
                      >
                        {entry.contactInfo.email}
                      </a>
                    </div>
                  )}

                  {entry.contactInfo?.phone && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </h4>
                      <a
                        href={`tel:${entry.contactInfo.phone}`}
                        className="text-sm hover:underline"
                        style={{ color: "#2691ce" }}
                      >
                        {entry.contactInfo.phone}
                      </a>
                    </div>
                  )}

                  {entry.location && (entry.location.city || entry.location.country) && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </h4>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {[entry.location.city, entry.location.state, entry.location.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {entry.themes && entry.themes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Tag className="h-4 w-4 mr-1" />
                      Themes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.themes.map((theme, index) => {
                        const themeName = typeof theme === 'string' ? theme : (theme?.name || String(theme?._id || theme?.id || theme || ''));
                        return (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-md"
                            style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                          >
                            {themeName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-md"
                          style={{ backgroundColor: "#f3f4f6", color: "#646464" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.socialLinks && (entry.socialLinks.linkedin || entry.socialLinks.twitter) && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Social Links
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {entry.socialLinks.linkedin && (
                        <a
                          href={entry.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: "#2691ce" }}
                        >
                          LinkedIn
                        </a>
                      )}
                      {entry.socialLinks.twitter && (
                        <a
                          href={entry.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: "#2691ce" }}
                        >
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Created Date
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  {entry.updatedAt && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Last Updated
                      </h4>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {formatDate(entry.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: "#646464" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

