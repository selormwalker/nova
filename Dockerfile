# ── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production image ──────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/nova.conf

# Non-root user for security
RUN addgroup -g 1001 nova \
 && adduser -D -u 1001 -G nova nova \
 && chown -R nova:nova /usr/share/nginx/html \
 && chown -R nova:nova /var/cache/nginx \
 && chown -R nova:nova /var/log/nginx \
 && touch /var/run/nginx.pid \
 && chown nova:nova /var/run/nginx.pid

USER nova

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
