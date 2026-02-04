"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setEventParticipation } from "@/app/(members)/_actions";
import type { EventParticipant, EventStatus } from "@/lib/types";

interface EventParticipationProps {
  eventId: string;
  initialParticipants: EventParticipant[];
  isLoggedIn: boolean;
}

const STATUS_LABELS: Record<EventStatus, string> = {
  going: "Jdu",
  maybe: "Možná",
  not_going: "Nejdu",
};

export default function EventParticipation({
  eventId,
  initialParticipants,
  isLoggedIn,
}: EventParticipationProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState("");

  const counts = {
    going: initialParticipants.filter((p) => p.status === "going").length,
    maybe: initialParticipants.filter((p) => p.status === "maybe").length,
    not_going: initialParticipants.filter((p) => p.status === "not_going")
      .length,
  };

  async function handleStatus(status: EventStatus) {
    if (!isLoggedIn) return;
    setPending(true);
    const result = await setEventParticipation(eventId, status, note || null);
    setPending(false);
    if (result.success) {
      setNote("");
      router.refresh();
    }
  }

  return (
    <div className="space-y-3 min-w-[180px]">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Účast
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-green-400">{counts.going} jde</span>
        <span className="text-yellow-400">{counts.maybe} možná</span>
        <span className="text-gray-500">{counts.not_going} nejde</span>
      </div>
      {isLoggedIn && (
        <>
          <div className="flex flex-wrap gap-2">
            {(["going", "maybe", "not_going"] as const).map((status) => (
              <button
                key={status}
                type="button"
                disabled={pending}
                onClick={() => handleStatus(status)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50 transition-colors"
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Poznámka (volitelné)"
            className="w-full px-3 py-2 rounded-lg text-sm bg-black/30 border border-white/20 text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/40 outline-none"
          />
        </>
      )}
    </div>
  );
}
