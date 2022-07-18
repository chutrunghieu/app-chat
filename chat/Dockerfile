FROM node:12.18.2-alpine

# Create app directory
RUN mkdir -p /chat
WORKDIR /chat

# Install app dependencies
COPY package.json /chat/
RUN npm install
RUN npm i -g nodemon

# Bundle app source
COPY . /chat/
CMD ["nodemon", "app.js"]
