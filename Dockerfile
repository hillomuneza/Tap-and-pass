FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs && adduser -S tap -u 1001

WORKDIR /app

COPY --from=builder --chown=tap:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=tap:nodejs /app/dist ./dist
COPY --from=builder --chown=tap:nodejs /app/server ./server
COPY --from=builder --chown=tap:nodejs /app/package.json ./

USER tap

EXPOSE 4000 4001

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "server/index.js"]
