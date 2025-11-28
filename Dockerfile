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

RUN apk --no-cache add postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

COPY docker-entrypoint.sh .

#Make the script executable AND convert line endings for Unix
RUN chmod +x docker-entrypoint.sh \
    && sed -i 's/\r$//' docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "start:prod"]