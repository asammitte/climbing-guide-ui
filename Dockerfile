# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable \
    && if [ -f .yarnrc.yml ]; then corepack prepare yarn@stable --activate; else corepack prepare yarn@1.22.22 --activate; fi \
    && yarn --version \
    && if [ -f .yarnrc.yml ]; then yarn install --immutable; else yarn install --frozen-lockfile; fi

COPY . .

# Build-time args (PUBLIC ONLY) ➕
ARG NUXT_API_BASE
ARG NUXT_PUBLIC_GOOGLE_CLIENT_ID
# Make them available to Nuxt at build time ➕
ENV NUXT_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_GOOGLE_CLIENT_ID=$NUXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NUXT_TELEMETRY_DISABLED=1

# Prefer project script; fallback to nuxi
RUN if yarn run | grep -q "generate"; then yarn generate; else npx nuxi generate; fi

# --- Nginx serve stage (static) ---
FROM nginx:alpine
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
    