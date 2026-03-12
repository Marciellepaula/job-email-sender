# ── Stage 1: Build frontend ──────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Production server ───────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY templates/ ./templates/
COPY .sequelizerc ./

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

RUN mkdir -p uploads data

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
