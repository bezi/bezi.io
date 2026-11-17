# syntax=docker/dockerfile:1

# 1. Build the static site (Vite -> dist/).
FROM node:26-alpine AS web
RUN npm install -g corepack@latest && corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# 2. Static-file server.
FROM nginx:1.31-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web /app/dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
