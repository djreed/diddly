FROM node:carbon-alpine

RUN apk add --update git

# Create app directory
WORKDIR /usr/src/app

# COPY obfuscated .
COPY client ./client
COPY server.js ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn

EXPOSE $PORT
CMD [ "yarn", "start" ]