import { createClient } from "@/lib/supabase/server";
import { withRetry } from "./utils";
import { ResultWithParticipants, ResultParticipant, Season } from "@/lib/types";

// Complex select with aliases and deep joins
const RESULT_SELECT = `
  id,
  date,
  venue,
  teamName:team_name,
  placement,
  score,
  note,
  seasonId:season_id,
  createdAt:created_at,
  updatedAt:updated_at,
  season:seasons!inner(
    id, code, name, startDate:start_date, endDate:end_date
  ),
  result_members(
    member_id,
    sort_order,
    members(
      id,
      displayName:display_name
    )
  )
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResultToParticipants<T extends Record<string, any>>(row: T): T & { participants: ResultParticipant[] } {
  // result_members comes from the alias or table name
  const rm = row.result_members as Array<{
    member_id: string;
    sort_order?: number;
    members?: { id: string; displayName: string }
  } | null> | undefined;

  const participants: ResultParticipant[] = (rm ?? [])
    .filter((r): r is NonNullable<typeof r> => r != null)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => ({
      id: r.members?.id ?? r.member_id,
      displayName: r.members?.displayName ?? "",
    }));

  // Clean up the intermediate property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { result_members: _, ...rest } = row;
  return { ...rest, participants } as T & { participants: ResultParticipant[] };
}

export async function getLatestResults(limit = 5): Promise<ResultWithParticipants[]> {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    return await supabase
      .from("results")
      .select(RESULT_SELECT)
      .order("date", { ascending: false })
      .limit(limit);
  });

  if (result.error) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data || []).map(mapResultToParticipants) as any as ResultWithParticipants[];
}

export async function getResultsBySeasonCode(code?: string): Promise<ResultWithParticipants[]> {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    if (code) {
      return await supabase
        .from("results")
        .select(RESULT_SELECT)
        .eq("season.code", code)
        .order("date", { ascending: false });
    }

    return await supabase
      .from("results")
      .select(RESULT_SELECT)
      .order("date", { ascending: false });
  });

  if (result.error) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data || []).map(mapResultToParticipants) as any as ResultWithParticipants[];
}

export async function getSeasons(): Promise<Season[]> {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("seasons")
      .select(`
        id,
        code,
        name,
        startDate:start_date,
        endDate:end_date
      `)
      .order("start_date", { ascending: false });
  });

  if (result.error) {
    return [];
  }
  
  return (result.data || []) as Season[];
}
