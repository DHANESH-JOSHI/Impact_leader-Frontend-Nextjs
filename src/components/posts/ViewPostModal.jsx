"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit,
  Eye,
  Heart,
  Calendar,
  User,
  Tag,
  Star,
  Clock,
  Share2,
  Save,
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

export default function ViewPostModal({ isOpen, onClose, post, onEdit, themes: themesProp = null }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [availableThemes, setAvailableThemes] = useState([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const fileInputRef = useRef(null);

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
    try {
      const result = await ThemesService.getAllThemes({ limit: 100, sortBy: "name", sortOrder: "asc" });
      if (result.success && Array.isArray(result.data)) {
        setAvailableThemes(result.data);
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
    }
  };

  // Initialize edit form data when entering edit mode
  const handleEditToggle = () => {
    if (!isEditMode && post) {
      setEditFormData({
        title: post.title,
        content: post.content,
        status: post.status || "draft",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || ""),
        // Normalize themes: extract names from theme objects or use strings directly
        themes: Array.isArray(post.themes) 
          ? post.themes.map(theme => {
              if (typeof theme === 'string') return theme; // Already a name
              if (theme && typeof theme === 'object') return theme.name || String(theme._id || theme.id || theme); // Extract name from object
              return String(theme); // Fallback
            }).filter(Boolean)
          : [],
        allowComments: post.allowComments !== false,
      });
      // Load existing media if editing
      if (post.media && Array.isArray(post.media)) {
        setSelectedMedia(post.media.map(m => ({ 
          url: typeof m === 'string' ? m : (m.url || m.path || ''), 
          isExisting: true,
          name: typeof m === 'string' ? 'Existing media' : (m.name || 'Existing media')
        })));
      } else {
        setSelectedMedia([]);
      }
    }
    setIsEditMode(!isEditMode);
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // Handle save changes
  const handleSaveChanges = () => {
    if (post) {
      const updatedPost = {
        ...post,
        ...editFormData,
        tags: editFormData.tags
          ? editFormData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag)
          : [],
        themes: Array.isArray(editFormData.themes) ? editFormData.themes : [],
        status: editFormData.status || "draft",
        allowComments: editFormData.allowComments !== false,
        // Include media files (only new files, not existing URLs)
        media: selectedMedia.filter(m => !m.isExisting && m.file).map(m => m.file),
        images: selectedMedia.filter(m => !m.isExisting && m.file).map(m => m.file),
      };
      onEdit(updatedPost);
      setIsEditMode(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setIsThemeDropdownOpen(false);
    setIsEditMode(false);
    setEditFormData({});
    // Clean up blob URLs
    selectedMedia.forEach(media => {
      if (!media.isExisting && media.url.startsWith('blob:')) {
        URL.revokeObjectURL(media.url);
      }
    });
    setSelectedMedia([]);
    onClose();
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "published":
        return { backgroundColor: "#10b981", color: "white" };
      case "draft":
        return { backgroundColor: "#f59e0b", color: "white" };
      case "archived":
        return { backgroundColor: "#6b7280", color: "white" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#374151" };
    }
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (!post){ return null;}
  else{
    console.log("post:",post)
  }

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
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
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
                  {isEditMode ? (
                    <Edit className="h-6 w-6" style={{ color: "#2691ce" }} />
                  ) : (
                    <Eye className="h-6 w-6" style={{ color: "#2691ce" }} />
                  )}
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {isEditMode ? "Edit Post" : "View Post"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    {isEditMode
                      ? "Make changes to your post"
                      : "Post details and content"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!isEditMode && (
                  <motion.button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all"
                    style={{ backgroundColor: "#2691ce" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Post</span>
                  </motion.button>
                )}

                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" style={{ color: "#646464" }} />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
              {isEditMode ? (
                /* Edit Mode Interface */
                <div className="p-6 space-y-6">
                  {/* Post Title Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Post Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-lg font-semibold"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Enter post title..."
                    />
                  </motion.div>

                  {/* Status and Allow Comments */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#040606" }}
                      >
                        Status
                      </label>
                      <select
                        name="status"
                        value={editFormData.status || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
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
                          checked={editFormData.allowComments !== false}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{
                            color: "#2691ce",
                            focusRingColor: "#2691ce",
                          }}
                        />
                        <span className="text-sm" style={{ color: "#646464" }}>
                          Allow Comments
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Full Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Post Content
                    </label>
                    <textarea
                      name="content"
                      value={editFormData.content || ""}
                      onChange={handleInputChange}
                      rows={15}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none font-mono text-sm"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Write your full post content here..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs" style={{ color: "#646464" }}>
                        The main content of your post
                      </p>
                      <span className="text-xs" style={{ color: "#646464" }}>
                        {(editFormData.content || "").length} characters
                      </span>
                    </div>
                  </motion.div>

                  {/* Tags Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={editFormData.tags || ""}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas (e.g., technology, tutorial, react)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Separate multiple tags with commas for better discoverability
                    </p>
                  </motion.div>

                  {/* Themes Multi-Select */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 }}
                    className="relative"
                    ref={themeDropdownRef}
                  >
                    <label
                      className="flex items-center text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      <Tag className="w-4 h-4 mr-2" style={{ color: "#2691ce" }} />
                      Themes
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-left flex items-center justify-between"
                        style={{ focusRingColor: "#2691ce" }}
                      >
                        <span className={(Array.isArray(editFormData.themes) ? editFormData.themes.length : 0) > 0 ? "text-gray-900" : "text-gray-500"}>
                          {(Array.isArray(editFormData.themes) ? editFormData.themes.length : 0) > 0 
                            ? `${editFormData.themes.length} theme${editFormData.themes.length !== 1 ? 's' : ''} selected`
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
                              const isSelected = Array.isArray(editFormData.themes) && editFormData.themes.includes(theme.name);
                              return (
                                <div
                                  key={theme._id || theme.id}
                                  onClick={() => {
                                    const currentThemes = Array.isArray(editFormData.themes) ? editFormData.themes : [];
                                    if (isSelected) {
                                      setEditFormData(prev => ({
                                        ...prev,
                                        themes: currentThemes.filter(t => t !== theme.name)
                                      }));
                                    } else {
                                      setEditFormData(prev => ({
                                        ...prev,
                                        themes: [...currentThemes, theme.name]
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
                    {Array.isArray(editFormData.themes) && editFormData.themes.length > 0 && (
                      <motion.div
                        className="flex flex-wrap gap-2 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {editFormData.themes.map((themeName, index) => (
                          <motion.span
                            key={themeName}
                            className="px-3 py-1 text-sm rounded-full text-white cursor-pointer flex items-center gap-1"
                            style={{ backgroundColor: "#10b981" }}
                            onClick={() => {
                              setEditFormData(prev => ({
                                ...prev,
                                themes: (Array.isArray(prev.themes) ? prev.themes : []).filter(t => t !== themeName)
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
                    transition={{ delay: 0.9 }}
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
                          id="media-upload-edit"
                        />
                        <label
                          htmlFor="media-upload-edit"
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

                  {/* Featured/Pinned Checkbox */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={editFormData.featured || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded focus:ring-2"
                        style={{ accentColor: "#2691ce" }}
                      />
                      <span className="text-sm font-medium" style={{ color: "#040606" }}>
                        Pin/Feature this post
                      </span>
                    </label>
                  </motion.div>
                </div>
              ) : (
                /* View Mode Display */
                <div className="p-6">
                  {/* Post Header Section */}
                  <motion.div
                    className="border-b border-gray-200 pb-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h1
                            className="text-3xl font-bold leading-tight"
                            style={{ color: "#040606" }}
                          >
                            {post.title}
                          </h1>
                          {post.isPinned && (
                            <motion.div
                              className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium text-yellow-600">
                                Featured
                              </span>
                            </motion.div>
                          )}
                        </div>

                        <p
                          className="text-lg leading-relaxed mb-4"
                          style={{ color: "#646464" }}
                        >
                          {post.excerpt}
                        </p>
                      </div>

                      <div
                        className="px-3 py-1 text-sm font-medium rounded-full ml-4 flex-shrink-0"
                        style={getStatusBadgeStyle(post.status)}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </div>
                    </div>

                    {/* Post Metadata */}
                    <motion.div
                      className="flex flex-wrap items-center gap-6 text-sm mb-4"
                      style={{ color: "#646464" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>By {post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                      {/* Category removed - Post model doesn't have category field */}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {calculateReadingTime(post.content)} min read
                        </span>
                      </div>
                    </motion.div>

                    {/* Post Statistics */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center space-x-6">
                        <div
                          className="flex items-center space-x-2 text-sm"
                          style={{ color: "#646464" }}
                        >
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()} views</span>
                        </div>
                        <div
                          className="flex items-center space-x-2 text-sm"
                          style={{ color: "#646464" }}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>

                      <motion.button
                        className="flex items-center space-x-2 text-sm px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
                        style={{ color: "#646464" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share Post</span>
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Main Content Display */}
                  <motion.div
                    className="prose prose-lg max-w-none mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div
                      className="text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#040606", lineHeight: "1.7" }}
                    >
                      {post.content}
                    </div>
                  </motion.div>

                  {/* Post Tags Section */}
                  {post.tags && post.tags.length > 0 && (
                    <motion.div
                      className="border-t border-gray-200 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "#040606" }}
                      >
                        Related Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                            style={{
                              backgroundColor: "#eff6ff",
                              color: "#2691ce",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer - Only shows in edit mode */}
            {isEditMode && (
              <div
                className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <motion.button
                  onClick={handleEditToggle}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "#646464" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel Changes
                </motion.button>
                <motion.button
                  onClick={handleSaveChanges}
                  className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  style={{ backgroundColor: "#2691ce" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
