# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---
# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "start:prod"]