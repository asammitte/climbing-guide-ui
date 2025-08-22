# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable \
    && if [ -f .yarnrc.yml ]; then corepack prepare yarn@stable --activate; else corepack prepare yarn@1.22.22 --activate; fi \
    && yarn --version \
    && if [ -f .yarnrc.yml ]; then yarn install --immutable; else yarn install --frozen-lockfile; fi
COPY . .
ENV NUXT_TELEMETRY_DISABLED=1
RUN yarn build   # SSR build -> outputs to .output/

# --- Run stage (SSR server) ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node",".output/server/index.mjs"]
