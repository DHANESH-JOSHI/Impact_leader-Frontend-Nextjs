"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiGrid, FiList, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import StoryCard from "@/components/stories/StoryCard";
import StoryTable from "@/components/stories/StoryTable";
import AddStoryModal from "@/components/stories/AddStoryModal";
import EditStoryModal from "@/components/stories/EditStoryModal";
import ViewStoryModal from "@/components/stories/ViewStoryModal";
import { StoriesService } from "@/services/storiesService";

/* ----------------------------- Toast Component ---------------------------- */
/** Professional, English-only toast component */
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-700 shadow-lg";
      case "error":
        return "bg-red-600 border-red-700 shadow-lg";
      default:
        return "bg-gray-600 border-gray-700 shadow-lg";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={`${getToastStyles()} border rounded-lg p-4 min-w-[320px] max-w-[420px]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------- Toast Hook ------------------------------- */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    // Only allow 'success' or 'error' types
    const validType = type === "success" ? "success" : "error";
    const id = Date.now() + Math.random();
    const newToast = { id, message, type: validType, isVisible: true };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => hideToast(id), 4000);
  };

  const hideToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, showToast, hideToast };
};

/* ------------------------------ Mocked Stories ---------------------------- */
const mockStories = [
  {
    id: 1,
    title: "Digital Nomad Life",
    content:
      "Working from a beachside café in Bali - living the dream! 🏝️ The perfect blend of productivity and paradise.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    author: "Alex Rivera",
    status: "published",
    views: 3420,
    likes: 287,
    tags: ["travel", "work", "digitalnomad", "bali", "lifestyle"],
    createdAt: "2024-01-20T08:30:00Z",
    updatedAt: "2024-01-20T08:30:00Z",
    duration: 24,
    isActive: true,
  },
];

/* -------------------------------- Animations ------------------------------ */
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/* ---------------------------- Safe Token Helpers -------------------------- */
const getStoredAuth = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("impactLeadersAuth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
// console.log("🔑 Stored Auth:", getStoredAuth());
const getToken = () => getStoredAuth()?.value?.accessToken ?? null;

/* --------------------------------- Page ---------------------------------- */
export default function StoriesPage() {
  const { toasts, showToast, hideToast } = useToast();

  const [categories, setCategories] = useState(["General", "Travel", "Lifestyle", "Work", "Technology"]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // compute token once on client
  const token = useMemo(
    () => (typeof window !== "undefined" ? getToken() : null),
    []
  );

  // Load stories only when token exists and pagination changes
  useEffect(() => {
    if (!token) {
      setLoading(false);
      console.log("🔒 StoriesPage: Token missing; skipping initial fetch.");
      return;
    }
    loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pagination.page, pagination.limit]);

  /* ------------------------ Robust Stories Loader ------------------------ */
  const loadStories = async (params = {}) => {
    setLoading(true);
    try {
      const result = await StoriesService.getStoriesFeed({
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });

      let ok = false;

      if (Array.isArray(result?.stories)) {
        // Already normalized (shape C)
        ok = true;
        const transformed = result.stories.map(transformStory).filter(Boolean);
        setStories(transformed);
        const total = Number.isFinite(result.total)
          ? result.total
          : transformed.length;
        const totalPages = Number.isFinite(result.totalPages)
          ? result.totalPages
          : Math.ceil(total / pagination.limit);
        setPagination((prev) => ({ ...prev, total, totalPages }));
      } else {
        ok = !!result?.success;
        const maybeArray =
          (Array.isArray(result?.data) && result.data) ||
          (Array.isArray(result?.data?.data) && result.data.data) ||
          [];

        const containers = Array.isArray(maybeArray) ? maybeArray : [];
        const allStories = containers.reduce((acc, item) => {
          const list = Array.isArray(item?.stories) ? item.stories : [];
          return acc.concat(list);
        }, []);

        const transformed = allStories.map(transformStory).filter(Boolean);
        const totalFromServer = containers.reduce(
          (sum, c) =>
            sum +
            (c?.storyCount ??
              (Array.isArray(c?.stories) ? c.stories.length : 0)),
          0
        );
        const total =
          totalFromServer > 0 ? totalFromServer : transformed.length;
        const totalPages = Math.ceil(total / pagination.limit);

        setStories(transformed);
        setPagination((prev) => ({ ...prev, total, totalPages }));

        if (ok) {
        } else {
          setStories(mockStories);
          setPagination((p) => ({
            ...p,
            total: mockStories.length,
            totalPages: 1,
          }));
          showToast(
            "Using demo data — API reported failure. Kindly Relogin",
            "warning"
          );
        }
      }
    } catch (error) {
      console.error("Failed to load stories:", error);
      setStories(mockStories);
      setPagination((p) => ({
        ...p,
        total: mockStories.length,
        totalPages: 1,
      }));
      showToast(
        "Failed to load stories — switched to demo data. Kindly Relogin",
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- Transformers ---------------------------- */
  const transformStory = (story) => {
    if (!story || typeof story !== "object") return null;

    const durationMs = Number.isFinite(story?.duration)
      ? story.duration
      : 86400000;
    const durationHours = Math.round((durationMs / 3600000) * 10) / 10;

    const author =
      typeof story?.author === "object"
        ? story.author?.name || story.author?.username || "Unknown"
        : story?.author || "Unknown";

    const caption = story?.caption || story?.title || "";
    const textContent = story?.textContent || story?.content || "";
    const imageUrl = story?.mediaUrl || story?.media?.url || null;

    return {
      id: story?._id || story?.id || `${Date.now()}-${Math.random()}`, // ensure stable id for table ops
      title:
        caption ||
        (textContent ? textContent.slice(0, 50) + "..." : "Untitled Story"),
      content: textContent,
      image: imageUrl,
      author,
      status: story?.isActive ? "published" : "draft",
      views:
        typeof story?.viewCount === "number"
          ? story.viewCount
          : Array.isArray(story?.views)
            ? story.views.length
            : 0,
      likes: story?.likes || 0,
      tags: Array.isArray(story?.tags) ? story.tags : [],
      createdAt: story?.createdAt || null,
      updatedAt: story?.updatedAt || null,
      duration: durationHours,
      isActive: !!story?.isActive,
      type: story?.type || "text",
      backgroundColor: story?.backgroundColor || "#2c3e50",
      textColor: story?.textColor || "#ffffff",
      fontFamily: story?.fontFamily || "Arial",
      expiresAt: story?.expiresAt || null,
    };
  };

  /* ------------------------------- Filtering ------------------------------ */
  const filteredStories = stories.filter(Boolean).filter((story) => {
    const q = (searchTerm || "").toLowerCase();
    const title = (story.title || "").toLowerCase();
    const content = (story.content || "").toLowerCase();
    const author = (story.author || "").toLowerCase();
    const hasTag = Array.isArray(story.tags)
      ? story.tags.some((t) => (t || "").toLowerCase().includes(q))
      : false;

    const matchesSearch =
      !q ||
      title.includes(q) ||
      content.includes(q) ||
      author.includes(q) ||
      hasTag;
    const matchesFilter =
      filterStatus === "all" || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  /* ------------------------------ Handlers CRUD --------------------------- */
  const handleAddStory = async (newStoryData) => {
    try {
      setLoading(true);
  
      console.log('📥 Received from form:', newStoryData);
  
      let result;
  
      // Use the data as-is from modal (it's already formatted correctly)
      const baseStoryData = {
        textContent: newStoryData.textContent, // Use the textContent from modal
        type: newStoryData.type,
        duration: newStoryData.duration, // Already in milliseconds from modal
        tags: newStoryData.tags || [],
        backgroundColor: newStoryData.backgroundColor || "#000000",
        textColor: newStoryData.textColor || "#FFFFFF",
        fontFamily: newStoryData.fontFamily || "Arial",
        isActive: newStoryData.isActive || false
      };
  
      console.log('📤 Base story data:', baseStoryData);
  
      if (newStoryData.mediaFile) {
        // For file uploads
        if (newStoryData.type === "image") {
          result = await StoriesService.createImageStory(
            baseStoryData,
            newStoryData.mediaFile
          );
        } else if (newStoryData.type === "video") {
          result = await StoriesService.createVideoStory(
            baseStoryData,
            newStoryData.mediaFile
          );
        }
      } else {
        // For stories with URLs or text stories
        if (newStoryData.type === "image") {
          // For image stories with URL - use mediaUrl field
          const imageStoryData = {
            ...baseStoryData,
            mediaUrl: newStoryData.mediaUrl || newStoryData.image // Map image to mediaUrl
          };
          console.log('🖼️ Image story data:', imageStoryData);
          result = await StoriesService.createTextStory(imageStoryData);
        } else {
          // For text stories
          console.log('📝 Text story data:', baseStoryData);
          result = await StoriesService.createTextStory(baseStoryData);
        }
      }
  
      console.log('📨 API Response:', result);
  
      if (result?.success) {
        setIsAddModalOpen(false);
        await loadStories();
        showToast(`Story created successfully! ✅`, "success");
      } else {
        const errorMsg = result?.message || "Unknown error";
        showToast(`Failed: ${errorMsg} ❌`, "error");
      }
    } catch (error) {
      console.error("Add story error:", error);
      showToast("There was a problem creating the story. Please try again. ❌", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleEditStory = async (updatedStoryData) => {
    try {
      setLoading(true);
      const id = selectedStory?.id;
      const result = await StoriesService.updateStory(id, {
        content: updatedStoryData.content,
        title: updatedStoryData.title,
        backgroundColor: updatedStoryData.backgroundColor,
        fontFamily: updatedStoryData.fontFamily,
        duration: updatedStoryData.duration,
        tags: updatedStoryData.tags,
        isActive: updatedStoryData.status === "published",
      });

      if (result?.success) {
        setIsEditModalOpen(false);
        setSelectedStory(null);
        await loadStories();
        showToast("Story updated successfully. 🎉", "success");
      } else {
        showToast(
          `Update failed: ${result?.message || "Unknown error"}. ❌`,
          "error"
        );
      }
    } catch (error) {
      console.error("Edit story error:", error);
      showToast(
        "There was a problem updating the story. Please try again. ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    const storyToDelete = stories.find((s) => s.id === storyId);
    showToast(
      `Confirming deletion of "${storyToDelete?.title}"... ⚠️`,
      "warning"
    );

    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        setLoading(true);
        const result = await StoriesService.deleteStory(storyId);

        if (result?.success) {
          await loadStories();
          showToast(
            `"${storyToDelete?.title}" deleted successfully. 🗑️`,
            "success"
          );
        } else {
          showToast(
            `Delete failed: ${result?.message || "Unknown error"}. ❌`,
            "error"
          );
        }
      } catch (error) {
        console.error("Delete story error:", error);
        showToast(
          "There was a problem deleting the story. Please try again. ❌",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewStory = (story) => {
    setSelectedStory(story);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (story) => {
    setSelectedStory(story);
    setIsEditModalOpen(true);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (query) => {
    setSearchTerm(query);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  /* --------------------------------- UI ---------------------------------- */
  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toasts */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              style={{ marginBottom: index > 0 ? "8px" : "0" }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => hideToast(toast.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <motion.div className="mb-8" variants={cardVariants}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#040606" }}>
              Stories Management
            </h1>
            <p style={{ color: "#646464" }} className="mt-1">
              Manage all your stories
            </p>
          </div>

          <motion.button
            onClick={() => {
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-white transition-colors"
            style={{ backgroundColor: "#2691ce" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus className="w-5 h-5" />
            Add New Story
          </motion.button>
        </div>

        {/* Controls */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border p-4"
          variants={cardVariants}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "#646464" }}
              />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: "#2691ce" }}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter */}
              <div className="relative">
                <FiFilter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "#646464" }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white"
                  style={{ focusRingColor: "#2691ce" }}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <motion.button
                  onClick={() => handleViewModeChange("cards")}
                  className={`p-2 ${viewMode === "cards"
                      ? "text-white"
                      : "bg-white hover:bg-gray-50"
                    }`}
                  style={{
                    backgroundColor: viewMode === "cards" ? "#2691ce" : "white",
                    color: viewMode === "cards" ? "white" : "#646464",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiGrid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => handleViewModeChange("table")}
                  className={`p-2 ${viewMode === "table"
                      ? "text-white"
                      : "bg-white hover:bg-gray-50"
                    }`}
                  style={{
                    backgroundColor: viewMode === "table" ? "#2691ce" : "white",
                    color: viewMode === "table" ? "white" : "#646464",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiList className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div className="mb-6" variants={cardVariants}>
        {loading ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-center items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-lg" style={{ color: "#646464" }}>
                Loading stories...
              </p>
            </div>
          </motion.div>
        ) : filteredStories.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No stories found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "cards" ? (
          <StoryCard
            stories={filteredStories}
            onView={handleViewStory}
            onEdit={handleEditClick}
            onDelete={handleDeleteStory}
          />
        ) : (
          <StoryTable
            stories={filteredStories}
            onView={handleViewStory}
            onEdit={handleEditClick}
            onDelete={handleDeleteStory}
          />
        )}
      </motion.div>

      {/* Modals */}
      <AddStoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onAdd={handleAddStory}
        categories={categories} 
      />

      <EditStoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStory(null);
        }}
        story={selectedStory}
        onEdit={handleEditStory}
      />

      <ViewStoryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStory(null);
        }}
        story={selectedStory}
      />
    </motion.div>
  );
}
