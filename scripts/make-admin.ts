import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function makeAdmin(email: string) {
  // Find user by email
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error(`User ${email} not found`);
    return;
  }

  // Update profile role
  // Assuming profile table is 'profiles' and linked by 'id'
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error updating profile:", updateError);
  } else {
    console.log(`User ${email} is now admin!`);
  }
}

makeAdmin("test1@example.com");
