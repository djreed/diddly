FROM node:carbon-alpine

RUN apk add --update git

# Create app directory
WORKDIR /usr/src/app

# COPY obfuscated .
COPY client ./client
COPY server.js ./
COPY *.json ./
COPY ./.bowerrc ./

RUN mkdir ./client/bower_components

RUN npm install --global bower
RUN npm install
RUN bower install

EXPOSE 3000
CMD [ "npm", "start" ]