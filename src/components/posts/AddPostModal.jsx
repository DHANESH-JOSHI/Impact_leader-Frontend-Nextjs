"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  FileText,
  Tag,
  Star,
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

export default function AddPostModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
}) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "", // Keep for UI but don't send to API
    content: "",
    category: categories[0] || "",
    status: "draft",
    tags: "",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [parsedTags, setParsedTags] = useState([]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle tag input
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setParsedTags(tags);
    setFormData((prev) => ({ ...prev, tags: e.target.value }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.length < 10) {
      newErrors.excerpt = "Excerpt must be at least 10 characters long";
    } else if (formData.excerpt.length > 200) {
      newErrors.excerpt = "Excerpt must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters long";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Transform data to match API structure
    const postData = {
      title: formData.title,
      content: formData.content,
      // Note: excerpt is NOT sent to API - it will be generated from content
      type: formData.category,
      themes: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      isPublic: formData.status === "published",
      isPinned: formData.featured,
      status: formData.status,
      allowComments: true,
      // author is automatically added from authenticated user
    };

    console.log("Submitting to API:", postData);
    
    try {
      await onSubmit(postData);
      
      // Reset form only on successful submission
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: categories[0] || "",
        status: "draft",
        tags: "",
        featured: false,
      });
      setTagInput("");
      setParsedTags([]);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: categories[0] || "",
        status: "draft",
        tags: "",
        featured: false,
      });
      setTagInput("");
      setParsedTags([]);
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.3)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#eff6ff" }}
                >
                  <FileText className="h-6 w-6" style={{ color: "#2691ce" }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    Create New Post
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    Add a new blog post or article
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Featured */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Post Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter an engaging post title..."
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{ focusRingColor: "#2691ce" }}
                        disabled={isSubmitting}
                      />
                      {errors.title && (
                        <motion.p
                          className="text-red-500 text-sm mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {errors.title}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <div className="lg:col-span-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Featured Post
                      </label>
                      <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{
                            color: "#2691ce",
                            focusRingColor: "#2691ce",
                          }}
                          disabled={isSubmitting}
                        />
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm" style={{ color: "#646464" }}>
                          Featured
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Category - Full Width */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <Tag className="inline h-4 w-4 mr-1" />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.category}
                    </motion.p>
                  )}
                </motion.div>

                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Publication Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === "draft"}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                        style={{ accentColor: "#2691ce" }}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm" style={{ color: "#646464" }}>
                        Draft
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === "published"}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                        style={{ accentColor: "#2691ce" }}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm" style={{ color: "#646464" }}>
                        Published
                      </span>
                    </label>
                  </div>
                </motion.div>

                {/* Excerpt - Keep for UI but not sent to API */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Post Excerpt *
                    <span className="text-xs text-gray-500 ml-2">
                      (For preview only - not stored in database)
                    </span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Write a compelling excerpt that summarizes your post..."
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
                      errors.excerpt ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.excerpt ? (
                      <motion.p
                        className="text-red-500 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.excerpt}
                      </motion.p>
                    ) : (
                      <p className="text-xs" style={{ color: "#646464" }}>
                        This will be displayed in post previews
                      </p>
                    )}
                    <span className="text-xs" style={{ color: "#646464" }}>
                      {formData.excerpt.length}/200
                    </span>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Post Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your full post content here..."
                    rows={12}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
                      errors.content ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.content ? (
                      <motion.p
                        className="text-red-500 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.content}
                      </motion.p>
                    ) : (
                      <p className="text-xs" style={{ color: "#646464" }}>
                        The main content of your post (stored in database)
                      </p>
                    )}
                    <span className="text-xs" style={{ color: "#646464" }}>
                      {formData.content.length} characters
                    </span>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInput}
                    placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {parsedTags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {parsedTags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full text-white"
                          style={{ backgroundColor: "#2691ce" }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Separate multiple tags with commas - will be saved as "themes" in database
                  </p>
                </motion.div>
              </form>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: "#646464" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                }`}
                style={{ backgroundColor: "#2691ce" }}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}