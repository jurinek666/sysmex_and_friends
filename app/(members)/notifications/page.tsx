import { Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getNotificationsForUser } from "@/lib/queries/notifications";
import NotificationItem from "./NotificationItem";

export const revalidate = 0;

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const notifications = await getNotificationsForUser(supabase, user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bell className="text-neon-cyan" />
          Oznámení
        </h1>
        <p className="text-gray-400 mt-1">
          Přehled oznámení k událostem a účasti.
        </p>
      </header>

      {notifications.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center text-gray-500">
          Zatím nemáte žádná oznámení.
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id}>
              <NotificationItem
                id={n.id}
                type={n.type}
                eventId={n.event_id}
                eventTitle={n.event_title}
                readAt={n.read_at}
                createdAt={n.created_at}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
