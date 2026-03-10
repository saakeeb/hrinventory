# Stage 1: Build Stage
# This stage builds the TypeScript code into JavaScript.
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production Stage
# This stage creates a lean image with only production code and dependencies.
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]