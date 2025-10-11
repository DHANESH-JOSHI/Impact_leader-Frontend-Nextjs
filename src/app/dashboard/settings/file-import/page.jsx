"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  File,
  RefreshCw,
} from "lucide-react";

export default function FileImportPage() {
  // current logo aur file upload ke states manage krta hai
  const [currentLogo, setCurrentLogo] = useState({
    url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop&crop=center",
    name: "company-logo.png",
    size: "45.2 KB",
    uploadedAt: "2024-01-15T10:30:00Z",
  });

  const [newFile, setNewFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // smooth transitions ke liye animation configurations
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // uploaded files ko validate krta hai - type aur size check
  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!validTypes.includes(file.type)) {
      alert("Please upload only image files (JPG, PNG, SVG, WebP)!");
      return false;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 5MB!");
      return false;
    }

    return true;
  };

  // validation ke baad file upload process krta hai
  const handleFileUpload = (file) => {
    if (validateFile(file)) {
      setNewFile(file);
    }
  };

  // drag aur drop functionality handle krta hai
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // input se file selection handle krta hai
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  // nayi file submit krke current logo update krta hai
  const handleUploadSubmit = async () => {
    if (!newFile) return;

    setUploading(true);

    // timeout ke sath upload process simulate krta hai
    setTimeout(() => {
      setCurrentLogo({
        url: URL.createObjectURL(newFile),
        name: newFile.name,
        size: `${(newFile.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString(),
      });
      setNewFile(null);
      setUploading(false);
      setUploadSuccess(true);

      // 3 seconds baad success message hide krta hai
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  // confirmation ke sath current logo remove krta hai
  const handleDeleteCurrentLogo = () => {
    if (window.confirm("Are you sure you want to delete the current logo?")) {
      setCurrentLogo(null);
    }
  };

  // date strings ko display ke liye format krta hai
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-white p-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* main page header - title aur description ke sath */}
      <motion.div className="mb-8" variants={cardVariants}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ImageIcon className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: "#040606" }}>
            Logo Management
          </h1>
        </div>
        <p className="text-sm" style={{ color: "#646464" }}>
          Upload and manage your company logo
        </p>
      </motion.div>

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* current logo display section */}
        <motion.div
          className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6"
          variants={cardVariants}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#040606" }}
          >
            Current Logo
          </h2>

          {currentLogo ? (
            <div className="space-y-4">
              {/* logo preview container */}
              <div className="flex justify-center">
                <div className="relative group">
                  <img
                    src={currentLogo.url}
                    alt="Current Logo"
                    className="w-32 h-32 object-contain border-2 border-gray-200 rounded-lg bg-white"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-5 transition-opacity rounded-lg"></div>
                </div>
              </div>

              {/* file details display */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#646464" }}>
                    File Name:
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#040606" }}
                  >
                    {currentLogo.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#646464" }}>
                    File Size:
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#040606" }}
                  >
                    {currentLogo.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#646464" }}>
                    Uploaded:
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#040606" }}
                  >
                    {formatDate(currentLogo.uploadedAt)}
                  </span>
                </div>
              </div>

              {/* current logo ke liye action buttons */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = currentLogo.url;
                    link.download = currentLogo.name;
                    link.click();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  style={{ color: "#2691ce" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
                <motion.button
                  onClick={handleDeleteCurrentLogo}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "#646464" }}
              />
              <p
                className="text-lg font-medium mb-2"
                style={{ color: "#040606" }}
              >
                No Logo Uploaded
              </p>
              <p className="text-sm" style={{ color: "#646464" }}>
                No logo has been uploaded yet
              </p>
            </div>
          )}
        </motion.div>

        {/* nayi logo upload krne ka section */}
        <motion.div
          className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-6"
          variants={cardVariants}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "#040606" }}
          >
            Upload New Logo
          </h2>

          {/* interactive upload area */}
          <div className="relative">
            <div
              className={`relative w-full group cursor-pointer transition-all duration-300 ${
                dragActive ? "scale-105" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div
                  className={`relative z-40 group-hover:translate-x-2 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center h-32 w-32 mx-auto rounded-xl bg-white${
                    dragActive ? "bg-blue-600" : ""
                  }`}
                  style={{
                    backgroundColor: dragActive ? "#2691ce" : "#040606",
                  }}
                >
                  <motion.svg
                    className="h-8 w-8 text-white"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height="32"
                    width="32"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{
                      y: dragActive ? -2 : 0,
                      scale: dragActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M7 9l5 -5l5 5"></path>
                    <path d="M12 4l0 12"></path>
                  </motion.svg>
                </div>

                {/* animated border overlay */}
                <div
                  className={`absolute border opacity-0 group-hover:opacity-80 transition-all duration-300 border-dashed inset-0 z-30 bg-transparent flex items-center justify-center h-32 w-32 mx-auto rounded-xl ${
                    dragActive
                      ? "opacity-80 border-blue-400"
                      : "border-blue-300"
                  }`}
                  style={{ borderColor: dragActive ? "#2691ce" : "#93c5fd" }}
                ></div>
              </label>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            {/* upload instructions */}
            <div className="text-center mt-4">
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "#040606" }}
              >
                Click to upload or drag & drop file
              </p>
              <p className="text-xs" style={{ color: "#646464" }}>
                PNG, JPG, SVG, WebP (Max 5MB)
              </p>
            </div>
          </div>

          {/* selected nayi file ka preview */}
          {newFile && (
            <motion.div
              className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: "#040606" }}
              >
                Preview:
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={URL.createObjectURL(newFile)}
                  alt="New logo preview"
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-white"
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#040606" }}
                  >
                    {newFile.name}
                  </p>
                  <p className="text-xs" style={{ color: "#646464" }}>
                    {(newFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <motion.button
                  onClick={() => setNewFile(null)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* upload submission button */}
          <div className="mt-6">
            <motion.button
              onClick={handleUploadSubmit}
              disabled={!newFile || uploading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                newFile && !uploading
                  ? "text-white hover:shadow-md"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              style={{
                backgroundColor: newFile && !uploading ? "#2691ce" : "#e5e7eb",
              }}
              whileHover={newFile && !uploading ? { scale: 1.02 } : {}}
              whileTap={newFile && !uploading ? { scale: 0.98 } : {}}
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* success notification */}
      {uploadSuccess && (
        <motion.div
          className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
        >
          <CheckCircle className="w-5 h-5" />
          Logo successfully uploaded!
        </motion.div>
      )}
    </motion.div>
  );
}
