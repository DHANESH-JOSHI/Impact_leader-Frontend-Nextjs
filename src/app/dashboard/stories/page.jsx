"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiGrid, FiList, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import StoryCard from "@/components/stories/StoryCard";
import StoryTable from "@/components/stories/StoryTable";
import AddStoryModal from "@/components/stories/AddStoryModal";
import EditStoryModal from "@/components/stories/EditStoryModal";
import ViewStoryModal from "@/components/stories/ViewStoryModal";
import { StoriesService } from "@/services/storiesService";

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

const getStoredAuth = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("impactLeadersAuth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getToken = () => getStoredAuth()?.value?.accessToken ?? null;

export default function StoriesPage() {

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

  const token = useMemo(
    () => (typeof window !== "undefined" ? getToken() : null),
    []
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pagination.page, pagination.limit]);

  const loadStories = async (params = {}) => {
    setLoading(true);
    try {
      const result = await StoriesService.getStoriesFeed({
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });

      if (result?.success && result.data) {
        const groupedData = Array.isArray(result.data) ? result.data : [];
        
        const allStories = groupedData.reduce((acc, group) => {
          const groupStories = Array.isArray(group.stories) ? group.stories : [];
          const authorInfo = group._id || {};
          const storiesWithAuthor = groupStories.map(story => ({
            ...story,
            author: authorInfo
          }));
          return acc.concat(storiesWithAuthor);
        }, []);

        const transformed = allStories.map(transformStory).filter(Boolean);
        
        const totalFromGroups = groupedData.reduce((sum, group) => sum + (group.storyCount || 0), 0);
        const total = result.pagination?.total || result.count || totalFromGroups || transformed.length;
        const totalPages = result.pagination?.totalPages || Math.ceil(total / pagination.limit);

        setStories(transformed);
        setPagination((prev) => ({ ...prev, total, totalPages }));
        
        if (transformed.length === 0) {
          toast("No stories found", { icon: 'ℹ️' });
        }
      } else {
        setStories([]);
        setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
        toast.error(result?.message || "Failed to load stories");
      }
    } catch (error) {
      console.error("Failed to load stories:", error);
      setStories([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 0 }));
      toast.error(error.message || "Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const transformStory = (story) => {
    if (!story || typeof story !== "object") return null;

    const durationMs = Number.isFinite(story?.duration)
      ? story.duration
      : 86400000;
    const durationHours = Math.round((durationMs / 3600000) * 10) / 10;

    let author = "Unknown";
    if (typeof story?.author === "object" && story.author) {
      if (story.author.name) {
        author = story.author.name;
      } else if (story.author.firstName || story.author.lastName) {
        author = `${story.author.firstName || ''} ${story.author.lastName || ''}`.trim();
      } else if (story.author.username) {
        author = story.author.username;
      } else if (story.author.email) {
        author = story.author.email;
      }
    } else if (typeof story?.author === "string") {
      author = story.author;
    }

    const caption = story?.caption || story?.title || "";
    const textContent = story?.textContent || story?.content || "";
    
    let imageUrl = null;
    if (story?.mediaUrl) {
      imageUrl = story.mediaUrl;
    } else if (story?.media?.url) {
      imageUrl = story.media.url;
    } else if (Array.isArray(story?.media) && story.media.length > 0) {
      imageUrl = story.media[0].url || story.media[0];
    } else if (story?.thumbnailUrl) {
      imageUrl = story.thumbnailUrl;
    }

    return {
      id: story?._id || story?.id || `${Date.now()}-${Math.random()}`,
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

  const handleAddStory = async (newStoryData) => {
    try {
      setLoading(true);
  
      let result;
  
      const baseStoryData = {
        textContent: newStoryData.textContent,
        type: newStoryData.type,
        duration: newStoryData.duration,
        tags: newStoryData.tags || [],
        backgroundColor: newStoryData.backgroundColor || "#000000",
        textColor: newStoryData.textColor || "#FFFFFF",
        fontFamily: newStoryData.fontFamily || "Arial",
        isActive: newStoryData.isActive || false
      };
  
      if (newStoryData.mediaFile) {
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
        if (newStoryData.type === "image") {
          const imageStoryData = {
            ...baseStoryData,
            mediaUrl: newStoryData.mediaUrl || newStoryData.image
          };
          result = await StoriesService.createTextStory(imageStoryData);
        } else {
          result = await StoriesService.createTextStory(baseStoryData);
        }
      }
  
      if (result?.success) {
        setIsAddModalOpen(false);
        await loadStories();
        toast.success(`Story created successfully!`);
      } else {
        const errorMsg = result?.message || "Unknown error";
        toast.error(`Failed: ${errorMsg}`);
      }
    } catch (error) {
      toast.error("There was a problem creating the story. Please try again.");
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
        toast.success("Story updated successfully");
      } else {
        toast.error(
          `Update failed: ${result?.message || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("There was a problem updating the story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    const storyToDelete = stories.find((s) => s.id === storyId);

    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        setLoading(true);
        const result = await StoriesService.deleteStory(storyId);

        if (result?.success) {
          await loadStories();
          toast.success(
            `"${storyToDelete?.title}" deleted successfully`
          );
        } else {
          toast.error(
            `Delete failed: ${result?.message || "Unknown error"}`
          );
        }
      } catch (error) {
        toast.error("There was a problem deleting the story. Please try again.");
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

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
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

        <motion.div
          className="bg-white rounded-lg shadow-sm border p-4"
          variants={cardVariants}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
