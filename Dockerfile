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

EXPOSE 8079

COPY . .

COPY --from=builder dist ./dist

COPY --from=builder node_modules ./node_modules

CMD [ "npm", "run", "start:docker" ]