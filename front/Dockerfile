# Use Node.js version 22 as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend app
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the frontend app
CMD ["npm", "start"]
