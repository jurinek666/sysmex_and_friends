import { createClient } from "@/lib/supabase/server";
import { withRetry } from "./utils";
import { ResultWithParticipants, ResultParticipant, Season } from "@/lib/types";

// Select s camelCase názvy (tabulky Result, Season, ResultMember, Member)
const RESULT_SELECT = `
  id,
  date,
  venue,
  teamName,
  placement,
  score,
  note,
  seasonId,
  createdAt,
  updatedAt,
  season:Season!inner(
    id, code, name, startDate, endDate
  ),
  ResultMember(
    member_id,
    sort_order,
    Member(
      id,
      displayName
    )
  )
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResultToParticipants<T extends Record<string, any>>(row: T): T & { participants: ResultParticipant[] } {
  const rm = row.ResultMember as Array<{
    member_id: string;
    sort_order?: number;
    Member?: { id: string; displayName: string }
  } | null> | undefined;

  const participants: ResultParticipant[] = (rm ?? [])
    .filter((r): r is NonNullable<typeof r> => r != null)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => ({
      id: r.Member?.id ?? r.member_id,
      displayName: r.Member?.displayName ?? "",
    }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ResultMember: _, ...rest } = row;
  return { ...rest, participants } as T & { participants: ResultParticipant[] };
}

export async function getLatestResults(limit = 5): Promise<ResultWithParticipants[]> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data || []).map(mapResultToParticipants) as any as ResultWithParticipants[];
}

export async function getResultsBySeasonCode(code?: string): Promise<ResultWithParticipants[]> {
  const supabase = await createClient();

  const result = await withRetry(async () => {
    if (code) {
      return await supabase
        .from("Result")
        .select(RESULT_SELECT)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data || []).map(mapResultToParticipants) as any as ResultWithParticipants[];
}

export async function getSeasons(): Promise<Season[]> {
  const supabase = await createClient();
  
  const result = await withRetry(async () => {
    return await supabase
      .from("Season")
      .select(`
        id,
        code,
        name,
        startDate,
        endDate
      `)
      .order("startDate", { ascending: false });
  });

  if (result.error) {
    return [];
  }
  
  return (result.data || []) as Season[];
}
