FROM node:20-alpine AS base

ARG PORT=3000

ENV NODE_ENV production

WORKDIR /src

# Build
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install --production=false
ENV PATH /opt/node_modules/.bin:$PATH

COPY --link . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT $PORT

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]