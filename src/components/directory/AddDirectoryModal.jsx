"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Building2,
  Upload,
  Globe,
  MapPin,
  Mail,
  Phone,
  Tag,
  Check,
} from "lucide-react";
import { DirectoryService } from "@/services/directoryService";
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

export default function AddDirectoryModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    organizationType: "",
    website: "",
    logo: null,
    contactInfo: {
      email: "",
      phone: "",
    },
    location: {
      city: "",
      state: "",
      country: "",
    },
    socialLinks: {
      linkedin: "",
      twitter: "",
    },
    themes: [],
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  const organizationTypes = DirectoryService.getOrganizationTypes();

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

  // Load themes when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (availableThemes.length === 0) {
      loadThemes();
    }
  }, [isOpen]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!formData.organizationType) {
      newErrors.organizationType = "Organization type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        organizationType: "",
        website: "",
        logo: null,
        contactInfo: {
          email: "",
          phone: "",
        },
        location: {
          city: "",
          state: "",
          country: "",
        },
        socialLinks: {
          linkedin: "",
          twitter: "",
        },
        themes: [],
        tags: [],
      });
      setLogoPreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
        title: "",
        description: "",
        category: "",
        organizationType: "",
        website: "",
        logo: null,
      contactInfo: {
        email: "",
        phone: "",
      },
      location: {
        city: "",
        state: "",
        country: "",
      },
      socialLinks: {
        linkedin: "",
        twitter: "",
      },
      themes: [],
      tags: [],
    });
    setLogoPreview(null);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.4)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  Add Directory Entry
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  Create a new directory entry
                </p>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Organization or person name"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="e.g., Technology, Healthcare"
                    />
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Brief description of the organization or person"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                    >
                      <option value="">Select type</option>
                      {organizationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.organizationType && (
                      <p className="text-sm text-red-500 mt-1">{errors.organizationType}</p>
                    )}
                  </div>

                  <div className="relative" ref={themeDropdownRef}>
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#646464" }} />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" style={{ color: "#646464" }} />
                      <span style={{ color: "#646464" }}>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#646464" }} />
                      <input
                        type="email"
                        name="contactInfo.email"
                        value={formData.contactInfo.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "#646464" }} />
                      <input
                        type="tel"
                        name="contactInfo.phone"
                        value={formData.contactInfo.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: "#2691ce" }}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                    whileHover={{ backgroundColor: "#e5e7eb" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    style={{ backgroundColor: "#2691ce" }}
                    whileHover={!isSubmitting ? { backgroundColor: "#1e7bb8" } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Create Entry</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

