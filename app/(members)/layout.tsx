import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MembersNav from "@/components/team/MembersNav";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-20">
        <MembersNav />
        {children}
      </div>
    </div>
  );
}
