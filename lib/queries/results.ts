import { createClient } from "@/lib/supabase/server";
import { withRetry } from "./utils";

const RESULT_SELECT = "*, season:Season(*), ResultMember(member_id, sort_order, Member(id, displayName))";

export type ResultParticipant = { id: string; displayName: string };

function mapResultToParticipants<T extends Record<string, unknown>>(row: T): T & { participants: ResultParticipant[] } {
  const rm = row.ResultMember as Array<{ member_id: string; sort_order?: number; Member?: { id: string; displayName: string } } | null> | undefined;
  const participants: ResultParticipant[] = (rm ?? [])
    .filter((r): r is NonNullable<typeof r> => r != null)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => ({
      id: r.Member?.id ?? r.member_id,
      displayName: r.Member?.displayName ?? "",
    }));
  const { ResultMember: _, ...rest } = row;
  return { ...rest, participants } as T & { participants: ResultParticipant[] };
}

export async function getLatestResults(limit = 5) {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    return await supabase
      .from("Result")
      .select(RESULT_SELECT)
      .order("date", { ascending: false })
      .limit(limit);
  });

  if (result.error) {
    return [];
  }

  return (result.data || []).map(mapResultToParticipants);
}

export async function getResultsBySeasonCode(code?: string) {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    if (code) {
      return await supabase
        .from("Result")
        .select(`*, season:Season!inner(*), ResultMember(member_id, sort_order, Member(id, displayName))`)
        .eq("season.code", code)
        .order("date", { ascending: false });
    }

    return await supabase
      .from("Result")
      .select(RESULT_SELECT)
      .order("date", { ascending: false });
  });

  if (result.error) {
    return [];
  }

  return (result.data || []).map(mapResultToParticipants);
}

export async function getSeasons() {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Season")
      .select("*")
      .order("startDate", { ascending: false });
  });

  if (result.error) {
    return [];
  }
  
  return result.data || [];
}
