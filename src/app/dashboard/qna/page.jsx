"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import QnaHeader from "@/components/qna/QnaHeader";
import QnaCardView from "@/components/qna/QnaCardView";
import QnaTableView from "@/components/qna/QnaTableView";
import AddQuestionModal from "@/components/qna/AddQuestionModal";
import ViewQnaModal from "@/components/qna/ViewQnaModal";
import DeleteConfirmModal from "@/components/qna/DeleteConfirmModal";
import { QnAService } from "@/services/qnaService";

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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQna, setSelectedQna] = useState(null);

  useEffect(() => {
    loadQnaData();
  }, []);

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
        const questionsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        const transformedQnaData = questionsData.map((qna) => {
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

          let tags = [];
          if (Array.isArray(qna.tags)) {
            tags = qna.tags;
          } else if (qna.tags && typeof qna.tags === 'string') {
            tags = [qna.tags];
          }

          const answerCount = Array.isArray(qna.answers) ? qna.answers.length : (typeof qna.answerCount === 'number' ? qna.answerCount : 0);
          const themes = Array.isArray(qna.themes) ? qna.themes : [];
          const category = themes.length > 0 ? themes[0] : (qna.category || "General");

          return {
            id: qna._id || qna.id,
            question: qna.title || "Untitled Question",
            answer: Array.isArray(qna.answers) && qna.answers.length > 0 
              ? qna.answers[0].content || "" 
              : qna.content || "",
            category: category,
            tags: tags,
            author: authorName,
            status: qna.status || "open",
            createdAt: qna.createdAt,
            updatedAt: qna.updatedAt,
            views: typeof qna.views === 'number' ? qna.views : 0,
            likes: Array.isArray(qna.upvotes) ? qna.upvotes.length : (typeof qna.upvotes === 'number' ? qna.upvotes : 0),
            helpful: typeof qna.helpful === 'number' ? qna.helpful : 0,
            notHelpful: Array.isArray(qna.downvotes) ? qna.downvotes.length : (typeof qna.downvotes === 'number' ? qna.downvotes : 0),
            isAnswered: !!(answerCount > 0 || qna.status === 'answered' || qna.status === 'closed'),
            answerCount: answerCount,
            acceptedAnswer: Array.isArray(qna.answers) ? qna.answers.find(a => a.isAccepted) : null,
          };
        });

        setQnaData(transformedQnaData);

        setPagination((prev) => ({
          ...prev,
          total: paginationData.totalQuestions || paginationData.total || transformedQnaData.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.totalQuestions || paginationData.total || transformedQnaData.length) / prev.limit),
        }));

        if (transformedQnaData.length === 0) {
          toast("No questions found", { icon: 'ℹ️' });
        }
      } else {
        setQnaData([]);
        toast.error(result.message || "Failed to load questions");
      }
    } catch (error) {
      setQnaData([]);
      toast.error(error.message || "Failed to load questions");
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
        toast.success("Question created successfully");
      } else {
        toast.error(`Failed to create question: ${result.message}`);
      }
    } catch (error) {
      toast.error("Failed to create question");
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
      if (qnaData.id) {
        const result = await QnAService.updateQuestion(qnaData.id, qnaData);
        
        if (result.success) {
          await loadQnaData();
          setIsEditModalOpen(false);
          setSelectedQna(null);
      toast.success("Question updated successfully");
        } else {
          toast.error(result.message || "Failed to update question");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to update question");
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

        toast.success("Question deleted successfully");
        setSelectedQna(null);
      } catch (error) {
        toast.error("Failed to delete question");
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
