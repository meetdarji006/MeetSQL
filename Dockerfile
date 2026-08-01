# Multi-stage Dockerfile for MeetSQL
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./
RUN npm ci

COPY client/package*.json ./client/
RUN npm --prefix client ci

# Copy source code
COPY tsconfig.json drizzle.config.ts ./
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY client/ ./client/

# Build backend and frontend
RUN npm run build

# Production runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000

CMD ["node", "dist/server.js"]
