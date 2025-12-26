"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  HelpCircle,
  Tag,
  Check,
} from "lucide-react";
import { QUESTION_STATUS_ENUM, QUESTION_THEMES_ENUM, QA_PRIORITY_ENUM } from "@/constants/backendEnums";

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

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  initialQuestion = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    themes: [],
    tags: [],
    status: "open",
    priority: "medium",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [parsedTags, setParsedTags] = useState([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        content: "",
        themes: [],
        tags: [],
        status: "open",
        priority: "medium",
      });
      setTagInput("");
      setParsedTags([]);
      setErrors({});
      setIsThemeDropdownOpen(false);
      return;
    }

    if (initialQuestion) {
      // Map frontend fields to backend fields
      const themes = Array.isArray(initialQuestion.themes) 
        ? initialQuestion.themes 
        : (initialQuestion.category ? [initialQuestion.category] : []);
      
      setFormData({
        title: initialQuestion.title || initialQuestion.question || "",
        content: initialQuestion.content || "",
        themes: themes,
        tags: Array.isArray(initialQuestion.tags) ? initialQuestion.tags : [],
        status: initialQuestion.status || "open",
        priority: initialQuestion.priority || "medium",
      });
      setParsedTags(Array.isArray(initialQuestion.tags) ? initialQuestion.tags : []);
    } else {
      setFormData({
        title: "",
        content: "",
        themes: [],
        tags: [],
        status: "open",
        priority: "medium",
      });
      setParsedTags([]);
    }
  }, [initialQuestion, isOpen]);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isThemeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 1) {
      newErrors.title = "Title must be at least 1 character";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 1) {
      newErrors.content = "Content must be at least 1 character";
    } else if (formData.content.length > 3000) {
      newErrors.content = "Content cannot exceed 3000 characters";
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

    // Prepare data matching backend structure
    const questionData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      themes: Array.isArray(formData.themes) ? formData.themes : [],
      tags: parsedTags.length > 0 ? parsedTags : [],
      status: formData.status,
      priority: formData.priority,
    };

    if (initialQuestion) {
      questionData.id = initialQuestion.id || initialQuestion._id;
    }

    onSubmit(questionData);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        content: "",
        themes: [],
        tags: [],
        status: "open",
        priority: "medium",
      });
      setTagInput("");
      setParsedTags([]);
      setErrors({});
      setIsThemeDropdownOpen(false);
      onClose();
    }
  };

  const toggleTheme = (theme) => {
    setFormData((prev) => {
      const currentThemes = Array.isArray(prev.themes) ? prev.themes : [];
      if (currentThemes.includes(theme)) {
        return { ...prev, themes: currentThemes.filter((t) => t !== theme) };
      } else {
        return { ...prev, themes: [...currentThemes, theme] };
      }
    });
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
                  <HelpCircle
                    className="h-6 w-6"
                    style={{ color: "#2691ce" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {initialQuestion ? "Edit Question" : "Add New Question"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    {initialQuestion ? "Update the Q&A entry" : "Create a new Q&A entry for your knowledge base"}
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
                {/* Title Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter the question title..."
                    maxLength={200}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.title ? "border-red-500" : "border-gray-300"
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
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    {formData.title.length}/200 characters
                  </p>
                </motion.div>

                {/* Content Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter the question content..."
                    rows={6}
                    maxLength={3000}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${errors.content ? "border-red-500" : "border-gray-300"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {errors.content && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.content}
                    </motion.p>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    {formData.content.length}/3000 characters
                  </p>
                </motion.div>

                {/* Themes Multi-select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                  ref={themeDropdownRef}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <Tag className="inline h-4 w-4 mr-1" />
                    Themes (Optional)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-left flex items-center justify-between"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      <span className={formData.themes.length > 0 ? "text-gray-900" : "text-gray-500"}>
                        {formData.themes.length > 0
                          ? `${formData.themes.length} theme(s) selected`
                          : "Select themes..."}
                      </span>
                      <X className={`h-4 w-4 transition-transform ${isThemeDropdownOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isThemeDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {QUESTION_THEMES_ENUM.map((theme) => (
                          <label
                            key={theme}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.themes.includes(theme)}
                              onChange={() => toggleTheme(theme)}
                              className="mr-2"
                            />
                            <span className="text-sm">{theme}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.themes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.themes.map((theme) => (
                        <span
                          key={theme}
                          className="px-3 py-1 text-sm rounded-full text-white flex items-center gap-1"
                          style={{ backgroundColor: "#2691ce" }}
                        >
                          {theme}
                          <button
                            type="button"
                            onClick={() => toggleTheme(theme)}
                            className="hover:text-gray-200 text-xs"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Select one or more themes for categorization
                  </p>
                </motion.div>

                {/* Priority and Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      {QA_PRIORITY_ENUM.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      {QUESTION_STATUS_ENUM.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                </div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Tags (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const newTag = tagInput.trim().toLowerCase();
                          if (newTag && !parsedTags.includes(newTag) && newTag.length <= 30) {
                            const updatedTags = [...parsedTags, newTag];
                            setParsedTags(updatedTags);
                            setFormData((prev) => ({
                              ...prev,
                              tags: updatedTags
                            }));
                          }
                          setTagInput('');
                        }
                      }}
                      placeholder="Type tag and press Enter or comma to add..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Display added tags */}
                  {parsedTags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {parsedTags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full text-white flex items-center gap-1"
                          style={{ backgroundColor: "#2691ce" }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedTags = parsedTags.filter(t => t !== tag);
                              setParsedTags(updatedTags);
                              setFormData((prev) => ({
                                ...prev,
                                tags: updatedTags
                              }));
                            }}
                            className="hover:text-gray-200 text-xs"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Type tag and press Enter or comma to add. Tags help users find questions more easily.
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
                className={`px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center space-x-2 ${isSubmitting
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
                    <span>{initialQuestion ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{initialQuestion ? "Update Question" : "Create Question"}</span>
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