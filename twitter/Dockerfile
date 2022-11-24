FROM node:16-alpine as builder

WORKDIR /build

RUN apk add --no-cache python3 make g++

RUN yarn set version stable

COPY package.json tsconfig.json yarn.lock ./
COPY  .yarn ./.yarn

RUN yarn install

COPY . ./

RUN npm run build:docker

FROM node:16-alpine as runtime

COPY . .

COPY --from=builder build/dist ./dist

COPY --from=builder build/node_modules ./node_modules

CMD [ "npm", "run", "start:docker" ]
