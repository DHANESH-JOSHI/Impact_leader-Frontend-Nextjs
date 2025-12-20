"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import PostsHeader from "@/components/posts/PostsHeader";
import PostsCardView from "@/components/posts/PostsCardView";
import PostsTableView from "@/components/posts/PostsTableView";
import AddPostModal from "@/components/posts/AddPostModal";
import ViewPostModal from "@/components/posts/ViewPostModal";
import DeleteConfirmModal from "@/components/posts/DeleteConfirmModal";
import { PostsService } from "@/services/postsService";

const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
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

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    const validType = type === "success" ? "success" : "error";
    const id = Date.now() + Math.random();
    const newToast = { id, message, type: validType, isVisible: true };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      hideToast(id);
    }, 4000);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};


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

export default function PostsPage() {
  const { toasts, showToast, hideToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("publishDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Load posts from API
  const loadPosts = async (params = {}) => {
    setLoading(true);
    try {
      const result = await PostsService.getAllPosts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        type: filterCategory !== 'all' ? filterCategory : undefined,
        isPublic: filterStatus === 'published' ? true : filterStatus === 'draft' ? false : undefined,
        ...params
      });

      if (result.success) {
        // apiClient normalizes response: { success, data: [...], pagination: {...} }
        const postsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        // Transform API response to match our UI expectations
        const transformedPosts = postsData?.map(post => {
          // Safely extract author name - handle both object and string cases
          let authorName = 'Unknown';
          if (typeof post.author === 'string') {
            authorName = post.author;
          } else if (post.author && typeof post.author === 'object') {
            // Handle populated author object
            if (post.author.name) {
              authorName = post.author.name;
            } else if (post.author.firstName || post.author.lastName) {
              authorName = `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim();
            } else if (post.author.username) {
              authorName = post.author.username;
            } else if (post.author.email) {
              authorName = post.author.email;
            }
          }

          // Safely extract tags - ensure it's always an array
          let tags = [];
          if (Array.isArray(post.tags)) {
            tags = post.tags;
          } else if (Array.isArray(post.themes)) {
            tags = post.themes;
          } else if (post.theme) {
            tags = [post.theme];
          } else if (post.tags && typeof post.tags === 'string') {
            tags = [post.tags];
          }

          // Safely extract excerpt
          const content = post.content || '';
          const excerpt = content.length > 150 
            ? content.slice(0, 150) + '...' 
            : content || 'No content available';

          return {
            id: post._id || post.id,
          title: post.title || 'Untitled Post',
            excerpt: excerpt,
            content: content,
            author: authorName,
            category: post.type || post.category || 'General',
          status: post.isPublic ? 'published' : 'draft',
            publishDate: post.createdAt 
              ? new Date(post.createdAt).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0],
            tags: tags,
            views: typeof post.views === 'number' ? post.views : 0,
            likes: typeof post.upvotes === 'number' ? post.upvotes : 0,
            featured: post.isPinned || post.featured || false,
            readTime: Math.ceil((content.length || 0) / 200),
            image: (post.images && Array.isArray(post.images) && post.images.length > 0) 
              ? post.images[0] 
              : (post.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80")
          };
        }) || [];

        setPosts(transformedPosts);
        setPagination(prev => ({
          ...prev,
          total: paginationData.totalPosts || paginationData.total || transformedPosts.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalPosts || paginationData.total || transformedPosts.length) / pagination.limit)
        }));

        showToast(`${transformedPosts.length} posts loaded successfully! 📚`, "success");
      } else {
        setPosts([]);
        showToast(result.message || "Failed to load posts", "error");
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
      showToast(error.message || "Failed to load posts", "error");
    } finally {
      setLoading(false);
    }
  };

  

  // Filter posts based on search and filters
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" ||
      post.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "publishDate") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleAddPost = async (newPost) => {
    try {
      setLoading(true);
      showToast("Creating new post...", "info");
  
      // Transform data to match API structure
      const postData = {
        title: newPost.title,
        content: newPost.content,
        type: newPost.category || 'announcement',
        themes: newPost.tags || [], // Changed from 'theme' to 'themes' array
        isPublic: newPost.status === 'published',
        isPinned: newPost.featured || false, // Added featured post mapping
        status: newPost.status, // Added status field
        allowComments: true // Added as required by API
      };
  
      let result;
  
      // Check if there are images to upload
      if (newPost.images && newPost.images.length > 0) {
        // Use FormData for images
        const formData = new FormData();
        formData.append('postData', JSON.stringify(postData));
        
        // Append each image file
        newPost.images.forEach((image, index) => {
          formData.append('images', image);
        });
  
        result = await PostsService.createPostWithImages(formData);
      } else {
        // Send regular JSON data when no images
        result = await PostsService.createPost(postData);
      }
  
      if (result.success) {
        setIsAddModalOpen(false);
        loadPosts(); // Reload posts to show the new one
        showToast(`Post "${newPost.title}" created successfully!`, "success");
      } else {
        showToast(`Failed to create post: ${result.message}`, "error");
      }
    } catch (error) {
      console.error('Create post error:', error);
      showToast("Failed to create post. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
    showToast(`Viewing "${post.title}"`, "info");
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedPost = async (postData) => {
    try {
      showToast("Updating post...", "info");

      if (postData.id) {
        const result = await PostsService.updatePost(postData.id, postData);
        
        if (result.success) {
          await loadPosts();
          setIsEditModalOpen(false);
          setSelectedPost(null);
          showToast(`Post "${postData.title}" updated successfully!`, "success");
        } else {
          showToast(result.message || "Failed to update post", "error");
        }
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      showToast(error.message || "Failed to update post. Please try again.", "error");
    }
  };

  const handleDeletePost = (postId) => {
    const postToDelete = posts.find((p) => p.id === postId);
    setSelectedPost(postToDelete);
    setIsDeleteModalOpen(true);
    showToast(`Preparing to delete "${postToDelete?.title}"`, "warning");
  };

  const confirmDelete = async () => {
    if (selectedPost) {
      try {
        showToast("Deleting post...", "info");

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPosts((prev) => prev.filter((post) => post.id !== selectedPost.id));
        setIsDeleteModalOpen(false);

        showToast(
          `Post "${selectedPost.title}" deleted successfully!`,
          "success"
        );
        setSelectedPost(null);
      } catch (error) {
        showToast("Failed to delete post. Please try again.", "error");
      }
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    showToast(`Switched to ${mode} view`, "info");
  };

  // Handle search
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      showToast(
        `Found ${filteredPosts.length} posts matching "${query}"`,
        "info"
      );
    }
  };

  // Handle filter changes
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    const categoryText = category === "all" ? "All Categories" : category;
    showToast(`Filtered by: ${categoryText}`, "info");
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    const statusText = status === "all" ? "All Status" : status;
    showToast(`Filtered by: ${statusText}`, "info");
  };

  const categories = ["all", ...new Set(posts.map((post) => post.category))];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toast Container */}
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

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div variants={cardVariants}>
          <PostsHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterCategory={filterCategory}
            setFilterCategory={handleCategoryFilter}
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            onAddPost={() => {
              setIsAddModalOpen(true);
              showToast("Opening new post form", "info");
            }}
            totalPosts={filteredPosts.length}
          />
        </motion.div>

        {/* Posts Display */}
        <motion.div variants={cardVariants}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading posts...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "card" ? (
                <PostsCardView
                  key="card-view"
                  posts={sortedPosts}
                  onViewPost={handleViewPost}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              ) : (
                <PostsTableView
                  key="table-view"
                  posts={sortedPosts}
                  onViewPost={handleViewPost}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>

        <AddPostModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            showToast("Cancelled post creation", "info");
          }}
          onSubmit={handleAddPost}
          categories={categories.filter((cat) => cat !== "all")}
        />

        <AddPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPost(null);
            showToast("Cancelled post editing", "info");
          }}
          onSubmit={handleSaveEditedPost}
          categories={categories.filter((cat) => cat !== "all")}
          initialPost={selectedPost}
        />

        <ViewPostModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            showToast("Closed post view", "info");
          }}
          post={selectedPost}
          onEdit={handleEditPost}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPost(null);
            showToast("Cancelled post deletion", "info");
          }}
          onConfirm={confirmDelete}
          postTitle={selectedPost?.title}
        />
      </div>
    </motion.div>
  );
}
