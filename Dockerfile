# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# If you use pnpm/yarn, replace with your installer (corepack works too)
RUN npm ci
COPY . .
ENV NUXT_TELEMETRY_DISABLED=1
# Allow passing the API base at build time
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
# Prefer project scripts if present
RUN npm run generate || npx nuxi generate

# --- Nginx serve stage ---
FROM nginx:alpine
# simple, no custom config: serve index.html for SPA
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
    