"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Calendar,
  Tag,
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

export default function ViewThemeModal({
  isOpen,
  onClose,
  theme,
  onUpdate,
}) {
  if (!theme) return null;

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
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  Theme Details
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  View theme information
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
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#eff6ff" }}
                  >
                    <Palette className="h-8 w-8" style={{ color: "#2691ce" }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#040606" }}>
                      {theme.name || "Untitled Theme"}
                    </h3>
                    {theme.category && (
                      <p className="text-sm mb-2" style={{ color: "#646464" }}>
                        {theme.category}
                      </p>
                    )}
                  </div>
                </div>

                {theme.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Description
                    </h4>
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {theme.description}
                    </p>
                  </div>
                )}

                {theme.tags && theme.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Tag className="h-4 w-4 mr-1" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {theme.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-md"
                          style={{ backgroundColor: "#eff6ff", color: "#2691ce" }}
                        >
                          {tag}
                        </span>
                      ))}
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
                      {formatDate(theme.createdAt)}
                    </p>
                  </div>
                  {theme.updatedAt && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Last Updated
                      </h4>
                      <p className="text-sm" style={{ color: "#646464" }}>
                        {formatDate(theme.updatedAt)}
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

