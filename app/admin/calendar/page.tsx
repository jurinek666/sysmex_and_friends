import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";

export const dynamic = "force-dynamic";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string | null;
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}

export default async function AdminCalendarPage() {
  const supabase = await createClient();
  
  const { data: events } = await supabase
    .from("events")
    .select(`
      id,
      title,
      date,
      venue,
      description,
      isUpcoming:is_upcoming,
      createdAt:created_at,
      updatedAt:updated_at
    `)
    .order("date", { ascending: true });

  const safeEvents = (events || []) as Event[];

  return (
    <AdminLayout title="Admin • Kalendář">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový termín</h2>
        <EventForm />
      </section>

      <EventList events={safeEvents} />
    </AdminLayout>
  );
}
