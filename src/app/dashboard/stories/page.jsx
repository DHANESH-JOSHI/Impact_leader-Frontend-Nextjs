"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import StoriesHeader from "@/components/stories/StoriesHeader";
import StoryCard from "@/components/stories/StoryCard";
import StoryTable from "@/components/stories/StoryTable";
import AddStoryModal from "@/components/stories/AddStoryModal";
import EditStoryModal from "@/components/stories/EditStoryModal";
import ViewStoryModal from "@/components/stories/ViewStoryModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
import { StoriesService } from "@/services/storiesService";
import { ThemesService } from "@/services/themesService";

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
    const raw = localStorage.getItem("onePurposAuth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getToken = () => getStoredAuth()?.value?.accessToken ?? null;

export default function StoriesPage() {

  // Stories don't have categories in backend - removed
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [themes, setThemes] = useState([]);
  const [themesLoading, setThemesLoading] = useState(false);
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const token = useMemo(
    () => (typeof window !== "undefined" ? getToken() : null),
    []
  );

  // Load themes from backend
  useEffect(() => {
    if (themes.length === 0 && !themesLoading) {
      loadThemes();
    }
  }, []);

  const loadThemes = async () => {
    if (themesLoading || themes.length > 0) return;
    setThemesLoading(true);
    try {
      const result = await ThemesService.getAllThemes({ limit: 100, sortBy: "name", sortOrder: "asc" });
      if (result.success && Array.isArray(result.data)) {
        setThemes(result.data);
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
    } finally {
      setThemesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, pagination.page, pagination.limit, searchTerm, filterStatus, filterType, filterTheme, sortBy, sortOrder]);

  const loadStories = async (params = {}) => {
    setLoading(true);
    try {
      // Map frontend filterStatus to backend status parameter
      let backendStatus = undefined;
      if (filterStatus === 'published' || filterStatus === 'approved') {
        backendStatus = 'approved';
      } else if (filterStatus === 'pending') {
        backendStatus = 'pending';
      } else if (filterStatus === 'rejected') {
        backendStatus = 'rejected';
      } else if (filterStatus === 'expired') {
        backendStatus = 'expired';
      }

      // Use latest API with backend filtering
      const result = await StoriesService.getStories({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        status: backendStatus,
        type: filterType !== 'all' ? filterType : undefined,
        themes: filterTheme !== 'all' ? filterTheme : undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        ...params,
      });

      if (result?.success && result.data) {
        const storiesData = Array.isArray(result.data) ? result.data : [];
        const transformed = storiesData.map(transformStory).filter(Boolean);
        
        // Use pagination from backend if available, otherwise fallback to count
        const paginationData = result.pagination || {};
        const total = paginationData.total || result.count || transformed.length;
        const totalPages = paginationData.totalPages || Math.ceil(total / pagination.limit);

        setStories(transformed);
        setPagination((prev) => ({
          ...prev,
          total,
          totalPages,
          currentPage: paginationData.currentPage || prev.page,
        }));
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
      // Normalize themes: extract names from theme objects or use strings directly
      themes: Array.isArray(story?.themes) 
        ? story.themes.map(theme => {
            if (typeof theme === 'string') return theme;
            if (theme && typeof theme === 'object') return theme.name || String(theme._id || theme.id || theme);
            return String(theme);
          }).filter(Boolean)
        : [],
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

  // Backend now handles all filtering, so we use stories directly
  const filteredStories = stories.filter(Boolean);

  const handleAddStory = async (newStoryData) => {
    try {
      setLoading(true);
  
      let result;
  
      const baseStoryData = {
        type: newStoryData.type,
        textContent: newStoryData.textContent || newStoryData.content || "",
        caption: newStoryData.caption || "",
        duration: newStoryData.duration || (24 * 60 * 60 * 1000), // Default 24 hours in milliseconds
        tags: Array.isArray(newStoryData.tags) ? newStoryData.tags : (newStoryData.tags ? newStoryData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        themes: Array.isArray(newStoryData.themes) ? newStoryData.themes : [],
        backgroundColor: newStoryData.backgroundColor || "#000000",
        textColor: newStoryData.textColor || "#FFFFFF",
        fontFamily: newStoryData.fontFamily || "Arial",
        isActive: newStoryData.isActive !== false,
      };
  
      // Handle file upload for image/video stories
      if (newStoryData.mediaFile && newStoryData.mediaFile instanceof File) {
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
        } else {
          // Text story with optional media
          result = await StoriesService.createTextStory(baseStoryData);
        }
      } else {
        // No file - text story or story with mediaUrl
        if (newStoryData.type === "text") {
          result = await StoriesService.createTextStory(baseStoryData);
        } else if (newStoryData.mediaUrl) {
          // Story with external media URL
          baseStoryData.mediaUrl = newStoryData.mediaUrl;
          result = await StoriesService.createTextStory(baseStoryData);
        } else {
          toast.error("Media file or URL is required for image/video stories");
          return;
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
      console.error('Failed to create story:', error);
      toast.error(error.message || "There was a problem creating the story. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditStory = async (updatedStoryData) => {
    try {
      setLoading(true);
      const id = selectedStory?.id;
      if (!id) {
        toast.error("Story ID is required");
        return;
      }

      // Prepare update data matching backend structure
      // Convert duration from hours to milliseconds (backend expects milliseconds)
      const durationHours = Number(updatedStoryData.duration) || 24;
      const durationMs = durationHours * 60 * 60 * 1000; // Convert hours to milliseconds
      
      const updateData = {
        type: updatedStoryData.type || selectedStory?.type,
        textContent: updatedStoryData.textContent || updatedStoryData.content,
        caption: updatedStoryData.caption || updatedStoryData.title || "",
        backgroundColor: updatedStoryData.backgroundColor,
        textColor: updatedStoryData.textColor,
        fontFamily: updatedStoryData.fontFamily,
        duration: durationMs, // Send in milliseconds
        tags: Array.isArray(updatedStoryData.tags) ? updatedStoryData.tags : (updatedStoryData.tags ? updatedStoryData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        themes: Array.isArray(updatedStoryData.themes) ? updatedStoryData.themes : [],
        isActive: updatedStoryData.isActive !== false,
      };

      // Check if there's a new media file to upload
      const hasMediaFile = updatedStoryData.mediaFile && updatedStoryData.mediaFile instanceof File;

      const result = await StoriesService.updateStory(id, updateData, hasMediaFile ? updatedStoryData.mediaFile : null);

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
      console.error('Failed to update story:', error);
      toast.error(error.message || "There was a problem updating the story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = (storyId) => {
    const story = stories.find((s) => s.id === storyId);
    setStoryToDelete(story);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStory = async () => {
    if (!storyToDelete?.id) return;

    try {
      setLoading(true);
      const result = await StoriesService.deleteStory(storyToDelete.id);

      if (result?.success) {
        await loadStories();
        toast.success(
          `"${storyToDelete?.caption || storyToDelete?.title}" deleted successfully`
        );
        setIsDeleteModalOpen(false);
        setStoryToDelete(null);
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
  };

  const handleViewStory = (story) => {
    setSelectedStory(story);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (story) => {
    // Close view modal first if it's open
    if (isViewModalOpen) {
      setIsViewModalOpen(false);
    }
    // Set selected story and open edit modal
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
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div >
        {/* Header Section */}
        <motion.div className="mb-8" variants={cardVariants}>
          <StoriesHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchTerm}
            setSearchQuery={handleSearchChange}
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            filterType={filterType}
            setFilterType={setFilterType}
            filterTheme={filterTheme}
            setFilterTheme={setFilterTheme}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            themes={themes}
            onAddStory={() => setIsAddModalOpen(true)}
            totalStories={stories.length}
          />
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
        onEdit={(story) => {
          setIsViewModalOpen(false); // Close view modal
          setSelectedStory(story); // Set story for edit modal
          setIsEditModalOpen(true); // Open edit modal
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStoryToDelete(null);
        }}
        onConfirm={confirmDeleteStory}
        title="Delete Story"
        message="Are you sure you want to delete this story? This action cannot be undone."
        itemName={storyToDelete?.caption || storyToDelete?.title}
        isLoading={loading}
      />
      </div>
    </motion.div>
  );
}
