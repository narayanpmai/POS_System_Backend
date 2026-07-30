# 📖 Koselighar System Operations & Technical Manual (`manual.md`)

This manual provides detailed instructions for database migrations, manual seeding, Prisma commands, and server maintenance for the Koselighar system.

---

## 1. 🔍 Prisma & Database Commands

> [!IMPORTANT]
> **Automatic Seeding is Disabled**: Seeding will **NEVER** run automatically during build, start, or migrations. You must run seeding manually when needed.

### A. Manual Database Seeding
To manually seed the Super Admin account (`smartpanchpokhari@gmail.com`) and default roles:

```bash
# Execute manual database seed
npm run prisma:seed
```

---

### B. Database Migrations & Schema Updates

#### 1. Generate Prisma Client (after modifying `prisma/schema.prisma`)
```bash
npx prisma generate
```

#### 2. Create & Apply a New Development Migration
```bash
npx prisma migrate dev --name <describe_your_change>
# Example:
npx prisma migrate dev --name add_discount_field
```

#### 3. Deploy Migrations to Production VPS (without prompt)
```bash
npx prisma migrate deploy
```

#### 4. Push Schema Directly to Database (Prototyping/Emergency)
```bash
npm run db:push
```

---

### C. Database Management & Inspection

#### 1. Open Prisma Studio (GUI Data Explorer)
Launch an interactive browser GUI on port 5555 to view and edit database tables:
```bash
npx prisma studio
```

#### 2. Reset Database (⚠️ DELETES ALL DATA - DEV ONLY)
Wipes all tables and reapplies migrations:
```bash
npx prisma migrate reset --skip-seed
```

---

## 2. 🚀 Server Deployment & PM2 Management

### A. Building the Applications

#### Backend (`koselighar-backend`)
```bash
cd koselighar-backend
npm run build
```

#### Frontend (`koselighar-frontend`)
```bash
cd koselighar-frontend
npm run build
```

---

### B. PM2 Production Process Commands

```bash
# Restart backend service
pm2 restart koselighar-backend

# Restart frontend service
pm2 restart koselighar-frontend

# View live application logs (HTTP requests & errors)
pm2 logs koselighar-backend

# View error logs only
pm2 logs koselighar-backend --err --lines 100

# View process status & memory usage
pm2 status
```

---

## 3. 🔐 Core System Credentials

* **Default Super Admin**: `smartpanchpokhari@gmail.com`
* **Default Password**: `admin123`
* **Backend API Base**: `http://localhost:8001` (Production: VPS Port 8001)
* **Swagger API Docs**: `http://localhost:8001/api/docs`
