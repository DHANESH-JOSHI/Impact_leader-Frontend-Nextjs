"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import QnaHeader from "@/components/qna/QnaHeader";
import QnaCardView from "@/components/qna/QnaCardView";
import QnaTableView from "@/components/qna/QnaTableView";
import AddQuestionModal from "@/components/qna/AddQuestionModal";
import ViewQnaModal from "@/components/qna/ViewQnaModal";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";
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
  }, [searchQuery, filterCategory, filterAnswered, sortBy, sortOrder, pagination.page]);

  const loadQnaData = async (params = {}) => {
    setLoading(true);
    try {
      // Map filterAnswered to status: answered = closed, unanswered = open
      let statusFilter = undefined;
      if (filterAnswered === "answered") {
        statusFilter = "closed";
      } else if (filterAnswered === "unanswered") {
        statusFilter = "open";
      }

      const result = await QnAService.getQuestions({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        themes: filterCategory !== "all" ? filterCategory : undefined, // Backend expects 'themes', not 'category'
        status: statusFilter,
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


  // Naya question add karne ka function
  const handleAddQuestion = async (newQuestion) => {
    try {
      setLoading(true);

      const apiData = {
        title: newQuestion.question || newQuestion.title,
        content: newQuestion.answer || newQuestion.content || "",
        tags: Array.isArray(newQuestion.tags) ? newQuestion.tags : (newQuestion.tags ? newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        themes: Array.isArray(newQuestion.themes) ? newQuestion.themes : (newQuestion.themes ? newQuestion.themes.split(',').map(t => t.trim()).filter(Boolean) : []),
        priority: newQuestion.priority || 'medium',
      };

      const result = await QnAService.askQuestion(apiData);

      if (result.success) {
        setIsAddModalOpen(false);
        await loadQnaData();
        toast.success("Question created successfully");
      } else {
        toast.error(`Failed to create question: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to create question:', error);
      toast.error(error.message || "Failed to create question");
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
        // Prepare update data matching backend structure
        const updateData = {
          title: qnaData.title || qnaData.question,
          content: qnaData.content || qnaData.answer || "",
          tags: Array.isArray(qnaData.tags) ? qnaData.tags : (qnaData.tags ? qnaData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
          themes: Array.isArray(qnaData.themes) ? qnaData.themes : (qnaData.themes ? qnaData.themes.split(',').map(t => t.trim()).filter(Boolean) : []),
          priority: qnaData.priority || 'medium',
        };

        const result = await QnAService.updateQuestion(qnaData.id, updateData);
        
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
      console.error('Failed to update question:', error);
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
        setLoading(true);
        const result = await QnAService.deleteQuestion(selectedQna.id);
        
        if (result.success) {
          await loadQnaData();
          setIsDeleteModalOpen(false);
          toast.success("Question deleted successfully");
          setSelectedQna(null);
        } else {
          toast.error(result.message || "Failed to delete question");
        }
      } catch (error) {
        console.error('Failed to delete question:', error);
        toast.error(error.message || "Failed to delete question");
      } finally {
        setLoading(false);
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
            totalQuestions={pagination.total}
          />
        </motion.div>

        {/* QnA dikhane ke do tarike - card ya table */}
        <motion.div variants={cardVariants}>
          <AnimatePresence mode="wait">
            {viewMode === "card" ? (
              <QnaCardView
                key="card-view"
                qnaData={qnaData}
                onViewQna={handleViewQna}
                onEditQna={handleEditQna}
                onDeleteQna={handleDeleteQna}
              />
            ) : (
              <QnaTableView
                key="table-view"
                qnaData={qnaData}
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

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedQna(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          itemName={selectedQna?.question}
          isLoading={false}
        />
      </div>
    </motion.div>
  );
}
