# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built application code from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Expose the application port
EXPOSE 5000

# Set the command to run the application
CMD [ "npm", "run", "start:prod" ]