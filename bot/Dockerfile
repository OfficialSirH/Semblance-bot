FROM node:20-alpine AS builder

WORKDIR /build

RUN apk add --no-cache python3 make g++ curl bash \
  && curl -sf https://gobinaries.com/tj/node-prune | sh

COPY .yarn ./.yarn

COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./

RUN yarn

COPY . .

RUN npm run build:docker \
  && npm prune --production \
  && node-prune

FROM node:20-alpine AS runtime

COPY --from=builder build/dist ./dist
COPY --from=builder build/node_modules ./node_modules

COPY ./src/images ./src/images
COPY .env package.json ./

EXPOSE 8008

CMD [ "npm", "run", "start:docker" ]
