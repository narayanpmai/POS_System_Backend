npx prisma migrate dev --name init
npx ts-node prisma/flush.ts
npx ts-node prisma/seed-admin.ts