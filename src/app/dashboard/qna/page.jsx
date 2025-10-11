"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
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

  // Different toast types ke liye different colors
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
      case "question":
        return "bg-purple-500 border-purple-600 shadow-purple-500/20";
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-500/20";
    }
  };

  // Har toast type ke liye alag icon
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
      case "question":
        return <HelpCircle className="h-5 w-5 text-white" />;
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
        className={`${getToastStyles()} border rounded-lg shadow-2xl p-4 min-w-[320px] max-w-[420px] backdrop-blur-sm`}
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

// Custom hook toast manage karne ke liye
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, isVisible: true };

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
    priority: "high",
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAnswered, setFilterAnswered] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
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
        category: filterCategory !== 'all' ? filterCategory : undefined,
        tags: undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        ...params
      });

      if (result.success) {
        const apiData = result.data;
        // Transform API response to match our UI expectations
        const transformedQnaData = apiData.questions?.map(qna => ({
          id: qna._id,
          question: qna.question || 'Untitled Question',
          answer: qna.answers && qna.answers.length > 0 ? qna.answers[0].answer : '',
          category: qna.category || 'General',
          tags: qna.tags || [],
          author: qna.author?.name || qna.author?.username || 'Anonymous',
          status: qna.status || 'active',
          priority: qna.priority || 'medium',
          difficulty: qna.difficulty || 'medium',
          createdAt: qna.createdAt,
          updatedAt: qna.updatedAt,
          views: qna.views || 0,
          likes: qna.upvotes || 0,
          helpful: qna.helpful || 0,
          notHelpful: qna.notHelpful || 0,
          isAnswered: qna.answers && qna.answers.length > 0,
          answerCount: qna.answers ? qna.answers.length : 0,
          acceptedAnswer: qna.answers && qna.answers.length > 0 ? qna.answers[0] : null
        })) || [];

        setQnaData(transformedQnaData);
        setPagination(prev => ({
          ...prev,
          total: apiData.total || 0,
          totalPages: Math.ceil((apiData.total || 0) / pagination.limit)
        }));

        showToast(`${transformedQnaData.length} questions loaded successfully! 💬`, "success");
      } else {
        // Fallback to mock data if API fails
        setQnaData(initialQnaData);
        showToast("Using demo data - API connection issue! 🔌", "warning");
      }
    } catch (error) {
      console.error('Failed to load Q&A data:', error);
      setQnaData(initialQnaData);
      showToast("Failed to load questions - using demo data! ❌", "error");
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

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    const matchesPriority =
      filterPriority === "all" || item.priority === filterPriority;

    const matchesAnswered =
      filterAnswered === "all" ||
      (filterAnswered === "answered" && item.isAnswered) ||
      (filterAnswered === "unanswered" && !item.isAnswered);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesPriority &&
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

  // Naya question add karne ka function with toast
  const handleAddQuestion = async (newQuestion) => {
    try {
      setLoading(true);
      showToast("Creating new question...", "info");

      const result = await QnAService.askQuestion({
        question: newQuestion.question,
        category: newQuestion.category,
        tags: newQuestion.tags || [],
        priority: newQuestion.priority || 'medium'
      });

      if (result.success) {
        // If there's an answer provided, add it
        if (newQuestion.answer && newQuestion.answer.trim() !== "") {
          const answerResult = await QnAService.answerQuestion(result.data._id, {
            answer: newQuestion.answer
          });
          
          if (!answerResult.success) {
            showToast("Question created but answer failed to add!", "warning");
          }
        }

        setIsAddModalOpen(false);
        loadQnaData(); // Reload to show the new question

        showToast(`"${newQuestion.question}" successfully created! ✅`, "success");
      } else {
        showToast(`Failed to create question: ${result.message} ❌`, "error");
      }
    } catch (error) {
      console.error('Add question error:', error);
      showToast("Question add karne mein kuch problem hui. Please try again! ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // question view krne ka function with toast
  const handleViewQna = (qna) => {
    setSelectedQna(qna);
    setIsViewModalOpen(true);
    showToast(`"${qna.question}" ko dekh rahe hain 👀`, "info");
  };

  // edit krne ka function with toast
  const handleEditQna = async (updatedQna) => {
    try {
      showToast("Question update kar rahe hain... ⏳", "info");

      // API call simulate kar rahe hain
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

      showToast(`Question successfully update ho gaya! 🎉`, "success");
    } catch (error) {
      showToast("Update karne mein problem hui. Please try again! ❌", "error");
    }
  };

  // delete krne ka function with toast
  const handleDeleteQna = (qnaId) => {
    const qnaToDelete = qnaData.find((q) => q.id === qnaId);
    setSelectedQna(qnaToDelete);
    setIsDeleteModalOpen(true);
    showToast(
      `"${qnaToDelete?.question}" delete karne ke liye ready kar rahe hain ⚠️`,
      "warning"
    );
  };

  // delete confirm krne ka function with toast
  const confirmDelete = async () => {
    if (selectedQna) {
      try {
        showToast("Question delete kar rahe hain... ⏳", "info");

        // API call simulate kar rahe hain
        await new Promise((resolve) => setTimeout(resolve, 500));

        setQnaData((prev) => prev.filter((qna) => qna.id !== selectedQna.id));
        setIsDeleteModalOpen(false);

        showToast(
          `"${selectedQna.question}" successfully delete ho gaya! 🗑️`,
          "success"
        );
        setSelectedQna(null);
      } catch (error) {
        showToast(
          "Delete karne mein problem hui. Please try again! ❌",
          "error"
        );
      }
    }
  };

  // View mode change karne ka function with toast
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    const modeText = mode === "card" ? "Card" : "Table";
    showToast(`${modeText} view mein switch kar diya! 🔄`, "info");
  };

  // Search handle karne ka function with toast
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      showToast(
        `"${query}" ke liye ${filteredQnaData.length} questions mile! 🔍`,
        "info"
      );
    }
  };

  // Category filter change karne ka function with toast
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    const categoryText = category === "all" ? "Saare Categories" : category;
    showToast(`${categoryText} category select kiya! 🏷️`, "info");
  };

  // Status filter change karne ka function with toast
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    const statusText = status === "all" ? "Saare Status" : status;
    showToast(`${statusText} status select kiya! 📊`, "info");
  };

  // Priority filter change karne ka function with toast
  const handlePriorityFilter = (priority) => {
    setFilterPriority(priority);
    const priorityText = priority === "all" ? "Saari Priorities" : priority;
    showToast(`${priorityText} priority select kiya! 🚨`, "info");
  };

  // Answered filter change karne ka function with toast
  const handleAnsweredFilter = (answered) => {
    setFilterAnswered(answered);
    let answeredText = "Saare Questions";
    if (answered === "answered") answeredText = "Answered Questions";
    if (answered === "unanswered") answeredText = "Unanswered Questions";
    showToast(`${answeredText} select kiye! ✅`, "info");
  };

  // filter dropdown ke liye unique categories nikal rhe hai
  const categories = ["all", ...new Set(qnaData.map((qna) => qna.category))];
  const priorities = ["all", "low", "medium", "high"];

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
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            filterPriority={filterPriority}
            setFilterPriority={handlePriorityFilter}
            filterAnswered={filterAnswered}
            setFilterAnswered={handleAnsweredFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            priorities={priorities}
            onAddQuestion={() => {
              setIsAddModalOpen(true);
              showToast(
                "Naya question add karne ka form khol rahe hain! ➕",
                "info"
              );
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
            showToast("Question add karna cancel kar diya! ❌", "info");
          }}
          onSubmit={handleAddQuestion}
          categories={categories.filter((cat) => cat !== "all")}
        />

        {/* question view krne ka modal */}
        <ViewQnaModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            showToast("Question view band kar diya! 👋", "info");
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
            showToast("Delete cancel kar diya! Safe hai ab! 😅", "info");
          }}
          onConfirm={confirmDelete}
          questionTitle={selectedQna?.question}
        />
      </div>
    </motion.div>
  );
}
