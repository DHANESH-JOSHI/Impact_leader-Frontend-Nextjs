"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  FileText,
  Tag,
  Star,
  Check,
  Upload,
  Video,
  Trash2,
} from "lucide-react";
import { ThemesService } from "@/services/themesService";

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
  initialPost = null,
  themes: themesProp = null, // Accept themes as prop
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    tags: [],
    themes: [],
    featured: false,
    allowComments: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [availableThemes, setAvailableThemes] = useState([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const fileInputRef = useRef(null);

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

  // Load themes only if not provided as prop, and only when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    if (themesProp && themesProp.length > 0) {
      setAvailableThemes(themesProp);
    } else if (availableThemes.length === 0) {
      // Only load if themes prop is not provided and we don't have themes yet
      loadThemes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, themesProp]);

  useEffect(() => {
    if (initialPost) {
      setFormData({
        title: initialPost.title || "",
        content: initialPost.content || "",
        status: initialPost.status || "draft",
        tags: Array.isArray(initialPost.tags) ? initialPost.tags : [],
        // Normalize themes: extract names from theme objects or use strings directly
        themes: Array.isArray(initialPost.themes) 
          ? initialPost.themes.map(theme => {
              if (typeof theme === 'string') return theme; // Already a name
              if (theme && typeof theme === 'object') return theme.name || String(theme._id || theme.id || theme); // Extract name from object
              return String(theme); // Fallback
            }).filter(Boolean)
          : [],
        featured: initialPost.featured || false,
        allowComments: initialPost.allowComments !== false,
      });
      // Load existing media if editing
      if (initialPost.media && Array.isArray(initialPost.media)) {
        setSelectedMedia(initialPost.media.map(m => ({ url: m, isExisting: true })));
      } else {
        setSelectedMedia([]);
      }
    } else {
      setFormData({
        title: "",
        content: "",
        status: "draft",
        tags: [],
        themes: [],
        featured: false,
        allowComments: true,
      });
      setSelectedMedia([]);
    }
  }, [initialPost, isOpen]);

  const loadThemes = async () => {
    try {
      const result = await ThemesService.getAllThemes({ limit: 100, sortBy: "name", sortOrder: "asc" });
      if (result.success && Array.isArray(result.data)) {
        setAvailableThemes(result.data);
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
    }
  };


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

  // Handle tag input with Enter key
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput("");
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input blur (add tag when user leaves the field)
  const handleTagBlur = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setTagInput("");
    }
  };

  // Handle media file selection
  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    const newMedia = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
      name: file.name
    }));

    setSelectedMedia(prev => [...prev, ...newMedia]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove media
  const handleRemoveMedia = (index) => {
    setSelectedMedia(prev => {
      const newMedia = prev.filter((_, i) => i !== index);
      // Revoke object URL if it was a new file
      if (!prev[index].isExisting && prev[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(prev[index].url);
      }
      return newMedia;
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters long";
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

    const postData = {
      title: formData.title,
      content: formData.content,
      themes: Array.isArray(formData.themes) ? formData.themes : [],
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      isPublic: formData.status === "published",
      isPinned: formData.featured || false,
      status: formData.status || "draft",
      allowComments: formData.allowComments !== false,
      // Include media files (only new files, not existing URLs)
      media: selectedMedia.filter(m => !m.isExisting && m.file).map(m => m.file),
      images: selectedMedia.filter(m => !m.isExisting && m.file).map(m => m.file),
    };

    if (initialPost) {
      postData.id = initialPost.id;
    }

    try {
      await onSubmit(postData);

      // Reset form only on successful submission
      setFormData({
        title: "",
        content: "",
        status: "draft",
        tags: [],
        themes: [],
        featured: false,
        allowComments: true,
      });
      setTagInput("");
      setSelectedMedia([]);
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
      setIsThemeDropdownOpen(false);
      setFormData({
        title: "",
        content: "",
        themes: [],
        status: "draft",
        tags: [],
        featured: false,
        allowComments: true,
      });
      setTagInput("");
      setSelectedMedia([]);
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
                    {initialPost ? "Edit Post" : "Create New Post"}
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

                {/* Status and Allow Comments */}
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

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Comments
                    </label>
                    <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg">
                      <input
                        type="checkbox"
                        name="allowComments"
                        checked={formData.allowComments}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded focus:ring-2"
                        style={{
                          color: "#2691ce",
                          focusRingColor: "#2691ce",
                        }}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm" style={{ color: "#646464" }}>
                        Allow Comments
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Tags Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
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
                    onBlur={handleTagBlur}
                    placeholder="Enter tags and press Enter or comma..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {formData.tags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
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
                    </motion.div>
                  )}
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Press Enter or comma to add tags. Click on tags to remove them.
                  </p>
                </motion.div>

                {/* Themes Multi-Select */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
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
                        {availableThemes.length > 0 ? (
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
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Select themes from the dropdown. Click on selected themes to remove them.
                  </p>
                </motion.div>

                {/* Media Upload */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <Upload className="w-4 h-4 mr-2" style={{ color: "#2691ce" }} />
                    Media (Images/Videos) - Optional
                  </label>
                  <div className="space-y-3">
                    {/* File Input */}
                    <div className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMediaSelect}
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        id="media-upload"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="media-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        style={{ 
                          borderColor: "#2691ce",
                          backgroundColor: "#f8fafc"
                        }}
                      >
                        <Upload className="w-5 h-5 mr-2" style={{ color: "#2691ce" }} />
                        <span className="text-sm" style={{ color: "#646464" }}>
                          Click to upload images or videos
                        </span>
                      </label>
                    </div>

                    {/* Media Preview */}
                    {selectedMedia.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {selectedMedia.map((media, index) => (
                          <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {media.url && (
                              <>
                                {media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
                                 (media.file && media.file.type.startsWith('image/')) ? (
                                  <img
                                    src={media.url}
                                    alt={media.name || `Media ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                  />
                                ) : (
                                  <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                    <Video className="w-8 h-8" style={{ color: "#2691ce" }} />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(index)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  disabled={isSubmitting}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                {media.isExisting && (
                                  <span className="absolute bottom-1 left-1 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                    Existing
                                  </span>
                                )}
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Upload images or videos to attach to your post. You can select multiple files.
                  </p>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${errors.content ? "border-red-500" : "border-gray-300"
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
                    <span>{initialPost ? "Update Post" : "Create Post"}</span>
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