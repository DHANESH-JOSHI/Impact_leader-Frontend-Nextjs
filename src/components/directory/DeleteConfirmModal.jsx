"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

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
  entry,
  loading = false,
}) {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const entryName = entry?.title || "this entry";

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setConfirmText("");
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#fef2f2" }}
              variants={iconVariants}
              initial="initial"
              animate="animate"
            >
              <AlertTriangle className="h-8 w-8" style={{ color: "#ef4444" }} />
            </motion.div>

            <h3 className="text-xl font-bold mb-2" style={{ color: "#040606" }}>
              Delete Directory Entry
            </h3>
            <p className="text-sm" style={{ color: "#646464" }}>
              Are you sure you want to delete <strong>{entryName}</strong>? This
              action cannot be undone.
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Type 'DELETE' to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ focusRingColor: "#ef4444" }}
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <motion.button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
              whileHover={{ backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleConfirm}
              disabled={confirmText !== "DELETE" || loading}
              className="px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              style={{ backgroundColor: "#ef4444" }}
              whileHover={
                confirmText === "DELETE" && !loading
                  ? { backgroundColor: "#dc2626" }
                  : {}
              }
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Entry</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

