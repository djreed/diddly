FROM node:carbon-alpine

# Create app directory
WORKDIR /app/

COPY obfuscated .
COPY client/index.html ./client/
COPY client/assets ./client/assets
COPY client/css ./client/css
COPY server.js .
COPY *.json ./
COPY .bowerrc .

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]