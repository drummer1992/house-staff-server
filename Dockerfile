# Stage 1 Base

FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 dev
FROM base as dev
COPY . .
EXPOSE 3000
USER node
CMD [ "npm", "run", "dev" ]


# Stage 3 build (compile TypeScript -> dist)
FROM base as build
COPY . .
RUN npm run build


# Stage 4 prod
FROM node:22-alpine as prod
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
RUN chown -R nodejs:nodejs /app
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:3000/health || exit 1
EXPOSE 3000
USER nodejs
ENTRYPOINT ["node"]
CMD ["dist/index.js"]
