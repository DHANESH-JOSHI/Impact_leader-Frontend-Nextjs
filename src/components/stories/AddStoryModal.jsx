import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUpload,
  FiImage,
  FiCalendar,
  FiClock,
  FiUser,
  FiType,
  FiFileText,
  FiTag,
} from "react-icons/fi";

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

export default function AddStoryModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    type: "text",
    // status: "draft",
    duration: 24,
    isActive: false,
    tags: [],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      image: url,
    }));
    setImagePreview(url);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim().toLowerCase()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image is required";
    }

    // if (!formData.author.trim()) {
    //   newErrors.author = "Author name is required";
    // }
    if (!formData.type) {
      newErrors.type = "Story type is required";
    }

    if (formData.duration < 1 || formData.duration > 168) {
      newErrors.duration = "Duration should be between 1 to 168 hours";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('🔍 Duration Debug - BEFORE conversion:', {
        formDuration: formData.duration,
        type: typeof formData.duration,
        rawValue: formData.duration
      });
      const durationInMilliseconds = Number(formData.duration) * 3600000;
    
    console.log('🔍 Duration Debug - AFTER conversion:', {
      hours: formData.duration,
      milliseconds: durationInMilliseconds,
      calculation: `${formData.duration} * 3600000 = ${durationInMilliseconds}`
    });

      const apiData = {
        textContent: formData.title + (formData.content ? "\n\n" + formData.content : ""),
        type: formData.type, // ADD THIS
        duration: durationInMilliseconds, // Convert to milliseconds
        mediaUrl: formData.image, // Change from 'image' to 'mediaUrl'
        tags: formData.tags,
        backgroundColor: "#000000", // Add default or make field
        textColor: "#FFFFFF", // Add default or make field
        fontFamily: "Arial", // Add default or make field
        isActive: formData.isActive,
      };

      console.log('Sending to API:', apiData);
      onAdd(apiData);

      setFormData({
        title: "",
        content: "",
        image: "",
        type: "text",
        duration: 24,
        isActive: false,
        tags: [],
      });
      setImagePreview("");
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
      // author: "",
      // status: "draft",
      type: "text",
      duration: 24,
      isActive: false,
      tags: [],
    });
    setImagePreview("");
    setErrors({});
    setTagInput("");
    onClose();
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
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: "#040606" }}
              >
                Add New Story
              </h2>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <FiType
                      className="w-4 h-4 mr-2"
                      style={{ color: "#2691ce" }}
                    />
                    Story Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your story title..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.title
                      ? "border-red-500"
                      : "border-gray-300 focus:border-transparent"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
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

                {/* Content Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <FiFileText
                      className="w-4 h-4 mr-2"
                      style={{ color: "#2691ce" }}
                    />
                    Story Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your story content..."
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all ${errors.content
                      ? "border-red-500"
                      : "border-gray-300 focus:border-transparent"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
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
                </motion.div>

                {/* Author Input */}
                {/* <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <FiUser
                      className="w-4 h-4 mr-2"
                      style={{ color: "#2691ce" }}
                    />
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.author
                      ? "border-red-500"
                      : "border-gray-300 focus:border-transparent"
                      }`}
                    style={{ focusRingColor: "#2691ce" }}
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
                </motion.div> */}

                {/* Tags Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <FiTag
                      className="w-4 h-4 mr-2"
                      style={{ color: "#2691ce" }}
                    />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleAddTag}
                    placeholder="Enter tags and press Enter..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: "#2691ce" }}
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
                          className="px-3 py-1 text-sm rounded-full text-white cursor-pointer"
                          style={{ backgroundColor: "#2691ce" }}
                          onClick={() => removeTag(tag)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {tag} ×
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Image Upload Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    className="flex items-center text-sm font-medium mb-2"
                    style={{ color: "#040606" }}
                  >
                    <FiImage
                      className="w-4 h-4 mr-2"
                      style={{ color: "#2691ce" }}
                    />
                    Story Image
                  </label>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="text-center">
                          <FiUpload
                            className="w-8 h-8 mx-auto mb-2"
                            style={{ color: "#646464" }}
                          />
                          <p className="text-sm" style={{ color: "#646464" }}>
                            Click to upload file
                          </p>
                          <p className="text-xs" style={{ color: "#646464" }}>
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <input
                        type="url"
                        placeholder="Or paste image URL..."
                        onChange={handleImageUrl}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        style={{ focusRingColor: "#2691ce" }}
                      />
                    </div>
                  </div>

                  {imagePreview && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </motion.div>
                  )}

                  {errors.image && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.image}
                    </motion.p>
                  )}
                </motion.div>

               {/* Settings Row - Update to 3 columns */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.6 }}
>
  {/* Status Field - Keep but map to isActive */}
  <div>
    <label
      className="flex items-center text-sm font-medium mb-2"
      style={{ color: "#040606" }}
    >
      <FiCalendar
        className="w-4 h-4 mr-2"
        style={{ color: "#2691ce" }}
      />
      Status
    </label>
    <select
      name="status"
      value={formData.status}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
      style={{ focusRingColor: "#2691ce" }}
    >
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="scheduled">Scheduled</option>
    </select>
  </div>

  {/* Story Type Field - NEW */}
  <div>
    <label
      className="flex items-center text-sm font-medium mb-2"
      style={{ color: "#040606" }}
    >
      <FiFileText
        className="w-4 h-4 mr-2"
        style={{ color: "#2691ce" }}
      />
      Story Type
    </label>
    <select
      name="type"
      value={formData.type}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
      style={{ focusRingColor: "#2691ce" }}
    >
      <option value="text">Text</option>
      <option value="image">Image</option>
      <option value="video">Video</option>
    </select>
  </div>

  {/* Duration Field */}
  <div>
    <label
      className="flex items-center text-sm font-medium mb-2"
      style={{ color: "#040606" }}
    >
      <FiClock
        className="w-4 h-4 mr-2"
        style={{ color: "#2691ce" }}
      />
      Duration (Hours)
    </label>
    <input
      type="number"
      name="duration"
      value={formData.duration}
      onChange={handleInputChange}
      min="1"
      max="168"
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
        errors.duration ? "border-red-500" : "border-gray-300"
      }`}
      style={{ focusRingColor: "#2691ce" }}
    />
    {errors.duration && (
      <motion.p
        className="text-red-500 text-sm mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {errors.duration}
      </motion.p>
    )}
  </div>
</motion.div>

                {/* Active Toggle */}
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 focus:ring-2"
                    style={{ color: "#2691ce", focusRingColor: "#2691ce" }}
                  />
                  <label className="ml-2 text-sm" style={{ color: "#040606" }}>
                    Make story active immediately
                  </label>
                </motion.div>
              </form>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <motion.button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ color: "#646464" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: "#2691ce" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Story
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
