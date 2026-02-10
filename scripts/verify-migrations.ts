
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(url, key);

async function verifyMemberTable() {
  console.log('Verifying "Member" table structure...');

  // We use "Member" because inspection showed it is PascalCase.
  // But Supabase client handles case sensitivity if we quote it, or if it's standard.
  // Inspection showed "Member".
  const { data, error } = await supabase.from('Member').select('*').limit(1);

  if (error) {
    console.error('Error querying Member table:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.warn('Member table is empty. Cannot verify columns fully from data.');
    console.warn('Assuming migration MIGHT be missing if you expected "profile_id".');
    return;
  }

  const columns = Object.keys(data[0]);
  console.log('Detected columns:', columns.join(', '));

  const hasProfileId = columns.includes('profile_id') || columns.includes('profileId');

  if (!hasProfileId) {
    console.error('\n❌ CRITICAL WARNING: Missing "profile_id" column in "Member" table!');
    console.error('The feature "Link Member to Profile" will NOT work.');
    console.error('Please run the following migration in your Supabase SQL Editor:');
    console.error('supabase/migrations/20250212_link_profiles_members_comments.sql');
    process.exit(1);
  } else {
    console.log('✅ "profile_id" column found. Migration seems applied.');
  }
}

async function main() {
  await verifyMemberTable();
}

main();
