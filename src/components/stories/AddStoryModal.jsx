"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Image as ImageIcon,
  Video,
  FileText,
  Tag,
  Star,
  Upload,
} from "lucide-react";
import { StoriesService } from "@/services/storiesService";
import { ThemesService } from "@/services/themesService";
import { Check } from "lucide-react";

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

export default function AddStoryModal({
  isOpen,
  onClose,
  onAdd,
  initialStory = null,
}) {
  const [formData, setFormData] = useState({
    type: "text",
    caption: "",
    textContent: "",
    duration: 86400000, // 24 hours in milliseconds
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    fontFamily: "Arial",
    tags: [],
    themes: [],
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [themesLoading, setThemesLoading] = useState(false);
  const themeDropdownRef = useRef(null);

  const storyTypes = StoriesService.getStoryTypes();
  const durations = StoriesService.getStoryDurations();
  const fontFamilies = StoriesService.getFontFamilies();
  const backgroundColors = StoriesService.getBackgroundColors();

  // Load themes when modal opens
  useEffect(() => {
    if (isOpen && availableThemes.length === 0 && !themesLoading) {
      loadThemes();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isThemeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  const loadThemes = async () => {
    if (themesLoading || availableThemes.length > 0) return;
    setThemesLoading(true);
    try {
      const result = await ThemesService.getAllThemes({ limit: 100, sortBy: "name", sortOrder: "asc" });
      if (result.success && Array.isArray(result.data)) {
        setAvailableThemes(result.data);
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
    } finally {
      setThemesLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        type: "text",
        caption: "",
        textContent: "",
        duration: 86400000,
        backgroundColor: "#000000",
        textColor: "#FFFFFF",
        fontFamily: "Arial",
        tags: [],
        themes: [],
        isFeatured: false,
      });
      setMediaFile(null);
      setMediaPreview(null);
      setTagInput("");
      setErrors({});
      setIsThemeDropdownOpen(false);
    }
  }, [isOpen]);

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

    // Reset media when type changes
    if (name === "type") {
      setMediaFile(null);
      setMediaPreview(null);
    }
  };

  // Handle media file selection
  const handleMediaSelect = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;

    // Validate file type
    if (formData.type === "image") {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          media: "Please select an image file",
        }));
        return;
      }
    } else if (formData.type === "video") {
      if (!file.type.startsWith("video/")) {
        setErrors((prev) => ({
          ...prev,
          media: "Please select a video file",
        }));
        return;
      }
    }

    setMediaFile(file);
    setErrors((prev) => ({ ...prev, media: "" }));

    // Create preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (formData.type === "text") {
      if (!formData.textContent.trim()) {
        newErrors.textContent = "Text content is required for text stories";
      } else if (formData.textContent.length > 500) {
        newErrors.textContent = "Text content cannot exceed 500 characters";
      }
    } else if (formData.type === "image" || formData.type === "video") {
      if (!mediaFile) {
        newErrors.media = "Media file is required for image/video stories";
      }
    }

    if (formData.caption && formData.caption.length > 200) {
      newErrors.caption = "Caption cannot exceed 200 characters";
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

    try {
      const storyData = {
        type: formData.type,
        caption: formData.caption || undefined,
        textContent: formData.type === "text" ? formData.textContent : undefined,
        duration: parseInt(formData.duration),
        backgroundColor: formData.type === "text" ? formData.backgroundColor : undefined,
        textColor: formData.type === "text" ? formData.textColor : undefined,
        fontFamily: formData.type === "text" ? formData.fontFamily : undefined,
        tags: formData.tags,
        themes: Array.isArray(formData.themes) ? formData.themes : [],
        isFeatured: formData.isFeatured,
        mediaFile: mediaFile,
      };

      await onAdd(storyData);

      // Reset form
      setFormData({
        type: "text",
        caption: "",
        textContent: "",
        duration: 86400000,
        backgroundColor: "#000000",
        textColor: "#FFFFFF",
        fontFamily: "Arial",
        tags: [],
        themes: [],
        isFeatured: false,
      });
      setMediaFile(null);
      setMediaPreview(null);
      setTagInput("");
      setErrors({});
      setIsThemeDropdownOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
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
                    Create New Story
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    Add a new story (text, image, or video)
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
                {/* Story Type */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Story Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {storyTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, type: type.value }))
                        }
                        className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                          formData.type === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {type.value === "text" && (
                          <FileText className="h-6 w-6" style={{ color: formData.type === type.value ? "#2691ce" : "#646464" }} />
                        )}
                        {type.value === "image" && (
                          <ImageIcon className="h-6 w-6" style={{ color: formData.type === type.value ? "#2691ce" : "#646464" }} />
                        )}
                        {type.value === "video" && (
                          <Video className="h-6 w-6" style={{ color: formData.type === type.value ? "#2691ce" : "#646464" }} />
                        )}
                        <span className="text-sm font-medium" style={{ color: formData.type === type.value ? "#2691ce" : "#646464" }}>
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Media Upload (for image/video) */}
                {(formData.type === "image" || formData.type === "video") && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      {formData.type === "image" ? "Image" : "Video"} *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMediaSelect}
                        accept={formData.type === "image" ? "image/*" : "video/*"}
                        className="hidden"
                        id="media-upload"
                      />
                      <label
                        htmlFor="media-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        style={{
                          borderColor: "#2691ce",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <Upload className="w-5 h-5 mr-2" style={{ color: "#2691ce" }} />
                        <span className="text-sm" style={{ color: "#646464" }}>
                          Click to upload {formData.type === "image" ? "image" : "video"}
                        </span>
                      </label>
                      {mediaPreview && (
                        <div className="mt-3">
                          {formData.type === "image" ? (
                            <img
                              src={mediaPreview}
                              alt="Preview"
                              className="max-w-full h-48 object-contain rounded-lg border border-gray-300"
                            />
                          ) : (
                            <video
                              src={mediaPreview}
                              controls
                              className="max-w-full h-48 rounded-lg border border-gray-300"
                            />
                          )}
                        </div>
                      )}
                      {errors.media && (
                        <p className="text-red-500 text-sm mt-1">{errors.media}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Text Content (for text stories) */}
                {formData.type === "text" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Text Content * (max 500 characters)
                      </label>
                      <textarea
                        name="textContent"
                        value={formData.textContent}
                        onChange={handleInputChange}
                        placeholder="Enter your story text..."
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${
                          errors.textContent ? "border-red-500" : "border-gray-300"
                        }`}
                        style={{ focusRingColor: "#2691ce" }}
                        disabled={isSubmitting}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.textContent ? (
                          <p className="text-red-500 text-sm">{errors.textContent}</p>
                        ) : (
                          <p className="text-xs" style={{ color: "#646464" }}>
                            The main text content of your story
                          </p>
                        )}
                        <span className="text-xs" style={{ color: "#646464" }}>
                          {formData.textContent.length}/500
                        </span>
                      </div>
                    </motion.div>

                    {/* Text Styling Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "#040606" }}
                        >
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            name="backgroundColor"
                            value={formData.backgroundColor}
                            onChange={handleInputChange}
                            className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <select
                            name="backgroundColor"
                            value={formData.backgroundColor}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ focusRingColor: "#2691ce" }}
                          >
                            {backgroundColors.map((color) => (
                              <option key={color.value} value={color.value}>
                                {color.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "#040606" }}
                        >
                          Text Color
                        </label>
                        <input
                          type="color"
                          name="textColor"
                          value={formData.textColor}
                          onChange={handleInputChange}
                          className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                        />
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
                          Font Family
                        </label>
                        <select
                          name="fontFamily"
                          value={formData.fontFamily}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ focusRingColor: "#2691ce" }}
                        >
                          {fontFamilies.map((font) => (
                            <option key={font.value} value={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Caption */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Caption (Optional, max 200 characters)
                  </label>
                  <input
                    type="text"
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    placeholder="Add a caption..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      errors.caption ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.caption ? (
                      <p className="text-red-500 text-sm">{errors.caption}</p>
                    ) : (
                      <p className="text-xs" style={{ color: "#646464" }}>
                        Optional caption for your story
                      </p>
                    )}
                    <span className="text-xs" style={{ color: "#646464" }}>
                      {formData.caption.length}/200
                    </span>
                  </div>
                </motion.div>

                {/* Duration */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                  >
                    {durations.map((duration) => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <Tag className="w-4 h-4 mr-2" style={{ color: "#2691ce" }} />
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleAddTag}
                    placeholder="Enter tags and press Enter or comma..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          className="px-3 py-1 text-sm rounded-full text-white cursor-pointer flex items-center gap-1"
                          style={{ backgroundColor: "#2691ce" }}
                          onClick={() => removeTag(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {tag}
                          <span className="ml-1 text-xs">×</span>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Themes Multi-Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="relative"
                  ref={themeDropdownRef}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <Tag className="w-4 h-4 mr-2" style={{ color: "#2691ce" }} />
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
                          ? `${formData.themes.length} theme${formData.themes.length !== 1 ? 's' : ''} selected`
                          : "Select themes..."}
                      </span>
                      <span className="text-gray-400">▼</span>
                    </button>
                    {isThemeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {themesLoading ? (
                          <div className="px-4 py-2 text-gray-500 text-sm">Loading themes...</div>
                        ) : availableThemes.length > 0 ? (
                          availableThemes.map((theme) => {
                            const isSelected = formData.themes.includes(theme.name);
                            return (
                              <div
                                key={theme._id || theme.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setFormData(prev => ({
                                      ...prev,
                                      themes: prev.themes.filter(t => t !== theme.name)
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      themes: [...prev.themes, theme.name]
                                    }));
                                  }
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                              >
                                <span>{theme.name}</span>
                                {isSelected && (
                                  <Check className="w-4 h-4" style={{ color: "#2691ce" }} />
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">No themes available</div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  {formData.themes.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {formData.themes.map((themeName, index) => (
                        <motion.span
                          key={themeName}
                          className="px-3 py-1 text-sm rounded-full text-white cursor-pointer flex items-center gap-1"
                          style={{ backgroundColor: "#10b981" }}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              themes: prev.themes.filter(t => t !== themeName)
                            }));
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {themeName}
                          <span className="ml-1 text-xs">×</span>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Featured */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
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
                      Mark as Featured Story
                    </span>
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
                    <span>Create Story</span>
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
