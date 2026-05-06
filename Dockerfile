# syntax=docker/dockerfile:1

# 1. Build the static site.
# react-scripts 1.x predates modern OpenSSL; use legacy provider to avoid
# `digital envelope routines::unsupported` on node 17+.
FROM node:20-alpine AS web
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN pnpm run build

# 2. Static-file server.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web /app/build /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
