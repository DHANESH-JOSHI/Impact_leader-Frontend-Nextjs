"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MessagesService } from "@/services/messagesService";
import { authStorage } from "@/lib/storage";
import { MessageSquare, Users, Send, Trash2, Search, Check, Image, X, Paperclip } from "lucide-react";
import DeleteConfirmModal from "@/components/core/DeleteConfirmModal";

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
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [messageMenuOpen, setMessageMenuOpen] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    // Get current user
    const user = authStorage.getCurrentUser();
    // Debug: Log current user to see its structure
    // console.log('Current User from storage:', user);
    setCurrentUser(user);
  }, []);

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
        const messagesData = Array.isArray(result.data) ? result.data : [];
        // Filter out deleted messages (in case backend returns soft-deleted messages)
        const activeMessages = messagesData.filter(msg => !msg.isDeleted && !msg.deletedBySender);
        setMessages(activeMessages);
        // Store otherUser from API response to help determine message alignment
        // The otherUser is in result.data.otherUser or result.otherUser
        if (result.data?.otherUser) {
          setOtherUser(result.data.otherUser);
        } else if (result.otherUser) {
          setOtherUser(result.otherUser);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error(error.message || "Failed to load messages");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isFile = !isImage && !isVideo;

    if (!isImage && !isVideo && !isFile) {
      toast.error("Please select an image, video, or file");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation || sending) return;

    setSending(true);
    try {
      const conversationId = selectedConversation._id || selectedConversation.id;
      const isGroup = selectedConversation.chatType === 'group' || selectedConversation.groupName;
      
      let result;
      
      if (selectedFile) {
        // Send message with attachment
        const isImage = selectedFile.type.startsWith('image/');
        const isVideo = selectedFile.type.startsWith('video/');
        const messageType = isImage ? 'image' : (isVideo ? 'file' : 'file');
        
        const messageData = {
          content: newMessage.trim() || (isImage ? '📷 Image' : isVideo ? '🎥 Video' : '📎 File'),
          type: messageType,
          ...(isGroup 
            ? { groupId: conversationId }
            : { recipientId: conversationId }
          )
        };

        if (isGroup) {
          result = await MessagesService.sendGroupMessage(conversationId, messageData, selectedFile);
        } else {
          result = await MessagesService.send1to1Message(messageData, selectedFile);
        }
      } else {
        // Send text message
        const messageData = {
          content: newMessage.trim(),
          type: 'text',
          ...(isGroup 
            ? { groupId: conversationId }
            : { recipientId: conversationId }
          )
        };

        result = await MessagesService.sendMessage(messageData);
      }
      
      if (result.success) {
        setNewMessage("");
        setSelectedFile(null);
        setFilePreview(null);
        // Reload messages to show the new one
        await loadMessages(conversationId);
        // Reload conversations to update last message
        await loadConversations();
        toast.success("Message sent successfully");
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    setDeleting(true);
    try {
      const messageId = messageToDelete._id || messageToDelete.id;
      const result = await MessagesService.deleteMessage(messageId);
      
      if (result.success) {
        // Remove message from local state immediately for better UX
        setMessages(prevMessages => 
          prevMessages.filter(msg => (msg._id || msg.id) !== messageId)
        );
        
        toast.success("Message deleted successfully");
        
        // Reload messages to ensure consistency with backend
        const conversationId = selectedConversation?._id || selectedConversation?.id;
        if (conversationId) {
          await loadMessages(conversationId);
          await loadConversations();
        }
        
        setIsDeleteModalOpen(false);
        setMessageToDelete(null);
      } else {
        toast.error(result.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error(error.message || "Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await MessagesService.markMessageAsRead(messageId);
      if (result.success) {
        toast.success("Message marked as read");
        // Reload messages to update read status
        const conversationId = selectedConversation?._id || selectedConversation?.id;
        if (conversationId) {
          await loadMessages(conversationId);
          await loadConversations();
        }
      } else {
        toast.error(result.message || "Failed to mark message as read");
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
      toast.error(error.message || "Failed to mark message as read");
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
    // For group conversations
    if (conversation.chatType === 'group' || conversation.groupName) {
      return conversation.groupName || "Group Chat";
    }
    // For 1-to-1 conversations
    if (conversation.participant) {
      const { firstName, lastName, companyName } = conversation.participant;
      if (firstName || lastName) {
        return `${firstName || ''} ${lastName || ''}`.trim() || companyName || "User";
      }
    }
    // Fallback
    if (conversation.participants && conversation.participants.length > 0) {
      return conversation.participants.map(p => {
        const name = p.firstName && p.lastName 
          ? `${p.firstName} ${p.lastName}`.trim()
          : (p.name || p.email || "User");
        return name;
      }).join(", ");
    }
    return "Conversation";
  };

  const getSenderName = (sender) => {
    if (!sender) return "Unknown";
    if (sender.firstName || sender.lastName) {
      return `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.email || "Unknown";
    }
    return sender.name || sender.email || "Unknown";
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
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#eff6ff" }}
                      >
                        {conversation.participant?.profileImage ? (
                          <img
                            src={conversation.participant.profileImage}
                            alt={getConversationName(conversation)}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5" style={{ color: "#2691ce" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate" style={{ color: "#040606" }}>
                            {getConversationName(conversation)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span
                              className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
                              style={{ backgroundColor: "#2691ce", color: "white" }}
                            >
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage ? (
                          <div className="flex items-start space-x-1">
                            {conversation.chatType === 'group' && conversation.lastMessage.sender && (
                              <span className="text-sm font-medium flex-shrink-0" style={{ color: "#646464" }}>
                                {getSenderName(conversation.lastMessage.sender)}:
                              </span>
                            )}
                            <p className="text-sm truncate flex-1" style={{ color: "#646464" }}>
                              {conversation.lastMessage.content || conversation.lastMessage.message || "No message"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm italic" style={{ color: "#9ca3af" }}>
                            No messages yet
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
                  {selectedConversation.participant && (
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      {selectedConversation.participant.companyName && `${selectedConversation.participant.companyName} • `}
                      {selectedConversation.participant.designation || ""}
                    </p>
                  )}
                  {selectedConversation.chatType === 'group' && selectedConversation.memberCount && (
                    <p className="text-xs mt-1" style={{ color: "#646464" }}>
                      {selectedConversation.memberCount} {selectedConversation.memberCount === 1 ? 'member' : 'members'}
                    </p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p style={{ color: "#646464" }}>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Method 1: Compare with currentUser from storage
                      const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId;
                      const senderId = message.sender?._id || message.sender?.id;
                      let isCurrentUser = Boolean(
                        currentUserId && 
                        senderId && 
                        String(currentUserId).trim() === String(senderId).trim()
                      );
                      
                      // Method 2: If otherUser is available, check if sender is NOT otherUser
                      // (meaning it must be current user)
                      if (!isCurrentUser && otherUser) {
                        const otherUserId = otherUser._id || otherUser.id;
                        if (senderId && otherUserId && String(senderId) !== String(otherUserId)) {
                          isCurrentUser = true;
                        }
                      }
                      
                      return (
                        <div
                          key={message._id || message.id}
                          className={`flex flex-col space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'} group relative w-full`}
                          onMouseEnter={() => setMessageMenuOpen(message._id || message.id)}
                          onMouseLeave={() => setMessageMenuOpen(null)}
                        >
                          <div className={`flex items-center space-x-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs font-medium" style={{ color: "#646464" }}>
                              {getSenderName(message.sender)}
                            </span>
                            <span className="text-xs" style={{ color: "#646464" }}>
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                          <div className={`flex items-start ${isCurrentUser ? 'flex-row-reverse justify-end' : 'justify-start w-full'}`}>
                            <div className="relative flex-shrink-0">
                              <div
                                className={`p-3 rounded-lg max-w-md ${
                                  isCurrentUser 
                                    ? 'rounded-br-none' 
                                    : 'rounded-bl-none'
                                }`}
                                style={{ 
                                  backgroundColor: isCurrentUser ? "#2691ce" : "#eff6ff",
                                  color: isCurrentUser ? "white" : "#040606"
                                }}
                              >
                                {message.attachment && message.attachment.url && (
                                  <div className="mb-2">
                                    {message.type === 'image' ? (
                                      <img
                                        src={message.attachment.url}
                                        alt={message.attachment.originalName || "Image"}
                                        className="max-w-full h-auto rounded-lg"
                                        style={{ maxHeight: "300px" }}
                                      />
                                    ) : message.type === 'file' && message.attachment.mimeType?.startsWith('video/') ? (
                                      <video
                                        src={message.attachment.url}
                                        controls
                                        className="max-w-full h-auto rounded-lg"
                                        style={{ maxHeight: "300px" }}
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : (
                                      <a
                                        href={message.attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 p-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                      >
                                        <Paperclip className="h-4 w-4" />
                                        <span className="text-sm truncate">
                                          {message.attachment.originalName || "Download file"}
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                )}
                                {(message.content || message.message) && (
                                  <p className="text-sm break-words" style={{ color: isCurrentUser ? "white" : "#040606" }}>
                                    {message.content || message.message}
                                  </p>
                                )}
                              </div>
                              {/* Message Actions Menu - Positioned absolutely */}
                              {messageMenuOpen === (message._id || message.id) && (
                                <div className={`absolute top-0 flex items-center space-x-1 ${
                                  isCurrentUser 
                                    ? 'left-0 -translate-x-full pr-2' 
                                    : 'right-0 translate-x-full pl-2'
                                }`}>
                                  {!message.isRead && !isCurrentUser && (
                                    <motion.button
                                      onClick={() => handleMarkAsRead(message._id || message.id)}
                                      className="p-1.5 rounded hover:bg-gray-200 transition-colors bg-white shadow-sm border border-gray-200"
                                      title="Mark as read"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Check className="h-4 w-4" style={{ color: "#2691ce" }} />
                                    </motion.button>
                                  )}
                                  {isCurrentUser && (
                                    <motion.button
                                      onClick={() => {
                                        setMessageToDelete(message);
                                        setIsDeleteModalOpen(true);
                                      }}
                                      className="p-1.5 rounded hover:bg-red-100 transition-colors bg-white shadow-sm border border-gray-200"
                                      title="Delete message"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Trash2 className="h-4 w-4" style={{ color: "#ef4444" }} />
                                    </motion.button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  {/* File Preview */}
                  {filePreview && (
                    <div className="mb-3 relative inline-block">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-w-xs h-auto rounded-lg border border-gray-300"
                        style={{ maxHeight: "150px" }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedFile && !filePreview && (
                    <div className="mb-3 flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                      <Paperclip className="h-4 w-4" style={{ color: "#646464" }} />
                      <span className="text-sm flex-1 truncate" style={{ color: "#040606" }}>
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="h-4 w-4" style={{ color: "#646464" }} />
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-input"
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Attach image or video"
                    >
                      <Image className="h-5 w-5" style={{ color: "#2691ce" }} />
                    </label>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: "#2691ce" }}
                      disabled={sending}
                    />
                    <motion.button
                      type="submit"
                      disabled={sending || (!newMessage.trim() && !selectedFile)}
                      className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ backgroundColor: "#2691ce", color: "white" }}
                      whileHover={{ scale: sending ? 1 : 1.05 }}
                      whileTap={{ scale: sending ? 1 : 0.95 }}
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </motion.button>
                  </form>
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

      {/* Delete Message Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleDeleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        isLoading={deleting}
      />
    </motion.div>
  );
}

