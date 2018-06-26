FROM node:carbon-alpine

RUN apk add --update git

# Create app directory
WORKDIR /usr/src/app

# Copy required files
COPY client ./client
COPY server.js ./
COPY package.json ./
COPY yarn.lock ./

# Download dependencies
RUN yarn

CMD [ "yarn", "start" ]

EXPOSE 3000
