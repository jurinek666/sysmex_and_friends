"use client";

import { DeleteButton } from "./DeleteButton";
import { useRouter } from "next/navigation";

interface DeleteFormButtonProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  itemId: string;
  itemName: string;
  className?: string;
}

export function DeleteFormButton({
  action,
  itemId,
  itemName,
  className,
}: DeleteFormButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", itemId);
    const result = await action(formData);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Chyba při mazání");
    }
  };

  return (
    <DeleteButton
      itemName={itemName}
      onDelete={handleDelete}
      className={className}
    />
  );
}
