# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifest for workspace resolution
COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies (workspace-aware)
RUN npm install --workspace=apps/api --include-workspace-root

# Copy source
COPY apps/api ./apps/api

# Build TypeScript
RUN npm run build --workspace=apps/api

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000
ENV HOST=0.0.0.0

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 8000

CMD ["node", "apps/api/dist/server.js"]