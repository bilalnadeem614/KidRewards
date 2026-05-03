# Step 1: Build the React Frontend
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Set up the Backend
FROM node:18
WORKDIR /app
COPY package*.json ./
# Install production dependencies AND ts-node to run the server.ts file
RUN npm install --production && npm install -g ts-node typescript

# Copy built frontend from build-stage
COPY --from=build-stage /app/dist ./dist

# Copy backend source files needed for runtime
COPY server.ts ./
COPY src/db.ts ./src/
COPY kidrewards.db ./ 

# Google Cloud Run expects 8080 by default
EXPOSE 8080

# Use ts-node to execute the TypeScript server file directly
CMD ["ts-node", "server.ts"]