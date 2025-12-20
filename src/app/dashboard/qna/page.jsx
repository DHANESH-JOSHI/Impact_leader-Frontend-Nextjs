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
        // apiClient normalizes response: { success, data: [...], pagination: {...} }
        const questionsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        // Transform API response to match our UI expectations
        const transformedQnaData = questionsData.map((qna) => {
          // Safely extract author name
          let authorName = "Anonymous";
          if (typeof qna.author === 'string') {
            authorName = qna.author;
          } else if (qna.author && typeof qna.author === 'object') {
            if (qna.author.name) {
              authorName = qna.author.name;
            } else if (qna.author.firstName || qna.author.lastName) {
              authorName = `${qna.author.firstName || ''} ${qna.author.lastName || ''}`.trim();
            } else if (qna.author.username) {
              authorName = qna.author.username;
            }
          }

          // Safely extract tags
          let tags = [];
          if (Array.isArray(qna.tags)) {
            tags = qna.tags;
          } else if (qna.tags && typeof qna.tags === 'string') {
            tags = [qna.tags];
          }

          return {
            id: qna._id || qna.id,
            question: qna.title || qna.question || qna.content || "Untitled Question",
            answer: qna.answer || qna.content || "",
            category: qna.category || qna.theme || "General",
            tags: tags,
            author: authorName,
            status: qna.status || "active",
            createdAt: qna.createdAt,
            updatedAt: qna.updatedAt,
            views: typeof qna.views === 'number' ? qna.views : 0,
            likes: Array.isArray(qna.upvotes) ? qna.upvotes.length : (typeof qna.upvotes === 'number' ? qna.upvotes : 0),
            helpful: typeof qna.helpful === 'number' ? qna.helpful : 0,
            notHelpful: typeof qna.notHelpful === 'number' ? qna.notHelpful : 0,
            isAnswered: !!(qna.answer || qna.answers || (qna.answerCount && qna.answerCount > 0)),
            answerCount: typeof qna.answerCount === 'number' ? qna.answerCount : 0,
            acceptedAnswer: qna.acceptedAnswer || null,
          };
        });

        setQnaData(transformedQnaData);

        setPagination((prev) => ({
          ...prev,
          total: paginationData.totalQuestions || paginationData.total || transformedQnaData.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalQuestions || paginationData.total || transformedQnaData.length) / pagination.limit),
        }));

        // Data loaded successfully - no toast needed for initial load
      } else {
        setQnaData([]);
        showToast(result.message || "Failed to load questions", "error");
      }
    } catch (error) {
      console.error("Failed to load Q&A data:", error);
      setQnaData([]);
      showToast(error.message || "Failed to load questions", "error");
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
  const handleEditQna = (qna) => {
    setSelectedQna(qna);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedQna = async (qnaData) => {
    try {
      showToast("Updating question…", "info");

      if (qnaData.id) {
        const result = await QnAService.updateQuestion(qnaData.id, qnaData);
        
        if (result.success) {
          await loadQnaData();
          setIsEditModalOpen(false);
          setSelectedQna(null);
      showToast("Question updated successfully", "success");
        } else {
          showToast(result.message || "Failed to update question", "error");
        }
      }
    } catch (error) {
      console.error("Failed to update question:", error);
      showToast(error.message || "Failed to update question", "error");
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

        <AddQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQna(null);
          }}
          onSubmit={handleSaveEditedQna}
          categories={categories.filter((cat) => cat !== "all")}
          initialQuestion={selectedQna}
        />

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
