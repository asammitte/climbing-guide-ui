# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first for better caching
COPY package.json yarn.lock ./

# Use Yarn via Corepack:
# - If the repo has .yarnrc.yml => assume Yarn Berry (v2+)
# - Else => use Yarn classic (v1)
RUN corepack enable \
    && if [ -f .yarnrc.yml ]; then corepack prepare yarn@stable --activate; else corepack prepare yarn@1.22.22 --activate; fi \
    && yarn --version \
    && if [ -f .yarnrc.yml ]; then yarn install --immutable; else yarn install --frozen-lockfile; fi

# Bring in the rest of the source
COPY . .

# Build static site; respect API base at build time
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_TELEMETRY_DISABLED=1
# Prefer project script; fallback to nuxi
RUN if yarn run | grep -q "generate"; then yarn generate; else npx nuxi generate; fi

# --- Nginx serve stage (static) ---
FROM nginx:alpine
# Nuxt generate outputs to .output/public for Nuxt 3
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
    