FROM node:16-alpine as builder

WORKDIR /

COPY package*.json ./
COPY tsconfig*.json ./

RUN apk add --no-cache python3 make g++
RUN npm install

COPY . ./

RUN npm run build:docker

FROM node:16-alpine as runtime

EXPOSE 8079

COPY . .

COPY --from=builder dist ./dist

COPY --from=builder node_modules ./node_modules

CMD [ "npm", "run", "start:docker" ]