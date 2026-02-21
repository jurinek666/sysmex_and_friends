import { getAllEvents } from "@/lib/queries/events";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventForm } from "./EventForm";
import { EventList } from "./EventList";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const events = await getAllEvents();

  return (
    <AdminLayout title="Admin • Kalendář">
      <section className="bg-white p-6 rounded-2xl border shadow-sm mb-12">
        <h2 className="text-xl font-bold mb-4">Nový termín</h2>
        <EventForm />
      </section>

      <EventList events={events} />
    </AdminLayout>
  );
}
