# KoseliGhar System - TODO & System Audit Log

## ✅ Completed Tasks (August 2026)

### 1. 🛡️ Pure HttpOnly Cookie Authentication & Redux Unification
- [x] **Backend Cookie Configuration**: Configured `access_token` and `refresh_token` with `SameSite=None; Secure; Path=/; HttpOnly` in `src/auth/auth.controller.ts`.
- [x] **Nginx HTTPS Proxy Trust**: Enabled `app.set('trust proxy', 1)` in NestJS `main.ts` so Express correctly recognizes HTTPS requests forwarded by Nginx.
- [x] **Redux Toolkit Unification**: Created `authSlice.ts` and `authApi.ts` in Next.js frontend, storing user state and in-memory tokens in Redux.
- [x] **AuthContext Removal**: Replaced `AuthContext.tsx` with `<AppInitializer>` and custom `useAuth()` hook backed by Redux.

### 2. 🔐 Multi-Tenancy & User Session Fixes
- [x] **Prisma User Tenant Bypass**: Updated `src/prisma/prisma.service.ts` to bypass `companyId` filtering for `User.findUnique` lookups by `id` or `email`, preventing `JwtStrategy.validate` failures.
- [x] **Tenant Middleware Cookie Support**: Updated `src/auth/tenant.middleware.ts` to parse `req.cookies.access_token` for SuperAdmin role detection and explicit `x-company-id` header tenant switching.
- [x] **Company ID 10 & Global Sales Visibility**: Updated `SalesService.findAllSales()` and `ReportsService.getDashboardSummary()` to handle `companyId: 10` and Global View (`companyId: 0`) without restricting to a missing active fiscal year.

### 3. 🖥️ Client-Side Stability & Null Safety
- [x] **`toSafeArray` Utility**: Created `src/utils/array.ts` to convert API responses (`{ items: [...] }`, `{ data: [...] }`, `null`, `undefined`) safely into Array objects.
- [x] **Global Layout Safety**: Applied `toSafeArray` across `Navbar.tsx`, `CategorySelect.tsx`, `SearchableCustomerSelect.tsx`, `CascadingCategorySelect.tsx`, `DashboardPage`, `ExpensesPage`, `IncomesPage`, `CompaniesPage`, and `UsersPage`, eliminating `TypeError: S.map is not a function` client exceptions.

---

## 📌 Outstanding / Next Tasks

### 👤 User-Wise Sales Tracking & Cashier Audit Log
- [ ] **Backend User Sales Audit Query**: Update `SalesService.findAllSales` to support filtering by `cashierId` (User ID) so admins can query sales made by a specific user on any given date range.
- [ ] **User-Wise Sales Analytics**: Add `/reports/user-sales-summary` endpoint to return date-wise breakdown of total transactions and revenue grouped per cashier.

### ⚙️ System & Infrastructure
- [ ] **Production Health Monitoring**: Monitor PM2 logs (`pm2 logs 17`) on Hostinger VPS during active cashier shifts.
- [ ] **Automated Backup Checks**: Verify PostgreSQL automated daily database backups.
- [ ] **Optional Feature Additions**: Custom PDF report exports and bulk product CSV imports.
