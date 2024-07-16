# Build-Phase
FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 8080

# Start Server
CMD ["http-server", "dist"]