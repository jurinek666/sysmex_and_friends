import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Zkusíme jednoduchý dotaz, třeba počet záznamů v tabulce Season (nebo jen check spojení)
    const { error } = await supabase.from("Season").select("*", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({ ok: true, db: "up (supabase)" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, db: "down", error: "DB unreachable" },
      { status: 503 }
    );
  }
}
