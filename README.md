
# Trezentos Connect

E-commerce platform for barbershops, built with React, TypeScript, and Supabase.

## Features

- Product Catalog with Categories
- Shopping Cart
- WhatsApp Checkout Integration
- Admin Dashboard (Supabase Auth)
- Real-time Database (Supabase)

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** React Context + TanStack Query

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure `.env` contains:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup:**
   Run the migration using Supabase CLI or apply `supabase/migrations/20260127000000_init_schema.sql` in the Supabase Dashboard SQL Editor.

4. **Seed Data:**
   To populate the database with initial products:
   ```bash
   node scripts/seed-products.js
   ```

5. **Create Admin User:**
   To create the initial admin account:
   ```bash
   node scripts/create-admin.js
   ```
   Default credentials in script: `admin@trezentos.com` / `adminpassword123`

6. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Admin Access

Access `/admin` and login with the created credentials.
