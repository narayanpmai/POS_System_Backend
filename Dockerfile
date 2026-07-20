# Stage 1: Build
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm ci
RUN npx prisma generate

COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci
RUN npx prisma generate

# Copy built artifacts from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
