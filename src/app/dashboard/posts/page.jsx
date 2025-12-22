"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PostsHeader from "@/components/posts/PostsHeader";
import PostsCardView from "@/components/posts/PostsCardView";
import PostsTableView from "@/components/posts/PostsTableView";
import AddPostModal from "@/components/posts/AddPostModal";
import ViewPostModal from "@/components/posts/ViewPostModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
import { PostsService } from "@/services/postsService";


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

  useEffect(() => {
    loadPosts();
  }, []);

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
        const postsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformedPosts = postsData?.map(post => {
          let authorName = 'Unknown';
          if (typeof post.author === 'string') {
            authorName = post.author;
          } else if (post.author && typeof post.author === 'object') {
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
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalPosts || paginationData.total || transformedPosts.length) / prev.limit)
        }));

      } else {
        setPosts([]);
        toast.error(result.message || "Failed to load posts");
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
      toast.error(error.message || "Failed to load posts");
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
  
      const postData = {
        title: newPost.title,
        content: newPost.content,
        type: newPost.category || 'announcement',
        themes: newPost.tags || [],
        isPublic: newPost.status === 'published',
        isPinned: newPost.featured || false,
        status: newPost.status,
        allowComments: true
      };
  
      let result;
  
      if (newPost.images && newPost.images.length > 0) {
        const formData = new FormData();
        formData.append('postData', JSON.stringify(postData));
        
        newPost.images.forEach((image, index) => {
          formData.append('images', image);
        });
  
        result = await PostsService.createPostWithImages(formData);
      } else {
        result = await PostsService.createPost(postData);
      }
  
      if (result.success) {
        setIsAddModalOpen(false);
        loadPosts();
        toast.success(`Post "${newPost.title}" created successfully!`);
      } else {
        toast.error(`Failed to create post: ${result.message}`);
      }
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedPost = async (postData) => {
    try {
      if (postData.id) {
        const result = await PostsService.updatePost(postData.id, postData);
        
        if (result.success) {
          await loadPosts();
          setIsEditModalOpen(false);
          setSelectedPost(null);
          toast.success(`Post "${postData.title}" updated successfully!`);
        } else {
          toast.error(result.message || "Failed to update post");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = (postId) => {
    const postToDelete = posts.find((p) => p.id === postId);
    setSelectedPost(postToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPost) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPosts((prev) => prev.filter((post) => post.id !== selectedPost.id));
        setIsDeleteModalOpen(false);

        toast.success(`Post "${selectedPost.title}" deleted successfully!`);
        setSelectedPost(null);
      } catch (error) {
        toast.error("Failed to delete post. Please try again.");
      }
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const categories = ["all", ...new Set(posts.map((post) => post.category))];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
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
          }}
          onSubmit={handleAddPost}
          categories={categories.filter((cat) => cat !== "all")}
        />

        <AddPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPost(null);
          }}
          onSubmit={handleSaveEditedPost}
          categories={categories.filter((cat) => cat !== "all")}
          initialPost={selectedPost}
        />

        <ViewPostModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
          }}
          post={selectedPost}
          onEdit={handleEditPost}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPost(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          itemName={selectedPost?.title}
          isLoading={false}
        />
      </div>
    </motion.div>
  );
}
