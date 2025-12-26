"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Calendar,
  Edit,
  Save,
  CheckCircle,
  XCircle,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!theme) return null;

  // Initialize edit form when entering edit mode
  const handleEditToggle = () => {
    if (!isEditMode) {
      setEditFormData({
        name: theme.name || "",
        description: theme.description || "",
        isActive: theme.isActive !== undefined ? theme.isActive : true,
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (editFormData.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }
    if (editFormData.description && editFormData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(theme.id, editFormData);
      setIsEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    {isEditMode ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-xl font-bold"
                        style={{ focusRingColor: "#2691ce" }}
                        maxLength={100}
                      />
                    ) : (
                      <h3 className="text-xl font-bold mb-2" style={{ color: "#040606" }}>
                        {theme.name || "Untitled Theme"}
                      </h3>
                    )}
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {isEditMode ? (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={editFormData.isActive}
                            onChange={handleInputChange}
                            className="w-4 h-4 rounded focus:ring-2"
                            style={{ accentColor: "#2691ce" }}
                          />
                          <span className="text-sm" style={{ color: "#646464" }}>
                            Active
                          </span>
                        </label>
                      ) : (
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
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
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Description
                  </h4>
                  {isEditMode ? (
                    <>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="Theme description (optional)"
                        maxLength={500}
                      />
                      <p className="text-xs mt-1" style={{ color: "#646464" }}>
                        {editFormData.description.length}/500 characters
                      </p>
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm" style={{ color: "#646464" }}>
                      {theme.description || "No description provided"}
                    </p>
                  )}
                </div>

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
              {isEditMode ? (
                <>
                  <motion.button
                    type="button"
                    onClick={handleEditToggle}
                    className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ color: "#646464" }}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    style={{ backgroundColor: "#2691ce" }}
                    whileHover={!isSubmitting ? { backgroundColor: "#1e7bb8" } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    type="button"
                    onClick={handleEditToggle}
                    className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50 flex items-center space-x-2"
                    style={{ color: "#646464" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                    style={{ color: "#646464" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

