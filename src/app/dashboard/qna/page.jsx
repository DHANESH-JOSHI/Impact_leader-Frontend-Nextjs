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
  const [filterTheme, setFilterTheme] = useState("all");
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
  const [selectedQna, setSelectedQna] = useState(null);

  useEffect(() => {
    loadQnaData();
  }, [searchQuery, filterTheme, filterStatus, sortBy, sortOrder, pagination.page]);

  const loadQnaData = async (params = {}) => {
    setLoading(true);
    try {
      // Map filterStatus to backend status
      let statusFilter = undefined;
      if (filterStatus === "answered") {
        statusFilter = "answered";
      } else if (filterStatus === "closed") {
        statusFilter = "closed";
      } else if (filterStatus === "open") {
        statusFilter = "open";
      }

      const result = await QnAService.getQuestions({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        themes: filterTheme !== "all" ? filterTheme : undefined,
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
          const category = themes.length > 0 ? themes[0] : "General";

          return {
            id: qna._id || qna.id,
            title: qna.title || "Untitled Question",
            question: qna.title || "Untitled Question", // Keep for backward compatibility with views
            content: qna.content || "",
            themes: themes,
            category: category, // Keep for backward compatibility with views
            tags: tags,
            author: authorName,
            status: qna.status || "open",
            priority: qna.priority || "medium",
            createdAt: qna.createdAt,
            updatedAt: qna.updatedAt,
            views: typeof qna.views === 'number' ? qna.views : 0,
            likes: Array.isArray(qna.upvotes) ? qna.upvotes.length : (typeof qna.upvotes === 'number' ? qna.upvotes : 0),
            helpful: typeof qna.helpful === 'number' ? qna.helpful : 0,
            notHelpful: Array.isArray(qna.downvotes) ? qna.downvotes.length : (typeof qna.downvotes === 'number' ? qna.downvotes : 0),
            isAnswered: !!(answerCount > 0 || qna.status === 'answered' || qna.status === 'closed'),
            answerCount: answerCount,
            acceptedAnswer: Array.isArray(qna.answers) ? qna.answers.find(a => a.isAccepted) : null,
            answers: qna.answers || [],
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
        title: newQuestion.title || "",
        content: newQuestion.content || "",
        tags: Array.isArray(newQuestion.tags) ? newQuestion.tags : [],
        themes: Array.isArray(newQuestion.themes) ? newQuestion.themes : [],
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
          title: qnaData.title || "",
          content: qnaData.content || "",
          tags: Array.isArray(qnaData.tags) ? qnaData.tags : [],
          themes: Array.isArray(qnaData.themes) ? qnaData.themes : [],
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

  // Theme filter change karne ka function
  const handleThemeFilter = (theme) => {
    setFilterTheme(theme);
  };

  // Status filter change karne ka function
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  // Get unique themes from questions for filter dropdown
  const themes = ["all", ...new Set(qnaData.flatMap((qna) => qna.themes || []))];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 relative"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        {/* top header section ka code */}
        <motion.div className="mb-8" variants={cardVariants}>
          <QnaHeader
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            filterTheme={filterTheme}
            setFilterTheme={handleThemeFilter}
            filterStatus={filterStatus}
            setFilterStatus={handleStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            themes={themes}
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
        />

        <AddQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQna(null);
          }}
          onSubmit={handleSaveEditedQna}
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
