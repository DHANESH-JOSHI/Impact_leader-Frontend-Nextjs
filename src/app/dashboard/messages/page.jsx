"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MessagesService } from "@/services/messagesService";
import { MessageSquare, Users, Send, Trash2, Search } from "lucide-react";

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

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadConversations();
  }, [pagination.page, searchQuery]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
      };

      const result = await MessagesService.getConversations(params);

      if (result.success) {
        const conversationsData = Array.isArray(result.data) ? result.data : [];
        const paginationData = result.pagination || {};

        setConversations(conversationsData);
        setPagination((prev) => ({
          ...prev,
          total: paginationData.total || conversationsData.length,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || conversationsData.length) / pagination.limit),
        }));
      } else {
        toast.error(result.message || "Failed to load conversations");
        setConversations([]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast.error(error.message || "Failed to load conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const result = await MessagesService.getConversationMessages(conversationId);
      if (result.success) {
        setMessages(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error(error.message || "Failed to load messages");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationName = (conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.participants && conversation.participants.length > 0) {
      return conversation.participants.map(p => p.name || p.email).join(", ");
    }
    return "Conversation";
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#eff6ff" }}
          >
            <MessageSquare className="h-6 w-6" style={{ color: "#2691ce" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#040606" }}>
              Messages
            </h1>
            <p className="text-sm" style={{ color: "#646464" }}>
              Manage your conversations
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
            style={{ color: "#646464" }}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ focusRingColor: "#2691ce" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: "#2691ce" }}></div>
            <p className="text-lg" style={{ color: "#646464" }}>
              Loading conversations...
            </p>
          </div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#646464" }} />
          <p className="text-lg" style={{ color: "#646464" }}>
            No conversations found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold" style={{ color: "#040606" }}>
                  Conversations
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {conversations.map((conversation) => (
                  <motion.button
                    key={conversation._id || conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      loadMessages(conversation._id || conversation.id);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ||
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#eff6ff" }}
                      >
                        <Users className="h-5 w-5" style={{ color: "#2691ce" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: "#040606" }}>
                          {getConversationName(conversation)}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-sm truncate" style={{ color: "#646464" }}>
                            {conversation.lastMessage.content || conversation.lastMessage.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold" style={{ color: "#040606" }}>
                    {getConversationName(selectedConversation)}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p style={{ color: "#646464" }}>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id || message.id}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium" style={{ color: "#646464" }}>
                            {message.sender?.name || message.sender?.email || "Unknown"}
                          </span>
                          <span className="text-xs" style={{ color: "#646464" }}>
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <div
                          className="p-3 rounded-lg max-w-md"
                          style={{ backgroundColor: "#eff6ff" }}
                        >
                          <p className="text-sm" style={{ color: "#040606" }}>
                            {message.content || message.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#646464" }} />
                  <p style={{ color: "#646464" }}>
                    Select a conversation to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Previous
          </button>
          <span className="px-4 py-2" style={{ color: "#646464" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ color: "#646464" }}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

