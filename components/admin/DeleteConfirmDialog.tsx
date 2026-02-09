"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DeleteConfirmDialogProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function DeleteConfirmDialog({
  itemName,
  onConfirm,
  onCancel,
  isOpen,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h3 id="delete-dialog-title" className="text-lg font-bold text-gray-900 mb-2">Potvrdit smazání</h3>
        <p id="delete-dialog-desc" className="text-gray-600 mb-6">
          Opravdu chcete smazat <strong>{itemName}</strong>? Tato akce je nevratná.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            Smazat
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
