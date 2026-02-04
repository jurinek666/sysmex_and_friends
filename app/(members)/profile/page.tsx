import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/queries/team";
import ProfileForm from "@/components/team/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const profile = await getCurrentUserProfile(supabase);

  if (!profile) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Můj profil</h1>
        <p className="text-gray-400 mt-1">
          Uprav si zobrazované jméno a avatar.
        </p>
      </header>
      <ProfileForm profile={profile} />
    </div>
  );
}
