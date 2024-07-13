# Base image
FROM node:20-alpine AS base

ARG PORT=3000

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /src

# Build stage
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install --production=false
ENV PATH /opt/node_modules/.bin:$PATH

COPY --link . .

RUN npm run build
RUN npm prune

# Puppeteer dependencies
FROM base AS puppeteer

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Final stage
FROM base

ENV PORT $PORT

# Copy puppeteer dependencies
COPY --from=puppeteer /usr/bin/chromium-browser /usr/bin/chromium-browser
COPY --from=puppeteer /usr/lib/chromium /usr/lib/chromium

# Copy built files and node modules
COPY --from=build /src/.output /src/.output
COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]