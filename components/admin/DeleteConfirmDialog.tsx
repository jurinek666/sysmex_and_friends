"use client";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Potvrdit smazání</h3>
        <p className="text-gray-600 mb-6">
          Opravdu chcete smazat <strong>{itemName}</strong>? Tato akce je nevratná.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
          >
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
}
