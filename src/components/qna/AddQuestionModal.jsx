"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  HelpCircle,
  User,
  Tag,
  Star,
  AlertTriangle,
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

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialQuestion = null,
}) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    tags: "",
    author: "Admin",
    status: "open",
    priority: "medium",
    difficulty: "easy",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [parsedTags, setParsedTags] = useState([]);

  useEffect(() => {
    if (initialQuestion) {
      setFormData({
        question: initialQuestion.question || "",
        answer: initialQuestion.answer || "",
        category: initialQuestion.category || "General",
        tags: Array.isArray(initialQuestion.tags) ? initialQuestion.tags.join(", ") : (initialQuestion.tags || ""),
        author: initialQuestion.author || "Admin",
        status: initialQuestion.status || "open",
        priority: initialQuestion.priority || "medium",
        difficulty: initialQuestion.difficulty || "easy",
        featured: initialQuestion.featured || false,
      });
      setParsedTags(Array.isArray(initialQuestion.tags) ? initialQuestion.tags : []);
    } else {
      setFormData({
        question: "",
        answer: "",
        category: "General",
        tags: "",
        author: "Admin",
        status: "open",
        priority: "medium",
        difficulty: "easy",
        featured: false,
      });
      setParsedTags([]);
    }
  }, [initialQuestion, isOpen]);

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

  // Validate form - removed category validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    } else if (formData.question.length < 10) {
      newErrors.question = "Question must be at least 10 characters long";
    }

    // Author is optional now since backend handles it
    // if (!formData.author.trim()) {
    //   newErrors.author = "Author name is required";
    // }

    // Category validation removed since it's not in API
    // if (!formData.category) {
    //   newErrors.category = "Category is required";
    // }

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

    // Use parsedTags directly instead of splitting formData.tags
    const finalTags = parsedTags.length > 0 ? parsedTags : [formData.category.toLowerCase()];

    const questionData = {
      ...formData,
      tags: finalTags,
    };

    if (initialQuestion) {
      questionData.id = initialQuestion.id;
    }

    onSubmit(questionData);

    // Reset form
    setFormData({
      question: "",
      answer: "",
      category: "General",
      tags: "",
      author: "Admin",
      status: "open",
      priority: "medium",
      difficulty: "easy",
      featured: false,
    });
    setTagInput("");
    setParsedTags([]);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        question: "",
        answer: "",
        category: "General",
        tags: "",
        author: "Admin",
        status: "open",
        priority: "medium",
        difficulty: "easy",
        featured: false,
      });
      setTagInput("");
      setParsedTags([]);
      setErrors({});
      onClose();
    }
  };

  // Default categories if none provided
  const defaultCategories = ["General", "Technical", "Billing", "Account", "Support"];
  const availableCategories = categories && categories.length > 0 ?
    categories.filter(cat => cat !== "all") :
    defaultCategories;

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
                {/* Question Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Question *
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter the question here..."
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${errors.question ? "border-red-500" : "border-gray-300"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {errors.question && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.question}
                    </motion.p>
                  )}
                </motion.div>

                {/* Answer Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Answer (Optional)
                  </label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    placeholder="Provide an answer (you can leave this empty and answer later)..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    You can add or update the answer later from the view page
                  </p>
                </motion.div>

                {/* Author and Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      <User className="inline h-4 w-4 mr-1" />
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Enter author name..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.author ? "border-red-500" : "border-gray-300"
                        }`}
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    />
                    {errors.author && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.author}
                      </motion.p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Leave empty to use default author
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      <Tag className="inline h-4 w-4 mr-1" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      {availableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Used for organization and filtering
                    </p>
                  </motion.div>
                </div>

                {/* Priority, Status, and Difficulty */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
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
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
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
                      <option value="open">Open</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
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
                          const newTag = tagInput.trim();
                          if (newTag && !parsedTags.includes(newTag)) {
                            const updatedTags = [...parsedTags, newTag];
                            setParsedTags(updatedTags);
                            setFormData((prev) => ({
                              ...prev,
                              tags: updatedTags.join(',')
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
                                tags: updatedTags.join(',')
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

                {/* Featured Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "#f8fafc" }}
                  >
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded focus:ring-2"
                        style={{ color: "#2691ce", focusRingColor: "#2691ce" }}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#040606" }}
                        >
                          Mark as Featured Question
                        </span>
                      </div>
                    </label>
                    <p
                      className="text-xs mt-2 ml-8"
                      style={{ color: "#646464" }}
                    >
                      Featured questions appear prominently in search results
                    </p>
                  </div>
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Question</span>
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