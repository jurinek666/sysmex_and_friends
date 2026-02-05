"use client";

import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markNotificationRead } from "@/app/(members)/_actions";

interface NotificationItemProps {
  id: string;
  type: string;
  eventId: string | null;
  eventTitle: string | null;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationItem({
  id,
  type,
  eventTitle,
  readAt,
  createdAt,
}: NotificationItemProps) {
  const router = useRouter();
  const isUnread = !readAt;

  async function handleMarkRead() {
    const result = await markNotificationRead(id);
    if (result.success) router.refresh();
  }

  const message =
    type === "event_promoted"
      ? `Uvolnilo se místo na akci${eventTitle ? ` „${eventTitle}"` : ""}. Nyní jste mezi účastníky.`
      : "Oznámení";

  return (
    <div
      className={`rounded-xl border p-4 ${
        isUnread
          ? "border-neon-cyan/40 bg-gray-900/80"
          : "border-gray-800 bg-gray-900/50 text-gray-400"
      }`}
    >
      <p className="text-sm">{message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {format(new Date(createdAt), "d. M. yyyy 'v' HH:mm", { locale: cs })}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <Link
          href="/schedule"
          className="text-xs font-medium text-neon-cyan hover:underline"
        >
          Kalendář a účast
        </Link>
        {isUnread && (
          <button
            type="button"
            onClick={handleMarkRead}
            className="text-xs font-medium text-gray-400 hover:text-white"
          >
            Označit jako přečtené
          </button>
        )}
      </div>
    </div>
  );
}
