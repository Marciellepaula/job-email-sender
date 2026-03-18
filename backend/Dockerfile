# Backend API only (frontend is a separate deploy)
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY templates/ ./templates/
COPY .sequelizerc ./

RUN mkdir -p uploads data && chown -R node:node /app

USER node

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3001/api/health || exit 1

CMD ["node", "src/server.js"]
