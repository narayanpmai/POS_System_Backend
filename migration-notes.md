npx prisma migrate dev --name init
npx prisma migrate dev --name add_users_table
npx ts-node prisma/flush.ts
npx ts-node prisma/seed-admin.ts