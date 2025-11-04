FROM node:22

# Create app directory
WORKDIR /src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Set port environment variables
ENV PORT=9000

# Expose the port the app runs on
EXPOSE 9000

CMD [ "npm", "start" ]