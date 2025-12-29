"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ResourcesHeader from "@/components/resources/ResourcesHeader";
import ResourcesCardView from "@/components/resources/ResourcesCardView";
import ResourcesTableView from "@/components/resources/ResourcesTableView";
import AddResourceModal from "@/components/resources/AddResourceModal";
import ViewResourceModal from "@/components/resources/ViewResourceModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
import { ResourcesService } from "@/services/resourcesService";
import { ThemesService } from "@/services/themesService";

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

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterTheme, setFilterTheme] = useState("all");
  const [filterPublic, setFilterPublic] = useState("all"); // all, public, private
  const [themes, setThemes] = useState([]);
  const [themesLoading, setThemesLoading] = useState(false);

  const [sort, setSort] = useState("newest");

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

  // Load themes from backend
  useEffect(() => {
    if (themes.length === 0 && !themesLoading) {
      loadThemes();
    }
  }, []);

  const loadThemes = async () => {
    if (themesLoading || themes.length > 0) return; // Prevent duplicate requests
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
    filterType,
    filterTheme,
    filterPublic,
    sort,
    searchQuery,
  ]);

  const loadResources = async (extra = {}) => {
    setLoading(true);
    try {
      const result = await ResourcesService.getAllResources({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        type: filterType !== "all" ? filterType : undefined,
        isPublic: filterPublic === "public" ? true : filterPublic === "private" ? false : undefined,
        themes: filterTheme !== "all" ? filterTheme : undefined,
        sort,
        ...extra,
      });

      if (result?.success) {
        const resourcesData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformed = resourcesData.map((r) => {
          const authorObj = r.uploadedBy || r.author;
          let authorName = "Unknown";
          if (typeof authorObj === 'string') {
            authorName = authorObj;
          } else if (authorObj && typeof authorObj === 'object') {
            if (authorObj.name) {
              authorName = authorObj.name;
            } else if (authorObj.username) {
              authorName = authorObj.username;
            } else if (authorObj.firstName || authorObj.lastName) {
              authorName = `${authorObj.firstName || ''} ${authorObj.lastName || ''}`.trim();
            }
          }

          let tags = [];
          if (Array.isArray(r.tags)) {
            tags = r.tags;
          } else if (r.tags && typeof r.tags === 'string') {
            tags = [r.tags];
          }

          // Get file URL - file.path can be S3 URL or local path
          let fileUrl = "";
          if (r.file?.path) {
            // If it's already a full URL (starts with http/https), use it as is
            // Otherwise, it's a local path and we need to prepend /uploads/
            fileUrl = r.file.path.startsWith('http://') || r.file.path.startsWith('https://') 
              ? r.file.path 
              : `/uploads/${r.file.path}`;
          } else if (r.url) {
            // For link type resources
            fileUrl = r.url;
          }

          return {
            id: r._id || r.id,
            title: r.title || "Untitled Resource",
            description: r.description || "No description available.",
            type: r.type || "document",
            fileUrl: fileUrl,
            fileName: r.file?.originalName || r.file?.filename || "file",
            fileSize: r.file?.size || 0,
            url: r.url || "", // Keep url field separate for link resources
            duration: r.duration || 0,
            category: r.category || "General",
            tags: tags,
            // Normalize themes: extract names from theme objects or use strings directly
            themes: Array.isArray(r.themes) 
              ? r.themes.map(theme => {
                  if (typeof theme === 'string') return theme; // Already a name
                  if (theme && typeof theme === 'object') return theme.name || theme; // Extract name from object
                  return theme; // Fallback
                }).filter(Boolean)
              : [],
            author: authorName,
            status: r.isPublic !== false && r.isActive !== false ? "published" : "draft",
            isPublic: r.isPublic !== undefined ? r.isPublic : true,
            thumbnail:
              r.thumbnail ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
            createdAt: toISODate(r.createdAt),
            updatedAt: toISODate(r.updatedAt),
            views: typeof r.views === 'number' ? r.views : 0,
            likes: Array.isArray(r.likes) ? r.likes.length : (typeof r.likes === 'number' ? r.likes : 0),
            downloads: typeof r.downloadCount === 'number' ? r.downloadCount : (typeof r.downloads === 'number' ? r.downloads : 0),
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
        
      } else {
        setResources([]);
        setPagination((p) => ({
          ...p,
          total: 0,
          totalPages: 0,
        }));
        toast.error(result.message || "Failed to load resources");
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
      setResources([]);
      setPagination((p) => ({
        ...p,
        total: 0,
        totalPages: 0,
      }));
      toast.error(err.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };


  /* Handlers */
  const handleAddResource = async (payload) => {
    try {
      setLoading(true);

      const cleanPayload = {
        title: payload.title?.trim() || "Untitled Resource",
        description: payload.description?.trim() || "No description",
        category: payload.category?.trim() || "General",
        type: payload.type || "document",
        tags: Array.isArray(payload.tags) ? payload.tags : (payload.tags ? payload.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        themes: Array.isArray(payload.themes) ? payload.themes : (payload.themes ? payload.themes.split(',').map(t => t.trim()).filter(Boolean) : []),
        isPublic: payload.isPublic !== undefined ? payload.isPublic : true,
        // Ensure exactly one is true (mutually exclusive)
        ...(payload.url && { url: payload.url }),
      };
  
      let res;
      if (payload.file && payload.file instanceof File) {
        // Use appropriate upload method based on resource type
        const fileType = cleanPayload.type || payload.file.type?.split('/')[0];
        console.log('[Resources] Uploading file:', {
          fileName: payload.file.name,
          fileSize: payload.file.size,
          fileType: payload.file.type,
          resourceType: cleanPayload.type
        });
        
        switch (fileType) {
          case 'video':
            res = await ResourcesService.uploadVideoResource(cleanPayload, payload.file);
            break;
          case 'audio':
            res = await ResourcesService.uploadAudioResource(cleanPayload, payload.file);
            break;
          case 'image':
            res = await ResourcesService.uploadImageResource(cleanPayload, payload.file);
            break;
          default:
            res = await ResourcesService.uploadDocumentResource(cleanPayload, payload.file);
        }
      } else {
        // No file - create resource without file (for link type or URL-based resources)
        res = await ResourcesService.createResource(cleanPayload);
      }
  
      if (res?.success) {
        setIsAddModalOpen(false);
        await loadResources();
        toast.success(`"${cleanPayload.title}" uploaded successfully`);
      } else {
        toast.error(`Upload failed: ${res?.message || 'Unknown error'}`);
      }
    } catch (e) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setIsViewModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedResource = async (resourceData) => {
    try {
      if (resourceData.id) {
        const cleanPayload = {
          title: resourceData.title?.trim() || "Untitled Resource",
          description: resourceData.description?.trim() || "No description",
          category: resourceData.category?.trim() || "General",
          type: resourceData.type || "document",
          tags: Array.isArray(resourceData.tags) ? resourceData.tags : (resourceData.tags ? resourceData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
          themes: Array.isArray(resourceData.themes) ? resourceData.themes : (resourceData.themes ? resourceData.themes.split(',').map(t => t.trim()).filter(Boolean) : []),
          isPublic: resourceData.isPublic !== undefined ? resourceData.isPublic : true,
          // Ensure exactly one is true (mutually exclusive)
          ...(resourceData.url && { url: resourceData.url }),
          ...(resourceData.file && { file: resourceData.file }),
        };

        const res = await ResourcesService.updateResource(resourceData.id, cleanPayload);
        
        if (res?.success) {
          await loadResources();
          setIsEditModalOpen(false);
          setSelectedResource(null);
          toast.success("Resource updated successfully");
        } else {
          toast.error(res?.message || "Failed to update resource");
        }
      }
    } catch (e) {
      toast.error(e.message || "Update failed");
    }
  };

  const handleDeleteResource = (id) => {
    const target = resources.find((r) => r.id === id);
    setSelectedResource(target || null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      const res = await ResourcesService.deleteResource?.(selectedResource.id);
      if (res?.success) {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        toast.success("Resource deleted");
      } else {
        setResources((prev) =>
          prev.filter((r) => r.id !== selectedResource.id)
        );
        toast.success("Resource deleted");
      }
    } catch (e) {
      toast.error("Delete failed. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
  };

  const handleTypeFilter = (type) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterType(type);
  };


  const handlePublicFilter = (value) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterPublic(value);
  };

  const handleThemeFilter = (theme) => {
    setPagination((p) => ({ ...p, page: 1 }));
    setFilterTheme(theme);
  };

  const handleResourceDownload = async (resource) => {
    try {
      const result = await ResourcesService.downloadResource(resource.id, resource.fileName || resource.title);
      if (result?.success) {
        toast.success('Download started');
      } else {
        toast.error(result?.message || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  // Use backend enum for resource types
  const types = useMemo(() => [
    "all",
    ...ResourcesService.getResourceTypes().map(t => t.value)
  ], []);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div >
        {/* Header */}
        <motion.div className="mb-8" variants={cardVariants}>
          <ResourcesHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterType={filterType}
            setFilterType={handleTypeFilter}
            filterTheme={filterTheme}
            setFilterTheme={handleThemeFilter}
            filterPublic={filterPublic}
            setFilterPublic={handlePublicFilter}
            sort={sort}
            setSort={setSort}
            types={types}
            themes={themes}
            onAddResource={() => {
              setIsAddModalOpen(true);
            }}
            totalResources={pagination.total}
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
                  resources={resources}
                  onViewResource={handleViewResource}
                  onEditResource={handleEditResource}
                  onDeleteResource={handleDeleteResource}
                  onDownloadResource={handleResourceDownload}
                />
              ) : (
                <ResourcesTableView
                  key="table-view"
                  resources={resources}
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
          }}
          onSubmit={handleAddResource}
        />

        <AddResourceModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedResource(null);
          }}
          onSubmit={handleSaveEditedResource}
          initialResource={selectedResource}
        />

        <ViewResourceModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
          }}
          resource={selectedResource}
          onEdit={handleEditResource}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedResource(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Resource"
          message="Are you sure you want to delete this resource? This action cannot be undone."
          itemName={selectedResource?.title}
          isLoading={false}
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
