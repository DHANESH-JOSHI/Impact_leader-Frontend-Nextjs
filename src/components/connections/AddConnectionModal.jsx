"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  User,
  Mail,
  Building,
  MessageSquare,
} from "lucide-react";
import { UsersService } from "@/services/usersService";
import CustomDropdown from "@/components/core/CustomDropdown";

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

export default function AddConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  connectionTypes = [],
}) {
  const [formData, setFormData] = useState({
    recipientId: "",
    connectionType: "professional",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await UsersService.getAllUsers({ page: 1, limit: 100 });
      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipientId) {
      newErrors.recipientId = "Please select a user";
    }
    if (!formData.connectionType) {
      newErrors.connectionType = "Please select a connection type";
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
      setFormData({
        recipientId: "",
        connectionType: "professional",
        message: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || user.firstName || user.username || user.email || "";
    const email = user.email || "";
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  });

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
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#040606" }}>
                  Send Connection Request
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  Connect with other users in the network
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    <User className="h-4 w-4 inline mr-1" />
                    Select User *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all mb-2"
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    <CustomDropdown
                      value={formData.recipientId}
                      onChange={(value) => {
                        const e = { target: { name: 'recipientId', value } };
                        handleInputChange(e);
                      }}
                      options={[
                        { value: "", label: "Select a user..." },
                        ...filteredUsers.map((user) => {
                          const name = user.name || user.firstName || user.username || user.email || "Unknown";
                          const email = user.email || "";
                          return {
                            value: user._id || user.id,
                            label: `${name}${email ? ` (${email})` : ""}`
                          };
                        })
                      ]}
                      placeholder="Select a user..."
                      minWidth="100%"
                      maxHeight="200px"
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      getOptionKey={(option, index) => option.value || index}
                    />
                  </div>
                  {errors.recipientId && (
                    <p className="text-sm text-red-600 mt-1">{errors.recipientId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    Connection Type *
                  </label>
                  <CustomDropdown
                    value={formData.connectionType}
                    onChange={(value) => {
                      const e = { target: { name: 'connectionType', value } };
                      handleInputChange(e);
                    }}
                    options={connectionTypes}
                    placeholder="Select connection type"
                    minWidth="100%"
                    maxHeight="200px"
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    getOptionKey={(option, index) => option.value || index}
                  />
                  {errors.connectionType && (
                    <p className="text-sm text-red-600 mt-1">{errors.connectionType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Add a personal message to your connection request..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{ focusRingColor: "#2691ce" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                  style={{ color: "#646464" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#2691ce" }}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

