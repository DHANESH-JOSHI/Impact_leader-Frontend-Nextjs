"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Eye,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Zap,
} from "lucide-react";

// brand colors ke sath custom alert component
const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  return (
    <div className={`p-4 border rounded-lg ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// brand colors ke sath custom button component
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
}) => {
  const variants = {
    default: "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50",
    primary: "text-white hover:opacity-90",
    secondary: "text-white hover:opacity-90",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-200 text-gray-900 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const primaryStyle =
    variant === "primary" ? { backgroundColor: "#2691ce" } : {};
  const secondaryStyle =
    variant === "secondary" ? { backgroundColor: "#646464" } : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ ...primaryStyle, ...secondaryStyle }}
    >
      {children}
    </button>
  );
};

// custom input component
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    style={{ focusRingColor: "#2691ce" }}
    {...props}
  />
);

// custom textarea component
const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    style={{ focusRingColor: "#2691ce" }}
    {...props}
  />
);

// custom select component
const Select = ({ children, value, onValueChange, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ focusRingColor: "#2691ce" }}
    >
      {children}
    </select>
  );
};

// notification type ke hisab se icons
const getNotificationIcon = (type) => {
  const iconProps = { className: "h-5 w-5" };
  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} className="h-5 w-5 text-green-600" />;
    case "warning":
      return (
        <AlertTriangle {...iconProps} className="h-5 w-5 text-yellow-600" />
      );
    case "error":
      return <AlertCircle {...iconProps} className="h-5 w-5 text-red-600" />;
    case "info":
      return <Info {...iconProps} className="h-5 w-5 text-blue-600" />;
    case "promotion":
      return <Zap {...iconProps} className="h-5 w-5 text-purple-600" />;
    default:
      return <Bell {...iconProps} className="h-5 w-5 text-gray-600" />;
  }
};

// notification form component - add/edit ke liye
const NotificationForm = ({ notification, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    notification || {
      title: "",
      message: "",
      type: "info",
      image: null,
      targetUsers: "all",
      scheduledAt: "",
      expiresAt: "",
    }
  );

  // image upload handle krne ka function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // form submit handle krne ka function
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: "#040606" }}>
            {notification ? "Edit Notification" : "Create New Notification"}
          </h2>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* title field */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Notification title"
              required
            />
          </div>

          {/* message field */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Message
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Notification message"
              required
            />
          </div>

          {/* notification type select */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Notification Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="promotion">Promotion</option>
            </Select>
          </div>

          {/* image upload section - optional */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mx-auto max-h-32 rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: null }))
                    }
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* target users select */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Target Users
            </label>
            <Select
              value={formData.targetUsers}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, targetUsers: value }))
              }
            >
              <option value="all">All Users</option>
              <option value="active">Active Users</option>
              <option value="new">New Users</option>
              <option value="premium">Premium Users</option>
            </Select>
          </div>

          {/* scheduling section - optional */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#646464" }}
              >
                Schedule For (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledAt: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#646464" }}
              >
                Expires At (Optional)
              </label>
              <Input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expiresAt: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* preview section */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#646464" }}
            >
              Preview
            </label>
            <Alert
              variant={formData.type}
              className="flex items-start space-x-3"
            >
              {getNotificationIcon(formData.type)}
              <div className="flex-1">
                <h4 className="font-medium">
                  {formData.title || "Notification Title"}
                </h4>
                <p className="text-sm mt-1">
                  {formData.message ||
                    "Notification message will appear here..."}
                </p>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 max-h-20 rounded"
                  />
                )}
              </div>
            </Alert>
          </div>

          {/* form actions - cancel/save */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <Save className="h-4 w-4 mr-2" />
              {notification ? "Update" : "Create"} Notification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { NotificationsService } from "@/services/notificationsService";
import toast from "react-hot-toast";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await NotificationsService.getNotifications({ limit: 100 });
      if (result.success) {
        const notificationsData = Array.isArray(result.data) ? result.data : [];
        setNotifications(notificationsData);
      } else {
        toast.error(result.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (notificationData) => {
    try {
      if (editingNotification) {
        const result = await NotificationsService.sendTargetedNotification({
          ...notificationData,
          id: editingNotification.id,
        });
        if (result.success) {
          toast.success("Notification updated successfully");
          await loadNotifications();
        } else {
          toast.error(result.message || "Failed to update notification");
        }
      } else {
        const result = await NotificationsService.sendTargetedNotification(notificationData);
        if (result.success) {
          toast.success("Notification created successfully");
          await loadNotifications();
        } else {
          toast.error(result.message || "Failed to create notification");
        }
      }
      setShowForm(false);
      setEditingNotification(null);
    } catch (error) {
      console.error("Failed to save notification:", error);
      toast.error("Failed to save notification");
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await NotificationsService.deleteNotification(id);
      if (result.success) {
        toast.success("Notification deleted successfully");
        await loadNotifications();
      } else {
        toast.error(result.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // status badge colors
  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      styles[status] || styles.active
    }`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
            Notification Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: "#646464" }}>
            Manage and customize notifications for your users
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Notification</span>
        </Button>
      </div>

      {/* stats cards section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" style={{ color: "#2691ce" }} />
            <span className="text-sm font-medium" style={{ color: "#646464" }}>
              Total
            </span>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#040606" }}>
            {notifications.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium" style={{ color: "#646464" }}>
              Active
            </span>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#040606" }}>
            {notifications.filter((n) => n.status === "active").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium" style={{ color: "#646464" }}>
              Scheduled
            </span>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#040606" }}>
            {notifications.filter((n) => n.status === "scheduled").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5" style={{ color: "#646464" }} />
            <span className="text-sm font-medium" style={{ color: "#646464" }}>
              Views
            </span>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#040606" }}>
            1,234
          </p>
        </div>
      </div>

      {/* notifications table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold" style={{ color: "#040606" }}>
            All Notifications
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Notification
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Type
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Target
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Status
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Created
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#646464" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className="font-medium" style={{ color: "#040606" }}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="capitalize text-sm"
                      style={{ color: "#646464" }}
                    >
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className="capitalize text-sm"
                      style={{ color: "#646464" }}
                    >
                      {notification.targetUsers}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={getStatusBadge(notification.status)}>
                      {notification.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-4 text-sm"
                    style={{ color: "#646464" }}
                  >
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(notification)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* notification form modal */}
      {showForm && (
        <NotificationForm
          notification={editingNotification}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingNotification(null);
          }}
        />
      )}
    </div>
  );
}
