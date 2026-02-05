import type { EventParticipant } from "@/lib/types";

export const MAX_EVENT_PARTICIPANTS = 8;

/**
 * Vrátí účastníky se statusem "going" seřazené podle created_at (chronologicky).
 */
export function getGoingOrderedByCreatedAt(
  participants: EventParticipant[]
): EventParticipant[] {
  return participants
    .filter((p) => p.status === "going")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

/**
 * Rozdělí seznam "going" (už seřazený podle created_at) na účastníky (prvních max)
 * a náhradníky (zbytek).
 */
export function splitParticipantsAndSubstitutes(
  goingOrdered: EventParticipant[],
  maxParticipants: number = MAX_EVENT_PARTICIPANTS
): {
  participants: EventParticipant[];
  substitutes: EventParticipant[];
} {
  const participants = goingOrdered.slice(0, maxParticipants);
  const substitutes = goingOrdered.slice(maxParticipants);
  return { participants, substitutes };
}

/**
 * Pro daný seznam účastníků události vrátí účastníky (1–8), náhradníky a možná.
 */
export function getParticipantsSubstitutesAndMaybe(participants: EventParticipant[]) {
  const goingOrdered = getGoingOrderedByCreatedAt(participants);
  const { participants: listParticipants, substitutes } =
    splitParticipantsAndSubstitutes(goingOrdered);
  const maybe = participants
    .filter((p) => p.status === "maybe")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  return { participants: listParticipants, substitutes, maybe };
}
