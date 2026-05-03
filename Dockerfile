# Step 1: Build the React Frontend
FROM node:18 AS build-stage
WORKDIR /app
COPY package*.json ./

# CLEAN INSTALL: This is the fix for the Tailwind/Oxide error
RUN rm -rf node_modules package-lock.json && npm cache clean --force && npm install

COPY . .
RUN npm run build

# Step 2: Set up the Backend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production && npm install -g ts-node typescript

COPY --from=build-stage /app/dist ./dist
COPY server.ts ./
COPY src/db.ts ./src/
COPY kidrewards.db ./ 

EXPOSE 8080

CMD ["ts-node", "server.ts"]