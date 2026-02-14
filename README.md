# Docim da Gringa

Loja de doces importados e nacionais. Built with React, TypeScript, and Supabase.

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
   Create `.env` from `.env.example` and set:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE=your_service_role_key
   ADMIN_PASSWORD=change_me
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
   Default credentials in script: `admin@docimdagringa.com` / `mental300andre`

6. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Deploy on Vercel

1. Import the repository in Vercel Dashboard.
2. Framework is auto-detected (Vite). Build: `npm run build`. Output: `dist`.
3. Set Environment Variables in Vercel Project:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Optionally for scripts (if used in CI):
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE`
     - `ADMIN_PASSWORD`
4. Trigger deploy; preview/live URLs will be available in Vercel.

## Admin Access

Access `/admin` and login with the created credentials.
