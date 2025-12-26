"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  X,
  CheckCircle,
} from "lucide-react";
import BusinessSettingsService from "@/services/businessSettingsService";
import toast from "react-hot-toast";

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

export default function BusinessSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyEmail: "",
    companyPhone: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    taxId: "",
    registrationNumber: "",
    isActive: true,
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadBusinessSettings();
  }, []);

  const loadBusinessSettings = async () => {
    setLoading(true);
    try {
      const result = await BusinessSettingsService.getBusinessSettings();
      if (result.success && result.data) {
        const data = result.data;
        setFormData({
          companyName: data.companyName || "",
          companyDescription: data.companyDescription || "",
          companyWebsite: data.companyWebsite || "",
          companyEmail: data.companyEmail || "",
          companyPhone: data.companyPhone || "",
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || "",
            twitter: data.socialLinks?.twitter || "",
            facebook: data.socialLinks?.facebook || "",
            instagram: data.socialLinks?.instagram || "",
          },
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            zipCode: data.address?.zipCode || "",
          },
          taxId: data.taxId || "",
          registrationNumber: data.registrationNumber || "",
          isActive: data.isActive !== false,
        });

        // Load logo if exists
        if (data.companyLogo && data.companyLogo.url) {
          setLogo({
            url: data.companyLogo.url,
            filename: data.companyLogo.filename,
            size: data.companyLogo.size,
            uploadedAt: data.companyLogo.uploadedAt,
          });
          setLogoPreview(data.companyLogo.url);
        }
      }
    } catch (error) {
      console.error("Failed to load business settings:", error);
      toast.error("Failed to load business settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("socialLinks.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only image files (JPG, PNG, SVG, WebP)!");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB!");
      return;
    }

    setNewLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setNewLogoFile(null);
    setLogoPreview(logo?.url || null);
  };

  const handleUploadLogo = async () => {
    if (!newLogoFile) {
      toast.error("Please select a logo file first");
      return;
    }

    setUploading(true);
    try {
      const result = await BusinessSettingsService.uploadCompanyLogo(newLogoFile);
      if (result.success) {
        toast.success("Logo uploaded successfully!");
        setLogo(result.data?.logo || {
          url: result.data?.url,
          filename: newLogoFile.name,
          size: newLogoFile.size,
        });
        setNewLogoFile(null);
        await loadBusinessSettings();
      } else {
        toast.error(result.message || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Upload logo error:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm("Are you sure you want to delete the company logo?")) {
      return;
    }

    try {
      const result = await BusinessSettingsService.deleteCompanyLogo();
      if (result.success) {
        toast.success("Logo deleted successfully!");
        setLogo(null);
        setLogoPreview(null);
        setNewLogoFile(null);
      } else {
        toast.error(result.message || "Failed to delete logo");
      }
    } catch (error) {
      console.error("Delete logo error:", error);
      toast.error("Failed to delete logo");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await BusinessSettingsService.updateBusinessSettings(formData);
      if (result.success) {
        toast.success("Business settings saved successfully!");
        await loadBusinessSettings();
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="mb-8" variants={cardVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#040606" }}>
                Business Settings
              </h1>
              <p className="mt-1" style={{ color: "#646464" }}>
                Manage company information, logo, and business details
              </p>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
              style={{ backgroundColor: "#2691ce" }}
              whileHover={!saving ? { scale: 1.02 } : {}}
              whileTap={!saving ? { scale: 0.98 } : {}}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company Logo */}
          <motion.div className="lg:col-span-1" variants={cardVariants}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#040606" }}>
                Company Logo
              </h2>

              {/* Logo Preview */}
              <div className="mb-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-full h-48 object-contain border border-gray-300 rounded-lg bg-gray-50"
                    />
                    {newLogoFile && (
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <ImageIcon className="h-12 w-12" style={{ color: "#646464" }} />
                  </div>
                )}
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ color: "#2691ce" }}
                >
                  <Upload className="h-4 w-4 inline mr-2" />
                  {newLogoFile ? "Change Logo" : "Upload Logo"}
                </label>

                {newLogoFile && (
                  <motion.button
                    onClick={handleUploadLogo}
                    disabled={uploading}
                    className="w-full px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50"
                    style={{ backgroundColor: "#2691ce" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </motion.button>
                )}

                {logo && !newLogoFile && (
                  <motion.button
                    onClick={handleDeleteLogo}
                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Logo</span>
                  </motion.button>
                )}

                {logo && (
                  <div className="text-xs" style={{ color: "#646464" }}>
                    <p>File: {logo.filename}</p>
                    {logo.size && <p>Size: {(logo.size / 1024).toFixed(1)} KB</p>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Company Information */}
          <motion.div className="lg:col-span-2 space-y-6" variants={cardVariants}>
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#040606" }}>
                <Building2 className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Enter company description"
                    maxLength={1000}
                  />
                  <p className="text-xs mt-1" style={{ color: "#646464" }}>
                    {formData.companyDescription.length}/1000 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Globe className="h-4 w-4 mr-1" />
                      Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#040606" }}>
                Social Media Links
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                    <Linkedin className="h-4 w-4 mr-1" style={{ color: "#0077b5" }} />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                    <Twitter className="h-4 w-4 mr-1" style={{ color: "#1DA1F2" }} />
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                    <Facebook className="h-4 w-4 mr-1" style={{ color: "#1877F2" }} />
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="socialLinks.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center" style={{ color: "#040606" }}>
                    <Instagram className="h-4 w-4 mr-1" style={{ color: "#E4405F" }} />
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#040606" }}>
                <MapPin className="h-5 w-5 mr-2" style={{ color: "#2691ce" }} />
                Business Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
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
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ color: "#040606" }}>
                Legal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Tax ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: "#2691ce" }}
                    placeholder="Registration Number"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: "#040606" }}>
                    Status
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#646464" }}>
                    Enable or disable business settings
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

