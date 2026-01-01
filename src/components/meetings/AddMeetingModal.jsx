"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
} from "lucide-react";
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

export default function AddMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  meetingTypes = [],
  initialMeeting = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    meetingType: "google-meet",
    timezone: "Asia/Kolkata",
    attendees: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendeeEmail, setAttendeeEmail] = useState("");

  useEffect(() => {
    if (initialMeeting) {
      setFormData({
        title: initialMeeting.title || "",
        description: initialMeeting.description || "",
        startTime: initialMeeting.startTime ? new Date(initialMeeting.startTime).toISOString().slice(0, 16) : "",
        endTime: initialMeeting.endTime ? new Date(initialMeeting.endTime).toISOString().slice(0, 16) : "",
        meetingType: initialMeeting.meetingType || "google-meet",
        timezone: initialMeeting.timezone || "Asia/Kolkata",
        attendees: initialMeeting.attendees || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        meetingType: "google-meet",
        timezone: "Asia/Kolkata",
        attendees: [],
      });
    }
    setErrors({});
  }, [initialMeeting, isOpen]);

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

  const handleAddAttendee = () => {
    if (attendeeEmail && !formData.attendees.includes(attendeeEmail)) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...prev.attendees, attendeeEmail],
      }));
      setAttendeeEmail("");
    }
  };

  const handleRemoveAttendee = (email) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((e) => e !== email),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = "End time must be after start time";
      }
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
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        meetingType: "google-meet",
        timezone: "Asia/Kolkata",
        attendees: [],
      });
      setErrors({});
      setAttendeeEmail("");
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
                  {initialMeeting ? "Edit Meeting" : "Create Meeting"}
                </h2>
                <p className="text-sm mt-1" style={{ color: "#646464" }}>
                  {initialMeeting ? "Update meeting details" : "Schedule a new meeting"}
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
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Meeting title"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{ focusRingColor: "#2691ce" }}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    <FileText className="h-4 w-4 inline mr-1" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Meeting description..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{ focusRingColor: "#2691ce" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                        errors.startTime ? "border-red-500" : "border-gray-300"
                      }`}
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-600 mt-1">{errors.startTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Clock className="h-4 w-4 inline mr-1" />
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
                        errors.endTime ? "border-red-500" : "border-gray-300"
                      }`}
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-red-600 mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      <Video className="h-4 w-4 inline mr-1" />
                      Meeting Type *
                    </label>
                    <CustomDropdown
                      value={formData.meetingType}
                      onChange={(value) => {
                        const e = { target: { name: 'meetingType', value } };
                        handleInputChange(e);
                      }}
                      options={meetingTypes}
                      placeholder="Select meeting type"
                      minWidth="100%"
                      maxHeight="200px"
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      getOptionKey={(option, index) => option.value || index}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                      Timezone
                    </label>
                    <CustomDropdown
                      value={formData.timezone}
                      onChange={(value) => {
                        const e = { target: { name: 'timezone', value } };
                        handleInputChange(e);
                      }}
                      options={[
                        { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
                        { value: "UTC", label: "UTC" },
                        { value: "America/New_York", label: "America/New_York (EST/EDT)" },
                        { value: "Europe/London", label: "Europe/London (GMT/BST)" }
                      ]}
                      placeholder="Select timezone"
                      minWidth="100%"
                      maxHeight="200px"
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      getOptionKey={(option, index) => option.value || index}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#040606" }}>
                    <Users className="h-4 w-4 inline mr-1" />
                    Attendees
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAttendee();
                        }
                      }}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: "#2691ce" }}
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddAttendee}
                      className="px-4 py-2 text-white rounded-lg font-medium"
                      style={{ backgroundColor: "#2691ce" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add
                    </motion.button>
                  </div>
                  {formData.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.attendees.map((email, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(email)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{initialMeeting ? "Update" : "Create"} Meeting</span>
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

