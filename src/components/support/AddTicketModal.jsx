"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Tag, AlertCircle } from "lucide-react";
import { SupportService } from "@/services/supportService";
import toast from "react-hot-toast";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function AddTicketModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general-inquiry",
    priority: "medium",
    requesterName: "",
    requesterEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = SupportService.getSupportCategories();
  const priorities = SupportService.getPriorityLevels();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Ticket subject is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.requesterName.trim()) {
      setError("Requester name is required");
      return false;
    }
    if (!formData.requesterEmail.trim()) {
      setError("Requester email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.requesterEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        requesterName: formData.requesterName.trim(),
        requesterEmail: formData.requesterEmail.trim(),
      };

      const result = await SupportService.createTicket(ticketData);

      if (result.success) {
        toast.success("Ticket created successfully");
      onSuccess();
      handleClose();
      } else {
        setError(result.message || "Failed to create ticket");
        toast.error(result.message || "Failed to create ticket");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while creating the ticket";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      category: "general-inquiry",
      priority: "medium",
      requesterName: "",
      requesterEmail: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div
            className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10"
          >
            <h2 className="text-xl font-bold" style={{ color: "#040606" }}>
              Create New Support Ticket
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" style={{ color: "#646464" }} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
                style={{ color: "#040606" }}
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                style={{ focusRingColor: "#2691ce" }}
                disabled={isSubmitting}
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: "#040606" }}
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the issue..."
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ focusRingColor: "#2691ce" }}
                disabled={isSubmitting}
              />
            </div>

            {/* Requester Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="requesterName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#040606" }}
                >
                  Requester Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="requesterName"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: "#2691ce" }}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="requesterEmail"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#040606" }}
                >
                  Requester Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="requesterEmail"
                  name="requesterEmail"
                  value={formData.requesterEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: "#2691ce" }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#040606" }}
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: "#2691ce" }}
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#040606" }}
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: "#2691ce" }}
                  disabled={isSubmitting}
                >
                  {priorities.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                style={{ color: "#646464" }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#2691ce" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Create Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
