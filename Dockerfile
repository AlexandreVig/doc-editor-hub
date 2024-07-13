# Base image
FROM node:20-alpine AS base

ARG PORT=3000

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /src

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

# Build stage
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install --production=false
ENV PATH /opt/node_modules/.bin:$PATH

COPY --link . .

RUN npm run build
RUN npm prune

# Final stage
FROM base

ENV PORT $PORT

# Copy built files and node modules
COPY --from=build /src/.output /src/.output
COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]