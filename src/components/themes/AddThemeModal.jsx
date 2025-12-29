"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Palette,
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

export default function AddThemeModal({
  isOpen,
  onClose,
  onSubmit,
  initialTheme = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when initialTheme is provided (edit mode)
  useEffect(() => {
    if (initialTheme) {
      setFormData({
        name: initialTheme.name || "",
        description: initialTheme.description || "",
        isActive: initialTheme.isActive !== undefined ? initialTheme.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [initialTheme, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
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
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const themeData = { ...formData };
      if (initialTheme) {
        themeData.id = initialTheme.id;
      }
      await onSubmit(themeData);
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setErrors({});
    onClose();
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
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  {initialTheme ? "Edit Theme" : "Add Theme"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  {initialTheme ? "Update theme information" : "Create a new theme"}
                </p>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Theme name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Theme description (optional)"
                    maxLength={500}
                  />
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    {formData.description.length}/500 characters
                  </p>
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ accentColor: "#2691ce" }}
                    />
                    <span className="text-sm font-medium" style={{ color: "#040606" }}>
                      Active
                    </span>
                  </label>
                  <p className="text-xs mt-1 ml-6" style={{ color: "#646464" }}>
                    Inactive themes won't appear in dropdowns but existing references will remain
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    style={{ backgroundColor: "#2691ce" }}
                    whileHover={!isSubmitting ? { backgroundColor: "#1e7bb8" } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{initialTheme ? "Updating..." : "Creating..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{initialTheme ? "Update Theme" : "Create Theme"}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

