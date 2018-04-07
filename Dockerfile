FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY *.json ./
RUN npm install
RUN bower install

COPY obfuscated/* .

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]