FROM node:20-alpine as builder

WORKDIR /build

RUN apk add --no-cache python3 make g++ curl bash

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

RUN yarn set version stable

# COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./
# COPY  .yarn ./.yarn
COPY package.json tsconfig.json yarn.lock ./

RUN yarn

COPY . .

RUN npm run build:docker

RUN npm prune --production

# run node prune
RUN node-prune

FROM node:20-alpine as runtime

COPY --from=builder build/dist ./dist
COPY --from=builder build/node_modules ./node_modules
COPY --from=builder build/package.json ./package.json

COPY ./src/images ./src/images
COPY .env /.env

EXPOSE 8008

CMD [ "npm", "run", "start:docker" ]
