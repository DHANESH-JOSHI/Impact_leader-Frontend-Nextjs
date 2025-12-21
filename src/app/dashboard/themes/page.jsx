"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ThemesHeader from "@/components/themes/ThemesHeader";
import ThemesCardView from "@/components/themes/ThemesCardView";
import ThemesTableView from "@/components/themes/ThemesTableView";
import AddThemeModal from "@/components/themes/AddThemeModal";
import ViewThemeModal from "@/components/themes/ViewThemeModal";
import DeleteConfirmModal from "@/components/themes/DeleteConfirmModal";
import { ThemesService } from "@/services/themesService";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function ThemesPage() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadThemes();
  }, [pagination.page, pagination.limit, searchQuery, sortBy, sortOrder]);

  const loadThemes = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
      };

      const result = await ThemesService.getAllThemes(params);

      if (result.success) {
        const themesData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = themesData.map((theme) => ({
          id: theme._id || theme.id,
          name: theme.name,
          description: theme.description,
          category: theme.category,
          tags: theme.tags || [],
          createdAt: theme.createdAt,
          updatedAt: theme.updatedAt,
          ...theme,
        }));

        setThemes(transformed);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || transformed.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || transformed.length) / pagination.limit),
        }));
      } else {
        toast.error(result.message || "Failed to load themes");
        setThemes([]);
      }
    } catch (error) {
      console.error("Failed to load themes:", error);
      toast.error(error.message || "Failed to load themes");
      setThemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheme = async (themeData) => {
    try {
      setLoading(true);
      const result = await ThemesService.createTheme(themeData);

      if (result.success) {
        toast.success("Theme created successfully");
        setIsAddModalOpen(false);
        await loadThemes();
      } else {
        toast.error(result.message || "Failed to create theme");
      }
    } catch (error) {
      console.error("Failed to create theme:", error);
      toast.error(error.message || "Failed to create theme");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTheme = async (themeId, themeData) => {
    try {
      setLoading(true);
      const result = await ThemesService.updateTheme(themeId, themeData);

      if (result.success) {
        toast.success("Theme updated successfully");
        setIsViewModalOpen(false);
        setSelectedTheme(null);
        await loadThemes();
      } else {
        toast.error(result.message || "Failed to update theme");
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast.error(error.message || "Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId) => {
    try {
      setDeleteLoading(true);
      const result = await ThemesService.deleteTheme(themeId);

      if (result.success) {
        toast.success("Theme deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedTheme(null);
        await loadThemes();
      } else {
        toast.error(result.message || "Failed to delete theme");
      }
    } catch (error) {
      console.error("Failed to delete theme:", error);
      toast.error(error.message || "Failed to delete theme");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewTheme = (theme) => {
    setSelectedTheme(theme);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filteredThemes = useMemo(() => {
    return themes;
  }, [themes]);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={cardVariants}>
        <ThemesHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onAddTheme={() => setIsAddModalOpen(true)}
          totalThemes={pagination.total}
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "#2691ce" }}></div>
              <p className="text-lg" style={{ color: "#646464" }}>
                Loading themes...
              </p>
            </div>
          </motion.div>
        ) : filteredThemes.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg" style={{ color: "#646464" }}>
              No themes found
            </p>
            <p className="mt-2" style={{ color: "#646464" }}>
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : viewMode === "card" ? (
          <ThemesCardView
            themes={filteredThemes}
            onViewTheme={handleViewTheme}
            onDeleteTheme={(theme) => {
              setSelectedTheme(theme);
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <ThemesTableView
            themes={filteredThemes}
            onViewTheme={handleViewTheme}
            onDeleteTheme={(theme) => {
              setSelectedTheme(theme);
              setIsDeleteModalOpen(true);
            }}
          />
        )}
      </motion.div>

      {pagination.totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center space-x-2 mt-6"
          variants={cardVariants}
        >
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Previous
          </button>
          <span className="px-4 py-2" style={{ color: "#646464" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Next
          </button>
        </motion.div>
      )}

      <AddThemeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTheme}
      />

      <ViewThemeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTheme(null);
        }}
        theme={selectedTheme}
        onUpdate={handleUpdateTheme}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTheme(null);
        }}
        onConfirm={() => {
          if (selectedTheme) {
            handleDeleteTheme(selectedTheme.id);
          }
        }}
        theme={selectedTheme}
        loading={deleteLoading}
      />
    </motion.div>
  );
}

