
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const adminEmail = 'admin@docimdagringa.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'mental300andre';

async function createAdmin() {
  console.log(`Creating admin user: ${adminEmail}...`);

  // 1. Create user in auth.users
  const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (createUserError) {
    console.error('Error creating user:', createUserError.message);
    return;
  }

  if (!user) {
    console.error('User creation failed (no user returned).');
    return;
  }

  console.log('User created. ID:', user.id);

  // 2. Insert into public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: adminEmail,
      role: 'admin',
    });

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
  } else {
    console.log('Admin profile created successfully.');
  }
}

createAdmin();
