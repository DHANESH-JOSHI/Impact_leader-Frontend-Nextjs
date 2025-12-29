import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiX,
  FiEye,
  FiHeart,
  FiClock,
  FiUser,
  FiEdit2,
  FiShare2,
  FiDownload,
  FiFlag,
  FiTag,
} from "react-icons/fi";

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ViewStoryModal({ isOpen, onClose, story, onEdit }) {
  if (!story) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.caption || story.title,
        text: story.textContent || story.content,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard if share fails
        const textToCopy = `${story.caption || story.title} - ${story.textContent || story.content}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success("Story content copied to clipboard!");
      });
    } else {
      const textToCopy = `${story.caption || story.title} - ${story.textContent || story.content}`;
      navigator.clipboard.writeText(textToCopy);
      toast.success("Story content copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`${story.title}\n\n${story.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${story.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.3)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <div className="flex items-center gap-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "#040606" }}
                >
                  Story Details
                </h2>
                <motion.span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    story.status
                  )}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                </motion.span>
                {story.isActive && (
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <span className="text-sm text-green-600 font-medium">
                      Active
                    </span>
                  </motion.div>
                )}
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5" style={{ color: "#646464" }} />
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Story Image */}
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="sticky top-0">
                    {(story.mediaUrl || story.thumbnailUrl || story.image) && (
                      <motion.img
                        src={story.mediaUrl || story.thumbnailUrl || story.image}
                        alt={story.caption || story.title || 'Story media'}
                        className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {story.type === 'video' && story.mediaUrl && (
                      <video
                        src={story.mediaUrl}
                        controls
                        className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
                        poster={story.thumbnailUrl}
                      />
                    )}

                    {/* Quick Actions */}
                    <motion.div
                      className="mt-4 flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-white"
                        style={{ backgroundColor: "#2691ce" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiShare2 className="w-4 h-4" />
                        Share
                      </motion.button>
                      <motion.button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiDownload className="w-4 h-4" />
                        Download
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiFlag className="w-4 h-4" />
                        Report
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Story Content */}
                <motion.div
                  className="lg:col-span-2 space-y-6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Title/Caption */}
                  <div>
                    <h1
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#040606" }}
                    >
                      {story.caption || story.title || 'Untitled Story'}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${story.type === 'image' ? 'bg-blue-100 text-blue-800' : story.type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {story.type || 'text'}
                      </span>
                      {story.isFeatured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center gap-4 text-sm"
                      style={{ color: "#646464" }}
                    >
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        <span>
                          {typeof story.author === 'object' 
                            ? `${story.author.firstName || ''} ${story.author.lastName || ''}`.trim() || story.author.email
                            : story.author || 'Unknown'}
                        </span>
                      </div>
                      {story.duration && (
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span>{Math.floor(story.duration / (60 * 60 * 1000))} hours</span>
                        </div>
                      )}
                      {story.expiresAt && (
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          <span>Expires: {formatTime(story.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {story.tags && story.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "#040606" }}
                      >
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {story.tags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            className="px-3 py-1 text-sm rounded-full text-white"
                            style={{ backgroundColor: "#2691ce" }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <FiTag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Themes */}
                  {story.themes && story.themes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "#040606" }}
                      >
                        Themes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {story.themes.map((theme, index) => {
                          const themeName = typeof theme === 'string' ? theme : (theme.name || theme);
                          return (
                            <motion.span
                              key={themeName}
                              className="px-3 py-1 text-sm rounded-full text-white"
                              style={{ backgroundColor: "#10b981" }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.45 + index * 0.1 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <FiTag className="w-3 h-3 inline mr-1" />
                              {themeName}
                            </motion.span>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Content */}
                  {(story.textContent || story.content) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "#040606" }}
                      >
                        Story Content
                      </h3>
                      <div
                        className="p-4 rounded-lg"
                        style={{ 
                          backgroundColor: story.backgroundColor || "#f8fafc",
                          color: story.textColor || "#040606",
                          fontFamily: story.fontFamily || 'Arial'
                        }}
                      >
                        <p
                          className="leading-relaxed whitespace-pre-wrap"
                        >
                          {story.textContent || story.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Media URL */}
                  {(story.mediaUrl || story.thumbnailUrl) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "#040606" }}
                      >
                        Media
                      </h3>
                      <div className="space-y-2">
                        {story.mediaUrl && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Media URL:</p>
                            <a href={story.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                              {story.mediaUrl}
                            </a>
                          </div>
                        )}
                        {story.thumbnailUrl && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Thumbnail URL:</p>
                            <a href={story.thumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                              {story.thumbnailUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Statistics */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#040606" }}
                    >
                      Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <motion.div
                        className="p-4 rounded-lg text-center"
                        style={{ backgroundColor: "#eff6ff" }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiEye
                          className="w-6 h-6 mx-auto mb-2"
                          style={{ color: "#2691ce" }}
                        />
                        <div
                          className="text-2xl font-bold"
                          style={{ color: "#2691ce" }}
                        >
                          {story.views}
                        </div>
                        <div className="text-sm" style={{ color: "#2691ce" }}>
                          Views
                        </div>
                      </motion.div>
                      <motion.div
                        className="bg-red-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiHeart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">
                          {story.likes}
                        </div>
                        <div className="text-sm text-red-600">Likes</div>
                      </motion.div>
                      <motion.div
                        className="bg-green-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiClock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {story.duration}
                        </div>
                        <div className="text-sm text-green-600">Hours</div>
                      </motion.div>
                      <motion.div
                        className="bg-purple-50 p-4 rounded-lg text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiShare2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">
                          0
                        </div>
                        <div className="text-sm text-purple-600">Shares</div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Metadata */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#040606" }}
                    >
                      Details
                    </h3>
                    <div
                      className="p-4 rounded-lg space-y-3"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#646464" }}>Story ID:</span>
                        <span
                          className="font-medium"
                          style={{ color: "#040606" }}
                        >
                          #{story.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#646464" }}>Created:</span>
                        <span
                          className="font-medium"
                          style={{ color: "#040606" }}
                        >
                          {formatTime(story.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#646464" }}>Last Updated:</span>
                        <span
                          className="font-medium"
                          style={{ color: "#040606" }}
                        >
                          {formatTime(story.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#646464" }}>Duration:</span>
                        <span
                          className="font-medium"
                          style={{ color: "#040606" }}
                        >
                          {story.duration} hours
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#646464" }}>Status:</span>
                        <span
                          className="font-medium capitalize"
                          style={{ color: "#040606" }}
                        >
                          {story.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Story Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#040606" }}
                    >
                      Activity Timeline
                    </h3>
                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: "#eff6ff" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "#2691ce" }}
                        ></div>
                        <div className="flex-1">
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#2691ce" }}
                          >
                            Story Created
                          </p>
                          <p className="text-xs" style={{ color: "#2691ce" }}>
                            {formatTime(story.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                      {story.updatedAt !== story.createdAt && (
                        <motion.div
                          className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">
                              Last Updated
                            </p>
                            <p className="text-xs text-green-600">
                              {formatTime(story.updatedAt)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                      {story.status === "published" && (
                        <motion.div
                          className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 }}
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-purple-900">
                              Published
                            </p>
                            <p className="text-xs text-purple-600">
                              Story is now live
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <div className="text-sm" style={{ color: "#646464" }}>
                Story ID: #{story.id} • {story.author}
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "#646464" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (onEdit) {
                      onEdit(story);
                    }
                  }}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                  style={{ backgroundColor: "#2691ce" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Story
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
