FROM node:carbon

# Create app directory
WORKDIR /app/


COPY client ./client
COPY server.js .
COPY *.json ./
COPY .bowerrc .

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]