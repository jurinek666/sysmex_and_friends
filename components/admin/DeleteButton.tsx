"use client";

import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  itemName: string;
  onDelete: () => Promise<void>;
  className?: string;
}

export function DeleteButton({ itemName, onDelete, className }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onDelete();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={`text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ${className || ""}`}
      >
        <Trash2 className="w-4 h-4" />
        {isPending ? "Maže se..." : "Smazat"}
      </button>
      <DeleteConfirmDialog
        itemName={itemName}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </>
  );
}
