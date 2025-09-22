"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
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
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
      delay: 0.2,
    },
  },
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Handle deletion process
  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm();
    setIsDeleting(false);
    setConfirmText("");
  };

  // Handle modal close
  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onClose();
    }
  };

  // Check if deletion can proceed
  const canDelete = confirmText.toLowerCase() === "delete";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(100, 100, 100, 0.4)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 text-center">
              <motion.div
                className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                variants={iconVariants}
                initial="initial"
                animate="animate"
              >
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </motion.div>

              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: "#040606" }}
              >
                Delete Post
              </h2>

              <p className="text-sm mb-4" style={{ color: "#646464" }}>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>

              {/* Post Title Display */}
              {postTitle && (
                <motion.div
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                  style={{ backgroundColor: "#f8fafc" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "#040606" }}
                    >
                      "{postTitle}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Warning Message */}
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Permanent Deletion Warning
                    </p>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li>• This post will be permanently deleted</li>
                      <li>• All associated data will be lost</li>
                      <li>• This action cannot be reversed</li>
                      <li>• Post views and engagement data will be removed</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Confirmation Input */}
              <motion.div
                className="text-left mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#040606" }}
                >
                  Type{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">
                    delete
                  </code>{" "}
                  to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all text-center"
                  style={{ focusRingColor: "#ef4444" }}
                  disabled={isDeleting}
                  autoComplete="off"
                />
                <p
                  className="text-xs mt-1 text-center"
                  style={{ color: "#646464" }}
                >
                  This helps prevent accidental deletions
                </p>
              </motion.div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-center space-x-3 p-6 border-t border-gray-200"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <motion.button
                onClick={handleClose}
                disabled={isDeleting}
                className={`px-6 py-2 border border-gray-300 rounded-lg transition-colors ${
                  isDeleting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                style={{ color: "#646464" }}
                whileHover={!isDeleting ? { scale: 1.02 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleDelete}
                disabled={!canDelete || isDeleting}
                className={`px-6 py-2 text-white rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  !canDelete || isDeleting
                    ? "opacity-50 cursor-not-allowed bg-gray-400"
                    : "bg-red-600 hover:bg-red-700 hover:shadow-md"
                }`}
                whileHover={canDelete && !isDeleting ? { scale: 1.02 } : {}}
                whileTap={canDelete && !isDeleting ? { scale: 0.98 } : {}}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Forever</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Additional Safety Notice */}
            <div className="px-6 pb-4">
              <motion.div
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    <strong>Pro tip:</strong> Consider archiving posts instead
                    of deleting them. Archived posts can be restored later if
                    needed.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
