"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  ticket,
  isDeleting,
}) {
  if (!isOpen || !ticket) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-600">
                Delete Ticket
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isDeleting}
            >
              <X className="h-5 w-5" style={{ color: "#646464" }} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm" style={{ color: "#040606" }}>
              Are you sure you want to delete this support ticket? This action cannot be undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start space-x-2">
                <p className="text-sm font-medium" style={{ color: "#646464" }}>
                  Ticket:
                </p>
                <p className="text-sm font-semibold" style={{ color: "#040606" }}>
                  {ticket.ticketNumber || "#TK-00000"}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <p className="text-sm font-medium" style={{ color: "#646464" }}>
                  Subject:
                </p>
                <p className="text-sm" style={{ color: "#040606" }}>
                  {ticket.title}
                </p>
              </div>
              {ticket.requester && (
                <div className="flex items-start space-x-2">
                  <p className="text-sm font-medium" style={{ color: "#646464" }}>
                    Requester:
                  </p>
                  <p className="text-sm" style={{ color: "#040606" }}>
                    {ticket.requester.name}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs" style={{ color: "#d97706" }}>
                <strong>Warning:</strong> All replies and attachments associated with this ticket will also be permanently deleted.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{ color: "#646464" }}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Ticket</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
