"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  FolderOpen,
  Upload,
  File,
  Video,
  Volume2,
  Image,
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

export default function AddResourceModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialResource = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document",
    fileUrl: "",
    fileName: "",
    fileSize: 0,
    duration: 0,
    category: categories[0] || "",
    tags: "",
    themes: "",
    author: "",
    isPublic: true,
    isESG: false,
    isCSR: true, // Default to CSR
    url: "",
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (initialResource) {
      setFormData({
        title: initialResource.title || "",
        description: initialResource.description || "",
        type: initialResource.type || "document",
        fileUrl: initialResource.fileUrl || "",
        fileName: initialResource.fileName || "",
        fileSize: initialResource.fileSize || 0,
        duration: initialResource.duration || 0,
        category: initialResource.category || categories[0] || "",
        tags: Array.isArray(initialResource.tags) ? initialResource.tags.join(", ") : (initialResource.tags || ""),
        themes: Array.isArray(initialResource.themes) ? initialResource.themes.join(", ") : (initialResource.themes || ""),
        author: initialResource.author || "",
        isPublic: initialResource.isPublic !== undefined ? initialResource.isPublic : true,
        isESG: initialResource.isESG || false,
        isCSR: initialResource.isCSR !== undefined ? initialResource.isCSR : true,
        url: initialResource.url || "",
        featured: initialResource.featured || false,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "document",
        fileUrl: "",
        fileName: "",
        fileSize: 0,
        duration: 0,
        category: categories[0] || "",
        tags: "",
        themes: "",
        author: "",
        isPublic: true,
        isESG: false,
        isCSR: true,
        url: "",
        featured: false,
      });
    }
  }, [initialResource, isOpen, categories]);

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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      let resourceType = "document";

      if (fileType.startsWith("video/")) {
        resourceType = "video";
      } else if (fileType.startsWith("audio/")) {
        resourceType = "audio";
      }

      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        type: resourceType,
      }));

      // Simulate file upload progress
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Create object URL for preview
          const url = URL.createObjectURL(file);
          setFormData((prevData) => ({
            ...prevData,
            fileUrl: url,
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Validate ESG/CSR - exactly one must be true
    if (formData.isESG === formData.isCSR) {
      newErrors.esgcsr = "Please select either ESG or CSR (exactly one must be selected)";
    }

    // For link type, URL is required. For other types, file or URL is required
    if (formData.type === "link") {
      if (!formData.url?.trim()) {
        newErrors.url = "URL is required for link type resources";
      }
    } else if (!selectedFile && !formData.fileUrl && !formData.url) {
      newErrors.file = "Please upload a file or provide a URL";
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
      const resourceData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        themes: formData.themes
          .split(",")
          .map((theme) => theme.trim())
          .filter((theme) => theme),
        isPublic: formData.isPublic,
        isESG: formData.isESG,
        isCSR: formData.isCSR,
        ...(formData.url && { url: formData.url }),
        ...(selectedFile && { file: selectedFile }),
        ...(formData.fileUrl && { fileUrl: formData.fileUrl }),
      };

      if (initialResource) {
        resourceData.id = initialResource.id;
      }

      console.log("📤 Submitting resource data:", resourceData);

      // Call the API through the onSubmit prop (which should handle the actual API call)
      await onSubmit(resourceData);

      // Reset form only after successful submission
      setFormData({
        title: "",
        description: "",
        type: "document",
        fileUrl: "",
        fileName: "",
        fileSize: 0,
        duration: 0,
        category: categories[0] || "",
        tags: "",
        themes: "",
        author: "",
        isPublic: true,
        isESG: false,
        isCSR: true,
        url: "",
        featured: false,
      });
      setSelectedFile(null);
      setUploadProgress(0);
      setErrors({});

    } catch (error) {
      console.error("❌ Form submission error:", error);
      // Handle error (show toast, set error state, etc.)
      setErrors({ submit: "Failed to create resource. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        description: "",
        type: "document",
        fileUrl: "",
        fileName: "",
        fileSize: 0,
        duration: 0,
        category: categories[0] || "",
        tags: "",
        themes: "",
        author: "",
        isPublic: true,
        isESG: false,
        isCSR: true,
        url: "",
        featured: false,
      });
      setSelectedFile(null);
      setUploadProgress(0);
      setErrors({});
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
                  <FolderOpen
                    className="h-6 w-6"
                    style={{ color: "#2691ce" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {initialResource ? "Edit Resource" : "Add New Resource"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    Upload and manage your media resources
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
                {/* File Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Upload File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="audio/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload
                          className="h-12 w-12 mx-auto mb-4"
                          style={{ color: "#2691ce" }}
                        />
                        <p
                          className="text-lg font-medium mb-2"
                          style={{ color: "#040606" }}
                        >
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm" style={{ color: "#646464" }}>
                          MP3, MP4, PDF, DOC files up to 100MB
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: "#646464" }}>Uploading...</span>
                        <span style={{ color: "#646464" }}>
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: "#2691ce",
                            width: `${uploadProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  {selectedFile && (
                    <motion.div
                      className="mt-4 p-4 border border-gray-200 rounded-lg"
                      style={{ backgroundColor: "#f8fafc" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div style={{ color: "#2691ce" }}>
                          {formData.type === "video" && (
                            <Video className="h-5 w-5" />
                          )}
                          {formData.type === "audio" && (
                            <Volume2 className="h-5 w-5" />
                          )}
                          {formData.type === "document" && (
                            <File className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {selectedFile.name}
                          </p>
                          <p className="text-sm" style={{ color: "#646464" }}>
                            {formatFileSize(selectedFile.size)} •{" "}
                            {formData.type}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {errors.file && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.file}
                    </motion.p>
                  )}
                </motion.div>

                {/* Title and Basic Info */}
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
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter resource title..."
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

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your resource..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none ${errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.description}
                    </motion.p>
                  )}
                </motion.div>

                {/* Category and Settings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
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
                    >
                      <option value="">Select a category</option>
                      {categories && categories.map((category) => (
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

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Resource Type *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="esgcsr"
                          checked={formData.isESG}
                          onChange={() => setFormData(prev => ({ ...prev, isESG: true, isCSR: false }))}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <span style={{ color: "#040606" }}>ESG</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="esgcsr"
                          checked={formData.isCSR}
                          onChange={() => setFormData(prev => ({ ...prev, isESG: false, isCSR: true }))}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <span style={{ color: "#040606" }}>CSR</span>
                      </label>
                    </div>
                    {errors.esgcsr && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.esgcsr}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Resource Type and Public/Private */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                      <option value="other">Other</option>
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
                      Visibility
                    </label>
                    <select
                      name="isPublic"
                      value={formData.isPublic ? "true" : "false"}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.value === "true" }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    >
                      <option value="true">Public</option>
                      <option value="false">Private</option>
                    </select>
                  </motion.div>
                </div>

                {/* URL (for link type) */}
                {formData.type === "link" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.url ? "border-red-500" : "border-gray-300"}`}
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    />
                    {errors.url && (
                      <motion.p
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.url}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Themes */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Themes (Optional)
                  </label>
                  <input
                    type="text"
                    name="themes"
                    value={formData.themes}
                    onChange={handleInputChange}
                    placeholder="Enter themes separated by commas (e.g., sustainability, education, healthcare)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Separate multiple themes with commas
                  </p>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas (e.g., tutorial, music, education)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    Separate multiple tags with commas
                  </p>
                </motion.div>

                {/* Featured Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ color: "#2691ce", focusRingColor: "#2691ce" }}
                      disabled={isSubmitting}
                    />
                    <label
                      className="ml-2 text-sm"
                      style={{ color: "#040606" }}
                    >
                      Mark as featured resource
                    </label>
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
                    <span>{initialResource ? "Update Resource" : "Create Resource"}</span>
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

