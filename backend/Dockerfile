# Use Node.js version 22 as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend app
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the backend app
CMD ["node", "index.js"]
