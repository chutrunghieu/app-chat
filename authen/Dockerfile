FROM node:12.18.2-alpine

# Create app directory
RUN mkdir -p /authen
WORKDIR /authen

# Install app dependencies
COPY package.json /authen/
RUN npm install
RUN npm i -g nodemon

# Bundle app source
COPY . /authen
CMD ["nodemon", "app.js"]
