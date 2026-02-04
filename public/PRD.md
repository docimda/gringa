# Product Requirements Document: Trezentos Connect

**Date:** 2026-02-03
**Status:** Draft

## 1. Product Overview
Trezentos Connect is an e-commerce platform for barbershops that enables shops to list and sell grooming products online. Built with React + TypeScript and backed by Supabase (Postgres, Auth, Storage, Realtime), the product provides a product catalog with categories, a shopping cart, a WhatsApp-based checkout flow, order management for customers, and an admin dashboard for product and order operations.

## 2. Core Goals
- Deliver an MVP e-commerce storefront for barbershop products with a clear product catalog and simple checkout flow (WhatsApp integration).
- Provide an admin dashboard (Supabase-authenticated) to manage products and orders without direct DB access.
- Persist and surface order data reliably in Supabase, with real-time updates to clients where applicable.
- Keep the deployment simple and secure (Vercel + environment variables) and use Supabase for server-side operations from scripts or backend processes.
- Ensure a responsive, performant UI built with Vite, React, TailwindCSS and accessible components (shadcn/ui, Radix UI).

## 3. Key Features
- **Product Catalog**: Landing page with categories, product listing, product detail preview. (src/pages/Index.tsx, src/services/productService.ts)
- **Search & Filters**: Category filtering and basic search across product name/description.
- **Shopping Cart**: Add/remove/update items, view cart page and price summary. (src/pages/CartPage.tsx)
- **Checkout — WhatsApp Integration**: Generate an order summary and pre-filled WhatsApp message to complete the purchase; also create an order record in Supabase for tracking. (src/pages/CheckoutPage.tsx, src/services/orderService.ts)
- **Order Management (Customer)**: View order history and status on Orders page. (src/pages/OrdersPage.tsx, src/services/orderService.ts)
- **Admin Dashboard**: Protected admin interface for product CRUD, inventory management, and order status updates. Uses Supabase Auth for admin sign-in. (src/pages/AdminPage.tsx, src/services/productService.ts, src/services/orderService.ts)
- **Real-time Updates**: Use Supabase Realtime to reflect product and order changes to connected clients (inventory and order status updates).
- **File/Media Storage**: Product images stored in Supabase Storage and served from the frontend.
- **Data Seeding & Admin Bootstrap**: Scripts to seed products and create initial admin user.
- **Deployment**: Vercel-friendly build with required environment variables.

## 4. User Flows
- **Browse Catalog**: Visitor lands on Index, browses categories, taps a product to see details.
- **Add to Cart**: User adds items from catalog or detail views; cart shows aggregated quantities and subtotal.
- **Cart Review**: User opens CartPage, edits quantities or removes items, proceeds to checkout.
- **Checkout via WhatsApp**: CheckoutPage builds an order record in Supabase and opens WhatsApp (web/mobile) with a pre-filled message containing order items, quantities and totals for the shop to process.
- **Order Tracking**: After checkout, an order entry exists in Supabase; user can view order history and status on OrdersPage.
- **Admin Sign-in**: Admin visits `/admin`, authenticates via Supabase credentials.
- **Admin Operations**: Admin creates/edits/deletes products and updates order statuses; changes propagate to storefront via realtime subscriptions.

## 5. Validation Criteria
- **Catalog**: Loads and displays products correctly; filters work.
- **Cart**: Updates UI and state correctly; persists across sessions.
- **Checkout**: Creates Supabase record and opens WhatsApp with correct data.
- **Order Visibility**: New orders appear in Admin/User views within 5 seconds (Realtime).
- **Security**: Admin routes protected; RLS policies enforced.
- **Performance**: High Lighthouse scores; fast TTI.
