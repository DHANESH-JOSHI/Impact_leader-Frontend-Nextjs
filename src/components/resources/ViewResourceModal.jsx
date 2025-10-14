"use client";

import React, { useState, useRef } from "react";
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
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  FileText,
  FolderOpen,
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

export default function ViewResourceModal({
  isOpen,
  onClose,
  resource,
  onEdit,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef(null);

  // Initialize edit form data when entering edit mode
  const handleEditToggle = () => {
    if (!isEditMode && resource) {
      setEditFormData({
        title: resource.title,
        description: resource.description,
        author: resource.author,
        category: resource.category,
        status: resource.status,
        tags: resource.tags ? resource.tags.join(", ") : "",
        featured: resource.featured,
      });
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

  // Handle save changes
  const handleSaveChanges = () => {
    if (resource) {
      const updatedResource = {
        ...resource,
        ...editFormData,
        tags: editFormData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };
      onEdit(updatedResource);
      setIsEditMode(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setIsEditMode(false);
    setEditFormData({});
    setIsPlaying(false);
    if (mediaRef.current) {
      mediaRef.current.pause();
    }
    onClose();
  };

  // Media controls
  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (mediaRef.current) {
      const seekTime =
        (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
      mediaRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Volume2 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (!resource) return null;

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
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[96vh] overflow-hidden"
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
                    <FolderOpen
                      className="h-6 w-6"
                      style={{ color: "#2691ce" }}
                    />
                  )}
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#040606" }}
                  >
                    {isEditMode ? "Edit Resource" : "View Resource"}
                  </h2>
                  <p className="text-sm" style={{ color: "#646464" }}>
                    {isEditMode
                      ? "Make changes to your resource"
                      : "Resource details and preview"}
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
                    <span>Edit Resource</span>
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
                  {/* Resource Title Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Resource Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-lg font-semibold"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Enter resource title..."
                    />
                  </motion.div>

                  {/* Meta Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
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
                        value={editFormData.author || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="Author name..."
                      />
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
                        <Tag className="inline h-4 w-4 mr-1" />
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={editFormData.category || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="Resource category..."
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
                  </div>

                  {/* Featured Resource Toggle */}
                  <motion.div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "#f8fafc" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={editFormData.featured || false}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded focus:ring-2"
                        style={{ color: "#2691ce", focusRingColor: "#2691ce" }}
                      />
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#040606" }}
                        >
                          Mark as Featured Resource
                        </span>
                      </div>
                    </label>
                    <p
                      className="text-xs mt-2 ml-8"
                      style={{ color: "#646464" }}
                    >
                      Featured resources appear prominently in listings
                    </p>
                  </motion.div>

                  {/* Resource Description */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#040606" }}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Describe your resource..."
                    />
                  </motion.div>

                  {/* Tags Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
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
                      placeholder="Enter tags separated by commas (e.g., tutorial, music, education)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      Separate multiple tags with commas for better
                      discoverability
                    </p>
                  </motion.div>
                </div>
              ) : (
                /* View Mode Display */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Media Preview Column */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-4">
                      {/* Media Player/Preview */}
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        {resource.type === "video" && (
                          <div className="relative">
                            <video
                              ref={mediaRef}
                              src={resource.fileUrl}
                              poster={resource.thumbnail}
                              className="w-full h-64 object-cover"
                              onTimeUpdate={handleTimeUpdate}
                              onLoadedMetadata={handleLoadedMetadata}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                            />

                            {/* Video Controls */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                              <div className="flex items-center space-x-3">
                                <motion.button
                                  onClick={handlePlayPause}
                                  className="text-white hover:text-blue-400 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                  ) : (
                                    <Play className="h-6 w-6" />
                                  )}
                                </motion.button>

                                <div className="flex-1">
                                  <div
                                    className="w-full h-1 bg-white bg-opacity-30 rounded cursor-pointer"
                                    onClick={handleSeek}
                                  >
                                    <div
                                      className="h-full bg-white rounded"
                                      style={{
                                        width: `${
                                          (currentTime / duration) * 100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                </div>

                                <span className="text-white text-sm">
                                  {formatDuration(currentTime)} /{" "}
                                  {formatDuration(duration)}
                                </span>

                                <motion.button
                                  onClick={handleMute}
                                  className="text-white hover:text-blue-400 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isMuted ? (
                                    <VolumeX className="h-5 w-5" />
                                  ) : (
                                    <Volume2 className="h-5 w-5" />
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        )}

                        {resource.type === "audio" && (
                          <div className="p-8">
                            <audio
                              ref={mediaRef}
                              src={resource.fileUrl}
                              onTimeUpdate={handleTimeUpdate}
                              onLoadedMetadata={handleLoadedMetadata}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                            />

                            {/* Audio Visualization */}
                            <div className="text-center mb-6">
                              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                <Volume2
                                  className="h-10 w-10"
                                  style={{ color: "#2691ce" }}
                                />
                              </div>
                              <p className="text-white font-medium">
                                {resource.title}
                              </p>
                            </div>

                            {/* Audio Controls */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-center space-x-4">
                                <motion.button
                                  onClick={handlePlayPause}
                                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                  ) : (
                                    <Play className="h-6 w-6" />
                                  )}
                                </motion.button>

                                <motion.button
                                  onClick={handleMute}
                                  className="text-white hover:text-blue-400 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isMuted ? (
                                    <VolumeX className="h-5 w-5" />
                                  ) : (
                                    <Volume2 className="h-5 w-5" />
                                  )}
                                </motion.button>
                              </div>

                              <div>
                                <div
                                  className="w-full h-2 bg-white bg-opacity-30 rounded cursor-pointer"
                                  onClick={handleSeek}
                                >
                                  <div
                                    className="h-full bg-white rounded"
                                    style={{
                                      width: `${
                                        (currentTime / duration) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-white text-sm mt-2">
                                  <span>{formatDuration(currentTime)}</span>
                                  <span>{formatDuration(duration)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {resource.type === "document" && (
                          <div className="h-64 flex items-center justify-center">
                            <div className="text-center text-white">
                              <FileText className="h-16 w-16 mx-auto mb-4" />
                              <p className="font-medium">Document Preview</p>
                              <p className="text-sm opacity-75">
                                Click download to view full document
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <motion.a
                          href={resource.fileUrl}
                          download={resource.fileName}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </motion.a>

                        <motion.button
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Resource Details Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Resource Header */}
                    <motion.div
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
                              {resource.title}
                            </h1>
                            {resource.featured && (
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
                            {resource.description}
                          </p>
                        </div>

                        <div
                          className="px-3 py-1 text-sm font-medium rounded-full ml-4 flex-shrink-0"
                          style={getStatusBadgeStyle(resource.status)}
                        >
                          {resource.status.charAt(0).toUpperCase() +
                            resource.status.slice(1)}
                        </div>
                      </div>

                      {/* Resource Metadata */}
                      <div
                        className="flex flex-wrap items-center gap-6 text-sm mb-4"
                        style={{ color: "#646464" }}
                      >
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>By {resource.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(resource.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Tag className="h-4 w-4" />
                          <span>{resource.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(resource.type)}
                          <span>
                            {resource.type.charAt(0).toUpperCase() +
                              resource.type.slice(1)}
                          </span>
                        </div>
                        {resource.duration && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(resource.duration)}</span>
                          </div>
                        )}
                      </div>

                      {/* Resource Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <Eye
                            className="h-6 w-6 mx-auto mb-2"
                            style={{ color: "#2691ce" }}
                          />
                          <div
                            className="text-2xl font-bold"
                            style={{ color: "#2691ce" }}
                          >
                            {resource.views.toLocaleString()}
                          </div>
                          <div className="text-sm" style={{ color: "#2691ce" }}>
                            Views
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-red-600">
                            {resource.likes}
                          </div>
                          <div className="text-sm text-red-600">Likes</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <Download className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">
                            {resource.downloads}
                          </div>
                          <div className="text-sm text-green-600">
                            Downloads
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <Share2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">
                            0
                          </div>
                          <div className="text-sm text-purple-600">Shares</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* File Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3
                        className="text-lg font-semibold mb-4"
                        style={{ color: "#040606" }}
                      >
                        File Details
                      </h3>
                      <div
                        className="rounded-lg p-4 space-y-3"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#646464" }}>File Name:</span>
                          <span
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {resource.fileName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#646464" }}>File Size:</span>
                          <span
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {formatFileSize(resource.fileSize)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#646464" }}>Type:</span>
                          <span
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {resource.type.charAt(0).toUpperCase() +
                              resource.type.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#646464" }}>Created:</span>
                          <span
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {formatDate(resource.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: "#646464" }}>
                            Last Updated:
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "#040606" }}
                          >
                            {formatDate(resource.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Resource Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3
                          className="text-lg font-semibold mb-4"
                          style={{ color: "#040606" }}
                        >
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag, index) => (
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
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
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
