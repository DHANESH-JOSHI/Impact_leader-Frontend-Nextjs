"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import QnaHeader from "@/components/qna/QnaHeader";
import QnaCardView from "@/components/qna/QnaCardView";
import QnaTableView from "@/components/qna/QnaTableView";
import AddQuestionModal from "@/components/qna/AddQuestionModal";
import ViewQnaModal from "@/components/qna/ViewQnaModal";
import DeleteConfirmModal from "@/components/qna/DeleteConfirmModal";
import { QnAService } from "@/services/qnaService";

// Toast Component - ye hamara toast dikhane ka component hai
const Toast = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      // 4 second baad automatically band ho jaayega
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // Only success and error toast types
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

  // Only success and error icons
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

// Custom hook toast manage karne ke liye - only success and error types
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    // Only allow 'success' or 'error' types
    const validType = type === "success" ? "success" : "error";
    const id = Date.now() + Math.random();
    const newToast = { id, message, type: validType, isVisible: true };

    setToasts((prev) => [...prev, newToast]);

    // 4 second baad auto-remove ho jaayega
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  };

  const hideToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};

// ye sample QnA data hai - baad me API se fetch krna hai
const initialQnaData = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer:
      "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link.",
    category: "Account",
    tags: ["password", "account", "login", "security"],
    author: "Admin",
    status: "published",
    isAnswered: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T12:45:00Z",
    views: 1250,
    likes: 45,
    helpful: 38,
    notHelpful: 7,
    featured: true,
    difficulty: "easy",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for enterprise accounts.",
    category: "Billing",
    tags: ["payment", "billing", "credit card", "paypal"],
    author: "Support Team",
    status: "published",
    priority: "medium",
    isAnswered: true,
    createdAt: "2024-01-12T14:20:00Z",
    updatedAt: "2024-01-12T16:30:00Z",
    views: 890,
    likes: 32,
    helpful: 28,
    notHelpful: 4,
    featured: false,
    difficulty: "easy",
  },
  {
    id: 3,
    question: "How can I integrate your API with my existing system?",
    answer: "",
    category: "Technical",
    tags: ["api", "integration", "development", "technical"],
    author: "John Doe",
    status: "draft",
    priority: "high",
    isAnswered: false,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
    views: 156,
    likes: 8,
    helpful: 0,
    notHelpful: 0,
    featured: false,
    difficulty: "hard",
  },
  {
    id: 4,
    question: "Is there a mobile app available?",
    answer:
      "Yes! We have mobile apps available for both iOS and Android. You can download them from the App Store and Google Play Store respectively.",
    category: "General",
    tags: ["mobile", "app", "ios", "android"],
    author: "Support Team",
    status: "published",
    priority: "low",
    isAnswered: true,
    createdAt: "2024-01-10T11:45:00Z",
    updatedAt: "2024-01-11T08:20:00Z",
    views: 2340,
    likes: 156,
    helpful: 142,
    notHelpful: 14,
    featured: true,
    difficulty: "easy",
  },
];

// animation variants - page aur card ke liye
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

export default function QnaPage() {
  // Toast system ka hook use kar rahe hai
  const { toasts, showToast, hideToast } = useToast();

  const [qnaData, setQnaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAnswered, setFilterAnswered] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // modal khulne bandh krne ke states hai ye
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQna, setSelectedQna] = useState(null);

  // Load Q&A data on component mount
  useEffect(() => {
    loadQnaData();
  }, []);

  // Load Q&A data from API
  const loadQnaData = async (params = {}) => {
    setLoading(true);
    try {
      const result = await QnAService.getQuestions({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: filterCategory !== "all" ? filterCategory : undefined,
        tags: undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        ...params,
      });

      if (result.success) {
        const apiData = result.data.data;
        console.log("result: ", apiData);
        // Transform API response to match our UI expectations
        const transformedQnaData =
          apiData?.map((qna) => ({
            id: qna._id,
            question: qna.title || qna.content || "Untitled Question", // FIX: Use title/content from API
            answer: qna.answer || qna.content || "", // FIX: Adjust based on actual API fields
            category: qna.category || "General",
            tags: qna.tags || [],
            author:
              qna.author?.firstName || qna.author?.lastName || "Anonymous", // FIX: Use firstName/lastName from API
            status: qna.status || "active",
            createdAt: qna.createdAt,
            updatedAt: qna.updatedAt,
            views: qna.views || 0,
            likes: qna.upvotes?.length || qna.upvotes || 0, // FIX: upvotes might be an array
            helpful: qna.helpful || 0,
            notHelpful: qna.notHelpful || 0,
            isAnswered: !!(qna.answer || qna.answers), // FIX: Check if answer exists
            answerCount: qna.answerCount || 0,
            acceptedAnswer: qna.acceptedAnswer || null,
          })) || [];

        setQnaData(transformedQnaData);

        setPagination((prev) => ({
          ...prev,
          total: apiData.total || 0,
          totalPages: Math.ceil((apiData.total || 0) / pagination.limit),
        }));

        // Data loaded successfully - no toast needed for initial load
      } else {
        // Fallback to mock data if API fails
        setQnaData(initialQnaData);
      }
    } catch (error) {
      console.error("Failed to load Q&A data:", error);
      setQnaData(initialQnaData);
      showToast("Failed to load questions", "error");
    } finally {
      setLoading(false);
    }
  };

  // yhn se sare filters aur search ka kaam hota hai
  const filteredQnaData = qnaData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" ||
      item.category.toLowerCase() === filterCategory.toLowerCase();

    const matchesAnswered =
      filterAnswered === "all" ||
      (filterAnswered === "answered" && item.isAnswered) ||
      (filterAnswered === "unanswered" && !item.isAnswered);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAnswered
    );
  });

  // sorting ka functionality yhn hai
  const sortedQnaData = [...filteredQnaData].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "createdAt" || sortBy === "updatedAt") {
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

  // Naya question add karne ka function
  const handleAddQuestion = async (newQuestion) => {
    try {
      setLoading(true);

      const apiData = {
        title: newQuestion.question,
        content: newQuestion.answer || "",
        tags: newQuestion.tags || [],
        category: newQuestion.category || "General",
        status: newQuestion.status || "open",
      };

      const result = await QnAService.askQuestion(apiData);

      if (result.success) {
        setIsAddModalOpen(false);
        loadQnaData();
        showToast("Question created successfully", "success");
      } else {
        showToast(`Failed to create question: ${result.message}`, "error");
      }
    } catch (error) {
      console.error("Add question error:", error);
      showToast("Failed to create question", "error");
    } finally {
      setLoading(false);
    }
  };

  // question view krne ka function
  const handleViewQna = (qna) => {
    setSelectedQna(qna);
    setIsViewModalOpen(true);
  };

  // edit krne ka function
  const handleEditQna = async (updatedQna) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setQnaData((prev) =>
        prev.map((qna) =>
          qna.id === updatedQna.id
            ? {
                ...updatedQna,
                updatedAt: new Date().toISOString(),
                isAnswered:
                  updatedQna.answer && updatedQna.answer.trim() !== "",
              }
            : qna
        )
      );

      showToast("Question updated successfully", "success");
    } catch (error) {
      showToast("Failed to update question", "error");
    }
  };

  // delete krne ka function
  const handleDeleteQna = (qnaId) => {
    const qnaToDelete = qnaData.find((q) => q.id === qnaId);
    setSelectedQna(qnaToDelete);
    setIsDeleteModalOpen(true);
  };

  // delete confirm krne ka function
  const confirmDelete = async () => {
    if (selectedQna) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setQnaData((prev) => prev.filter((qna) => qna.id !== selectedQna.id));
        setIsDeleteModalOpen(false);

        showToast("Question deleted successfully", "success");
        setSelectedQna(null);
      } catch (error) {
        showToast("Failed to delete question", "error");
      }
    }
  };

  // View mode change karne ka function
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Search handle karne ka function
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Category filter change karne ka function
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  // Answered filter change karne ka function
  const handleAnsweredFilter = (answered) => {
    setFilterAnswered(answered);
  };

  // filter dropdown ke liye unique categories nikal rhe hai
  const categories = ["all", ...new Set(qnaData.map((qna) => qna.category))];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toast Container - saare toasts yahan dikhenge */}
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
        {/* top header section ka code */}
        <motion.div variants={cardVariants}>
          <QnaHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterCategory={filterCategory}
            setFilterCategory={handleCategoryFilter}
            filterAnswered={filterAnswered}
            setFilterAnswered={handleAnsweredFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            onAddQuestion={() => {
              setIsAddModalOpen(true);
            }}
            totalQuestions={filteredQnaData.length}
          />
        </motion.div>

        {/* QnA dikhane ke do tarike - card ya table */}
        <motion.div variants={cardVariants}>
          <AnimatePresence mode="wait">
            {viewMode === "card" ? (
              <QnaCardView
                key="card-view"
                qnaData={sortedQnaData}
                onViewQna={handleViewQna}
                onEditQna={handleEditQna}
                onDeleteQna={handleDeleteQna}
              />
            ) : (
              <QnaTableView
                key="table-view"
                qnaData={sortedQnaData}
                onViewQna={handleViewQna}
                onEditQna={handleEditQna}
                onDeleteQna={handleDeleteQna}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* sare modals yhn hai */}
        {/* nayi question add krne ka modal */}
        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onSubmit={handleAddQuestion}
          categories={categories.filter((cat) => cat !== "all")}
        />

        {/* question view krne ka modal */}
        <ViewQnaModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
          }}
          qna={selectedQna}
          onEdit={handleEditQna}
        />

        {/* delete confirm krne ka modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedQna(null);
          }}
          onConfirm={confirmDelete}
          questionTitle={selectedQna?.question}
        />
      </div>
    </motion.div>
  );
}
