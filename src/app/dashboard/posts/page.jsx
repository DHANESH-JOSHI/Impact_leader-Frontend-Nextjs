"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from "lucide-react";
import PostsHeader from "@/components/posts/PostsHeader";
import PostsCardView from "@/components/posts/PostsCardView";
import PostsTableView from "@/components/posts/PostsTableView";
import AddPostModal from "@/components/posts/AddPostModal";
import ViewPostModal from "@/components/posts/ViewPostModal";
import DeleteConfirmModal from "@/components/posts/DeleteConfirmModal";
import { PostsService } from "@/services/postsService";

// Toast Component
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
        return "bg-green-500 border-green-600 shadow-green-500/20";
      case "error":
        return "bg-red-500 border-red-600 shadow-red-500/20";
      case "info":
        return "bg-blue-500 border-blue-600 shadow-blue-500/20";
      case "warning":
        return "bg-yellow-500 border-yellow-600 shadow-yellow-500/20";
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-500/20";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />;
      case "info":
        return <Info className="h-5 w-5 text-white" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className={`${getToastStyles()} border rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[400px] backdrop-blur-sm`}
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

// Custom hook for toast management
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, isVisible: true };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};

// Mock data - yahan se backend API fetch karni hai
const initialPosts = [
  {
    id: 1,
    title: "Mastering Full-Stack Development with Next.js 14",
    excerpt:
      "Dive deep into Next.js 14's revolutionary features including App Router, Server Components, and edge runtime optimization for lightning-fast web applications.",
    content:
      "Next.js 14 has transformed the way we build full-stack applications. With its powerful App Router, React Server Components, and enhanced performance optimizations, developers can now create blazingly fast web experiences. This comprehensive guide covers everything from setup to deployment, including advanced patterns like streaming, parallel routing, and edge computing integration. Learn how to leverage TypeScript, Tailwind CSS, and modern authentication patterns to build production-ready applications that scale effortlessly.",
    author: "Alexandra Chen",
    category: "Full-Stack Development",
    status: "published",
    publishDate: "2024-01-22",
    tags: [
      "nextjs",
      "react",
      "full-stack",
      "server components",
      "typescript",
      "performance",
    ],
    views: 4580,
    likes: 287,
    featured: true,
    readTime: 12,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    id: 2,
    title: "Building Scalable Design Systems: From Concept to Implementation",
    excerpt:
      "A comprehensive guide to creating design systems that grow with your product, featuring real-world examples from leading tech companies and actionable implementation strategies.",
    content:
      "Design systems are the backbone of consistent user experiences across digital products. This in-depth exploration covers the entire lifecycle of design system creation, from initial token definition to component library maintenance. Learn how companies like Airbnb, Shopify, and GitHub structure their systems, implement design tokens effectively, and maintain consistency across multiple platforms. We'll dive into tools like Figma, Storybook, and design token management, plus strategies for getting organizational buy-in and measuring success.",
    author: "Marcus Rodriguez",
    category: "Design Systems",
    status: "published",
    publishDate: "2024-01-20",
    tags: [
      "design systems",
      "ui/ux",
      "figma",
      "storybook",
      "design tokens",
      "component library",
    ],
    views: 3240,
    likes: 198,
    featured: true,
    readTime: 15,
    image:
      "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=80",
  },
  {
    id: 3,
    title: "React Performance Mastery: Advanced Optimization Techniques",
    excerpt:
      "Unlock the full potential of React applications with cutting-edge optimization strategies, from bundle splitting to memory management and runtime performance tuning.",
    content:
      "React performance optimization goes far beyond basic memoization. This advanced guide explores sophisticated techniques including strategic code splitting, lazy loading patterns, virtual scrolling implementation, and memory leak prevention. Discover how to leverage React's concurrent features, optimize re-renders with precision, and implement effective caching strategies. We'll also cover performance monitoring tools, profiling techniques, and real-world case studies showing 300%+ performance improvements in production applications.",
    author: "Sarah Kim",
    category: "React Development",
    status: "published",
    publishDate: "2024-01-18",
    tags: [
      "react",
      "performance",
      "optimization",
      "concurrent features",
      "profiling",
      "web vitals",
    ],
    views: 5120,
    likes: 342,
    featured: true,
    readTime: 18,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: 4,
    title: "The Future of Web Development: AI-Powered Coding Tools",
    excerpt:
      "Explore how AI assistants and automated code generation are revolutionizing development workflows, boosting productivity, and reshaping the industry landscape.",
    content:
      "Artificial Intelligence is fundamentally changing how we write code. From GitHub Copilot to specialized AI tools for testing, debugging, and optimization, developers now have unprecedented support in their daily workflows. This comprehensive analysis examines the current state of AI-powered development tools, their impact on productivity, and what the future holds. Learn how to integrate AI assistants effectively, maintain code quality, and prepare for the evolving landscape of software development careers.",
    author: "David Thompson",
    category: "AI & Development",
    status: "published",
    publishDate: "2024-01-25",
    tags: [
      "artificial intelligence",
      "ai tools",
      "github copilot",
      "automation",
      "future tech",
      "productivity",
    ],
    views: 2890,
    likes: 156,
    featured: false,
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  },
  {
    id: 5,
    title: "Microservices Architecture: Lessons from Production",
    excerpt:
      "Real-world insights into building, deploying, and maintaining microservices at scale, including common pitfalls and battle-tested solutions.",
    content:
      "Microservices architecture promises scalability and flexibility, but implementation challenges are often underestimated. Drawing from five years of production experience across multiple high-traffic applications, this article provides practical guidance on service boundaries, inter-service communication, data consistency patterns, and operational complexity management. Learn about distributed tracing, circuit breakers, service mesh implementation, and the organizational changes required for successful microservices adoption.",
    author: "Jennifer Walsh",
    category: "Architecture",
    status: "draft",
    publishDate: "2024-01-28",
    tags: [
      "microservices",
      "architecture",
      "scalability",
      "devops",
      "distributed systems",
      "kubernetes",
    ],
    views: 0,
    likes: 0,
    featured: false,
    readTime: 20,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
];

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

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
        // console.log(result.data.data,": hey")
        const apiData = result.data.data;
        // Transform API response to match our UI expectations
        const transformedPosts = apiData?.map(post => ({
          id: post._id,
          title: post.title || 'Untitled Post',
          excerpt: post.content?.slice(0, 150) + '...' || 'No content available',
          content: post.content || '',
          author: post.author?.name ||`${post.author?.firstName} ${post.author?.lastName}` || post.author?.username || 'Unknown',
          category: post.type || 'General',
          status: post.isPublic ? 'published' : 'draft',
          publishDate: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          tags: post.theme ? [post.theme] : [],
          views: post.views || 0,
          likes: post.upvotes || 0,
          featured: post.isPinned || false,
          readTime: Math.ceil((post.content?.length || 0) / 200), // Approximate read time
          image: post.images && post.images.length > 0 ? post.images[0] : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
        })) || [];

        setPosts(transformedPosts);
        setPagination(prev => ({
          ...prev,
          total: apiData.total || 0,
          totalPages: Math.ceil((apiData.total || 0) / pagination.limit)
        }));

        showToast(`${transformedPosts.length} posts loaded successfully! 📚`, "success");
      } else {
        // Fallback to mock data if API fails
        setPosts(initialPosts);
        showToast("Using demo data - API connection issue! 🔌", "warning");
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts(initialPosts);
      showToast("Failed to load posts - using demo data! ❌", "error");
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

  const handleEditPost = async (updatedPost) => {
    try {
      showToast("Updating post...", "info");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );

      showToast(`Post "${updatedPost.title}" updated successfully!`, "success");
    } catch (error) {
      showToast("Failed to update post. Please try again.", "error");
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

        {/* Modals */}
        <AddPostModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            showToast("Cancelled post creation", "info");
          }}
          onSubmit={handleAddPost}
          categories={categories.filter((cat) => cat !== "all")}
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
