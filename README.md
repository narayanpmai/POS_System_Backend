# Antigravity Hyper SmartPOS System

A complete, production-ready, enterprise-grade Point of Sale (POS) System built from scratch. It integrates a modular **NestJS API Backend** connected to a **PostgreSQL Database** via **Prisma ORM**, and a high-performance **Next.js App Router Client** styled with a premium **Blue & Orange** glassmorphism theme using **Bootstrap 5**.

---

## Technical Stack

*   **Frontend**: Next.js (App Router), Axios, Bootstrap 5, Bootstrap Icons, Chart.js.
*   **Backend**: NestJS, Passport JWT Auth, Swagger OpenAPI, class-validator, DTO.
*   **Database**: PostgreSQL, Prisma ORM.
*   **DevOps**: Docker Compose (Zero-Config DB).

---

## Directory Structure

```text
smartPos/
│
├── backend/                  # NestJS Application API
│   ├── prisma/
│   │   ├── schema.prisma     # Full database schema definition
│   │   └── seed.ts           # Demo records & credential seeds
│   ├── src/
│   │   ├── main.ts           # Entrypoint (pipes, CORS, Swagger OpenAPI)
│   │   ├── app.module.ts     # Root app module
│   │   ├── auth/             # JWT hashing, guards, logic
│   │   ├── products/         # Products and categories CRUD
│   │   ├── sales/            # POS checkout transactional pipeline
│   │   ├── customers/        # Customer CRM profiles and points ledger
│   │   ├── reports/          # Analytics aggregates & timeline queries
│   │   └── settings/         # Store configurations (currency, receipts)
│   └── tsconfig.json
│
├── frontend/                 # Next.js Application Client
│   ├── src/
│   │   ├── app/              # Next.js App Router Pages
│   │   │   ├── globals.css   # Brand system & responsive media overrides
│   │   │   ├── login/        # Glassmorphic Login with Quick Demo Fill
│   │   │   ├── register/     # Cashier Account Creation
│   │   │   ├── dashboard/    # Analytics panels & sales graphs
│   │   │   ├── pos/          # Fast POS screen & printable receipt popup
│   │   │   ├── products/     # Catalog and categories CRUD forms
│   │   │   ├── inventory/    # Stock Ledger & asset valuation panels
│   │   │   ├── customers/    # Client lists & CRM purchase histories
│   │   │   ├── reports/      # Period analytics tables & export templates
│   │   │   └── settings/     # Store customization configurations
│   │   ├── components/       # Custom Navigation & Hydration wrappers
│   │   └── context/          # Auth Session provider & Axios interceptors
│   └── tsconfig.json
│
├── docker-compose.yml        # PostgreSQL alpine database engine
├── setup.ps1                 # Master setup orchestrator
└── start-dev.ps1             # Simultaneous Dev Server launcher
```

---

## Default Seeding Credentials

The database contains these pre-configured accounts:
*   **Store Administrator**
    *   **Email**: `admin@pos.com`
    *   **Password**: `admin123`
*   **Cashier Worker**
    *   **Email**: `cashier@pos.com`
    *   **Password**: `cashier123`

---

## Quick-Start Guides

### 1. Zero-Config PowerShell Deploy (Windows)
Open a PowerShell command window as administrator inside `d:\smartPos` and execute:
```powershell
# Installs database, backend dependencies, frontend dependencies, seeds, and compiles
.\setup.ps1
```

### 2. Live Server Launcher
To start both servers in side-by-side terminal consoles automatically:
```powershell
.\start-dev.ps1
```

---

## Key Feature Operations

1.  **Glassmorphic Login**: Fill admin or cashier demo passwords with one-click buttons.
2.  **Telemetry Dashboard**: Displays live counts for daily earnings, monthly statistics, net profits, asset values, and dynamic sales/profit timeline charts.
3.  **Fast Cashier POS Screen**:
    *   Select categories, type fuzzy keyword, or simulate a barcode scan using the scan input.
    *   Click on products to add to cart, adjust quantities, input manual discounts.
    *   Link to a registered customer to award loyalty points (1 point per $10 spent).
    *   Choose CASH, CARD, or QR, click Checkout, and review a custom thermal print receipt ready for `window.print()`.
4.  **Database Seeding**: The seed script populates 7 days of historical sales and top-selling products so that graphs and reports are active immediately.
5.  **Settings customization**: Admins can change store name, contact tel, currency symbols, and thermal receipt header/footer lines from the settings page.
