# # With Everything // 1.09GB
# --- Builder Stage ---
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  COPY package.json pnpm-lock.yaml ./
  COPY . .

  RUN npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build && pnpm prune --prod
  
  # --- Runner Stage ---
  FROM node:20-alpine AS runner
  
  WORKDIR /app
  
  ENV NODE_ENV=production
  ENV PORT=3000

  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  # COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/node_modules ./node_modules
  # COPY --from=builder /app/next.config.ts ./next.config.ts
  
  EXPOSE 3000
  CMD ["node_modules/.bin/next", "start"]



# Without Edge Function Support //282MB 

# # --- Builder Stage ---

# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package.json pnpm-lock.yaml ./
# COPY . .

# RUN npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build && pnpm prune --prod

# # --- Runner Stage ---
# FROM gcr.io/distroless/nodejs20-debian12

# WORKDIR /app

# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/static ./.next/static

# ENV NODE_ENV=production
# ENV PORT=3000
# EXPOSE 3000

# CMD ["server.js"]
