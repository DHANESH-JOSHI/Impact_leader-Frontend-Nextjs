"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
  FileText,
  Video,
} from "lucide-react";
import ResourcesHeader from "@/components/resources/ResourcesHeader";
import ResourcesCardView from "@/components/resources/ResourcesCardView";
import ResourcesTableView from "@/components/resources/ResourcesTableView";
import AddResourceModal from "@/components/resources/AddResourceModal";
import ViewResourceModal from "@/components/resources/ViewResourceModal";
import DeleteConfirmModal from "@/components/resources/DeleteConfirmModal";
import { ResourcesService } from "@/services/resourcesService";

const toISODate = (d) => {
  try {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? "" : dt.toISOString();
  } catch {
    return "";
  }
};
const humanBytes = (bytes = 0) => {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val >= 10 ? 0 : 1)} ${units[i]}`;
};

const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles =
    type === "success"
      ? "bg-green-500 border-green-600 shadow-green-500/20"
      : type === "error"
      ? "bg-red-500 border-red-600 shadow-red-500/20"
      : type === "warning"
      ? "bg-yellow-500 border-yellow-600 shadow-yellow-500/20"
      : type === "resource"
      ? "bg-purple-500 border-purple-600 shadow-purple-500/20"
      : type === "download"
      ? "bg-teal-500 border-teal-600 shadow-teal-500/20"
      : "bg-blue-500 border-blue-600 shadow-blue-500/20";

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? AlertCircle
      : type === "warning"
      ? AlertTriangle
      : type === "resource"
      ? FileText
      : type === "download"
      ? Video
      : Info;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.96 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={`${styles} border rounded-lg shadow-2xl p-4 min-w-[340px] max-w-[460px] backdrop-blur-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-white" />
            <p className="text-white text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/85 hover:text-white transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, isVisible: true }]);
    setTimeout(() => hideToast(id), 4500);
  };
  const hideToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, showToast, hideToast };
};


/* ===========================
   Animations
=========================== */
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.1 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.26, ease: "easeOut" },
  },
};

/* ===========================
   Page
=========================== */
export default function ResourcesPage() {
  const { toasts, showToast, hideToast } = useToast();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

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
  const [selectedResource, setSelectedResource] = useState(null);

const categories = useMemo(
  () => {
    const uniqueCategories = Array.from(
      new Set(
        resources
          .map((r) => r.category)
          .filter(Boolean)
          .filter(c => c !== "all" && c !== "")
      )
    );
    return uniqueCategories.length > 0 
      ? ["all", ...uniqueCategories]
      : ["all", "General", "Web Development", "Productivity", "Study", "Cloud Computing"];
  },
  [resources]
);
const modalCategories = useMemo(() => {
  return categories.filter((c) => c !== "all" && c !== "");
}, [categories]);

  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      loadResources();
    }, 300);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    filterCategory,
    filterType,
    filterStatus,
    sortBy,
    sortOrder,
    searchQuery,
  ]);

  const loadResources = async (extra = {}) => {
    setLoading(true);
    try {
      const result = await ResourcesService.getAllResources({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: filterCategory !== "all" ? filterCategory : undefined,
        type: filterType !== "all" ? filterType : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        sortBy,
        sortOrder,
        ...extra,
      });

      if (result?.success) {
        const resourcesData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = resourcesData.map((r) => {
          let authorName = "Unknown";
          if (typeof r.author === 'string') {
            authorName = r.author;
          } else if (r.author && typeof r.author === 'object') {
            if (r.author.name) {
              authorName = r.author.name;
            } else if (r.author.username) {
              authorName = r.author.username;
            } else if (r.author.firstName || r.author.lastName) {
              authorName = `${r.author.firstName || ''} ${r.author.lastName || ''}`.trim();
            }
          }

          let tags = [];
          if (Array.isArray(r.tags)) {
            tags = r.tags;
          } else if (r.tags && typeof r.tags === 'string') {
            tags = [r.tags];
          }

          return {
            id: r._id || r.id,
            title: r.title || "Untitled Resource",
            description: r.description || "No description available.",
            type: r.type || "document",
            fileUrl: r.fileUrl || r.downloadUrl || "",
            fileName: r.fileName || "file",
            fileSize: r.fileSize || 0,
            duration: r.duration || 0,
            category: r.category || "General",
            tags: tags,
            author: authorName,
            status: r.isPublic || r.isActive ? "published" : "draft",
            thumbnail:
              r.thumbnail ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
            createdAt: toISODate(r.createdAt),
            updatedAt: toISODate(r.updatedAt),
            views: typeof r.views === 'number' ? r.views : 0,
            likes: typeof r.likes === 'number' ? r.likes : 0,
            downloads: typeof r.downloads === 'number' ? r.downloads : 0,
            featured: !!r.featured,
            quality: r.quality || "Standard",
            language: r.language || "English",
          };
        });

        setResources(transformed);
        setPagination((p) => ({
          ...p,
          total: paginationData.totalResources || paginationData.total || transformed.length,
          totalPages: Math.max(
            1,
            Math.ceil((paginationData.totalResources || paginationData.total || transformed.length) / p.limit)
          ),
        }));
        showToast(`Loaded ${transformed.length} resources`, "success");
      } else {
        setResources([]);
        setPagination((p) => ({
          ...p,
          total: 0,
          totalPages: 0,
        }));
        showToast(result.message || "Failed to load resources", "error");
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
      setResources([]);
      setPagination((p) => ({
        ...p,
        total: 0,
        totalPages: 0,
      }));
      showToast(err.message || "Failed to load resources", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Client-side filtering (for fallback/demo & extra safety) */
  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesCategory =
        filterCategory === "all" ||
        r.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesType = filterType === "all" || r.type === filterType;
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, filterCategory, filterType, filterStatus]);

  const sortedResources = useMemo(() => {
    const list = [...filteredResources];
    list.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
        ? 1
        : -1;
    });
    return list;
  }, [filteredResources, sortBy, sortOrder]);

  /* Handlers */
  const handleAddResource = async (payload) => {
    try {
      setLoading(true);
      showToast("Uploading resource…", "info");
      console.log("🔍 Checking createResource method:", !!ResourcesService.createResource);

      // Clean and validate data before sending
      const cleanPayload = {
        title: payload.title?.trim() || "Untitled Resource",
        description: payload.description?.trim() || "No description",
        category: payload.category?.trim() || "General",
        type: payload.type || "document",
        tags: payload.tags || [],
        themes: payload.themes || [],
        isPublic: payload.isPublic || false,
        featured: payload.featured || false,
      };
  
      console.log("🧹 Cleaned payload:", cleanPayload);
  
      let res;
      if (payload.file) {
        res = await ResourcesService.uploadDocumentResource(cleanPayload, payload.file);
      } else {
        res = await ResourcesService.createResource(cleanPayload);
      }
  
      if (res?.success) {
        setIsAddModalOpen(false);
        await loadResources();
        showToast(`"${cleanPayload.title}" uploaded successfully`, "success");
      } else {
        showToast(`Upload failed: ${res?.message}`, "error");
      }
    } catch (e) {
      console.error("Add resource error:", e);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
    const icon =
      resource.type === "video"
        ? "🎥"
        : resource.type === "audio"
        ? "🎧"
        : "📄";
    showToast(`${icon} Viewing “${resource.title}”`, "info");
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedResource = async (resourceData) => {
    try {
      showToast("Updating resource…", "info");

      if (resourceData.id) {
        const res = await ResourcesService.updateResource(resourceData.id, resourceData);
        
      if (res?.success) {
          await loadResources();
          setIsEditModalOpen(false);
          setSelectedResource(null);
          showToast("Resource updated successfully", "success");
      } else {
          showToast(res?.message || "Failed to update resource", "error");
        }
      }
    } catch (e) {
      console.error("Failed to update resource:", e);
      showToast(e.message || "Update failed", "error");
    }
  };

  const handleDeleteResource = (id) => {
    const target = resources.find((r) => r.id === id);
    setSelectedResource(target || null);
    setIsDeleteModalOpen(true);
    if (target) {
      showToast(
        `Ready to delete “${target.title}” (${humanBytes(target.fileSize)})`,
        "warning"
      );
    }
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      showToast("Deleting resource…", "info");
      const res = await ResourcesService.deleteResource?.(selectedResource.id);
      if (res?.success) {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        showToast("Resource deleted", "success");
      } else {
        // Optimistic fallback
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        showToast("Resource deleted (local)", "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    showToast(
      mode === "card" ? "Switched to Card Gallery" : "Switched to Table List",
      "info"
    );
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    // The debounced loader will fire; toast only when query is substantive
    if (q.trim().length > 2) {
      const count = filteredResources.length;
      showToast(
        `Found ${count} result${count === 1 ? "" : "s"} for “${q.trim()}”`,
        "info"
      );
    }
  };

  const handleCategoryFilter = (category) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterCategory(category);
    showToast(
      category === "all" ? "Filter: All Categories" : `Filter: ${category}`,
      "info"
    );
  };

  const handleTypeFilter = (type) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterType(type);
    const label =
      type === "video"
        ? "Video"
        : type === "audio"
        ? "Audio"
        : type === "document"
        ? "Document"
        : "All Types";
    showToast(`Filter: ${label}`, "info");
  };

  const handleStatusFilter = (status) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterStatus(status);
    const label =
      status === "all"
        ? "All Status"
        : status === "published"
        ? "Published"
        : "Draft";
    showToast(`Filter: ${label}`, "info");
  };

  const handleResourceDownload = (resource) => {
    const icon =
      resource.type === "video"
        ? "🎥"
        : resource.type === "audio"
        ? "🎧"
        : "📄";
    showToast(
      `${icon} Download started: “${resource.title}” (${humanBytes(
        resource.fileSize
      )})`,
      "download"
    );
    // You can trigger actual download in the child component’s click handler.
  };

  const types = ["all", "video", "audio", "document"];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toasts */}
      <div className="fixed top-0 right-0 z-50 p-4">
        <AnimatePresence>
          {toasts.map((t, i) => (
            <div key={t.id} style={{ marginBottom: i > 0 ? "12px" : 0 }}>
              <Toast
                message={t.message}
                type={t.type}
                isVisible={t.isVisible}
                onClose={() => hideToast(t.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={cardVariants}>
          <ResourcesHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterCategory={filterCategory}
            setFilterCategory={handleCategoryFilter}
            filterType={filterType}
            setFilterType={handleTypeFilter}
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            types={types}
            onAddResource={() => {
              setIsAddModalOpen(true);
              showToast("Opening upload form", "info");
            }}
            totalResources={filteredResources.length}
          />
        </motion.div>

        {/* Content */}
        <motion.div variants={cardVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading resources…</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "card" ? (
                <ResourcesCardView
                  key="card-view"
                  resources={sortedResources}
                  onViewResource={handleViewResource}
                  onEditResource={handleEditResource}
                  onDeleteResource={handleDeleteResource}
                  onDownloadResource={handleResourceDownload}
                />
              ) : (
                <ResourcesTableView
                  key="table-view"
                  resources={sortedResources}
                  onViewResource={handleViewResource}
                  onEditResource={handleEditResource}
                  onDeleteResource={handleDeleteResource}
                  onDownloadResource={handleResourceDownload}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Modals */}
        <AddResourceModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            showToast("Upload canceled", "info");
          }}
          onSubmit={handleAddResource}
          categories={modalCategories}
        />

        <AddResourceModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedResource(null);
            showToast("Cancelled resource editing", "info");
          }}
          onSubmit={handleSaveEditedResource}
          categories={modalCategories}
          initialResource={selectedResource}
        />

        <ViewResourceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            showToast("Closed resource view", "info");
          }}
          resource={selectedResource}
          onEdit={handleEditResource}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedResource(null);
            showToast("Deletion canceled", "info");
          }}
          onConfirm={confirmDelete}
          resourceTitle={selectedResource?.title}
        />
      </div>
    </motion.div>
  );
}

/* ===========================
   Service contract (for reference)
=========================== */
// ResourcesService.getAllResources({
//   page, limit, search, category, type, status, sortBy, sortOrder
// }) => { success: true, data: { resources: [ ... ], total: 123 } }
//
// Optionals used:
// ResourcesService.createResource(payload)
// ResourcesService.updateResource(id, payload)
// ResourcesService.deleteResource(id)
// ResourcesService.uploadVideoResource(meta, file)
// ResourcesService.uploadAudioResource(meta, file)
// ResourcesService.uploadImageResource(meta, file)
// ResourcesService.uploadDocumentResource(meta, file)
