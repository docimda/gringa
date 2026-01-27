
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nswedijyvafrbxjsaple.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zd2VkaWp5dmFmcmJ4anNhcGxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU1MDAwMCwiZXhwIjoyMDg1MTI2MDAwfQ.g-Cad_cBpNDYMCi9MMd3vYhfda4HPz0_6UwKiYSnswE';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const adminEmail = 'admin@trezentos.com';
const adminPassword = 'adminpassword123'; // Change this in production

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
